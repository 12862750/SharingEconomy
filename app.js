//app.js
App({
  onLaunch: function () {
    this.globalData.isIPX = this.isIPX();
  },
  isIPX() {
    return !!wx.getSystemInfoSync().model.match(/iPhone\sX/g);
  },
  globalData: {
    isIPX: false
  }
})