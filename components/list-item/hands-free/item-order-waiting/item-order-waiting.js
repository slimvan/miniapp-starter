Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {},
    data: {},
    methods: {
        onItemClick() {
            wx.navigateTo({
                url: `/packageMall/pages/handsFree/detail/detail`
            })
        }
    }
})

