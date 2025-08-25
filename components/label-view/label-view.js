// component/label-view/label-view.js
Component({
    options: {
        multipleSlots: true, //多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
        // 标题
        title: {
            type: String,
            value: ''
        },
        //显示更多
        showMore: {
            type: Boolean,
            value: false
        },
        fontSize: {
            type: String,
            value: '36rpx'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onMoreClick: function () {
            this.triggerEvent('moreclick')
        }
    }
})