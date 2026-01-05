// components/popup/popup-list-picker/popup-list-picker.js
const PageUtil = require("@/utils/PageUtil")
const Constant = require("@/utils/Constant")
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        url: {
            type: String,
            value: ''
        },
        params: {
            type: Object,
            value: {}
        },
        keyValue: {
            type: String,
            value: ''
        },
        keyField: {
            type: String,
            value: 'alias'
        },
        titleField: {
            type: String,
            value: 'title'
        },
    },

    observers: {
        'url, params': function (url, params) {
            if (url) {
                this.setData({
                    list: [],
                    list_info: {},
                    keyword: '',
                }, () => {
                    this.getListData()
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        Constant,
        list: [],
        list_info: {},
        isRequesting: false,
        isLoadingMore: false,
        keyword: '',
    },

    /**
     * 组件的方法列表
     */
    methods: {

        /**
         * 物流公司列表
         */
        async getListData(isLoadMore) {
            let list = await PageUtil.getListData({
                url: this.data.url,
                params: {
                    ...this.data.params,
                    keyword: this.data.keyword,
                },
                list: this.data.list,
                pageHost: this,
                isLoadMore: isLoadMore,
            })
            
            // 根据keyValue和keyField设置选中状态
            if (this.data.keyValue && this.data.keyField) {
                list = list.map(item => {
                    return {
                        ...item,
                        selected: item[this.data.keyField] === this.data.keyValue
                    }
                })
            }
            
            this.setData({
                list: list,
            })
        },

        /**
         * 弹窗显示状态改变
         */
        onVisibleChange(e) {
            this.setData({
                show: e.detail.value
            })
            if (!this.data.show) {
                this.triggerEvent('close')
            }
        },

        /**
         * 列表滚动到底部
         */
        onScrollToLower() {
            this.getListData(true)
        },

        /**
         * 列表项点击
         */
        onItemClick(e) {
            let item = e.currentTarget.dataset.item
            this.triggerEvent('confirm', {
                value: item
            })
        },

        /**
         * 搜索确认
         */
        onSearchConfirm(e) {
            this.setData({
                keyword: e.detail.value
            })
            this.getListData()
        },

        /**
         * 搜索取消
         */
        onSearchClear(e) {
            this.setData({
                keyword: e.detail.value
            })
            this.getListData()
        }
    },

    lifetimes: {
        attached() {
            // this.getListData() // 由 observer 处理
        }
    },
})