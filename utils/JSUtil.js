const JSUtil = {
    /**
     * 解析url中的参数 返回json
     */
    parseUrl(url) {
        const json = {};
        if (url.indexOf('?') === -1) {
            return json
        }
        const arr = url.substr(url.indexOf('?') + 1).split('&');
        arr.forEach(item => {
            const tmp = item.split('=');
            json[tmp[0]] = tmp[1];
        });
        return json;
    },

    /**
     * 是否空对象
     */
    isEmptyObject(object) {
        return !object || Object.keys(object).length === 0
    },

    /**
     * 是否空数组
     */
    isEmptyArray(array) {
        return !array || array.length <= 0
    },
}

module.exports = JSUtil;