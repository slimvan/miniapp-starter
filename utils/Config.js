//测试环境
const develop = {
    NAME: 'develop',
    DOMAIN: '',
    BASE_URL: '',
    APP_ALIAS: '',

}
//uat环境
const trial = {
    NAME: 'trial',
    DOMAIN: '',
    BASE_URL: '',
    APP_ALIAS: '',

}
//生产环境
const release = {
    NAME: 'release',
    DOMAIN: '',
    BASE_URL: '',
    APP_ALIAS: '',

}

const ENV = develop

module.exports = {
    ENV: ENV, //运行环境
    BASE_URL: ENV.BASE_URL, //请求域名
    APP_ALIAS: ENV.APP_ALIAS, //APP别名

    umengConfig: '', //友盟key

    mainColor: '#000000', //主色调
    pageSize: 20, //每页请求数量


    // 注册登录
    SMS_TYPE_LOGIN_LOGIN: 3, //短信验证码类型 登录
    SMS_TYPE_LOGIN_REGISTER: 6, //短信验证码类型 注册
    SMS_COUNTDOWN_TIME: 60, //短信验证码 倒计时时间 单位秒
    LOGIN_TYPE_BY_SMS_CODE: 2, //登录方式  1密码 2短信验证码

    // 文章别名
    ARTICLE_REGISTER_AGREEMENT: '', //注册协议
    ARTICLE_PRIVACY_RULES: '', //隐私政策

}