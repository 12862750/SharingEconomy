// pages/personal/personal.js
import {
  fetchUserInfo,
  postPhone,
} from '../../utils/fetch';
import { FETCH_CONFIG } from '../../utils/const';
import { formatterPhoneNumber, to } from '../../utils/util'

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

  async onGetPhone(e) {
    wx.showLoading({
      title: '正在绑定',
    });
    try {
      const [code, getCodeErr] = await to(this.getCode());
      if (getCodeErr) {
        wx.showToast({
          title: getCodeErr.errmsg,
          icon: 'none',
        });
        return
      }

      const phoneRes = await to(this.getDecodePhoneInfo(e, code));
      const [phoneNumber, errmsg] = this.getPhoneNumber(phoneRes);

      if (errmsg) {
        wx.showToast({
          title: errmsg,
          icon: 'none',
        });
        return
      }

      this.setData({
        mobile: formatterPhoneNumber(phoneNumber),
      });
      this.bindPhoneNumber(phoneNumber);
      wx.hideLoading();
    } catch(e) {
      console.log(e)
      wx.showToast({
        title: '绑定手机号失败，请重试',
        icon: 'none',
      })
    }
  },

  getCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res.code);
        },
        fail: err => {
          reject(err);
        }
      })
    })
  },

  getDecodePhoneInfo(e, code) {
    wx.cloud.init();
    return wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        ...e.detail,
        code,
      },
    })
  },

  getPhoneNumber([res, err]) {
    if (err || res.result.err) {
      return [null, err.errmsg];
    }

    const { phoneNumber } = res.result.data;

    return [phoneNumber, null];
  },

  bindPhoneNumber(num) {
    postPhone(num)
  }
})