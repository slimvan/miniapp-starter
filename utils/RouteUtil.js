const NetworkUtil = require("@/utils/NetworkUtil")
const Config = require("@/utils/Config")
const RouteUtil = {


    /**
     * 轮播图列表项的点击事件跳转规则
     * @param {列表项} item
     */
    slideItemClicks(item) {
        switch (parseInt(item.type_id)) {
            case 1: //小程序内页
                switch (item.jump_type_id) {
                    case 0: //自定义
                        wx.navigateTo({
                            url: item.url,
                        })
                        break;
                    case 1: //文章详情
                        wx.navigateTo({
                            url: `/pages/others/article/article?alias=${item.type_item_alias}`,
                        })
                        break
                }
                break;
            case 2: //网页
                if (!item.url) {
                    return
                }
                wx.navigateTo({
                    url: '/pages/others/webview/webview?url=' + encodeURIComponent(item.url)
                })
                break;
            case 3: //其他小程序
                wx.navigateToMiniProgram({
                    appId: item.jump_appid,
                    path: item.url,
                    allowFullScreen: true,
                    envVersion: Config.ENV.NAME,
                    extraData: JSON.parse(item.extra_data),
                    fail(error) {
                        console.log(error)
                    }
                })
                break;
            case 4: //视频预览
                wx.previewMedia({
                    sources: [{
                        url: item.url,
                        type: 'video'
                    }],
                    fail(error) {
                        wx.showToast({
                            title: error.errMsg,
                            icon: 'none'
                        })
                    }
                })
                break;
        }
    },


    /**
     * 上一页实例
     */
    previousPage() {
        const pages = getCurrentPages(); //页面指针数组
        return pages[pages.length - 2]; //上一页面指针
    },

    /**
     * 当前页面实例
     */
    currentPage() {
        const pages = getCurrentPages();
        return pages[pages.length - 1] //当前页面
    },


    /**
     * 返回上一页 如果当前页面处于栈底，返回首页
     */
    navigateBack() {
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function (res) {
                // success
            },
            fail: function () {
                wx.reLaunch({
                    url: '/pages/homepage/homepage',
                })
            },
            complete: function () {
                // complete
            }
        })
    },

}

module.exports = RouteUtil