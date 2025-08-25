// pages/others/article/article.js
const NetworkUtil = require("@/utils/NetworkUtil")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '', //文章id
        alias: '', //文章别名
        url: '/article/view', //指定的url
        info: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.setData({
                id: options.id,
            })
        }
        if (options.alias) {
            this.setData({
                alias: options.alias
            })
        }
        if (options.url) {
            this.setData({
                url: decodeURIComponent(options.url),
            })
        }

        this.getInfo()
        this.readArticle()
    },

    async getInfo() {
        let res = await NetworkUtil.get({
            url: this.data.url,
            params: {
                id: this.data.id,
                alias: this.data.alias
            }
        })
        if (res.error === 0) {
            this.setData({
                info: res.data
            })
            wx.setNavigationBarTitle({
                title: res.data.title
            })
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    },

    /**
     * 标记已读文章
     */
    async readArticle() {
        let res = await NetworkUtil.post({
            url: '/article/reads',
            params: {
                id: this.data.id,
                alias: this.data.alias
            }
        })
        if (res.error === 0) {

        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 富文本链接点击
     */
    onLinkTap: function (e) {
        console.log(e)
        let url = e.detail.href
        if (url) {
            wx.navigateTo({
                url: '/pages/others/webview/webview?url=' + encodeURIComponent(url),
            })
        }
    }
})