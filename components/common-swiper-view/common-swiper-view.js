const RouteUtil = require("@/utils/RouteUtil")
// components/common-swiper-view/common-swiper-view.js

Component({

    externalClasses: ['custom-class'],

    /**
     * 组件的属性列表
     */
    properties: {
        height:{
            type: String,
            value: '360rpx'
        },

        list: {
            type: Array,
            value: [],
        },

        indicator: {
            type: Boolean,
            value: true
        },

        mask: {
            type: Boolean,
            value: false
        },

        autoplay: {
            type: Boolean,
            value: true
        },

        circular: {
            type: Boolean,
            value: true
        },

        interval: {
            type: Number,
            value: 5000
        },

        type: {
            type: String,
            value: 'slide' || 'album'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        current: 0,
        isPlaying: false,
        muted: true,
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /**
         * 静音切换
         */
        onMuteClick() {
            this.setData({
                muted: !this.data.muted
            })
        },

        /**
         * 轮播项点击
         */
        onSlideItemClick(e) {
            let item = e.currentTarget.dataset.item
            switch (this.data.type) {
                case "slide":
                    RouteUtil.slideItemClicks(item)
                    break
                case "album":
                    let current = e.currentTarget.dataset.item.img_url || e.currentTarget.dataset.item.file_url
                    if (item.is_video === 1) {
                        wx.previewMedia({
                            sources: [{
                                url: current,
                                type: 'video'
                            }]
                        })
                    } else {
                        wx.previewImage({
                            current: current,
                            urls: this.data.list.map(item => item.img_url || item.file_url || item)
                        })
                    }
                    break
            }
        },

        /**
         * 轮播图切换
         */
        onSwiperChange(e) {
            this.setData({
                current: e.detail.current,
            })

            //处理轮播图中视频循环第二次不会自动播放的问题
            let item = this.data.list[e.detail.current]
            if (item.is_video === 1) {
                let videoContext = wx.createVideoContext(`video-${e.detail.current}`, this)
                videoContext.seek(0)
                videoContext.play()
            } else {
                this.setData({
                    muted: true,
                    isPlaying: false
                })
            }
        },

        /**
         * 视频开始播放
         */
        onVideoPlay(e) {
            this.setData({
                isPlaying: true
            })
        },

        /**
         * 视频播放结束
         */
        onVideoEnded(e) {
            this.setData({
                isPlaying: false
            })
            let index = e.currentTarget.dataset.index
            //如果当前播放的视频是最后一个视频，且循环轮播，则跳转到第一项
            if (index === this.data.list.length - 1 && this.data.circular) {
                this.setData({
                    current: 0
                })
            } else {
                //轮播到下一项
                this.setData({
                    current: index + 1
                })
            }
        }
    }
})