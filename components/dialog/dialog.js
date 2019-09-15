// components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showHeader: {
      type: Boolean,
      value: true
    },
    header: String,
    showFooter: {
      type: Boolean,
      value: true
    },
    comfirmText: {
      type: String,
      value: '确 定'
    },
    showCancel: {
      type: Boolean,
      value: true
    },
    cancelText: {
      type: String,
      value: '取 消'
    },
    msg: String,
    type: {
      type: String,
      value: 'success'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComfirm() {
      this.triggerEvent('comfirm');
    },
    onCancal() {
      this.triggerEvent('cancal');
    }
  }
})
