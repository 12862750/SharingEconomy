// pages/pay/pay.js
import {
  toLogin,
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
    device_info: ["BT","C"],//合法设备前缀
    server_info: "0000FF",//合法服务前缀
    device_id: "",
    service_id: "",
    write_id: null,
    notify_id: null,
    read_id: null,
    // 发送指令后返回结果
    writeReturn: false,
    onOpenNotify: null,
    stopSearch:false
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

    //开始初始化
    if (!this.data.connected) {
      this.pageInit();
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
        
      });
  },

  //初始界面设备信息和蓝牙搜索连接
  pageInit() {
    wx.showLoading({
      title: '信息加载中...',
    })
    //查询扫描的设备
    Promise.all([fetchUserBalance(), fetchDeviceInfo(this.data.deviceNumber)])
      .then(([{ result: userBalance}, { result: deviceInfo }]) => {
        wx.hideLoading();
        this.setData({
          deviceInfo,
          userBalance,
        })

        //开始连接设备
        this.connect();
        this.onNotifyChange(function (msg) {
          console.log(msg);
        })
      })
      .catch((res) => {
        this.disconnect()
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '发生未知错误，请重试！',
          timeout: 5000
        })
      })
  },
  //选择支付类型
  onPayTypeChange(e) {
    const { value } = e.detail;
    this.setData({
      payType: value,
    });
  },
  //输入卡号
  onInput(e) {
    const { value } = e.detail;
    this.setData({
      cardNum: value,
    });
  },
  //扫描卡号
  onScanTap() {
    var _this = this
    var that = this;
    wx.scanCode({
      success: (res) => {
        const path = res.result
        var scanCoupon = '0'
        if (path.length > 20) {
          let q = decodeURIComponent(path)
          scanCoupon = Utils.getQueryString(q, 'id')
        }
        if (scanCoupon === '0' || scanCoupon === 'undefined' || scanCoupon === null) {
          scanCoupon = path
        }
        that.setData({
          cardNum: scanCoupon
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '扫描失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },

 //开始先核销数据，核销成功，再开启设备
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
              //发送指令到设备
              this.sendMsg("FFDF03002D230032");
              wx.showModal({
                title: '支付结果',
                content: rawData+':请等待设备开启！',
                showCancel: false,
                confirmText: "知道了",
                success: function (resss) {
                  if (resss.confirm) {
                    //wx.navigateTo({ url: '/pages/index/index' })
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
  
  //离开界面，断开连接
  onHide(){
    this.disconnect()
  },
  onUnload() {
    this.disconnect()
  },

  //-----开始------蓝牙使用方法-------------
  /**连接模块 */
  connect() {
    if (!wx.openBluetoothAdapter) {
      this.showError("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。");
      return;
    }
    var _this = this;
    //定时器
    setTimeout(function () {
      _this.setData({ stopSearch: true })
      _this.stopSearch();
      //提示找不到设备
      if(!_this.data.connected){
        _this.setData({
          connStatus: '找不到设备'
        })
        wx.showToast({
          title: '找不到设备',
          icon: 'success',
          duration: 5000
        })
      }
    }, 10000);

    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('--openBluetoothAdapter:', res)
      },
      complete(res) {
        wx.onBluetoothAdapterStateChange(function (res) {
          if (res.available && !_this.data.stopSearch) {
            setTimeout(function () {
              _this.connect();
            }, 2000);
          }
        })
        _this.getBlueState();
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: '请检查蓝牙是否可用！',
          timeout: 5000
        })
      }
    })
  },

  //获取蓝牙状态
  getBlueState() {
    var _this = this;
    if (_this.data.device_id != "") {
      _this.connectDevice();
      return;
    }
    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log('--getBluetoothAdapterState:', res)
        if (!!res && res.available) {//蓝牙可用    
          _this.startSearch();
        }
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '请开启手机蓝牙开关！',
          timeout: 5000
        })
      }
    })
  },

  //开始搜索
  startSearch() {
    var _this = this;
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success(res) {
        console.log('--startBluetoothDevicesDiscovery:', res)
        wx.onBluetoothDeviceFound(function (res) {
           
          console.log('--onBluetoothDeviceFound:', res)
          var device = _this.filterDevice(res.devices);
          if (device) {
            _this.setData({ device_id: device.deviceId})
            _this.stopSearch();
            _this.connectDevice();
          }
        });
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: '搜索不到蓝牙，请重试！',
          timeout: 5000
        })
      }
    })
  },
  //停止搜索周边设备  
  stopSearch() {
    var _this = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('--stopBluetoothDevicesDiscovery:', res)
      }
    })
  },

  //连接到设备
  connectDevice() {
    var _this = this;
    wx.createBLEConnection({
      deviceId: _this.data.device_id,
      success(res) {
        console.log('--createBLEConnection:', res)
        _this.getDeviceService();
      }
    })
  },
  //搜索设备服务
  getDeviceService() {
    var _this = this;
    wx.getBLEDeviceServices({
      deviceId: _this.data.device_id,
      success: function (res) {
        console.log('--getBLEDeviceServices:', res)
        //var services = _this.filterService(res.services);
        var service_id = _this.filterService(res.services);
        if (service_id != "") {
          _this.setData({ service_id: service_id })
          //获取连接设备的所有特征值  
          wx.getBLEDeviceCharacteristics({
            deviceId: _this.data.device_id,
            serviceId: service_id,
            success: function (res) {
              console.log('--success getBLEDeviceCharacteristics:', res)
              let notify_id, write_id, read_id;
              for (let i = 0; i < res.characteristics.length; i++) {
                let charc = res.characteristics[i];
                if (charc.properties.notify) {
                  notify_id = charc.uuid;
                }
                if (charc.properties.write) {
                  write_id = charc.uuid;
                }
                if (charc.properties.read) {
                  read_id = charc.uuid;
                }
              }
              if (notify_id != null && write_id != null) {
                _this.setData({
                  notify_id: notify_id,
                  write_id: write_id,
                  connected: true,
                  connStatus: '连接成功'
                })
                _this.openNotify();
              }
              if (read_id != null) {
                _this.setData({
                  read_id: read_id
                })
              }
            },
            complete: function (res) {
              console.log('-complete-getBLEDeviceCharacteristics:', res)
            },
            fail: function (res) {
              wx.showToast({
                icon: 'none',
                title: '获取特征值失败，请重试！',
                timeout: 5000
              })
            }
          })

        }
        
      }
    })
  },
 
  openNotify() {
    var _this = this;
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: _this.data.device_id,
      serviceId: _this.data.service_id,
      characteristicId: _this.data.notify_id,
      complete(res) {
        console.log('--notifyBLECharacteristicValueChange:', res)
        setTimeout(function () {
          _this.onOpenNotify;
        }, 1000);
        _this.onNotifyChange();//接受消息
      },
      fail(res) {
        console.log('启动notify:' + res.errMsg);
      },

    })
  },

  //监听消息
  onNotifyChange(callback) {
    var _this = this;
    wx.onBLECharacteristicValueChange(function (res) {
      callback && callback(msg);
       
      console.log('--onBLECharacteristicValueChange:', res);
    })
  },

  //发送消息
  sendMsg(msg, toArrayBuf = true) {
    let _this = this;
    let buf = toArrayBuf ? this.hexStringToArrayBuffer(msg) : msg;
    wx.writeBLECharacteristicValue({
      deviceId: _this.data.device_id,
      serviceId: _this.data.service_id,
      characteristicId: _this.data.write_id,
      value: buf,
      success: function (res) {
        console.log('--sendMsg:', res);
      },
      fail: function (res) {
        console.log('--sendMsg err:', res);
      }
    })
  },

  //断开 连接 
  disconnect() {
    var _this = this;
    wx.closeBLEConnection({
      deviceId: _this.data.device_id,
      success(res) {
      }
    })
    wx.closeBluetoothAdapter({
      success(res) {
      },
      fail(res) {
      }
    })
  },
  /*事件通信模块*/

  /*其他辅助模块*/
  hexStringToArrayBuffer(str) {
    if (!str) {
      return new ArrayBuffer(0);
    }

    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)

    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }

    return buffer;
  },

  //过滤目标设备
  filterDevice(device) {
    var data = device[0].name;
    if (data && this.data.deviceInfo && this.data.deviceInfo.deviceBrand === data) {
      var obj = { name: device[0].name, deviceId: device[0].deviceId }
      return obj
    }
  },
  //过滤主服务
  filterService(services) {
    let service_id = "";
    for (let i = 0; i < services.length; i++) {
      if (services[i].uuid.toUpperCase().indexOf(this.data.server_info) != -1) {
        service_id = services[i].uuid;
        break;
      }
    }

    return service_id;
  },
  //-----结束------蓝牙使用方法

})