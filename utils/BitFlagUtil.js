const BitFlagUtil = {
    /**
     * 判断指定配置项是否开启
     * @param {number} value - 配置项总值
     * @param {number} target - 要判断的配置项
     * @returns {boolean}
     */
    isEnabled(value, target) {
        return (value & target) === target;
    }
};

module.exports = BitFlagUtil;