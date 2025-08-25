// components/indicator-view/indicator-view.js
Component({
    properties: {
        count: {
            type: Number,
            value: 0,
            observer() {
                this.calculateTrackWidth();
            }
        },
        sliderWidth: {
            type: Number,
            value: 40// 单位rpx
        },
        trackColor: {
            type: String,
            value: "#D4D4D4",
        },
        sliderColor: {
            type: String,
            value: '#333333'
        },
        currentIndex: {
            type: Number,
            value: 0,
            observer(newVal) {
                this.updateSliderOffset(newVal);
            }
        }
    },
    data: {
        trackWidth: 0,
        sliderOffset: 0
    },
    methods: {
        calculateTrackWidth() {
            if (this.data.count <= 1) return;
            const trackWidth = this.data.count * this.data.sliderWidth;
            this.setData({
                trackWidth
            });
        },

        updateSliderOffset(index) {
            const {count} = this.data;
            if (count <= 0) return;

            const spacePerItem = this.data.trackWidth / count;
            const offset = index * spacePerItem;
            this.setData({
                sliderOffset: offset
            });
        }
    },
    lifetimes: {
        attached() {
            this.updateSliderOffset(this.data.currentIndex);
        }
    }
});