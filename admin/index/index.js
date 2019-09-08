// admin/index/index.js
import { getUserInfo } from '../../utils/admin-fetch';
import { showErrorToast } from '../../utils/util';

const systemInfo = getApp().globalData.systemInfo;
const bgHeight = systemInfo.screenWidth * 456 / 750;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgHeight,
    info: {
      total: 0,
      today: 0,
      curMonth: 0,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },

  getUserInfo() {
    wx.showLoading({
      title: '信息加载中',
    })
    const a = getUserInfo()
      .then(res => {
        this.setData({
          info: res.result
        })
      })
      .catch(err => {
        wx.showModal({
          title: '错误',
          content: err.errmsg || '获取信息失败，请重试',
          showCancel: false,
          confirmText: '重试',
          success: () => {
            this.getUserInfo();
          }
        })
      })
      .finally(() => {
        wx.hideLoading();
      })
  },

  toChangePassword() {
    wx.navigateTo({
      url: '/admin/change-password/change-password',
    })
  },

  toOperatePage(e) {
    const { type } = e.currentTarget.dataset;

    wx.navigateTo({
      url: `/admin/${type}/${type}`,
    })
  }
})