//app.js
import { checkSession } from '/utils/util';
import { toLogin } from '/utils/fetch';
import { FETCH_CONFIG } from '/utils/const';

App({
  onLaunch: function () {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.isIPX = this.isIPX(this.globalData.systemInfo.model);

    const wxCode = wx.getStorageSync('wxCode');

    checkSession()
      .then((code) => {
        this.globalData.wxCode = code ? code : wxCode;
      })
      .then(() => {
        FETCH_CONFIG.TOKEN = this.globalData.wxCode;
        return toLogin(this.globalData.wxCode);
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