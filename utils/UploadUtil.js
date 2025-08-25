const NetworkUtil = require("@/utils/NetworkUtil")

const UploadUtil = {

    /**
     * 上传照片
     * @param path 本地临时路径
     * @param formData 表单数据
     * @return {Promise<void>}
     */
    async uploadImage(path, formData) {
        let res = await NetworkUtil.upload({
                url: "/upload/image",
                name: "image",
                path: path,
                formData: {
                    ...formData
                }
            }
        )
        if (res.error === 0) {
            return res.data

        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
            return {}
        }
    },


    /**
     * 按顺序上传多个照片（并行执行，结果保持顺序）
     * @param {Array<string>} paths 本地临时路径数组
     * @param {Array<object>} formData 表单数据
     * @return {Promise<Array<any>>} 返回包含每张图片上传结果的数组
     */
    async uploadImages(paths, formData) {

        // 创建上传任务数组
        const uploadTasks = paths.map((path, index) =>
            this.uploadImage(path, formData)
        );

        // 使用 Promise.all 并行执行上传任务
        return Promise.all(uploadTasks);
    },

    /**
     * 上传文件
     * @param path 本地临时路径
     * @param formData 表单数据
     * @return {Promise<void>}
     */
    async uploadFile(path, formData) {
        let res = await NetworkUtil.upload({
                url: "/upload/file",
                name: "file",
                path: path,
                formData: {
                    ...formData
                }
            }
        )
        if (res.error === 0) {
            return res.data

        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
            return {}
        }
    },


    /**
     * 按顺序上传多个文件(并行执行，结果保持顺序）
     * @param {Array<string>} paths 本地临时路径数组
     * @param {Array<object>} formData 表单数据
     * @return {Promise<Array<any>>} 返回包含每个文件上传结果的数组
     */
    async uploadFiles(paths, formData) {

        // 创建上传任务数组
        const uploadTasks = paths.map((path, index) =>
            this.uploadFile(path, formData)
        );

        // 使用 Promise.all 并行执行上传任务
        return Promise.all(uploadTasks);
    }
}

module.exports = UploadUtil;