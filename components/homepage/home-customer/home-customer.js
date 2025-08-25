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
        onItemButtonClick() {
            wx.navigateTo({
                url: `/packageCustomer/pages/memberCode/memberCode`
            })
        },
        onButtonClick() {
            wx.navigateTo({
                url: `/packageCustomer/pages/handsFree/list/list`
            })
        }
    }
})

