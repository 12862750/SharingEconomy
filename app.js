//app.js
import { checkSession } from '/utils/util';
import { toLogin } from '/utils/fetch';
import { FETCH_CONFIG } from '/utils/const';

App({
  onLaunch: function () {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.isIPX = this.isIPX(this.globalData.systemInfo.model);

    const token = wx.getStorageSync('token');
    const uid = wx.getStorageSync('uid');
    FETCH_CONFIG.TOKEN = token;
    FETCH_CONFIG.UID = uid;

    checkSession(token)
      .then((code) => {
        return code ? toLogin(code) : Promise.resolve({});
      })
      .then(({ result }) => {
        if (result) {
          FETCH_CONFIG.TOKEN = result.token;
          FETCH_CONFIG.UID = result.uid;
          wx.setStorageSync('token', result.token);
          wx.setStorageSync('uid', result.uid);
        }
      });

    this.getUserInfo();
  },
  getUserInfo() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.globalData.userInfo = res.userInfo;
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  isIPX(model) {
    return !!model.match(/iPhone\sX/g);
  },
  globalData: {
    isIPX: false,
    systemInfo: {},
    userInfo: null,
  }
})