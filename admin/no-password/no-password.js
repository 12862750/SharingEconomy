// admin/no-password/no-password.js
import { showErrorToast, to } from '../../utils/util';
import { FETCH_CONFIG } from '../../utils/const';
import { toLogin, getCode, resetPassword } from '../../utils/admin-fetch';

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
    waitTime: 0,
  },

  async onComplete() {
    const { username, code, password } = this;
    if (!username) {
      showErrorToast('请输入用户名');
      return;
    }

    if (!code) {
      showErrorToast('请输入验证码');
      return;
    }

    if (!password) {
      showErrorToast('请输入密码');
      return;
    }

    wx.showLoading({
      title: '加载中···',
    });

    try {
      const [resetRes, resetErr] = await to(resetPassword({ username, code, password }));

      if (resetErr) throw new Error(resetErr);

      wx.showToast({
        title: '密码重置成功',
      })

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (e) {
      console.log(e);
      showErrorToast(e.errmsg)
      wx.hideLoading();
    }

  },

  onInput(e) {
    const { currentTarget, detail: { value } } = e;
    const { type } = currentTarget.dataset;

    this[type] = value;
  },

  onGetCode() {
    const { username } = this;
    if (!username) {
      showErrorToast('请输入用户名');
      return;
    }

    getCode(username);

    this.data.waitTime = 60;
    this.timer = setInterval(() => {
      this.setData({
        waitTime: --this.data.waitTime
      });

      if (!this.data.waitTime) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }, 1000)
  }
})