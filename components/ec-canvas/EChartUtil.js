const echarts = require('./echarts')
const EChartUtil = {
    /**
     * 初始化图表
     * 组件对象：pageObject下的ecComponent_canvasId
     * chart对象：pageObject下的canvasId同名变量
     * @param {页面对象} pageObject
     * @param {图表id} canvasId
     */
    initChart(pageObject, canvasId = 'chart') {
        return new Promise((resolve) => {
            // 获取组件
            pageObject[`ecComponent_${canvasId}`] = pageObject.selectComponent(`#${canvasId}`);
            console.log(pageObject[`ecComponent_${canvasId}`])

            pageObject[`ecComponent_${canvasId}`].init((canvas, width, height, dpr) => {
                // 获取组件的 canvas、width、height 后的回调函数
                // 在这里初始化图表
                pageObject[`${canvasId}`] = echarts.init(canvas, null, {
                    width: width,
                    height: height,
                    devicePixelRatio: dpr // 屏幕像素
                });
                resolve(pageObject[`${canvasId}`])
                // 注意这里一定要返回 chart 实例，否则会影响事件处理等
                return pageObject[`${canvasId}`]
            });
        })
    }
}
module.exports = EChartUtil;