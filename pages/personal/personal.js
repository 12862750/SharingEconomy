// pages/personal/personal.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    operationList: [
      { text: '订单记录', icon: 'order' },
      { text: '关于我们', icon: 'about' },
      { text: '我要加盟', icon: 'join' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    }
  },
  
  getUserInfo(e) {
    const { userInfo } = e.detail;
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo,
    })
  }
})