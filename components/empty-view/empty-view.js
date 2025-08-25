// component/empty-view/empty-view.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //图标
        image: {
            type: String,
            value: '/images/common/ic_empty.png'
        },
        //提示语
        description: {
            type: String,
            value: '抱歉，暂时没有内容哦~'
        },

    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {},
})