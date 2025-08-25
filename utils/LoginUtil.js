const Config = require("@/utils/Config");
const NetworkUtil = require("@/utils/NetworkUtil");

const LoginUtil = {
    /**
     * 判断是否登录
     * @param {boolean} route 是否跳转到登录页面
     * @returns {boolean} 是否已登录
     */
    isLogin(route = true) {
        const mobile = wx.getStorageSync('mobile');
        if (!mobile) {
            if (route) {
                wx.navigateTo({
                    url: '/pages/others/login/login',
                });
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
        wx.setStorageSync('mobile', mobile);
        wx.setStorageSync('access_token', access_token);
    },

    /**
     * 清除登录信息
     */
    clearLoginData() {
        wx.removeStorageSync('access_token');
        wx.removeStorageSync('mobile');
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
        const cachedUserInfo = wx.getStorageSync('user_info');
        if (cachedUserInfo && !forceRefresh) {
            return cachedUserInfo;
        }

        try {
            const res = await NetworkUtil.get({
                url: "/account/info",
            });
            if (res.error === 0) {
                wx.setStorageSync('user_info', res.data);
                return res.data;
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