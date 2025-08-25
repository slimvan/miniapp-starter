const Util = {

    /**
     * 节流函数
     * @param fn 方法
     * @param delay 间隔时间
     * @returns {(function(): void)|*}
     */
    throttle(fn, delay = 300) {
        let lastTime = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    },


    /**
     * 防抖函数
     * @param fn 方法
     * @param delay 间隔时间
     * @returns {(function(): void)|*}
     */
    debounce(fn, delay = 300) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        }
    },


}


module.exports = Util;