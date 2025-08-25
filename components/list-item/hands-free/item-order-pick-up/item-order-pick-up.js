const Config = require("@/utils/Config")

Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {},
    data: {},
    methods: {
        onItemButtonClick() {
            wx.showModal({
                title: '提示',
                content: '确定商品已交付到顾客吗？',
                confirmColor: Config.mainColor,
                success: (res) => {
                    if (res.confirm) {
                        wx.showToast({
                            title: '操作成功',
                            icon: 'success',
                        })
                    }
                }
            })
        }
    }
})

