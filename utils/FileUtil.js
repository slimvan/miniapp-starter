const Config = require("./Config");

const FileUtil = {
    /**
     * 是否本地路径
     */
    isLocalFile(url) {
        return url.indexOf('://tmp') !== -1;
    },

    /**
     * 获取文件后缀名
     */
    getFileSuffix(fileName) {
        return fileName.split('.').pop().toLowerCase();
    },

    /**
     * 选择文件
     * @param limit 上限数量
     * @param type 文件类型 all:所有类型 image:图片 video:视频 file:其他文件
     * @param extension 文件拓展名过滤
     * @param list 已选择的列表
     */
    chooseFile(limit, type = 'file', extension, list) {
        return new Promise((resolve, reject) => {
            let count = limit - list.length;
            if (count <= 0) {
                wx.showToast({title: `最大可上传${limit}项`, icon: 'none'});
                return reject();
            }
            wx.chooseMessageFile({
                count: limit,
                type: type,
                extension: extension.map(item => `.${item}`),
                success: (res) => resolve(res.tempFiles),
                fail: (error) => reject(error),
            });
        });
    },

    /**
     * 打开文件
     * @param path 文件本地路径或网络地址
     */
    async openFile(path) {
        if (this.isLocalFile(path)) {
            this.openLocalFile(path);
        } else {
            await this.downloadFileAndOpen(path);
        }
    },


    /**
     * 下载文件
     * @param url 文件下载路径
     * @returns {Promise<string>} 文件的临时路径
     */
    downloadFile(url) {
        return new Promise((resolve, reject) => {
            wx.showLoading({title: '下载中'});
            wx.downloadFile({
                url: url,
                header: {'access-token': wx.getStorageSync('access_token')},
                success: (res) => res.statusCode === 200 ? resolve(res.tempFilePath) : reject(res),
                fail: (error) => reject(error),
                complete: () => wx.hideLoading(),
            });
        });
    },


    /**
     * 下载并打开文件
     * @param url 文件下载路径
     */
    async downloadFileAndOpen(url) {
        try {
            const tempFilePath = await this.downloadFile(url);
            wx.openDocument({
                filePath: tempFilePath,
                fileType: this.getFileSuffix(url),
                showMenu: true,
                fail: (error) => wx.showToast({title: error.errMsg, icon: 'none'}),
            });
        } catch (error) {
            wx.showToast({title: error.errMsg || '下载失败', icon: 'none'});
        }
    },

    /**
     * 打开本地文件
     * @param path 文件本地路径
     */
    openLocalFile(path) {
        if (!path) {
            wx.showToast({title: '文件路径不能为空'});
            return;
        }
        wx.openDocument({
            filePath: path,
            fileType: this.getFileSuffix(path),
            showMenu: true,
            fail: (error) => wx.showToast({title: error.errMsg, icon: 'none'}),
        });
    },

    /**
     * 获取文件流数据
     * @param url 文件路径
     */
    getFileStream(url) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Config.BASE_URL + url}`,
                method: 'GET',
                header: {'access-token': wx.getStorageSync('access_token')},
                responseType: 'arraybuffer',
                success: (res) => {
                    if (res.statusCode === 200) {
                        if (res.header['Content-Type'].indexOf('application/octet-stream') !== -1) {
                            resolve(res);
                        } else {
                            reject('文件下载失败');
                        }
                    } else {
                        reject('文件下载失败');
                    }
                },
                fail: (error) => reject(error),
            });
        });
    },

    /**
     * 将文件流写入文件
     * @param filePath 文件路径
     * @param fileStream 文件流
     */
    writeFileStream(filePath, fileStream) {
        return new Promise((resolve, reject) => {
            wx.getFileSystemManager().writeFile({
                filePath: filePath,
                data: fileStream,
                encoding: 'binary',
                success: (res) => resolve(res),
                fail: (error) => reject(error),
            });
        });
    },

    /**
     * 下载文件流并打开
     */
    async downloadStreamFileAndOpen(url) {
        try {
            const result = await this.getFileStream(url);
            const filePath = `${wx.env.USER_DATA_PATH}/${decodeURIComponent(result.header.filename)}`;
            await this.writeFileStream(filePath, result.data);
            wx.openDocument({
                filePath: filePath,
                fileType: this.getFileSuffix(result.header.filename),
                showMenu: true,
                fail: (error) => wx.showToast({title: error.errMsg, icon: 'none'}),
            });
        } catch (err) {
            wx.showToast({title: err, icon: 'none'});
        }
    },
};

module.exports = FileUtil;