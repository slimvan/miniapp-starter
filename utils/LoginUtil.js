const Config = require("@/utils/Config");
const Constant = require("@/utils/Constant");
const NetworkUtil = require("@/utils/NetworkUtil");
const StorageUtil = require("@/utils/StorageUtil");

const LoginUtil = {
    /**
     * 判断是否登录
     * @param {boolean} options.route 是否跳转到登录页面
     * @param {boolean} options.redirect 是否重定向到登录页面
     * @returns {boolean} 是否已登录
     */
    isLogin(options = {route: true, redirect: false}) {
        const mobile = wx.getStorageSync(Constant.STORAGE_KEY_MOBILE);
        if (!mobile) {
            if (options.route) {
                if (options.redirect) {
                    wx.redirectTo({
                        url: '/pages/others/login/login',
                    });
                } else {
                    wx.navigateTo({
                        url: '/pages/others/login/login',
                    });
                }
            }
            return false;
        }
        return true;
    },

    /**
     * 保存登录信息
     * @param {Object} res 后端返回的登录数据
     */
    saveLoginData(res) {
        const {mobile, access_token} = res.data;
        wx.setStorageSync(Constant.STORAGE_KEY_MOBILE, mobile);
        wx.setStorageSync(Constant.STORAGE_KEY_ACCESS_TOKEN, access_token);
    },

    /**
     * 清除登录信息
     */
    clearLoginData() {
        StorageUtil.clearLoginData();
    },

    /**
     * 退出登录
     */
    async logout() {
        const result = await wx.showModal({
            title: '提示',
            content: '确定退出登录吗？',
            confirmText: '确定',
            cancelText: '取消',
            confirmColor: Config.mainColor,
        });

        if (result.confirm) {
            try {
                const res = await NetworkUtil.post({
                    url: "/account/logout",
                    loadingText: '退出登录'
                });
                if (res.error === 0) {
                    this.clearLoginData();
                    wx.reLaunch({
                        url: '/pages/homepage/homepage',
                    });
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                    });
                }
            } catch (error) {
                wx.showToast({
                    title: '退出登录失败',
                    icon: 'none',
                });
            }
        }
    },

    /**
     * 获取用户信息
     * @param {boolean} forceRefresh 是否强制刷新用户信息
     * @returns {Promise<Object>} 用户信息
     */
    async getUserInfo(forceRefresh = false) {
        const cachedUserInfo = wx.getStorageSync(Constant.STORAGE_KEY_USER_INFO);
        if (cachedUserInfo && !forceRefresh) {
            return cachedUserInfo;
        }

        try {
            const res = await NetworkUtil.get({
                url: "/account/info",
            });
            if (res.error === 0) {
                wx.setStorageSync(Constant.STORAGE_KEY_USER_INFO, res.data);
                return res.data;
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                });
                return {};
            }
        } catch (error) {
            wx.showToast({
                title: '获取用户信息失败',
                icon: 'none',
            });
            throw error;
        }
    },


    /**
     * 保存分享码到本地存储
     * @param {string} share_code 分享码
     */
    saveShareCode(share_code) {
        if (share_code) {
            wx.setStorageSync('share_code', share_code);
        }
    }
};

module.exports = LoginUtil;