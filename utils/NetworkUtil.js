const Config = require("@/utils/Config")
const Constant = require("@/utils/Constant")
const StorageUtil = require("@/utils/StorageUtil")

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
            // 如果没有 token，自动获取（getToken 内部已处理防重复）
            if (!wx.getStorageSync(Constant.STORAGE_KEY_ACCESS_TOKEN)) {
                try {
                    await this.getToken()
                    console.log('获取到access_token', wx.getStorageSync(Constant.STORAGE_KEY_ACCESS_TOKEN))
                } catch (e) {
                    console.error('自动获取Token失败:', e)
                }
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
                    "access-token": wx.getStorageSync(Constant.STORAGE_KEY_ACCESS_TOKEN),
                },
                data: finalParams,
                success: (res) => {
                    if (res.statusCode === 200) {
                        if (res.data && !this.checkBusinessError(res.data)) {
                            // 业务错误已被处理（已弹窗提示），reject Promise 让调用方能够捕获
                            reject({handled: true})
                            return
                        }
                        resolve(res.data)
                    } else {
                        this.handleError(res, reject)
                    }
                },
                fail: (res) => this.handleError(res, reject),
                complete: () => {
                    wx.hideLoading()
                }
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
        // 405 后台系统错误
        if (resData.error === 405) {
            this.showErrorModal(resData.msg)
            return false
        }

        // 40000~41000之间
        if (resData.error >= 40000 && resData.error <= 41000) {
            // 清除登录状态
            StorageUtil.clearLoginData()
            this.showErrorModal(resData.msg, () => {
                wx.redirectTo({
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
                        if (callback) {
                            callback()
                        }
                    }
                },
            })
        }
    },

    /**
     * 获取 token (静默登录)
     */
    async getToken() {
        // 如果已经有正在进行的 token 请求，直接返回该 Promise
        if (tokenPromise) {
            console.log('检测到正在进行的token请求，等待其完成')
            return await tokenPromise
        }

        // 创建新的 token 请求 Promise
        tokenPromise = (async () => {
            try {
                console.log('开始获取token')
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
                    wx.setStorageSync(Constant.STORAGE_KEY_ACCESS_TOKEN, result.data.access_token)
                    wx.setStorageSync("mobile", result.data.mobile)
                    console.log('token获取成功')
                } else {
                    throw new Error('登录失败：未返回access_token')
                }

                return result
            } catch (e) {
                console.error('getToken error:', e)
                throw e
            } finally {
                // 请求完成后清空 tokenPromise，允许下次重新获取
                tokenPromise = null
            }
        })()

        return await tokenPromise
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
                    "access-token": wx.getStorageSync(Constant.STORAGE_KEY_ACCESS_TOKEN),
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
