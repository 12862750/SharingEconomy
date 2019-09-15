// admin/add-device/add-device.js
import { getShopInfo, toAddDevice } from '../../utils/admin-fetch';
import { showErrorToast, to } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopName: '',
    deviceNum: '',
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
    this.fetchShopInfo(options.id);
  },

  fetchShopInfo(id) {
    wx.showLoading({
      title: '信息加载中',
    })
    getShopInfo({ id })
      .then(res => {
        wx.hideLoading();
        this.setData({
          shopName: res.result.name
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

  async onSubmit(e) {
    const { deviceCode } = e.detail.value;

    if (!deviceCode) {
      wx.showToast({
        title: '请输入设备编号',
        icon: 'none'
      });

      return;
    }

    wx.showLoading({
      title: '正在提交...',
    })

    try {
      const [addRes, addErr] = await to(toAddDevice({
        deviceCode,
        id: this.options.id
      }));

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
  },

  onScan() {
    wx.scanCode({
      success: (res) => {
        this.setData({
          deviceNum: res.result
        })
      },
      fail: () => {
        wx.showToast({
          title: '扫码失败，请重试',
          icon: 'none'
        })
      }
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