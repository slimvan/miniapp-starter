const Constant = require("@/utils/Constant");

const StorageUtil = {
    /**
     * 清除登录信息
     */
    clearLoginData() {
        wx.removeStorageSync(Constant.STORAGE_KEY_ACCESS_TOKEN);
        wx.removeStorageSync(Constant.STORAGE_KEY_MOBILE);
        wx.removeStorageSync(Constant.STORAGE_KEY_USER_INFO);
    },
};

module.exports = StorageUtil;

