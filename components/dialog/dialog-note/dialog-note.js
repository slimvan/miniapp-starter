// components/dialog/dialog-note/dialog-note.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false
        },

        content: {
            type: String,
            value: '',
            observer(newVal) {
                this.setData({
                    temp_content: newVal
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        content: '',
        temp_content: '',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 弹窗确定
         */
        onNoteDialogConfirm() {
            this.triggerEvent('closed', {
                value: this.data.temp_content
            })
        },

        /**
         * 弹窗取消
         */
        onNoteDialogCancel() {
            this.triggerEvent('closed', {
                value: this.data.content,
            })
            this.setData({
                temp_content: this.data.content
            })
        },

        /**
         * 备注输入
         */
        onNoteInput(e) {
            this.setData({
                temp_content: e.detail.value
            })
        },
    }
})