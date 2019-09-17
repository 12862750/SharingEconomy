// admin/cash-get/cash-get.js
import { showErrorToast, to } from '../../utils/util';
import { toGetCash } from '../../utils/admin-fetch';

Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  onInput(e) {
    const { detail: { value } } = e;

    this.amount = value;
  },

  async onSubmit() {
    const { amount } = this;

    if (!amount) {
      showErrorToast('请输入提现金额');
      return;
    }

    if (amount % 100) {
      showErrorToast('金额需为100或100的整倍数');
      return;
    }

    try {
      const [cashRes, cashErr] = await to(toGetCash({ amount }));

      if (cashErr) throw new Error(cashErr);

      const dialog = {
        ...cashRes.result,
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
  },

  onComfirm() {
    const { success } = this.data.dialog;

    this.setData({
      'dialog.show': false
    });
  }
})