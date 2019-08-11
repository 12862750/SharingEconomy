// pages/pay/pay.js
import { fetchUserInfo, fetchUserBalance, fetchDeviceInfo } from '../../utils/fetch';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: app.globalData.isIPX,
    payType: '1',
    payTypeList: [{
      id: 'pay1',
      value: '1',
      name: '光波卡',
    }, {
      id: 'pay2',
      value: '2',
      name: '能量贝抵扣',
    }, {
      id: 'pay3',
      value: '3',
      name: '单次体验',
    }],
    deviceInfo: {}
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
  },
  onPayTypeChange(e) {
    const { value } = e.detail;
    this.setData({
      payType: value,
    });
  },
  onScanTap() {
    console.log('扫描光波卡');
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
        console.log(res);
      }
    })
  },
  onStartTap() {
    console.log('开启设备！！！')
  }
})