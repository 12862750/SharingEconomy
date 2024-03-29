// admin/agent/agent.js
import { showErrorToast, to } from '../../utils/util';
import { getAgent } from '../../utils/admin-fetch';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    agents: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    this.fetchAgent();
  },

  fetchAgent() {
    wx.showLoading({
      title: '信息加载中',
    })
    getAgent()
      .then(res => {
        wx.hideLoading();
        this.setData({
          agents: res.result
        })
      })
      .catch(err => {
        wx.hideLoading();
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
  },

  goToAddAgent() {
    wx.navigateTo({
      url: '/admin/add-agent/add-agent',
    })
  }
})