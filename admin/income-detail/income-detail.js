// admin/income-detail/income-detail.js
import { fetchImcomeRecords } from '../../utils/admin-fetch';
import { showErrorToast } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    records: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading({
      title: '信息加载中',
    })
    const a = fetchImcomeRecords()
      .then(res => {
        this.setData({
          records: res.result
        })
      })
      .catch(err => {
        wx.showModal({
          title: '错误',
          content: err.errmsg || '获取收入记录失败，请重试',
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
  goToCashGet() {
    wx.navigateTo({
      url: '/admin/cash-get/cash-get',
    })
  }
})