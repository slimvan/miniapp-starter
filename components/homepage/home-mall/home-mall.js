Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {},
    data: {
        currentTabIndex: 0,
    },
    methods: {
        onTabsChanged(e) {
            this.setData({
                currentTabIndex: e.detail.value
            })
        }
    }
})

