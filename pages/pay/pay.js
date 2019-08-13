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

import bluetooth from '../../utils/bluetooth.js';
var TimerCheck;

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageInit();
  },
  pageInit() {
    wx.showLoading({
      title: '信息加载中...',
    })
    Promise.all([fetchUserBalance(), fetchDeviceInfo('A00006')])
      .then(([{ result: userBalance}, { result: deviceInfo }]) => {
        wx.hideLoading();
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
  onShow() {
    bluetooth.OpenPrint(); //打开蓝牙
    timer(this);
  },
  onHide: function () {
    clearInterval(TimerCheck);
    bluetooth.ClosePirint(); //关闭蓝牙
  },

  //发送指令
  printText() {
    pos.PrintText('aa');
  },
})

//定时器
function timer(that) {
  try {
    if (bluetooth.GetCanPrint()) { //打印机是否就绪
      that.setData({
        connStatus: '连接成功'
      });
    } else {
      that.setData({
        motto: bluetooth.GetCurLog(), //状态日志
      });
    }
  } catch (err) { }
  TimerCheck = setTimeout(function () {
    timer(that);
  }, 9000);
}