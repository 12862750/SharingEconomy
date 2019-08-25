// pages/order/order.js
import {
  getOrderList,
} from '../../utils/fetch';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    orderList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
    });

    getOrderList()
      .then(res => {
        wx.hideLoading();
        this.setData({
          orderList: res.result,
          // orderList: [{
          //   id: '1',
          //   name: '网点1',
          //   type: '充值',
          //   status: '完成',
          //   time: '2019-07-03 15:32:33',
          //   applied: '9.9'
          // }, {
          //   id: '2',
          //   name: '网点2',
          //   type: '使用',
          //   status: '3分20秒',
          //   time: '2019-07-03 15:32:33',
          //   applied: '9.9'
          // }],
          isLoading: false,
        });
      })
      .catch(err => {
        console.log(err);
        wx.hideLoading();
        this.setData({
          isLoading: false,
        });
      })
  },
})