const Config = require("@/utils/Config");

const PermissionUtil = {
    /**
     * 检查系统定位开关
     */
    async checkSystemLocationEnabled() {
        return new Promise((resolve, reject) => {
            const systemSetting = wx.getSystemSetting();
            if (!systemSetting.locationEnabled) {
                wx.showModal({
                    title: '提示',
                    content: '您已关闭设备的定位功能，小程序无法获取您的位置信息，请打开设备定位功能后重试。',
                    confirmColor: Config.mainColor,
                    showCancel: false
                });
                return reject('系统定位未开启');
            }
            resolve();
        });
    },

    /**
     * 检查微信应用的定位权限
     */
    async checkAppLocationPermission() {
        return new Promise((resolve, reject) => {
            const appAuthorizeSetting = wx.getAppAuthorizeSetting();
            switch (appAuthorizeSetting.locationAuthorized) {
                case 'authorized':
                    resolve();
                    break;
                case 'denied':
                    wx.showModal({
                        title: '提示',
                        content: '您已拒绝微信的位置信息授权，请前往设置页面打开授权',
                        confirmColor: Config.mainColor,
                        success: async (res) => {
                            if (res.confirm) {
                                await wx.openAppAuthorizeSetting();
                            }
                        }
                    });
                    reject('微信定位权限被拒绝');
                    break;
                case 'non determined':
                    reject('定位权限未确定');
                    break;
                default:
                    reject('未知定位权限');
            }
        });
    },

    /**
     * 请求小程序定位权限
     */
    async requestLocationPermission() {
        try {
            // 检查系统定位开关
            await this.checkSystemLocationEnabled();

            // 检查微信应用定位权限
            await this.checkAppLocationPermission();

            // 申请小程序定位权限
            await new Promise((resolve, reject) => {
                wx.authorize({
                    scope: 'scope.userLocation',
                    success: () => resolve(),
                    fail: () => {
                        wx.showModal({
                            title: '提示',
                            content: '您已拒绝小程序的位置信息授权，请前往设置页面打开授权',
                            confirmColor: Config.mainColor,
                            success: async (res) => {
                                if (res.confirm) {
                                    await wx.openSetting();
                                }
                            }
                        })
                        reject('小程序定位权限被拒绝')
                    }
                });
            });

            return true;
        } catch (error) {
            console.warn(error);
            return false;
        }
    }
};

module.exports = PermissionUtil;