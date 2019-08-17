// pages/pay/pay.js
import {
  toLogin,
  fetchUserInfo,
  fetchUserBalance,
  fetchDeviceInfo,
  payToStart,
} from '../../utils/fetch';
import { PAY_TYPE, FETCH_CONFIG } from '../../utils/const';

import {
  getQueryString,
  getWechatPayData,
  getVirtualCurrencyData,
  getCardPayData,
} from './util'
import { checkSession } from '../../utils/util';
const token = wx.getStorageSync('token');

import { BTManager, ConnectStatus } from './wx-ant-ble/index.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: app.globalData.isIPX,
    sysInfo: app.globalData.systemInfo,
    deviceName: '初始中',
    payType: '2',
    payAmount: 0,//0元
    times: 0,//0次
    cardNum: '',//卡密码
    payTypeList: [
      PAY_TYPE.CARD_PAY, 
      PAY_TYPE.VIRTUAL_CURRENCY, 
      PAY_TYPE.WECHAT_PAY,
    ],
    deviceInfo: {},
    userBalance: 0,
    connStatus: '连接中...',
    // 蓝牙是否连接
    connected: false,
    // 成功连接的设备
    device: {},
    // 扫描到的设备
    devices: [],
    // 设备能够notify的特征
    notifyUUIDs: [],
    // 设备能够read的特征
    readUUIDs: [],
    // 设备能够write的特征
    writeUUIDs: [],
    // 发送指令后返回结果
    writeReturn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let q = decodeURIComponent(options.q)
    let deviceName = 0
    if (q === 'undefined' || q === null) {
      deviceName = options.id
    } else {
      deviceName = getQueryString(q, 'id')
    }

    this.setData({
      deviceNumber: deviceName
    })
 
    // 初始化蓝牙管理器
    this.bt = new BTManager({
      debug: true
    });
    // 注册状态回调
    this.bt.registerDidUpdateConnectStatus(this.didUpdateConnectStatus.bind(this));
    // 注册发现外设回调
    this.bt.registerDidDiscoverDevice(this.didDiscoverDevice.bind(this));
    // 注册特征值改变回调
    this.bt.registerDidUpdateValueForCharacteristic(this.didUpdateValueForCharacteristic.bind(this));
  },

  pageInit() {
    wx.showLoading({
      title: '信息加载中...',
    })
     
    Promise.all([fetchUserBalance(), fetchDeviceInfo(this.data.deviceNumber)])
      .then(([{ result: userBalance}, { result: deviceInfo }]) => {
        wx.hideLoading();
        this.setData({
          deviceInfo,
          userBalance,
        })
        this._scan()
      })
      .catch((res) => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '发生未知错误，请重试！',
          timeout: 5000
        })
      })
  },
  onPayTypeChange(e) {
    const { value } = e.detail;
    this.setData({
      payType: value,
    });
  },
  onInput(e) {
    const { value } = e.detail;
    this.setData({
      cardNum: value,
    });
  },
  onScanTap() {
    var _this = this
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
        console.log(res);
        _this.setData({
          cardNum: res.result,
        });
      }
    })
  },
  onStartTap() {
    const {
      payType,
      deviceInfo,
      userBalance,
      cardNum,
    } = this.data;
    let params = null;
    let payAmount = deviceInfo.appKey
    let deviceId = deviceInfo.deviceNumber
    switch (payType) {
      case PAY_TYPE.WECHAT_PAY.value:
        params = getWechatPayData(deviceId, payAmount);
        break;
      case PAY_TYPE.VIRTUAL_CURRENCY.value:
        params = getVirtualCurrencyData(Number(userBalance), deviceId, payAmount);
        break;
      case PAY_TYPE.CARD_PAY.value:
        params = getCardPayData(cardNum, deviceId, payAmount);
        break;
    }

    if (params) {
      payToStart(params)
        .then((result) => {
          console.log('pay result:', result);
          if (result.status === 'success') {
            var rawData = result.result
            if (rawData.indexOf('成功') != -1) {
              wx.showModal({
                title: '支付结果',
                content: rawData,
                showCancel: false,
                confirmText: "知道了",
                success: function (resss) {
                  if (resss.confirm) {
                    wx.navigateTo({ url: '/pages/index/index' })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '温馨提示',
                content: rawData,
                showCancel: false,
                confirmText: "知道了",
              })
            }
          }

        })
        .catch((err) => {
          wx.showToast({
            title: err.errorMsg,
            mask: true,
            icon: 'none',
            timeout: 3000
          });
        })
    }
  },
  //查询设备信息成功，扫描连接设备
  onShow() {
    checkSession(token)
      .then((code) => {
        return code ? toLogin(code) : Promise.resolve({});
      })
      .then(({ result }) => {
        if (result) {
          FETCH_CONFIG.TOKEN = result.token;
          FETCH_CONFIG.UID = result.uid;
          wx.setStorageSync('token', result.token);
          wx.setStorageSync('uid', result.uid);
        }
        this.pageInit();
      });
  },

  //发送指令到设备
  bindPrintText: function () {
    //检查输入的光波卡
    if (!this.data.cardNum) {
      wx.showToast({
        title: '请输入光波卡号或扫描光波卡',
        mask: true,
        icon: 'none',
      });
      return null;
    }else{
      this._write('FFDF03002D230032');
    }
  },

  //离开界面，断开连接
  onHide(){
    this.bt.disconnect()
  },
  onUnload() {
    this.bt.disconnect()
  },

  //-----开始------蓝牙使用方法-------------
  // 状态改变回调
  didUpdateConnectStatus(res) {
    console.log('home registerDidUpdateConnectStatus', res);
    if (res.connectStatus === ConnectStatus.connected) {
      wx.hideLoading();
      wx.showToast({
        title: '连接成功',
        icon: 'none',
        timeout: 3000
      })
      this.setData({ connected: true, device: res.device, connStatus: '连接成功' });
      this.parseDeviceUUIDs(res.device);
    } else if (res.connectStatus === ConnectStatus.disconnected) {
      wx.hideLoading();
      wx.showToast({
        title: '连接失败',
        icon: 'none',
        timeout: 3000
      })
      this.setData({ connected: false, connStatus: '连接失败', notifyUUIDs: [], readUUIDs: [], writeUUIDs: [] });
    }else{
      wx.showToast({
        title: '无法连接',
        icon: 'none',
        timeout: 3000
      })
      this.setData({ connected: false, connStatus: res.message })
    }
  },

  // 发现外设回调
  didDiscoverDevice(res) {
    console.log('home didDiscoverDevice', res);
    if (res.timeout) {
      console.log('home didDiscoverDevice', '扫描超时');
      wx.showToast({
        title: '扫描超时',
        icon: 'none',
        timeout: 3000
      })
    } else {
      let device = res.device;//扫描的设备
      let devices = this.data.devices;//已扫描的设备
      function checkDevice(d, ds) {
        for (let v of ds) {
          if (d.deviceId && v.deviceId === d.deviceId) {
            return true;
          }
        }
        return false;
      }

      if (!checkDevice(device, devices) && device != undefined && device.deviceId != undefined) {
        let deviceId = ""
        if ('ios' === this.data.sysInfo.platform || 'IOS' === this.data.sysInfo.platform) {
          deviceId = device.advertisData;//IOS版本扫描的设备ID
        } else if ('android' === this.data.sysInfo.platform){
          deviceId = device.deviceId.toString().replace(/:/g, "");//安卓版本扫描的设备ID
        }

        //必须是跟表中设备一致才添加
        let deviceBrand = this.data.deviceInfo.deviceBrand.toString().replace(/:/g, "");//表中的ID
        if (deviceId.toLowerCase().indexOf(deviceBrand.toLowerCase()) != -1){
          devices.push(device);
          this._connect(device);
        }
      }else{
        wx.showToast({
          title: '找不到设备',
          icon: 'none',
          timeout: 3000
        })
        this.setData({ connected: false, connStatus: '找不到设备' })
      }
      this.setData({ devices });
    }
  },

  // 特征值改变回调
  didUpdateValueForCharacteristic(res) {
    console.log('home registerDidUpdateValueForCharacteristic', res);
    let deviceId = ""
    if ('ios' === this.data.sysInfo.platform || 'IOS' === this.data.sysInfo.platform) {
      deviceId = res.device.advertisData;//IOS版本扫描的设备ID
    } else if ('android' === this.data.sysInfo.platform) {
      deviceId = res.deviceId.toString().replace(/:/g, "");//安卓版本扫描的设备ID
    }

    //必须是跟表中设备一致
    let deviceBrand = this.data.deviceInfo.deviceBrand.toString().replace(/:/g, "");//表中的ID
    if (deviceId.toLowerCase().indexOf(deviceBrand.toLowerCase()) != -1) {
      wx.showToast({
        title: '已开机成功！',
        icon: 'none',
        timeout: 3000
      })
      this.setData({
        writeReturn: true
      })
      //调用后台核销光波卡
      this.onStartTap()
    }
  },

  //连接成功，解析UUIDS
  parseDeviceUUIDs(device) {
    let { notifyUUIDs, readUUIDs, writeUUIDs } = this.data;
    for (let service of device.services) {
      for (let char of service.characteristics) {
        if (char.properties.notify) {
          notifyUUIDs.push({
            suuid: service.serviceId,
            cuuid: char.uuid,
            listening: false
          })
        }
        if (char.properties.read) {
          readUUIDs.push({
            suuid: service.serviceId,
            cuuid: char.uuid,
          })
        }
        if (char.properties.write) {
          writeUUIDs.push({
            suuid: service.serviceId,
            cuuid: char.uuid,
          })
        }
      }
    }
    this.setData({ notifyUUIDs, readUUIDs, writeUUIDs });
  },

  // 扫描
  _scan() {
    if (!this.data.connected){
      this.bt.scan({
        services: [],
        allowDuplicatesKey: false,
        interval: 0,
        timeout: 15000,
        deviceName: '',
        containName: ''
      }).then(res => {
        console.log('home scan success', res);
      }).catch(e => {
        console.log('home scan fail', e);
        wx.showToast({
          title: e.message,
          icon: 'none',
          timeout:3000
        });
      });
    }
  },

  // 停止扫描
  _stopScan() {
    this.bt.stopScan().then(res => {
      console.log('home stopScan success', res);
    }).catch(e => {
      console.log('home stopScan fail', e);
    })
  },

  // 连接
  _connect(mydevice) {
    this.bt.stopScan();
    let device = mydevice;
    this.bt.connect(device).then(res => {
      console.log('home connect success', res);
    }).catch(e => {
      wx.showToast({
        title: e.message,
        icon: 'none',
        timeout: 3000
      });
      console.log('home connect fail', e);
    });
    wx.showLoading({
      title: '连接' + device.name,
    });
  },

  // 断开连接
  _disconnect() {
    this.bt.disconnect().then(res => {
      console.log('home disconnect success', res);
    }).catch(e => {
      console.log('home disconnect fail', e);
    })
  },

  // 监听/停止监听
  _notify() {
    let index = 0;
    let { suuid, cuuid, listening } = this.data.notifyUUIDs[index];
    this.bt.notify({
      suuid, cuuid, state: !listening
    }).then(res => {
      console.log('home notify success', res);
      this.setData({ [`notifyUUIDs[${index}].listening`]: !listening });
    }).catch(e => {
      console.log('home notify fail', e);
    })
  },

  // 读特征值
  _read(e) {
    let index = e.currentTarget.id;
    let { suuid, cuuid } = this.data.readUUIDs[index];
    this.bt.read({
      suuid, cuuid
    }).then(res => {
      console.log('home read success', res);
    }).catch(e => {
      console.log('home read fail', e);
    })
  },

  // 向蓝牙模块写入数据，这里只做简单的例子，发送的是 'FFFF' 的十六进制字符串
  _write(txt) {
    let index = 0;
    let { suuid, cuuid } = this.data.writeUUIDs[index];
    this.bt.write({
      suuid,
      cuuid,
      value: txt
    }).then(res => {
      console.log('home write success', res);
      this._notify()
      wx.showToast({
        title: '发送开机指令成功！',
        icon: 'none',
        timeout: 3000
      })
    }).catch(e => {
      console.log('home write fail', e);
    })
  },
  //-----结束------蓝牙使用方法

})