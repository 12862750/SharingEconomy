// admin/shop/shop.js
import { getShop, delShop } from '../../utils/admin-fetch';
import { showErrorToast, to } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops: [],
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

  onShow: function () {
    this.fetchShop();
  },

  fetchShop() {
    wx.showLoading({
      title: '信息加载中',
    })
    getShop()
      .then(res => {
        wx.hideLoading();
        this.setData({
          shops: res.result
        })
      })
      .catch(err => {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: err.errmsg || '获取信息失败，请重试',
          showCancel: false,
          confirmText: '重试',
          success: () => {
            this.getUserInfo();
          }
        })
      })
  },

  goToAddShop() {
    wx.navigateTo({
      url: '/admin/add-shop/add-shop',
    })
  },

  onShopTap(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/admin/shop-info/shop-info?id=' + id,
    })
  },

  onChangeTap(e) {
    const { id } = e.currentTarget.dataset;

    this.goToAddShop(id);
  },

  onAddTap() {
    this.goToAddShop();
  },

  async onDelTap(e) {
    const { id } = e.currentTarget.dataset;

    const confirmRes = await this.confirmDel();

    if (confirmRes.confirm) {
      wx.showLoading({
        title: '正在删除',
      })

      const [delRes, delErr] = await to(delShop({ id }));

      wx.hideLoading();

      if (delErr) {
        console.log(e);
        showErrorToast(e.errmsg);
      } else {
        const dialog = {
          ...delRes.result,
          show: true
        };

        this.setData({
          dialog,
        })
      }
    }
  },

  confirmDel() {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: '提示',
        content: '删除操作无法撤销，确定要删除吗',
        success(res) {
          resolve(res);
        }
      })
    })
  },

  onComfirm() {
    const { success } = this.data.dialog;

    this.setData({
      'dialog.show': false
    });

    if (success) {
      this.fetchShop();
    }
  },

  goToAddShop(id) {
    wx.navigateTo({
      url: '/admin/add-shop/add-shop' + (id ? `?id=${id}` : ''),
    })
  }
})