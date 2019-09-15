// admin/add-agent/add-agent.js
import { showErrorToast, to } from '../../utils/util';
import { saveShop, uploadPic, getShopInfo } from '../../utils/admin-fetch';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialog: {
      show: false,
      success: false,
      msg: ''
    },
    shop: {
      deviceNum: '',
      name: '',
      position: '',
      longitude: '',
      latitude: '',
      contact: '',
      phone: '',
      pic: []
    },
    pageTitle: '新增代理商'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        pageTitle: '修改代理商'
      });

      getShopInfo({ id: options.id })
        .then(res => {
          wx.hideLoading();
          this.setData({
            shop: res.result
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
              wx.navigateBack();
            }
          })
        })
    }
  },

  async onSubmit(e) {
    const params = e.detail.value;
    if (this.validateForm(params)) {
      wx.showLoading({
        title: '正在提交',
      });

      try {
        const [uploadRes, uploadErr] = await to(uploadPic(this.data.shop.pic));

        console.log(uploadRes);

        if (uploadErr) throw new Error(uploadErr);

        const [saveRes, saveErr] = await to(saveShop({ id: this.options.id, pic: uploadRes, ...params }));

        if (saveErr) throw new Error(saveErr);

        const dialog = {
          ...saveRes.result,
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

  onNavTap() {
    wx.chooseLocation({
      success: (res) => {
        const { longitude, latitude, name } = res;
        this.setData({
          'shop.longitude': longitude,
          'shop.latitude': latitude,
          'shop.position': name
        })
      }
    })
  },

  onScanTap() {
    wx.scanCode({
      success: (res) => {
        this.setData({
          'shop.deviceNum': res.result
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

  onPicSelectTap() {
    wx.chooseImage({
      success: (res) => {
        this.setData({
          'shop.pic': res.tempFilePaths
        })
      },
      fail: (err) => {
        console.log(err);
        wx.showToast({
          title: '上传图片失败，请重试',
          icon: 'none'
        })
      }
    })
  },

  validateForm(obj) {
    const errMsg = {
      deviceNum: '请输入设备编号',
      name: '请输入店铺名称',
      position: '请输入店铺位置',
      longitude: '请输入经度',
      latitude: '请输入纬度',
      contact: '请输入联系人',
      phone: '请输入联系方式'
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