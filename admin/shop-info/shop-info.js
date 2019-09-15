// admin/shop-info/shop-info.js
import { getShopInfo } from '../../utils/admin-fetch';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: {
      name: '',
      deviceCount: 0,
      devices: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shopId = options.id
  },

  onShow: function () {
    this.fetchShopInfo();
  },

  fetchShopInfo() {
    wx.showLoading({
      title: '信息加载中',
    })
    getShopInfo({ id: this.shopId })
      .then(res => {
        wx.hideLoading();
        this.setData({
          shop: res.result
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
            wx.navigateBack();
          }
        })
      })
  },

  goToAddDevice() {
    wx.navigateTo({
      url: '/admin/add-device/add-device?id=' + this.shopId,
    })
  }
})