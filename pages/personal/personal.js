// pages/personal/personal.js
import {
  fetchUserInfo,
} from '../../utils/fetch';
import { FETCH_CONFIG } from '../../utils/const';
import { formatterPhoneNumber } from '../../utils/util'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    mobile: '',
    operationList: [
      { text: '订单记录', type: 'order' },
      { text: '关于我们', type: 'about' },
      { text: '我要加盟', type: 'join' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

  onShow() {
    if (app.globalData.userInfo) {
      fetchUserInfo({ userId: FETCH_CONFIG.UID })
        .then((res) => {
          this.setData({
            mobile: res.result.mobile,
            userInfo: app.globalData.userInfo,
          });
        });
    } else {
      app.userInfoReadyCallback = (res) => {
        fetchUserInfo({ userId: FETCH_CONFIG.UID })
          .then(({ result }) => {
            this.setData({
              mobile: result.mobile,
              userInfo: res.userInfo,
            });
          });
      }
    }
  },
  
  getUserInfo(e) {
    const { userInfo } = e.detail;
    app.globalData.userInfo = userInfo;
    fetchUserInfo({ userId: FETCH_CONFIG.UID })
      .then((res) => {
        this.setData({
          mobile: res.result.mobile,
          userInfo,
        });
      });
  },

  onListTap(e) {
    const { type } = e.currentTarget.dataset;

    wx.navigateTo({
      url: `/pages/${type}/${type}`
    })
  },

  onGetPhone(e) {
    wx.showLoading({
      title: '正在加载',
    });
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        ...e.detail,
        code: FETCH_CONFIG.CODE,
      },
    })
      .then(res => {
        wx.hideLoading();
        console.log(res);
        const { data, err } = res.result;
        if (err) {
          wx.showToast({
            title: err.errmsg,
            icon: 'none'
          })
          return
        }
        const { phoneNumber } = data;
        this.setData({
          mobile: formatterPhoneNumber(phoneNumber),
        });
        this.bindPhoneNumber(phoneNumber);
      })
      .catch((err) => {
        wx.hideLoading();
        console.error(err);
      })
  },

  bindPhoneNumber(num) {
    console.log(num)
  }
})