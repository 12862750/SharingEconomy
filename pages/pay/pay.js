// pages/pay/pay.js
import {
  fetchUserInfo,
  fetchUserBalance,
  fetchDeviceInfo,
  payToStart,
} from '../../utils/fetch';
import { PAY_TYPE } from '../../utils/const';

import {
  getWechatPayData,
  getVirtualCurrencyData,
  getCardPayData,
} from './util'

import { BTManager, ConnectStatus } from './wx-ant-ble/index.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: app.globalData.isIPX,
    payType: '2',
    payTypeList: [
      PAY_TYPE.CARD_PAY, 
      PAY_TYPE.VIRTUAL_CURRENCY, 
      PAY_TYPE.WECHAT_PAY,
    ],
    deviceInfo: {},
    userBalance: 0,
    cardNum: '',
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    Promise.all([fetchUserBalance(), fetchDeviceInfo('A00006')])
      .then(([{ result: userBalance}, { result: deviceInfo }]) => {
        wx.hideLoading();
        this._scan()
        this.setData({
          deviceInfo,
          userBalance,
        })
      })
      .catch(() => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '发生未知错误，请重试！',
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
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
        console.log(res);
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

    switch (payType) {
      case PAY_TYPE.WECHAT_PAY.value:
        params = getWechatPayData(deviceInfo.deviceId);
        break;
      case PAY_TYPE.VIRTUAL_CURRENCY.value:
        params = getVirtualCurrencyData(Number(userBalance), deviceInfo.deviceId);
        break;
      case PAY_TYPE.CARD_PAY.value:
        params = getCardPayData(cardNum, deviceInfo.deviceId);
        break;
    }

    if (params) {
      payToStart(params)
        .then((result) => {
          console.log('pay result:', result);
        })
        .catch((err) => {
          wx.showToast({
            title: err.errorMsg,
            mask: true,
            icon: 'none',
          });
        })
    }
  },
  //查询设备信息成功，扫描连接设备
  onShow() {
    this.pageInit();
  },
  //发送指令到设备
  bindPrintText: function () {
    this._write('AT\r\n');
  },

  //-----开始------蓝牙使用方法-------------
  // 状态改变回调
  didUpdateConnectStatus(res) {
    console.log('home registerDidUpdateConnectStatus', res);
    if (res.connectStatus === ConnectStatus.connected) {
      wx.hideLoading();
      this.setData({ connected: true, device: res.device, connStatus: '连接成功' });
      this.parseDeviceUUIDs(res.device);
    } else if (res.connectStatus === ConnectStatus.disconnected) {
      wx.hideLoading();
      wx.showToast({
        title: '成功：'+res.message,
        icon: 'none'
      })
      this.setData({ connected: false, connStatus: '连接失败', notifyUUIDs: [], readUUIDs: [], writeUUIDs: [] });
    }
  },

  // 发现外设回调
  didDiscoverDevice(res) {
    console.log('home didDiscoverDevice', res);
    if (res.timeout) {
      console.log('home didDiscoverDevice', '扫描超时');
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    } else {
      let device = res.device;//扫描的设备
      let devices = this.data.devices;//
      function checkDevice(d, ds) {
        for (let v of ds) {
          debugger
          if (v.deviceId === d.deviceId) {
            return true;
          }
        }
        return false;
      }
      if (!checkDevice(device, devices)) {
        //必须是跟表中设备一致才添加
        if (device.deviceId === this.data.deviceInfo.deviceBrand){
          devices.push(device);
          this._connect(device);
        }
      }
      this.setData({ devices });
    }
  },

  // 特征值改变回调
  didUpdateValueForCharacteristic(res) {
    debugger
    console.log('home registerDidUpdateValueForCharacteristic', res);
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
    if (!connected){
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
          icon: 'none'
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
        icon: 'none'
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
  _notify(e) {
    let index = e.currentTarget.id;
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
    }).catch(e => {
      console.log('home write fail', e);
    })
  },
  //-----结束------蓝牙使用方法

})