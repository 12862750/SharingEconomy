// admin/login/login.js
import { showErrorToast, to } from '../../utils/util';
import { FETCH_CONFIG } from '../../utils/const';
import { toLogin } from '../../utils/admin-fetch';

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

  async onLogin() {
    const { username, password } = this;
    if (!username) {
      showErrorToast('请输入用户名');
      return;
    }

    if (!password) {
      showErrorToast('请输入密码');
      return;
    }

    wx.showLoading({
      title: '正在登录',
    });
    
    try {
      const [loginRes, loginErr] = await to(toLogin({ username, password }));

      if (loginErr) throw new Error(loginErr);

      const { token, uid } = loginRes;
      FETCH_CONFIG.ADMIN_TOKEN = token;
      FETCH_CONFIG.ADMIN_UID = uid;

      wx.redirectTo({
        url: '/admin/index/index'
      })
    } catch(e) {
      console.log(e);
      showErrorToast(e.errmsg)
    }

    wx.hideLoading();
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