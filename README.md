# miniapp-starter 小程序

一个基于微信小程序原生能力与 TDesign 组件库的起始项目模板，内置常用基础组件与工具方法，帮助快速搭建业务页面。

## 技术栈与依赖
- 微信小程序（原生）
- TDesign for Mini Program（已集成至 `miniprogram_npm/tdesign-miniprogram`）
- dayjs（`miniprogram_npm/dayjs`）

## 目录结构
> 仅展示关键目录与文件，完整结构以仓库为准。

```
miniapp-starter/
  app.js
  app.json
  app.less
  pages/
    homepage/
      homepage.js
      homepage.json
      homepage.less
      homepage.wxml
    others/
      article/
      login/
      webview/
  components/
    common-swiper-view/
    dialog/
    ec-canvas/
    empty-view/
    file-selector/
    footer-view/
    homepage/
    indicator-view/
    label-view/
    loading-view/
    mp-html/
    photo-selector/
    popup/
    qrcode-view/
  miniprogram_npm/
    dayjs/
    tdesign-miniprogram/
  styles/
  utils/
  wxs/
```

### 关键目录说明
- `pages/`: 业务页面目录。
  - `homepage/`: 首页页面文件夹。
  - `others/`: 其他示例页面（文章、登录、WebView 等）。
- `components/`: 自定义通用组件集合（如轮播、选择器、二维码、HTML 渲染等）。
- `miniprogram_npm/`: 小程序 npm 构建产物（TDesign、dayjs 等）。
- `styles/`: 全局样式与 TDesign 主题样式覆盖。
- `utils/`: 常用工具函数与配置（如 `Config.js`、`AppUtil.js` 等）。
- `wxs/`: 小程序 WXS 脚本。

## 开发环境准备
1. 安装微信开发者工具（建议使用最新稳定版）。
2. 使用微信开发者工具导入本项目根目录 `miniapp-starter/`。
3. 构建 npm：在微信开发者工具中选择「工具 -> 构建 npm」。
   - 若修改或新增依赖，请重新构建 npm。

## 运行与预览
- 在微信开发者工具中点击「预览/编译」即可运行项目。
- 如遇到组件找不到，重新执行「构建 npm」。

## 代码规范与约定
- 缩进：4 空格。
- 命名：使用有语义的全词命名，避免缩写。
- 页面模板（空页面）统一使用以下生命周期方法与注释：
  - 包含 `data` 与以下生命周期：
    - `onLoad(options)`、`onReady`、`onShow`、`onHide`、`onUnload`
    - `onPullDownRefresh`、`onReachBottom`、`onShareAppMessage`
  - 方法均保留「微信开发工具默认」风格的注释块。

示例（仅示意，按需填充业务逻辑）：

```javascript
// pages/example/example.js
Page({
    /** 页面初始数据 */
    data: {},

    /** 生命周期函数--监听页面加载 */
    onLoad(options) {},

    /** 生命周期函数--监听页面初次渲染完成 */
    onReady() {},

    /** 生命周期函数--监听页面显示 */
    onShow() {},

    /** 生命周期函数--监听页面隐藏 */
    onHide() {},

    /** 生命周期函数--监听页面卸载 */
    onUnload() {},

    /** 监听用户下拉动作 */
    onPullDownRefresh() {},

    /** 页面上拉触底事件的处理函数 */
    onReachBottom() {},

    /** 用户点击右上角分享 */
    onShareAppMessage() {},
})
```

## 第三方库与组件
- **TDesign Miniprogram**：丰富的 UI 组件，路径：`miniprogram_npm/tdesign-miniprogram`。
- **dayjs**：轻量日期处理库，路径：`miniprogram_npm/dayjs`。
- 内置通用组件：
  - `components/mp-html`：富文本/HTML 渲染。
  - `components/ec-canvas`：图表画布封装（ECharts 适配）。
  - `components/file-selector`、`components/photo-selector`：文件/图片选择器。
  - `components/qrcode-view`：二维码生成与展示。
  - 其他：`common-swiper-view`、`loading-view`、`empty-view`、`popup` 等。

## 发布与打包
1. 确认在微信开发者工具中构建 npm 无误。
2. 检查 `app.json` 与各 `page.json` 的页面与组件引用是否正确。
3. 使用微信开发者工具上传代码并在平台后台提审发布。

## 常见问题
- 组件样式异常：
  - 确认已构建 npm；
  - 检查是否覆盖了 TDesign 的主题样式（`styles/t-design/*`）。
- 依赖报错：
  - 删除 `miniprogram_npm` 后重新构建 npm；
  - 确认小程序基础库版本满足依赖要求。

## 许可证
根据实际业务选择（MIT/Apache-2.0/私有）。如未指定，默认视为内部项目使用。

