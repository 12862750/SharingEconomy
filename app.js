//app.js
App({
  onLaunch: function () {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.isIPX = this.isIPX(this.globalData.systemInfo.model);
    wx.checkSession({
      success: (res) => {
        console.log(res);
      },
      fail: (err) => {
        console.log(err);
      }
    });
  },
  isIPX(model) {
    return !!model.match(/iPhone\sX/g);
  },
  globalData: {
    isIPX: false,
    systemInfo: {},
  }
})