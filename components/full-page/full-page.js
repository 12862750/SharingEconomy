const systemInfo = getApp().globalData.systemInfo || wx.getSystemInfoSync();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    bgImg: String,
    bgHeight: String,
    bgFrom: {
      type: String,
      value: '#68d98a'
    },
    bgTo: {
      type: String,
      value: '#41c2a9'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    systemInfo
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
