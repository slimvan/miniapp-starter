const FileUtil = require("../../utils/FileUtil");
const ImageUtil = require("../../utils/ImageUtil");
const FileType = require("./util/FileType");
const JSUtil = require("../../utils/JSUtil")
const UploadUtil = require("../../utils/UploadUtil");
// component/file-selector/file-selector.js
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
        //文件列表
        list: {
            type: Array,
            value: [],
            observer: function (newVal, oldVal) {
                if (!JSUtil.isEmptyArray(newVal)) {
                    this.setIconByFileType()
                }
            }
        },
        //查看模式
        isView: {
            type: Boolean,
            value: false,
        },

        //文件类型
        chooseTypes: {
            type: Array,
            value: ['media', 'file'],
        },


        // 参考https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html
        //媒体文件类型
        mediaType: {
            type: Array,
            value: ['image', 'video'],
        },
        //媒体来源类型
        sourceType: {
            type: Array,
            value: ['album', 'camera'],
        },

        // 参考https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseMessageFile.html
        //扩展名过滤
        extension: {
            type: Array,
            value: FileType.file_type_list.map(item => item.extension).flat(),
        },
        //添加图标
        addIcon: {
            type: String,
            value: './images/ic_add.png'
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

        /**
         * 添加文件
         */
        onFileAddClick: async function (e) {
            try {
                if (this.data.chooseTypes.includes('media') && this.data.chooseTypes.includes('file')) {
                    //选择上传「图片/视频」或『文件』
                    wx.showActionSheet({
                        itemList: ['图片/视频', '文件'],
                        success: async (res) => {
                            if (res.tapIndex === 0) {
                                this.addMedia()
                            } else {
                                this.addFile()
                            }
                        }
                    })
                } else if (this.data.chooseTypes.includes('file')) {
                    this.addFile()
                } else if (this.data.chooseTypes.includes('media')) {
                    this.addMedia()
                }
            } catch (err) {
                console.log(err)
            }
        },

        /**
         * 添加图片、视频
         */
        async addMedia() {
            let result = await ImageUtil.chooseMedia(this.data.limit, this.data.mediaType, this.data.sourceType, this.data.list)
            this.setData({
                list: this.data.list.concat(result)
            })
            this.triggerEvent('filechoosed', {
                value: this.data.list
            })
        },

        /**
         * 添加文件
         */
        async addFile() {
            let result = await FileUtil.chooseFile(this.data.limit, 'file', this.data.extension, this.data.list)
            this.setData({
                list: this.data.list.concat(result)
            })
            this.triggerEvent('filechoosed', {
                value: this.data.list
            })
        },

        /**
         * 列表项点击
         */
        onFileItemClick(e) {
            let item = e.currentTarget.dataset.item
            //根据文件后缀判断文件类型，进行不同的交互
            let file_path = item.path || item.file_path || item.file_url || item.url
            let suffix = FileUtil.getFileSuffix(file_path)
            let type = FileType.file_type_list.find(item => item.extension.includes(suffix)).type
            switch (type) {
                case 'image':
                    wx.previewImage({
                        current: item.url || item.file_path,
                        urls: this.data.list.map(item => item.url || item.file_path)
                    })
                    break
                case 'video':
                    wx.previewMedia({
                        sources: [{
                            url: item.url || item.file_path,
                            type: 'video'
                        }]
                    })
                    break
                case 'file':
                    FileUtil.openFile(file_path)
                    break
            }
        },

        /**
         * 列表项删除
         */
        onFileItemDeleteClick(e) {
            let index = e.currentTarget.dataset.index
            this.data.list.splice(index, 1)
            this.setData({
                list: this.data.list,
            })
            this.triggerEvent('filedeleted', {
                value: this.data.list
            })
        },

        /**
         * 根据文件类型设置icon
         */
        setIconByFileType() {
            console.log(this.data.list)
            this.data.list.forEach(item => {
                //根据文件后缀名查询关联类型，设置icon
                let suffix = FileUtil.getFileSuffix(item.path || item.file_path || item.url || item.file_url)
                item.icon = FileType.file_type_list.find(item => item.extension.includes(suffix)).icon
            })
            this.setData({
                list: this.data.list
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
                let uploadedResult = await UploadUtil.uploadFiles(
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
    },
    lifetimes: {},
})