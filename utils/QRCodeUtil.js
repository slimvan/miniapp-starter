const NetworkUtil = require("@/utils/NetworkUtil")
const JSUtil = require("@/utils/JSUtil")

const QRCodeUtil = {
    /**
     * 解析小程序码参数
     */
    async parseScene(scene) {
        let res = await NetworkUtil.get({
            url: "qrcode/parse",
            params: {
                alias: scene
            }
        })
        if (res.error === 0) {
            return res.data
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    },

    /**
     * 普通二维码打开小程序参数获取
     */
    getNormalQRCodeParams(options) {
        const q = decodeURIComponent(options.q)
        console.log('普通二维码打开小程序', q)
        return JSUtil.parseUrl(q)
    }
}
module.exports = QRCodeUtil;