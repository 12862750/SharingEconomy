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
    const skey = wx.getStorageSync('skey')
    FETCH_CONFIG.TOKEN = token;
    FETCH_CONFIG.UID = uid;
    FETCH_CONFIG.CODE = skey;

    checkSession(token)
      .then((code) => {
        if (code) {
          FETCH_CONFIG.CODE = code;
          wx.setStorageSync('skey', code);
          return toLogin(code);
        }
        return Promise.resolve({});
      })
      .then(({ result }) => {
        if (result) {
          FETCH_CONFIG.TOKEN = result.token;
          FETCH_CONFIG.UID = result.uid;
          wx.setStorageSync('token', result.token);
          wx.setStorageSync('uid', result.uid);
          this.loginReadyCallback && this.loginReadyCallback(result)
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