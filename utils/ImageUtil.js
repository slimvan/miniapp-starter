const Config = require('./Config')
const FileUtil = require('./FileUtil')

const ImageUtil = {

    /**
     * 选择图片
     * @param {number} limit 上限数量
     * @param {Array} list 已选择的列表
     * @returns {Promise<*>}
     */
    async chooseImage(limit, list) {
        return this.chooseMedia(limit, ['image'], ['album', 'camera'], list);
    },

    /**
     * 选择媒体资源文件
     * @param {number} limit 上限数量
     * @param {Array} mediaType 文件类型
     * @param {Array} sourceType 图片和视频选择的来源
     * @param {Array} list 已选择的列表
     * @returns {Promise<Array>} 选择的媒体文件
     */
    chooseMedia(limit, mediaType = ['image', 'video'], sourceType = ['album', 'camera'], list = []) {
        return new Promise((resolve, reject) => {
            const count = limit - list.length;
            if (count <= 0) {
                wx.showToast({
                    title: `最大可上传${limit}项`,
                    icon: 'none'
                });
                return reject('超出上传上限');
            }

            wx.chooseMedia({
                count: count,
                mediaType: mediaType,
                sourceType: sourceType,
                maxDuration: 10, // 视频拍摄时长默认10秒
                sizeType: ['original', 'compressed'],
                success: (res) => {
                    const files = res.tempFiles.map(item => ({...item, path: item.tempFilePath}));
                    resolve(files);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    },

    /**
     * 保存图片到本地相册
     * @param {string} image 图片路径
     * @returns {Promise<void>}
     */
    async saveImage(image) {
        try {
            const res = await this.checkPhotoAlbumAuthorization();
            if (!res) {
                // 授权失败或未授权
                const authResult = await this.requestPhotoAlbumAuthorization();
                if (!authResult) return; // 用户拒绝了授权
            }
            if (!FileUtil.isLocalFile(image)) {
                //下载网络图片后保存
                image = await FileUtil.downloadFile(image)
            }

            //保存本地路径图片到相册
            await wx.saveImageToPhotosAlbum({
                filePath: image,
            });

            wx.showToast({
                title: '图片已保存到本地相册',
                icon: 'none'
            });
        } catch (error) {
            // 如果用户主动取消保存，则不提示
            if (!error.errMsg.includes('cancel')) {
                wx.showToast({
                    title: '图片保存失败',
                    icon: 'none'
                });
            }
            console.warn(error);
        }
    },

    /**
     * 检查相册保存权限
     * @returns {Promise<boolean>}
     */
    checkPhotoAlbumAuthorization() {
        return new Promise((resolve) => {
            wx.getSetting({
                success: (res) => {
                    resolve(res.authSetting['scope.writePhotosAlbum'] || false);
                },
                fail: () => {
                    resolve(false);
                }
            });
        });
    },

    /**
     * 请求相册保存权限
     * @returns {Promise<boolean>}
     */
    requestPhotoAlbumAuthorization() {
        return new Promise((resolve) => {
            wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => resolve(true),
                fail: () => {
                    wx.showModal({
                        title: '授权提示',
                        content: '您可以在设置页面手动打开保存到相册权限',
                        confirmText: '去设置',
                        confirmColor: Config.mainColor,
                        success: (result) => {
                            if (result.confirm) {
                                wx.openSetting({
                                    success: () => resolve(true),
                                    fail: () => resolve(false)
                                });
                            } else {
                                resolve(false);
                            }
                        },
                        fail: () => resolve(false)
                    });
                }
            });
        });
    },
}

module.exports = ImageUtil;