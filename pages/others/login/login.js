// pages/others/login/login.js
const Config = require("@/utils/Config")
const Util = require("@/utils/Util")
const RouteUtil = require("@/utils/RouteUtil")
const LoginUtil = require("@/utils/LoginUtil")
const NetworkUtil = require("@/utils/NetworkUtil")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '', //手机号
        code: '', //验证码
        isLoginBySMSCode: false, //通过短信验证码登录
        verify_info: {}, //图形验证码信息
        send_code_enable: true, //发送验证码 开关
        count_down_time: Config.SMS_COUNTDOWN_TIME, //倒计时时间 单位秒
        interval: null, //倒计时计时器
        checked: false, //同意用户协议

        redirect_url: '', //重定向路径
        redirect_options: {}, //重定向onLoad参数

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.redirect_url) {
            this.setData({
                redirect_url: decodeURIComponent(options.redirect_url)
            })
        }
        if (options.redirect_options) {
            this.setData({
                redirect_options: JSON.parse(decodeURIComponent(options.redirect_options))
            })
        }

    },

    /**
     * 获取图形验证码
     */
    getVerifyCode: async function () {
        let res = await NetworkUtil.get({
            url: "/captcha/get",
            params: {}
        })
        if (res.error === 0) {
            this.setData({
                verify_info: res.data
            })
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    },


    /**
     * 快速登录-获取手机号码
     */
    onPhoneNumberGeted: async function (e) {
        if (!e.detail.code) {
            return
        }

        if (e.detail.errMsg.indexOf('deny') !== -1) {
            // 用户取消授权
            return
        }

        let res = await NetworkUtil.post({
                url: "/mp/bind-mobile-by-code",
                params: {
                    code: e.detail.code
                },
                loadingText: "登录中"
            }
        )
        if (res.error === 0) {
            this.handleLoginSuccess(res)
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    },

    /**
     * 登录成功后处理
     * @param {接口返回信息} res
     */
    handleLoginSuccess: function (res) {
        LoginUtil.saveLoginData(res)

        if (this.data.redirect_url) {
            RouteUtil.previousPage().onLoad(this.data.redirect_options)
            wx.navigateBack({
                delta: 1,
            })
        } else {
            //跳转首页
            wx.reLaunch({
                url: '/pages/homepage/homepage',
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 手机号输入
     */
    onMobileInput: function (e) {
        this.setData({
            mobile: e.detail.value,
        })
    },

    /**
     * 验证码输入
     */
    onCodeInput: function (e) {
        this.setData({
            code: e.detail.value,
        })
    },

    /**
     * 图形验证码输入
     */
    onVerifyCode: function (e) {
        this.setData({
            'verify_info.code': e.detail.value
        })
    },

    /**
     * 勾选同意用户协议
     */
    onLinkViewClick: function () {
        this.setData({
            checked: !this.data.checked
        })
    },

    /**
     * 查看用户协议
     */
    onLinkClick: function (e) {
        wx.openPrivacyContract()
    },

    /**
     * 通过短信验证码登录
     */
    onLoginTypeSwitch: function () {
        this.setData({
            isLoginBySMSCode: !this.data.isLoginBySMSCode
        })
        if (this.data.isLoginBySMSCode) {
            this.getVerifyCode()
        }
    },

    /**
     * 按钮遮罩点击
     */
    onButtonsMaskClick: function () {
        wx.showToast({
            title: '请阅读并同意《用户协议及隐私政策》',
            icon: 'none'
        })
    },


    /**
     * 发送验证码
     */
    onSendCodeClick: Util.debounce(async function () {
        if (!this.data.mobile) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            })
            return
        }
        if (!this.data.verify_info.code) {
            wx.showToast({
                title: '请输入图形验证码',
                icon: 'none'
            })
            return
        }
        let res = await NetworkUtil.post({
            url: "/sms/send",
            params: {
                mobile: this.data.mobile,
                type_id: Config.SMS_TYPE_LOGIN_LOGIN,
                captcha_key: this.data.verify_info.captcha_key,
                captcha: this.data.verify_info.code,
            }
        })
        if (res.error === 0) {
            this.initInterval()
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    }),

    /**
     * 初始化倒计时
     */
    initInterval: function () {
        this.data.interval = setInterval(() => {
            if (this.data.count_down_time > 1) {
                this.setData({
                    send_code_enable: false,
                    count_down_time: this.data.count_down_time - 1,
                })
            } else {
                //重置状态
                this.setData({
                    send_code_enable: true,
                    count_down_time: Config.SMS_COUNTDOWN_TIME
                })
                clearInterval(this.data.interval) //时间到清除计时器
            }
        }, 1000);
    },

    /**
     * 登录
     */
    onLoginClick: Util.debounce(async function () {
        let res = await NetworkUtil.post({
            url: "/account/login",
            params: {
                mobile: this.data.mobile,
                password: this.data.code,
                login_type: Config.LOGIN_TYPE_BY_SMS_CODE,
            },
            loadingText: "登录中",
        })
        if (res.error === 0) {
            wx.showToast({
                title: '登录成功',
                icon: 'success',
            })
            setTimeout(() => {
                this.handleLoginSuccess(res)
            }, 1000)
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    }),


    /**
     * 申请成为经销商
     */
    onAgentApplyClick() {
        wx.navigateTo({
            url: `/packageAgent/pages/apply/apply?apply_type=2`
        })
    },
})