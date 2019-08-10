//app.js
import { checkSession } from '/utils/util';
import { toLogin } from '/utils/fetch';
import { FETCH_CONFIG } from '/utils/const';

App({
  onLaunch: function () {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.isIPX = this.isIPX(this.globalData.systemInfo.model);

    const token = wx.getStorageSync('token');

    checkSession()
      .then((code) => {
        return code ? toLogin(code) : Promise.resolve({});
      })
      .then(({ result }) => {
        if (result) {
          FETCH_CONFIG.TOKEN = result.token;
          wx.setStorageSync('token', result.token);
        } else {
          FETCH_CONFIG.TOKEN = token;
        }
      });
  },
  isIPX(model) {
    return !!model.match(/iPhone\sX/g);
  },
  globalData: {
    isIPX: false,
    systemInfo: {},
    wxCode: '',
  }
})