const Config = require("@/utils/Config");
const NetworkUtil = require("@/utils/NetworkUtil");

const PageUtil = {
    /**
     * 获取列表数据
     * @param options
     * @param options.url 请求地址
     * @param options.params 请求参数
     * @param options.loadingText 加载提示文字
     * @param options.isLoadMore 是否加载更多
     * @param options.list 列表数据
     * @param options.pageHost 页面实例
     * @returns {Promise<unknown>}
     */
    getListData(options) {
        let {url, params = {}, loadingText, isLoadMore, list, pageHost} = options

        return new Promise(async (resolve, reject) => {
            if (pageHost.data.isRequesting) {
                // 如果已经有请求正在进行，则直接返回，防止重复请求
                return resolve(list);
            }

            // 如果已经是最后一页，并且是在加载更多时触发，则直接返回
            if (isLoadMore && pageHost.data.list_info.lastPage) {
                return resolve(list);
            }

            pageHost.setData({isRequesting: true}); // 标记请求正在进行

            try {
                // 设置分页参数
                params.page = isLoadMore ? ((pageHost.data.list_info?.page || 0) + 1) : 1
                params.page_size = Config.pageSize;

                // 更新页面显示状态，加载更多
                if (isLoadMore) {
                    pageHost.setData({
                        isLoadingMore: true,
                    })
                }

                // 请求数据
                let res = await NetworkUtil.get({
                    url,
                    params,
                    loadingText,
                });
                if (res.error === 0) {
                    // 更新页面数据
                    pageHost.setData({
                        list_info: {
                            lastPage: true, //默认最后一页
                            ...res.data
                        }
                    });

                    // 合并数据
                    list = isLoadMore ? list.concat(res.data.items) : res.data.items;

                    resolve(list);
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                    })
                    reject(res.msg)
                }
            } catch (error) {
                reject(error);
            } finally {
                // 请求结束，标记为非请求状态
                pageHost.setData({isRequesting: false});
                wx.stopPullDownRefresh()
                if (isLoadMore) {
                    pageHost.setData({
                        isLoadingMore: false,
                    })
                }
            }
        });
    }
}

module.exports = PageUtil;