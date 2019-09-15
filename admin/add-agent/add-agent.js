// admin/add-agent/add-agent.js
import { showErrorToast, to } from '../../utils/util';
import { toAddAgent } from '../../utils/admin-fetch';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitTime: 0,
    role: '1',
    dialog: {
      show: false,
      success: false,
      msg: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.role = '1'
  },

  async onSubmit() {
    const { acount, password, phone, mobileCode, name, role } = this;
    const params = { acount, password, phone, mobileCode, name, role };

    if (this.validateForm(params)) {
      wx.showLoading({
        title: '正在提交...',
      })
      try {
        const [addRes, addErr] = await to(toAddAgent(params));

        if (addErr) throw new Error(addErr);

        const dialog = {
          ...addRes.result,
          show: true
        };

        this.setData({
          dialog,
        })
      } catch (e) {
        console.log(e);
        showErrorToast(e.errmsg)
      }

      wx.hideLoading();
    }
  },

  onInput(e) {
    const { currentTarget, detail: { value } } = e;
    const { type } = currentTarget.dataset;

    this[type] = value;

    if (type === 'role') {
      this.setData({
        role: value
      })
    }
  },

  goBack() {
    wx.navigateBack();
  },

  onGetCode() {
    const { phone } = this;
    if (!phone) {
      showErrorToast('请输入手机号');
      return;
    }

    getCode(phone);

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
  },
  validateForm(obj) {
    const errMsg = {
      acount: '请输入账户',
      password: '请输入密码',
      phone: '请输入手机号',
      mobileCode: '请输入验证码',
      name: '请输入名称',
      role: '请选择角色'
    }

    return Object.keys(obj).every(key => {
      if (!obj[key]) {
        showErrorToast(errMsg[key]);
        return false;
      }

      return true;
    })
  },

  onComfirm() {
    const { success } = this.data.dialog;

    this.setData({
      'dialog.show': false
    });

    if (success) {
      wx.navigateBack();
    }
  }
})