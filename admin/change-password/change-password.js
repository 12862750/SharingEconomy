// admin/change-password/change-password.js
import { showErrorToast, to } from '../../utils/util';
import { changePassword } from '../../utils/admin-fetch'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: 'test1',
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

  },

  async onSubmit() {
    const { oldPassword, password, comfirmPassword } = this;
    const params = { oldPassword, password, comfirmPassword };

    if (this.validateForm(params)) {
      if (password === comfirmPassword) {
        wx.showLoading({
          title: '正在提交...',
        })
        const [changeRes, changeErr] = await to(changePassword(params));
        let dialog = null;

        if (changeErr) {
          dialog = {
            ...changeErr,
            show: true
          }
        } else {
          dialog = {
            ...changeRes,
            show: true
          }
        }

        this.setData({
          dialog,
        })

        wx.hideLoading();
      } else {
        showErrorToast('确认密码不一致')
      }
    }
  },

  onInput(e) {
    const { currentTarget, detail: { value } } = e;
    const { type } = currentTarget.dataset;

    this[type] = value;
  },

  validateForm(obj) {
    const errMsg = {
      oldPassword: '请输入旧密码',
      password: '请输入新密码',
      comfirmPassword: '请再次确认密码',
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