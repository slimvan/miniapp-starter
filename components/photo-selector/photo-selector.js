// component/photo-selector/photo-selector.js
const ImageUtil = require("../../utils/ImageUtil")
const UploadUtil = require("../../utils/UploadUtil")
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //最大上传数量
        limit: {
            type: Number,
            value: 9,
        },
        //仅展示图片
        isView: {
            type: Boolean,
            value: false,
        },
        //图片列表  本地图片path 服务端图片url
        list: {
            type: Array,
            value: [],
        },
        //图片选择的来源，可选值：['album', 'camera']，默认 ['album', 'camera']
        sourceType: {
            type: Array,
            value: ['album', 'camera'],
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        list: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //图片添加
        onPhotoAddClick: async function (e) {
            try {
                let result = await ImageUtil.chooseImage(this.data.limit, this.data.list, this.data.sourceType)
                this.setData({
                    list: this.data.list.concat(result)
                })
                this.triggerEvent('photochoosed', {
                    value: this.data.list
                })
            } catch (err) {
                console.log(err)
            }
        },

        //图片项点击
        onPhotoItemClick: function (e) {
            let item = e.currentTarget.dataset.item
            wx.previewImage({
                current: item.url || item.path,
                urls: this.data.list.map(item => item.url || item.path),
            });
        },

        //图片项删除
        onPhotoItemDeleteClick: function (e) {
            let index = e.currentTarget.dataset.index
            this.data.list.splice(index, 1)
            this.setData({
                list: this.data.list,
            })
            this.triggerEvent('photodeleted', {
                value: this.data.list
            })
        },

        /**
         * 上传需要上传的图片
         */
        async uploadIfNeed() {
            // 过滤出list中需要上传的项  规则：url不存在表示未上传过
            let originalList = this.data.list
            // 找出未上传项
            let needUploadList = originalList.filter(item => !item.url)

            if (needUploadList.length > 0) {
                let uploadedResult = await UploadUtil.uploadImages(
                    needUploadList.map(item => item.path), {}
                )
                console.log('@@@上传结果：', uploadedResult)

                // 用上传结果替换未上传项
                let resultIndex = 0
                let newList = originalList.map(item => {
                    if (!item.url) {
                        return uploadedResult[resultIndex++] // 用新的上传结果替代
                    } else {
                        return item // 原样保留已上传项
                    }
                })

                this.setData({list: newList})
            }

            return this.data.list
        }
    }
})