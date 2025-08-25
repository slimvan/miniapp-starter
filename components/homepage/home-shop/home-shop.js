const MockData = require("@/utils/MockData")
const ViewUtil = require("@/utils/ViewUtil")

Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {},
    data: {
        slide_list: MockData.slide_list,
    },
    methods: {
        onOrderListClick() {
            wx.navigateTo({
                url: `/packageShop/pages/handsFree/list/list`
            })
        },
        onOrderCreateClick(){
            wx.navigateTo({
                url: `/packageShop/pages/handsFree/create/create`
            })
        }
    }
})

