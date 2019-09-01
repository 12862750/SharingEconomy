// admin/login/login.js
import { showErrorToast } from '../../utils/util'

const systemInfo = getApp().globalData.systemInfo;
const bgHeight = systemInfo.screenWidth * 443 / 750;
const contentPadingTop = bgHeight - systemInfo.statusBarHeight - 44;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgHeight,
    contentPadingTop,
  },

  onLogin() {
    if (!this.username) {
      showErrorToast('请输入用户名');
      return;
    }

    if (!this.password) {
      showErrorToast('请输入密码');
      return;
    }

    wx.showLoading({
      title: '正在登录',
    });
  },

  onInput(e) {
    const { currentTarget, detail: { value }} = e;
    const { type } = currentTarget.dataset;

    this[type] = value;
  },

  onNoPasswordTap() {
    wx.navigateTo({
      url: '/admin/no-password/no-password'
    })
  }
})