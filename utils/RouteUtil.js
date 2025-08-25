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
                    case 1: //自助集星
                        wx.openEmbeddedMiniProgram({
                            appId: Config.APP_ID_MIXC,
                            path: `/pages/autoPoint/index?type=0&mallNo=${Config.PROJECT_CODE}`,
                            allowFullScreen: true,
                            envVersion: Config.ENV.NAME
                        })
                        break;
                    case 2: //找店导览
                        wx.openEmbeddedMiniProgram({
                            appId: Config.APP_ID_MIXC,
                            path: `/pages/shop/findShop/index?mallNo=${Config.PROJECT_CODE}`,
                            allowFullScreen: true,
                            envVersion: Config.ENV.NAME
                        })
                        break;
                    case 3: //停车服务
                        wx.navigateTo({
                            url: `/packageParking/pages/homepage/homepage`
                        })
                        break;
                    case 4: //文体订场
                        this.culturalSports()
                        break;
                    case 5: //积分商城
                        wx.showToast({
                            title: '功能尚未开放',
                            icon: 'none'
                        })
                        break;
                    case 6: //会员权益
                        wx.switchTab({
                            url: `/pages/service/service`
                        })
                        break;
                    case 7: //物品租借
                        wx.openEmbeddedMiniProgram({
                            appId: Config.APP_ID_MIXC,
                            path: `/pages/lease/list/index?mallNo=${Config.PROJECT_CODE}`,
                            allowFullScreen: true,
                            envVersion: Config.ENV.NAME
                        })
                        break;
                    case 8: //投诉反馈 跳转微信原生能力
                        break
                    case 9: //积分明细
                        wx.openEmbeddedMiniProgram({
                            appId: Config.APP_ID_MIXC,
                            path: `/pages/pointList/main?mallNo=${Config.PROJECT_CODE}`,
                            allowFullScreen: true,
                            envVersion: Config.ENV.NAME
                        })
                        break
                    case 10: //万象星兑礼
                        wx.openEmbeddedMiniProgram({
                            appId: Config.APP_ID_MIXC,
                            path: `/pages/goods/goodsList/index?type=5&mallNo=${Config.PROJECT_CODE}`,
                            allowFullScreen: true,
                            envVersion: Config.ENV.NAME
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
                wx.openEmbeddedMiniProgram({
                    appId: item.jump_appid,
                    path: item.url,
                    allowFullScreen: true,
                    envVersion: Config.ENV.NAME,
                    fail(error) {
                        console.log(error)
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


    /**
     * 跳转文体订场
     */
    async culturalSports() {
        let res = await NetworkUtil.get({
            url: "oauth/wentihui-authorization",
        })
        wx.navigateToMiniProgram({
            appId: Config.APP_ID_CULTURAL_SPORTS,
            path: 'pages/oauth/authorize',//双方约定授权请求路径（固定值）
            extraData: res.data.extraData,
            envVersion: Config.ENV.NAME,
        })
    },

    /**
     * 优惠信息点击
     */
    promotionItemClick(item) {
        switch (item.type_id) {
            case 1: // 优惠详情
                wx.navigateTo({
                    url: `/pages/others/article/article?alias=${item.alias}&url=${encodeURIComponent('promotion/view')}`
                })
                break;
            case 2: //外部链接
                wx.navigateTo({
                    url: `/pages/others/webview/webview?url=${encodeURIComponent(item.url)}`
                })
                break;
            case 3: //半屏跳转小程序
                wx.openEmbeddedMiniProgram({
                    appId: item.jump_appid,
                    path: item.url,
                    allowFullScreen: true,
                    envVersion: Config.ENV.NAME,
                    fail(error) {
                        console.log(error)
                    }
                })
                break
        }
    }

}

module.exports = RouteUtil