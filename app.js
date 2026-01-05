// app.js
// npm install umtrack-wx@latest --save
const AppUtil = require("@/utils/AppUtil")
const Config = require("@/utils/Config")
const Constant = require("@/utils/Constant")
const NetworkUtil = require("@/utils/NetworkUtil")
const WxNotificationCenter = require("@/utils/WxNotificationCenter")
const LoginUtil = require("@/utils/LoginUtil")
import 'umtrack-wx'; //npm install umtrack-wx@latest --save


App({
    onLaunch: async function (options) {
        await this.init(options)
    },

    onShow: function (options) {
    },

    globalData: {},

    umengConfig: {
        appKey: Config.umengConfig, //由友盟分配的APP_KEY
        useOpenid: false, // 是否使用openid进行统计，此项为false时将使用友盟+随机ID进行用户统计。使用openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用OpenID。
        autoGetOpenid: false, // 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
        debug: false, //是否打开调试模式
    },

    /**
     * 初始化工作
     */
    async init(options) {
        this.showEnvToast()
        AppUtil.checkUpdate()
        // this.loadFontFace()
        WxNotificationCenter.addNotification("refresh_work_order", () => {
            this.getUnReadCount()
        }, this)

        //清除旧的token 每次启动都获取新token
        wx.removeStorageSync(Constant.STORAGE_KEY_ACCESS_TOKEN)
        await NetworkUtil.getToken()
    },

    /**
     * 吐司提示当前运行环境
     */
    showEnvToast() {
        if (Config.ENV.NAME !== "release") {
            wx.showToast({
                title: `当前处于${Config.ENV.NAME}环境`,
                icon: "none",
            })
        }
    },

    /**
     * 加载字体
     */
    loadFontFace() {
        wx.loadFontFace({
            global: true,
            family: '',
            source: '',
            desc: {
                style: 'normal',
                weight: 'normal',
                variant: 'normal'
            },
            success: (result) => {
            },
            fail: (res) => {
            },
            complete: () => {
            }
        });
    },


    onUnlaunch() {
        WxNotificationCenter.removeNotification("refresh_work_order", this)
    }
})
