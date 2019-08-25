// pages/join/join.js
import { FETCH_CONFIG } from '../../utils/const.js';
import { submitAddJoin } from '../../utils/fetch.js';

const app = getApp();
const validateMsg = {
  city: '请输入城市信息',
  userName: '请输入联系人',
  mobileno: '请输入联系电话',
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: app.globalData.isIPX,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onSubmit(e) {
    console.log(e.detail.value);
    const formData = e.detail.value;
    const keys = Object.keys(formData);

    const emptyKey = keys.find((key) => !formData[key]);

    if (emptyKey && emptyKey !== 'remarks') {
      wx.showToast({
        title: validateMsg[emptyKey],
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '正在提交',
    });

    submitAddJoin(Object.assign(formData, { userId: FETCH_CONFIG.UID }))
      .then((res) => {
        wx.showToast({
          title: '提交成功',
          mask: true,
        });

        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      })
      .catch((err) => {
        console.log('err', err)
        wx.showToast({
          title: '提交加盟信息出错，请重试！',
          icon: 'none',
          mask: true,
        });
      })
  }
})