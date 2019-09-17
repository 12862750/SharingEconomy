// pages/pay/pay.js
import {
  toLogin,
  fetchUserBalance,
  fetchDeviceInfo,
  payToStart,
  getOrderState,
} from '../../utils/fetch';
import { PAY_TYPE, FETCH_CONFIG } from '../../utils/const';

import {
  getQueryString,
  getWechatPayData,
  getVirtualCurrencyData,
  getCardPayData,
} from './util'
import {
  checkSession,
  to,
  showErrorToast,
  ab2hex,
} from '../../utils/util';
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
    orderState: 2,
 
    // 蓝牙是否连接
    connected: false,
    device_info: ["BT","C"],//合法设备前缀
    server_info: ["0000FF","0000AE"],//合法服务前缀
    device_id: "",
    service_id: "",
    write_id: null,
    notify_id: null,
    read_id: null,
    // 发送指令后返回结果
    writeReturn: false,
    onOpenNotify: null,
    stopSearch:false,
    isScan:false
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
      if (FETCH_CONFIG.TOKEN && FETCH_CONFIG.UID) {
        this.pageInit();
      } else {
        app.loginReadyCallback = () => {
          this.pageInit();
        }
      }
    }
  },

  //初始界面设备信息和蓝牙搜索连接
  async pageInit() {
    wx.showLoading({
      title: '信息加载中...',
    })
    
    try {
      const [infoRes, infoErr] = await to(this.getInfo());
      if (infoErr) {
        showErrorToast(infoErr.errmsg);
        this.disconnect();
        return;
      }

      this.setData(infoRes);

      this.onNotifyChange(function (msg) {
        console.log(msg);
      })
    } catch(e) {
      console.error(e);
      showErrorToast();
    }

    wx.hideLoading();
  },

  getInfo() {
    return Promise.all([
      fetchUserBalance(),
      fetchDeviceInfo(this.data.deviceNumber)
    ])
      .then(([{ result: userBalance }, { result: deviceInfo }]) => {
          this.setData({
               userBalance: userBalance,
               deviceInfo: deviceInfo
          })
          this.connect()
      })
      .catch((err) => Promise.reject(err));
  },
  setTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.interval = setInterval(() => {
      this.setData({
        timeText: --this.data.timeText
      })

      if (!this.data.timeText) {
        this.setData({
          orderState: 0
        })

        clearInterval(this.interval);
        this.interval = null;
      }
    }, 1000)
  },
  async checkDeviceState() {
    wx.showLoading({
      title: '正在检查设备状态',
    });
    try {
      const [orderInfo, orderErr] = await to(getOrderState(this.data.deviceInfo.deviceNumber));
      console.log(orderInfo);
      if (orderErr) {
        showErrorToast(orderErr.errmsg);
        return;
      }

      this.orderInfo = orderInfo;

      if (orderInfo.status === 1) {
        // 订单进行中，检测设备状态
        this.isCheckingDevice = true;
        const [msgRes, msgErr] = await to(this.sendMsg('FFDF0401000000E4'));

        if (msgErr) {
          showErrorToast('获取设备状态出错，请重新扫码！');
          return;
        }

        this.setData({
          orderState: 1,
          timeText: this.data.deviceInfo.operatorName * 60 - orderInfo.timeUsed
        })
        this.setTimer();
      } else {
        //开始连接设备
        this.setData({
          orderState: 0
        })
      }
    } catch(e) {
      console.log(e);
    }
    wx.hideLoading();
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
    this.setData({
      isScan: true
    })
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
              const command = this.getCommandStr(this.data.deviceInfo.operatorName);
              this.sendMsg(command);
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
              this.setData({
                orderState: 1,
                timeText: (this.data.deviceInfo.operatorName * 60)
              })

              this.setTimer();
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
    if (!this.data.isScan){
      this.disconnect()
    }
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
    }, 20000);

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
            _this.connectDevice();
            _this.stopSearch();
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
        if (!_this.hadOpened) {
          console.log('--notifyBLECharacteristicValueChange:', res)
          setTimeout(function () {
            _this.onOpenNotify;
          }, 1000);
          _this.onNotifyChange();//接受消息
          _this.stopSearch();
          _this.checkDeviceState();
          _this.hadOpened = true;
        }
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
      callback && callback(res);
       
      console.log('--onBLECharacteristicValueChange:', res);
      console.log('--hex', ab2hex(res.value));
      const state = ab2hex(res.value).slice(-4, -2);
      
      if (_this.isCheckingDevice && state === '00') {
        const time = _this.data.deviceInfo.operatorName - _this.orderInfo.timeUsed / 60;
        const command = _this.getCommandStr(time);
        _this.sendMsg(command);
        _this.isCheckingDevice = false;
      }
    })
  },

  //发送消息
  sendMsg(msg, toArrayBuf = true) {
    let _this = this;
    let buf = toArrayBuf ? this.hexStringToArrayBuffer(msg) : msg;
    return new Promise((resolve, reject) => {
      wx.writeBLECharacteristicValue({
        deviceId: _this.data.device_id,
        serviceId: _this.data.service_id,
        characteristicId: _this.data.write_id,
        value: buf,
        success: function (res) {
          console.log('--sendMsg:', res);
          resolve(res)
        },
        fail: function (err) {
          console.log('--sendMsg err:', err);
          reject(err)
        }
      })
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
      if (services[i].uuid.toUpperCase().indexOf(this.data.server_info[0]) != -1 ||
          services[i].uuid.toUpperCase().indexOf(this.data.server_info[1]) != -1) {
        service_id = services[i].uuid;
        break;
      }
    }

    return service_id;
  },
  getCommandStr(time) {
    time = Number(time)
    const valid = (271 + time + parseInt('00', 16)).toString(16).slice(-2).toUpperCase();
    const time16 = time.toString(16).toUpperCase();
    return `FFDF03002D${time16}00${valid}`;
  }
  //-----结束------蓝牙使用方法

})