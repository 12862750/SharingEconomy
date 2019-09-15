// components/table/table.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    columns: Array,
    data: {
      type: Array,
      value: [],
      observer: (val) => {
        console.log(val)
      }
    },
    showHeader: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    attached: function () {
      console.log(this)
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
