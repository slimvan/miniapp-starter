const AppUtil = {
    /**
     * 检查版本更新
     */
    checkUpdate() {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                wx.showLoading({
                    title: '更新下载中...',
                })
            }
        })
        updateManager.onUpdateReady(function () {
            wx.hideLoading();
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启小程序？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })

        })
        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.hideLoading();
            wx.showToast({
                title: '版本更新失败',
                icon: "none"
            });
        })
    },
}

module.exports = AppUtil