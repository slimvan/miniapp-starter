const ViewUtil = {
    /**
     * 测量指定view的信息
     * @param {viewId} viewId
     * @returns
     */
    measureView(viewId) {
        return new Promise((resolve) => {
            wx.createSelectorQuery()
                .select("#" + viewId)
                .boundingClientRect(function (res) {
                    resolve(res);
                })
                .exec();
        });
    },

    /**
     * rpx转px
     * @param {像素} rpx
     * @returns number
     */
    rpx2px(rpx) {
        return (rpx / 750) * wx.getWindowInfo().windowWidth;
    },

    /**
     * px转rpx
     * @param {像素} px
     * @returns number
     */
    px2rpx(px) {
        return (px / wx.getWindowInfo().windowWidth) * 750;
    },

    /**
     * 初始化状态栏高度
     */
    initStatusBarHeight() {
        const windowInfo = wx.getWindowInfo() //获取窗口信息
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect() //获取胶囊按钮信息
        wx.setStorageSync("StatusBarHeight", windowInfo.statusBarHeight); // 状态栏高度
        wx.setStorageSync("CustomBarHeight", menuButtonInfo.bottom + menuButtonInfo.top - windowInfo.statusBarHeight); // 胶囊按钮的中线位置，用于自定义标题栏的返回按钮
    }

};

module.exports = ViewUtil;
