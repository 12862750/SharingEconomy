// components/form-item/form-item.js
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    label: String,
    placeholder: String,
    id: String,
    type: {
      type: String,
      value: 'input'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    focus: false,
  },

  lifetimes: {
    attached() {
      this.setData({
        value: '',
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLabelTap() {
      this.setData({
        focus: true,
      });
    },
    onInput(e) {
      const { value } = e.detail;

      this.setData({
        value,
      });
    }
  }
})
