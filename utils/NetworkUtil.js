const Config = require("@/utils/Config")

let tokenPromise = null // 全局唯一变量，用于存储 token 请求的 Promise 对象
let errorModalShowed = false

const NetworkUtil = {
    /**
     * 通用请求方法
     * @param options {Object} 请求配置
     * @param options.url {string} 请求地址
     * @param options.method {string} 请求方式 (GET, POST, PUT, DELETE等)
     * @param options.params {Object} 请求参数
     * @param options.loadingText {string} 加载提示文字（可选）
     * @param options.ignoreToken {boolean} 是否忽略 token（可选）
     * @returns {Promise<unknown>}
     */
    async request(options) {
        const {url, method = "GET", params = {}, loadingText, ignoreToken = false} = options

        // 显示加载提示
        if (loadingText) {
            wx.showLoading({
                title: loadingText,
                mask: true,
            })
        }

        if (!ignoreToken) {
            // 如果没有 token，且 tokenPromise 为空，则发起 token 请求
            if (!wx.getStorageSync("access_token") && tokenPromise == null) {
                tokenPromise = await this.getToken()
            }

            // 等待 tokenPromise，防止异步调用多个请求，保证getToken()优先执行
            if (tokenPromise) {
                await tokenPromise
                console.log('获取到access_token', wx.getStorageSync("access_token"))
                tokenPromise = null
            }
        }

        let result = await new Promise((resolve, reject) => {
            const finalParams = this.buildParams(params)
            console.log(`【发起请求】：${Config.BASE_URL}${url}`)
            console.log(finalParams)

            wx.request({
                url: `${Config.BASE_URL}${url}`,
                method,
                header: {
                    "content-type": "application/json",
                    "app-alias": Config.APP_ALIAS,
                    "access-token": wx.getStorageSync("access_token"),
                },
                data: finalParams,
                success: (res) => {
                    if (res.statusCode === 200) {
                        if (res.data && !this.checkBusinessError(res.data)) {
                            return
                        }
                        resolve(res.data)
                    } else {
                        this.handleError(res, reject)
                    }
                },
                fail: (res) => this.handleError(res, reject),
            })
        })

        console.log(`【请求响应】：${Config.BASE_URL}${url}`)
        console.log(result)

        // 隐藏加载提示
        if (loadingText) {
            wx.hideLoading()
        }

        return result
    },

    /**
     * GET 请求
     * @param options {options} 请求配置
     * @returns {Promise<unknown>}
     */
    async get(options) {
        return await this.request({...options, method: "GET"})
    },

    /**
     * POST 请求
     * @param options {Object} 请求配置
     * @returns {Promise<unknown>}
     */
    async post(options) {
        return await this.request({...options, method: "POST"})
    },

    /**
     * 组装请求参数
     * @param params
     */
    buildParams(params) {
        return {...params, app_alias: Config.APP_ALIAS}
    },

    /**
     * 错误处理
     * @param res 响应数据
     * @param reject Promise 的 reject 方法
     */
    handleError(res, reject) {
        const errorMsg = res?.data?.msg
            ? `【${res.data.error}】${res.data.msg}`
            : res.errMsg || "请求失败"
        wx.showToast({
            title: `【${res.statusCode}】${errorMsg}`,
            icon: "none",
        })
        reject({errorMsg})
    },

    /**
     * 新增业务错误码检查方法（可被重写）
     * @param resData 响应数据
     * @returns {boolean} true: 正常请求，false: 拦截异常
     */
    checkBusinessError(resData) {
        // 40000~41000之间
        if (resData.error >= 40000 && resData.error <= 41000) {
            this.showErrorModal(resData.msg, () => {
                wx.navigateTo({
                    url: "/pages/others/login/login",
                })
            })
            return false
        }
        return true
    },

    /**
     * 展示错误对话框
     * @param content 提示内容
     * @param callback 回调函数
     */
    showErrorModal(content, callback) {
        if (!errorModalShowed) {
            errorModalShowed = true
            wx.showModal({
                title: "提示",
                content: content,
                showCancel: false,
                confirmColor: Config.mainColor,
                success: function (res) {
                    if (res.confirm) {
                        errorModalShowed = false
                        callback()
                    }
                },
            })
        }
    },

    /**
     * 获取 token
     */
    async getToken() {
        if (tokenPromise) {
            return tokenPromise
        }

        tokenPromise = (async () => {
            try {
                const code = await new Promise((resolve, reject) => {
                    wx.login({
                        success: (res) => resolve(res.code),
                        fail: reject,
                    })
                })

                let result = await this.request({
                    url: "/mp/login",
                    method: "POST",
                    params: {code},
                    ignoreToken: true,
                })

                if (result.error === 0) {
                    wx.setStorageSync("access_token", result.data.access_token)
                    wx.setStorageSync("mobile", result.data.mobile)
                }

                return result
            } catch (e) {
                console.log(e)
                throw e
            }
        })()

        return tokenPromise
    },

    /**
     * 上传文件
     * @param options {Object}
     * @return {Promise<unknown>}
     */
    async upload(options) {
        const {url, path, name, params = {}} = options
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: `${Config.BASE_URL}${url}`,
                filePath: path,
                name: name,
                formData: params,
                header: {
                    "app-alias": Config.APP_ALIAS,
                    "access-token": wx.getStorageSync("access_token"),
                },
                success: (res) => {
                    console.log(res)
                    if (res.statusCode === 200) {
                        resolve(JSON.parse(res.data))
                    } else {
                        this.handleError(res, reject)
                    }
                },
                fail: (res) => this.handleError(res, reject),
            })
        })
    },
}

module.exports = NetworkUtil
