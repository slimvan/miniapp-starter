const dayjs = require('dayjs')
const DateTimeUtil = {

    /**
     * 格式化时间范围
     * @param data 数据对象
     * @returns {string} 格式化后的时间范围字符串
     */
    format(data) {
        if (data.start_at && data.end_at) {
            //起止时间为同一天 返回XX月XX日 XX时XX分 ~ XX时XX分
            if (dayjs(data.start_at).isSame(dayjs(data.end_at), 'day')) {
                let start_at = dayjs(data.start_at).format('MM/DD HH:mm')
                let end_at = dayjs(data.end_at).format('HH:mm')
                return `${start_at}~${end_at}`
            }

            //起止时间为不同天 显示XX月XX日 XX时XX分 ~ XX月XX日 XX时XX分
            if (!dayjs(data.start_at).isSame(dayjs(data.end_at), 'day')) {
                let start_at = dayjs(data.start_at).format('MM/DD HH:mm')
                let end_at = dayjs(data.end_at).format('MM/DD HH:mm')
                return `${start_at}~${end_at}`
            }
        }
        return 'Invalid Date'
    },


    /**
     * 根据周几返回对应的中文字符串
     */
    getWeekDayStr(dayIndex) {
        const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        return weekMap[dayIndex]
    }
}

module.exports = DateTimeUtil;