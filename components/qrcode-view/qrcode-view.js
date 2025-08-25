// component/qrcode-view/qrcode-view.js
const QR = require('./util/weapp-qrcode')
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      value: '',
      observer(val) {
        if (val) {
          this.generateQRCode(val)
        }
      }
    },
    width: {
      type: Number,
      value: 300,
    },
    height: {
      type: Number,
      value: 300,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    generateQRCode(content) {
      this.data.url = QR.drawImg(content, {
        typeNumber: 4,
        errorCorrectLevel: 'M',
        size: this.data.width
      })
      this.setData({
        url: this.data.url
      })
    }
  }
})