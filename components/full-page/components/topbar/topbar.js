// components/topbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    showBack: false,
  },

  lifetimes: {
    attached: function () {
      this.setData({
        showBack: getCurrentPages().length > 1,
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
