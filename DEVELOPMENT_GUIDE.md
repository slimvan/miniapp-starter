# 企业级微信小程序开发规范

> 基于 `miniapp-starter` 项目模板提炼，适用于团队协作的原生微信小程序开发。

---

## 目录

1. [技术栈与依赖](#一-技术栈与依赖)
2. [项目结构规范](#二-项目结构规范)
3. [命名规范](#三-命名规范)
4. [样式体系规范](#四-样式体系规范)
5. [WXML 模板规范](#五-wxml-模板规范)
6. [JavaScript 编码规范](#六-javascript-编码规范)
7. [页面开发规范](#七-页面开发规范)
8. [组件开发规范](#八-组件开发规范)
9. [网络请求规范](#九-网络请求规范)
10. [工具函数体系](#十-工具函数体系)
11. [状态与存储管理](#十一-状态与存储管理)
12. [路由与导航规范](#十二-路由与导航规范)
13. [环境与配置管理](#十三-环境与配置管理)
14. [第三方库集成规范](#十四-第三方库集成规范)
15. [性能优化规范](#十五-性能优化规范)
16. [安全规范](#十六-安全规范)
17. [Git 与协作规范](#十七-git-与协作规范)
18. [附录：文件模板](#附录文件模板)

---

## 一、技术栈与依赖

| 类别 | 技术方案 | 说明 |
|------|---------|------|
| 框架 | 微信小程序原生 |  |
| UI 组件库 | TDesign Miniprogram `^1.9.7` | 通过 npm 构建引入 |
| CSS 预处理器 | Less | 项目配置 `useCompilerPlugins: ["less"]` |
| 日期处理 | dayjs `^1.11.13` | 轻量日期处理库 |
| 数据统计 | 友盟 umtrack-wx `^2.8.0` | 埋点与数据采集 |
| 路径别名 | `@/*` → `/*` | 通过 `resolveAlias` + `jsconfig.json` 配置 |

### 依赖管理原则

- 所有 npm 依赖通过 `package.json` 管理，安装后需在微信开发者工具中执行 **「工具 → 构建 npm」**
- 构建产物输出至 `miniprogram_npm/` 目录
- 引用第三方组件时，统一使用 `tdesign-miniprogram/组件名/组件名` 路径

---

## 二、项目结构规范

```
miniapp-starter/
├── app.js                    # 应用入口
├── app.json                  # 全局配置
├── app.less                  # 全局样式（Less 入口）
├── project.config.json       # 项目配置
├── jsconfig.json             # 路径别名配置
├── package.json              # npm 依赖
│
├── pages/                    # 📄 页面目录
│   ├── homepage/             #   首页模块
│   │   ├── homepage.js
│   │   ├── homepage.json
│   │   ├── homepage.wxml
│   │   └── homepage.less
│   └── others/               #   其他页面
│       ├── article/
│       ├── login/
│       └── webview/
│
├── components/               # 🧩 通用组件目录
│   ├── common-swiper-view/   #   通用轮播组件
│   ├── dialog/               #   弹窗类组件
│   ├── empty-view/           #   空状态组件
│   ├── file-selector/        #   文件选择器
│   ├── footer-view/          #   页脚组件
│   ├── loading-view/         #   加载状态组件
│   ├── photo-selector/       #   图片选择器
│   ├── popup/                #   弹出层组件
│   └── ...
│
├── styles/                   # 🎨 全局样式目录
│   ├── variables.less        #   变量定义（颜色、间距等）
│   ├── common.less           #   通用样式类
│   ├── form.less             #   表单样式
│   ├── text-color.less       #   文字颜色工具类
│   ├── button-color.less     #   按钮颜色工具类
│   ├── animate.less          #   动画库（Animate.css 适配）
│   ├── miniapp.less          #   小程序全局样式重置
│   └── t-design/             #   TDesign 主题覆盖
│       ├── t-design.less     #     TDesign 主入口
│       ├── tabs.less
│       ├── navbar.less
│       └── ...
│
├── utils/                    # 🔧 工具函数目录
│   ├── Config.js             #   环境与业务配置
│   ├── Constant.js           #   常量定义
│   ├── NetworkUtil.js        #   网络请求封装
│   ├── LoginUtil.js          #   登录逻辑
│   ├── StorageUtil.js        #   本地存储
│   ├── RouteUtil.js          #   路由导航
│   ├── PageUtil.js           #   分页数据
│   ├── ImageUtil.js          #   图片处理
│   ├── FileUtil.js           #   文件操作
│   ├── UploadUtil.js         #   文件上传
│   ├── ViewUtil.js           #   视图测量
│   ├── PermissionUtil.js     #   权限管理
│   ├── DateTimeUtil.js       #   日期时间
│   ├── Util.js               #   节流防抖
│   ├── JSUtil.js             #   JS 基础工具
│   ├── BitFlagUtil.js        #   位运算工具
│   ├── QRCodeUtil.js         #   二维码工具
│   ├── AppUtil.js            #   应用工具
│   ├── WxNotificationCenter.js # 通知中心
│   ├── MockData.js           #   Mock 数据
│   └── dayjs/                #   dayjs 插件
│
├── wxs/                      # 📝 WXS 脚本
│   └── util.wxs
│
├── images/                   # 🖼️ 静态图片资源
├── miniprogram_npm/          # 📦 npm 构建产物（自动生成）
└── node_modules/             # npm 依赖源文件
```

### 目录规范要点

1. **页面分层**：`pages/` 下按功能模块分目录组织，主页面直接放置，辅助页面归入 `others/`
2. **组件分类**：`components/` 下按功能域分目录，业务组件可按页面归属进一步分组（如 `components/homepage/`）
3. **样式分层**：全局样式统一放 `styles/`，页面级样式跟随页面文件
4. **工具函数**：按功能域拆分为独立模块（如 `NetworkUtil`、`ImageUtil`），避免万能的大工具文件
5. **分包结构**：大型项目使用 `packageXxx/` 分包目录（如 `packageActivity/`、`packageGoods/`）

---

## 三、命名规范

### 3.1 文件与目录命名

| 类别 | 规则 | 示例 |
|------|------|------|
| 页面目录 | 小驼峰命名 (camelCase) | `homepage/`、`orderDetail/` |
| 页面文件集 | 与目录同名 | `homepage.js`、`homepage.wxml`、`homepage.less`、`homepage.json` |
| 组件目录 | 短横线分隔 (kebab-case) | `empty-view/`、`photo-selector/` |
| 组件文件集 | 与目录同名 | `empty-view.js`、`empty-view.wxml` |
| 工具文件 | 大驼峰命名 (PascalCase) | `NetworkUtil.js`、`ImageUtil.js` |
| 样式文件 | 短横线分隔 (kebab-case) | `text-color.less`、`button-color.less` |
| WXS 文件 | 短横线分隔 (kebab-case) | `util.wxs` |

### 3.2 代码命名

| 类别 | 规则 | 示例 |
|------|------|------|
| 变量 / 函数 | 小驼峰 (camelCase) | `isLogin`、`getListData` |
| 常量 | 全大写下划线 (UPPER_SNAKE_CASE) | `STORAGE_KEY_ACCESS_TOKEN`、`SMS_COUNTDOWN_TIME` |
| Less 变量 | `@` 前缀 + 小驼峰 | `@mainColor`、`@textColorDark` |
| CSS 类名 | 短横线分隔 (kebab-case) | `.common-button`、`.ios-safe-area-padding` |
| 事件处理函数 | `on` + 动作描述 | `onPhotoAddClick`、`onMobileInput` |
| 数据属性 | 下划线命名 (snake_case) | `list_info`、`verify_info` |

### 3.3 命名原则

- ✅ 使用**有语义的全词命名**，避免缩写（`onPhoneNumberGeted` 而非 `onPhoneNumGet`）
- ✅ 布尔变量以 `is`/`has`/`can` 开头（`isLogin`、`isLoadMore`、`send_code_enable`）
- ✅ 异步方法名体现异步特征（`async getUserInfo`、`async getToken`）
- ❌ 禁止使用纯数字或无意义字母命名

---

## 四、样式体系规范

### 4.1 样式文件组织

全局样式通过 `app.less` 统一导入，加载顺序如下：

```less
/**app.less**/
@import "/styles/variables.less";      // 1. 变量定义（最先加载）
@import "/styles/t-design/t-design.less"; // 2. TDesign 主题覆盖
@import "/styles/form.less";           // 3. 表单样式
@import "/styles/common.less";         // 4. 通用样式类
@import "/styles/text-color.less";     // 5. 文字颜色工具类
@import "/styles/button-color.less";   // 6. 按钮颜色工具类
@import "/styles/animate.less";        // 7. 动画库
@import "styles/miniapp.less";         // 8. 小程序特定样式

page {
  background-color: @pageColor;
}
```

### 4.2 设计令牌 (Design Tokens)

#### 颜色体系

```less
// 品牌色
@mainColor: #74874F;           // 主色调 
@secondaryColor: #F4EDDD;      // 辅助色
@pageColor: #f5f5f5;           // 页面背景色
@dividerColor: #eeeeee;        // 分割线颜色

// 功能色
@redColor: #D25050;             // 错误/危险
@greenColor: #14bc5c;           // 成功
@goldColor: #d8b879;            // 金色/高级
@orangeColor: #DF913F;          // 警告
@blueColor: #3491fa;            // 信息/链接
@purpleColor: #6738B9;          // 紫色
@yellowColor: #FFCE00;          // 黄色

// 功能色背景
@mainColorBg: #F6F6E5;
@greenColorBg: #14bc5c33;
@blueColorBg: #3491fa33;
@redColorBg: #F5E5E5;
@disabledColor: #E5E5E5;
@darkColorTranslucence: rgba(0, 0, 0, 0.5);

// 文字色彩层级
@textColorBlack: #000000;       // 标题
@textColorDark: #333333;        // 正文
@textColorMedium: #777777;      // 辅助说明
@textColorLight: #AAAAAA;       // 占位/禁用
@textColorGold: #C08935;        // 金色文字
```

#### 颜色使用原则

- ✅ **所有颜色引用必须使用 Less 变量**，禁止硬编码色值
- ✅ 功能色语义化使用：成功用 `@greenColor`，错误用 `@redColor`
- ❌ 避免使用纯红 (`#FF0000`)、纯蓝 (`#0000FF`) 等高饱和度默认色
- ✅ TDesign 主题色通过 CSS 变量覆盖：`--td-brand-color: @mainColor;`

### 4.3 通用样式类

#### 布局类

```less
.container {                    // 页面根容器
  display: flex;
  flex-direction: column;
}

.horizontal-view {              // 水平布局
  display: flex;
  flex-direction: row;
  align-items: center;
}

.vertical-view {                // 垂直布局
  display: flex;
  flex-direction: column;
}

.vertical-view-center {         // 垂直居中布局
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

#### 按钮类

```less
.common-button {                // 主按钮
  margin: 30rpx;
  background: @mainColor;
  font-size: 28rpx;
  color: white;
  font-weight: 500;
  text-align: center;
  border-radius: 90rpx;
  height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-primary { ... }         // 表单主按钮
.button-outline { ... }         // 描边按钮
.button-default-clear { ... }   // 透明按钮（清除默认样式）
```

#### 文字截断类

```less
.text-line-1 {                  // 单行溢出省略
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.text-line-2 {                  // 两行溢出省略
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
}
```

#### iOS 安全区域适配

```less
.ios-safe-area-margin {
  margin-bottom: calc(30rpx + constant(safe-area-inset-bottom)) !important;
  margin-bottom: calc(30rpx + env(safe-area-inset-bottom)) !important;
}

.ios-safe-area-padding {
  padding-bottom: calc(30rpx + constant(safe-area-inset-bottom)) !important;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom)) !important;
}
```

### 4.4 样式编写规范

1. **使用 Less 嵌套**，保持层级清晰：
   ```less
   .input-container {
     .login-input-view {
       .input-content { ... }
       .send-message-code { ... }
     }
   }
   ```

2. **表单统一使用 `.form-view` + `.cell-view` 结构**：
   ```less
   .form-view { ... }
   .cell-view {
     padding: 30rpx;
     border-bottom: 1px solid @dividerColor;
     &:last-child { border-bottom: none; }
   }
   ```

3. **尺寸单位统一使用 `rpx`**，特殊场景使用 `px`（如 1 像素线条）

4. **全局样式重置**（`miniapp.less`）：
   - `view` / `text` 标签设置 `word-break: break-all` 防止英文数字不换行
   - `text` 标签设置 `white-space: pre-wrap` 支持换行显示
   - `checkbox` 统一圆角主题色样式

---

## 五、WXML 模板规范

### 5.1 根容器

每个页面的 WXML 根节点**必须**统一使用 `class="container"`：

```html
<view class="container">
    <!-- 页面内容 -->
</view>
```

### 5.2 标签选用

| 场景 | 推荐标签 | 说明 |
|------|---------|------|
| 默认文本展示 | `<view>` | 大部分文本场景使用 `view` |
| 需解析 `\n` 换行 | `<text>` | 如 `<text>欢迎登录\nXXX小程序</text>` |
| 需要文本可选 | `<text>` | 通过 `user-select` 属性实现 |
| 列表滚动 | `<view>` + `overflow: auto` | 配合 `-webkit-overflow-scrolling: touch` |
| 需要滚动事件监听 | `<scroll-view>` | 仅在需要 `bindscrolltoupper/lower` 时使用 |

### 5.3 属性换行

当标签属性较多或单行超过 80 字符时，属性**必须换行排列**：

```html
<!-- ✅ 推荐 -->
<t-dialog
    visible="{{show}}"
    title="备注"
    confirm-btn="确定"
    cancel-btn="取消"
    bind:confirm="onNoteDialogConfirm"
    bind:cancel="onNoteDialogCancel">
</t-dialog>

<!-- ❌ 不推荐 -->
<t-dialog visible="{{show}}" title="备注" confirm-btn="确定" cancel-btn="取消" bind:confirm="onNoteDialogConfirm" bind:cancel="onNoteDialogCancel"></t-dialog>
```

### 5.4 事件绑定

- 普通事件使用 `bind:事件名` 或 `bind事件名`
- 阻止冒泡使用 `catch:事件名` 或 `catch事件名`
- 条件禁用事件：`bindtap="{{condition ? 'handler' : ''}}"`

```html
<!-- 条件禁用示例 -->
<view bindtap="{{send_code_enable ? 'onSendCodeClick' : ''}}">
    {{send_code_enable ? '发送验证码' : count_down_time + '秒'}}
</view>

<!-- 阻止冒泡示例 -->
<view class="buttons-mask-view" catch:tap="onButtonsMaskClick"></view>
```

### 5.5 条件渲染

- 元素切换频繁时使用 `hidden`
- 条件分支使用 `wx:if` / `wx:elif` / `wx:else`

```html
<view bindtap="onLoginClick" wx:if="{{isLoginBySMSCode}}">登录</view>
<button open-type="getPhoneNumber" bindgetphonenumber="onPhoneNumberGeted" wx:else>
    快捷登录
</button>
```

### 5.6 注释规范

使用 WXML 注释标注区域功能：

```html
<!-- 短信验证码登录 -->
<view class="input-container" wx:if="{{isLoginBySMSCode}}">
    ...
</view>

<!-- 登录按钮 -->
<view class="buttons-view">
    ...
</view>

<!-- 隐私协议 -->
<view class="link-container">
    ...
</view>
```

---

## 六、JavaScript 编码规范

### 6.1 模块引入

- **统一使用 `@/` 路径别名**引入工具模块（页面和组件均适用）：
  ```javascript
  const Config = require("@/utils/Config")
  const NetworkUtil = require("@/utils/NetworkUtil")
  const LoginUtil = require("@/utils/LoginUtil")
  ```

- npm 包使用 `import` 语法：
  ```javascript
  import 'umtrack-wx';
  ```

- ❌ **禁止使用相对路径**引用 `utils/` 下的工具模块：
  ```javascript
  // ❌ 不推荐
  const ImageUtil = require("../../utils/ImageUtil")
  const Config = require("./Config")

  // ✅ 推荐
  const ImageUtil = require("@/utils/ImageUtil")
  const Config = require("@/utils/Config")
  ```

### 6.2 异步编程

**统一使用 `async/await`**，避免回调地狱和 `.then()` 链式调用：

```javascript
// ✅ 推荐
async onLoad(options) {
    try {
        const res = await NetworkUtil.get({ url: "/api/data" })
        if (res.error === 0) {
            this.setData({ list: res.data })
        }
    } catch (error) {
        console.error(error)
    }
}

// ❌ 不推荐
onLoad(options) {
    NetworkUtil.get({ url: "/api/data" }).then(res => {
        this.setData({ list: res.data })
    }).catch(err => {
        console.error(err)
    })
}
```

### 6.3 wx API Promise 化

将原生回调式 API 封装为 Promise：

```javascript
// ✅ 推荐封装方式
const code = await new Promise((resolve, reject) => {
    wx.login({
        success: (res) => resolve(res.code),
        fail: reject,
    })
})
```

### 6.4 防抖与节流

对用户频繁触发的操作（如按钮点击、表单提交），使用 `Util.debounce()` 或 `Util.throttle()`：

```javascript
const Util = require("@/utils/Util")

Page({
    // 防抖：等用户停止操作后执行（适用于提交类）
    onLoginClick: Util.debounce(async function () {
        let res = await NetworkUtil.post({ ... })
        // ...
    }),

    // 节流：固定间隔执行一次（适用于滚动类）
    onScroll: Util.throttle(function () {
        // ...
    }, 300),
})
```

### 6.5 注释规范

- **所有注释必须使用中文**
- 方法使用 JSDoc 风格注释：

```javascript
/**
 * 获取用户信息
 * @param {boolean} forceRefresh 是否强制刷新用户信息
 * @returns {Promise<Object>} 用户信息
 */
async getUserInfo(forceRefresh = false) { ... }
```

- 单行注释使用 `//`：
```javascript
// 清除旧的token 每次启动都获取新token
wx.removeStorageSync(Constant.STORAGE_KEY_ACCESS_TOKEN)
```

### 6.6 错误处理

- 网络请求必须使用 `try/catch` 包裹
- 用户取消操作不弹错误提示

#### 场景一：网络请求错误处理

`NetworkUtil` 内部已对业务错误码（如 405、40000~41000）**自动弹窗提示**，
大部分场景下调用方只需简单 `catch` 即可，无需额外处理：

```javascript
// ✅ 常规写法（大部分场景）
try {
    const res = await NetworkUtil.post({
        url: "/api/submit",
        params: { ... },
        loadingText: "提交中",
    })
    if (res.error === 0) {
        // 业务成功
    } else {
        wx.showToast({ title: res.msg, icon: 'none' })
    }
} catch (error) {
    // NetworkUtil 内部已处理，此处无需额外操作
}
```

如果需要在 `catch` 中**自定义错误提示**，可通过 `error.handled` 判断错误是否已被 `NetworkUtil` 内部处理过，避免重复弹窗：

```javascript
// 进阶用法：需要自定义错误提示时
catch (error) {
    if (!error.handled) {
        wx.showToast({ title: '自定义错误提示', icon: 'none' })
    }
}
```

> 💡 **原理**：`NetworkUtil.request()` 中 `checkBusinessError()` 检测到业务错误时，
> 会先调用 `showErrorModal()` 弹窗提示用户，然后执行 `reject({ handled: true })`。

#### 场景二：wx API 错误处理

调用微信原生 API 时，注意排除用户主动取消的场景：

```javascript
try {
    await wx.saveImageToPhotosAlbum({ filePath: image })
} catch (error) {
    // 用户主动取消保存，不提示错误
    if (!error.errMsg.includes('cancel')) {
        wx.showToast({ title: '图片保存失败', icon: 'none' })
    }
}
```

---

## 七、页面开发规范

### 7.1 页面模板

每个新页面必须保留完整的生命周期方法骨架：

```javascript
// pages/example/example.js
const Config = require("@/utils/Config")
const NetworkUtil = require("@/utils/NetworkUtil")

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

### 7.2 页面 JSON 配置

```json
{
  "usingComponents": {},
  "enablePullDownRefresh": false
}
```

- 按需配置 `enablePullDownRefresh`
- 自定义导航栏时添加 `"navigationStyle": "custom"`
- 组件引用在 `usingComponents` 中声明

### 7.3 页面样式

```less
/* pages/example/example.less */
.container {
  // 页面级样式
}
```

### 7.4 分页列表页面

使用 `PageUtil.getListData()` 统一处理分页逻辑。推荐在页面内封装一个 `getListData` 方法，
让 `onLoad`、`onReachBottom`、`onPullDownRefresh` 保持简洁：

```javascript
const PageUtil = require("@/utils/PageUtil")

Page({
    data: {
        list: [],
        list_info: {},      // 分页信息
        isRequesting: false, // 请求锁
        isLoadingMore: false, // 加载更多状态
    },

    async onLoad() {
        await this.getListData()
    },

    async onReachBottom() {
        await this.getListData(true)
    },

    async onPullDownRefresh() {
        this.data.list = []
        await this.getListData()
    },

    /**
     * 获取列表数据
     * @param {boolean} isLoadMore 是否加载更多
     */
    async getListData(isLoadMore = false) {
        this.data.list = await PageUtil.getListData({
            url: "/api/list",
            params: {},
            loadingText: isLoadMore ? '' : '加载中',
            isLoadMore,
            list: this.data.list,
            pageHost: this,
        })
        this.setData({ list: this.data.list })
    },
})
```

---

## 八、组件开发规范

### 8.1 组件结构

每个组件包含 4 个文件，命名使用 **kebab-case**：

```
components/
└── empty-view/
    ├── empty-view.js       # 组件逻辑
    ├── empty-view.json     # 组件配置
    ├── empty-view.wxml     # 组件模板
    └── empty-view.less     # 组件样式
```

### 8.2 组件 JSON 配置

```json
{
  "component": true,
  "usingComponents": {
    "t-empty": "tdesign-miniprogram/empty/empty"
  }
}
```

### 8.3 组件 JS 模板

```javascript
// components/example/example.js
Component({
    /** 组件的属性列表 */
    properties: {
        // 使用中文注释说明每个属性
        image: {
            type: String,
            value: '/images/common/ic_empty.png'
        },
        description: {
            type: String,
            value: '抱歉，暂时没有内容哦~'
        },
    },

    /** 组件的初始数据 */
    data: {},

    /** 组件的方法列表 */
    methods: {},
})
```

### 8.4 组件通信

- **父 → 子**：通过 `properties` 传递
- **子 → 父**：通过 `triggerEvent` 触发自定义事件

```javascript
// 子组件
methods: {
    onConfirm() {
        this.triggerEvent('closed', { value: this.data.content })
    },
}
```

```html
<!-- 父组件 -->
<dialog-note show="{{showDialog}}" bind:closed="onDialogClosed"/>
```

- **属性监听**：使用 `observer` 监听属性变化

```javascript
properties: {
    content: {
        type: String,
        value: '',
        observer(newVal) {
            this.setData({ temp_content: newVal })
        }
    }
}
```

### 8.5 组件对外暴露方法

通过 `this.selectComponent()` 调用组件内部方法：

```javascript
// 页面中调用组件方法
const photoSelector = this.selectComponent('#photo-selector')
const uploadedList = await photoSelector.uploadIfNeed()
```

### 8.6 组件设计原则

| 原则 | 说明 |
|------|------|
| 单一职责 | 每个组件只负责一个功能区域 |
| 属性驱动 | 组件内部不直接操作外部数据 |
| 事件通信 | 状态变更通过事件通知父组件 |
| 默认值友好 | `properties` 设置合理的默认值 |
| 封装第三方 | 对 TDesign 等组件二次封装，便于全局替换 |

---

## 九、网络请求规范

### 9.1 NetworkUtil 架构

项目网络层基于 `NetworkUtil` 统一封装，核心特性：

```
NetworkUtil
├── request(options)       # 通用请求（核心方法）
├── get(options)           # GET 请求
├── post(options)          # POST 请求
├── upload(options)        # 文件上传
├── getToken()             # Token 获取（单例模式）
├── buildParams(params)    # 参数组装
├── handleError(res, reject) # 错误处理
├── checkBusinessError(resData) # 业务错误码检查
└── showErrorModal(content, callback) # 错误弹窗
```

### 9.2 请求调用示例

```javascript
// GET 请求
const res = await NetworkUtil.get({
    url: "/api/list",
    params: { page: 1 },
    loadingText: "加载中",   // 可选：显示 loading
})

// POST 请求
const res = await NetworkUtil.post({
    url: "/api/submit",
    params: { name: "test" },
    loadingText: "提交中",
})

// 忽略 Token 的请求
const res = await NetworkUtil.request({
    url: "/mp/login",
    method: "POST",
    params: { code },
    ignoreToken: true,
})
```

### 9.3 请求配置 Options

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | `string` | ✅ | 相对路径（不含域名） |
| `method` | `string` | ❌ | 请求方式，默认 `GET` |
| `params` | `object` | ❌ | 请求参数，默认 `{}` |
| `loadingText` | `string` | ❌ | 加载提示文字 |
| `ignoreToken` | `boolean` | ❌ | 是否忽略 Token |

### 9.4 响应处理规范

```javascript
if (res.error === 0) {
    // 业务成功
    this.setData({ data: res.data })
} else {
    // 业务失败
    wx.showToast({ title: res.msg, icon: 'none' })
}
```

### 9.5 Token 管理

- **静默登录**：应用启动时自动通过 `wx.login()` 获取 `code` 换取 `access_token`
- **单例防重复**：使用 `tokenPromise` 全局变量防止并发获取 Token
- **自动续期**：请求发现无 Token 时自动调用 `getToken()`
- **请求头注入**：`access-token` 和 `app-alias` 自动附加到请求头

### 9.6 业务错误码体系

| 错误码 | 含义 | 处理方式 |
|--------|------|---------|
| `0` | 请求成功 | 正常处理 |
| `405` | 后台系统错误 | 弹出模态框提示 |
| `40000~41000` | 登录态异常 | 清除登录信息 → 跳转登录页 |

### 9.7 文件上传

```javascript
// 单文件上传
const result = await UploadUtil.uploadImage(tempFilePath, formData)

// 批量上传（并行）
const results = await UploadUtil.uploadImages(pathList, formData)

// 底层上传
const res = await NetworkUtil.upload({
    url: "/upload/image",
    path: tempFilePath,
    name: "image",
    params: {},
})
```

---

## 十、工具函数体系

### 10.1 工具函数分类

| 模块 | 职责 | 核心方法 |
|------|------|---------|
| `Config.js` | 环境配置与业务常量 | `ENV`、`BASE_URL`、`mainColor` |
| `Constant.js` | 存储键名等纯常量 | `STORAGE_KEY_*`、`COLOR` |
| `NetworkUtil.js` | 网络请求封装 | `get`、`post`、`upload`、`getToken` |
| `LoginUtil.js` | 登录逻辑 | `isLogin`、`saveLoginData`、`logout`、`getUserInfo` |
| `StorageUtil.js` | 本地存储管理 | `clearLoginData` |
| `RouteUtil.js` | 路由与导航 | `slideItemClicks`、`previousPage`、`navigateBack` |
| `PageUtil.js` | 分页数据处理 | `getListData` |
| `ImageUtil.js` | 图片选择与保存 | `chooseImage`、`saveImage` |
| `FileUtil.js` | 文件操作 | `chooseFile`、`downloadFile`、`openFile` |
| `UploadUtil.js` | 文件上传 | `uploadImage`、`uploadImages`、`uploadFile` |
| `ViewUtil.js` | 视图测量与转换 | `measureView`、`rpx2px`、`px2rpx` |
| `PermissionUtil.js` | 权限申请 | `requestLocationPermission` |
| `DateTimeUtil.js` | 日期时间处理 | `format`、`getWeekDayStr`、`deadlineFormat` |
| `Util.js` | 通用工具 | `throttle`、`debounce` |
| `JSUtil.js` | JS 基础工具 | `parseUrl`、`isEmptyObject`、`isEmptyArray` |
| `BitFlagUtil.js` | 位运算 | `isEnabled` |
| `QRCodeUtil.js` | 二维码解析 | `parseScene`、`getNormalQRCodeParams` |
| `AppUtil.js` | 应用管理 | `checkUpdate` |
| `WxNotificationCenter.js` | 事件总线 | `addNotification`、`postNotificationName`、`removeNotification` |
| `MockData.js` | Mock 数据 | 开发阶段模拟数据 |

### 10.2 工具函数设计原则

1. **单一职责**：每个文件只处理一个功能域
2. **纯函数优先**：工具函数尽量无副作用
3. **Promise 封装**：所有异步操作返回 Promise
4. **统一导出**：使用 `module.exports` 导出模块对象
5. **参数注释**：使用 JSDoc 标注每个参数的类型和说明

---

## 十一、状态与存储管理

### 11.1 本地存储 Key 管理

所有存储 Key 统一在 `Constant.js` 中定义：

```javascript
module.exports = {
    COLOR: {
        MAIN: '#74874F',
    },
    STORAGE_KEY_ACCESS_TOKEN: 'access_token',
    STORAGE_KEY_MOBILE: 'mobile',
    STORAGE_KEY_USER_INFO: 'user_info',
}
```

### 11.2 存储操作规范

- ✅ 写入：`wx.setStorageSync(Constant.STORAGE_KEY_XXX, value)`
- ✅ 读取：`wx.getStorageSync(Constant.STORAGE_KEY_XXX)`
- ✅ 删除：`wx.removeStorageSync(Constant.STORAGE_KEY_XXX)`
- ❌ 禁止硬编码 Key 字符串

### 11.3 登录状态管理

```javascript
// 保存登录信息
LoginUtil.saveLoginData(res)

// 判断登录状态（自动跳转登录页）
if (!LoginUtil.isLogin()) return

// 判断登录状态（不跳转）
if (!LoginUtil.isLogin({ route: false })) { ... }

// 清除登录信息
LoginUtil.clearLoginData()

// 获取用户信息（带缓存）
const userInfo = await LoginUtil.getUserInfo()

// 强制刷新用户信息
const userInfo = await LoginUtil.getUserInfo(true)
```

### 11.4 跨页面通信

使用 `WxNotificationCenter` 实现事件总线模式：

```javascript
const WxNotificationCenter = require("@/utils/WxNotificationCenter")

// 注册监听
WxNotificationCenter.addNotification("refresh_list", (info) => {
    this.loadData()
}, this)

// 发送通知
WxNotificationCenter.postNotificationName("refresh_list", { id: 123 })

// 移除监听（页面卸载时必须调用）
onUnload() {
    WxNotificationCenter.removeNotification("refresh_list", this)
}
```

---

## 十二、路由与导航规范

### 12.1 导航方式

| API | 场景 | 说明 |
|-----|------|------|
| `wx.navigateTo` | 常规页面跳转 | 保留当前页，可返回 |
| `wx.redirectTo` | 页面替换 | 关闭当前页 |
| `wx.reLaunch` | 重启应用 | 关闭所有页面，如退出登录 |
| `wx.navigateBack` | 返回上一页 | `delta` 指定返回层级 |
| `wx.switchTab` | 切换 Tab | 仅适用于 TabBar 页面 |

### 12.2 安全返回

使用 `RouteUtil.navigateBack()` 代替原生 `wx.navigateBack()`，当栈底时自动跳首页：

```javascript
RouteUtil.navigateBack()
```

### 12.3 页面间传参

```javascript
// 跳转传参
wx.navigateTo({
    url: `/pages/others/article/article?alias=${item.type_item_alias}`
})

// 复杂参数需编码
wx.navigateTo({
    url: `/pages/others/login/login?redirect_url=${encodeURIComponent(url)}&redirect_options=${encodeURIComponent(JSON.stringify(options))}`
})

// 接收参数
onLoad(options) {
    const alias = options.alias
    const redirect_url = decodeURIComponent(options.redirect_url)
}
```

### 12.4 WebView 页面

统一使用 `webview` 页面打开外部链接：

```javascript
wx.navigateTo({
    url: '/pages/others/webview/webview?url=' + encodeURIComponent(item.url)
})
```

### 12.5 登录重定向

```javascript
// 需要登录的页面
if (!LoginUtil.isLogin()) return

// 登录成功后返回原页面
handleLoginSuccess(res) {
    LoginUtil.saveLoginData(res)
    if (this.data.redirect_url) {
        RouteUtil.previousPage().onLoad(this.data.redirect_options)
        wx.navigateBack({ delta: 1 })
    } else {
        wx.reLaunch({ url: '/pages/homepage/homepage' })
    }
}
```

---

## 十三、环境与配置管理

### 13.1 多环境配置

在 `Config.js` 中定义三套环境：

```javascript
// 测试环境
const develop = {
    NAME: 'develop',
    DOMAIN: 'https://dev.example.com',
    BASE_URL: 'https://dev-api.example.com',
    APP_ALIAS: 'myapp_dev',
}

// UAT 环境
const trial = {
    NAME: 'trial',
    DOMAIN: 'https://uat.example.com',
    BASE_URL: 'https://uat-api.example.com',
    APP_ALIAS: 'myapp_uat',
}

// 生产环境
const release = {
    NAME: 'release',
    DOMAIN: 'https://www.example.com',
    BASE_URL: 'https://api.example.com',
    APP_ALIAS: 'myapp',
}

// 切换环境只需修改此行
const ENV = develop
```

### 13.2 环境提示

非生产环境自动弹出环境提示 Toast：

```javascript
showEnvToast() {
    if (Config.ENV.NAME !== "release") {
        wx.showToast({
            title: `当前处于${Config.ENV.NAME}环境`,
            icon: "none",
        })
    }
}
```

### 13.3 业务配置项

统一在 `Config.js` 中管理：

```javascript
module.exports = {
    ENV: ENV,
    BASE_URL: ENV.BASE_URL,
    APP_ALIAS: ENV.APP_ALIAS,

    umengConfig: '',                    // 友盟 Key
    mainColor: '#000000',               // 主色调
    pageSize: 20,                       // 每页请求数量

    // 短信相关
    SMS_TYPE_LOGIN_LOGIN: 3,
    SMS_TYPE_LOGIN_REGISTER: 6,
    SMS_COUNTDOWN_TIME: 60,
    LOGIN_TYPE_BY_SMS_CODE: 2,

    // 文章别名
    ARTICLE_REGISTER_AGREEMENT: '',
    ARTICLE_PRIVACY_RULES: '',
}
```

---

## 十四、第三方库集成规范

### 14.1 TDesign 组件

- 在 `page.json` 或 `component.json` 中按需引入：
  ```json
  {
    "usingComponents": {
      "t-dialog": "tdesign-miniprogram/dialog/dialog",
      "t-icon": "tdesign-miniprogram/icon/icon",
      "t-empty": "tdesign-miniprogram/empty/empty"
    }
  }
  ```

- 主题色覆盖统一在 `styles/t-design/t-design.less`：
  ```less
  page {
    --td-brand-color: @mainColor;
    --td-brand-color-active: @mainColor;
  }
  ```

- 组件样式定制在 `styles/t-design/` 下按组件创建独立文件

### 14.2 dayjs

- 通过 `require('dayjs')` 引入
- 插件统一放在 `utils/dayjs/plugin/` 目录
- 按需加载插件：
  ```javascript
  const dayjs = require('dayjs')
  const duration = require('@/utils/dayjs/plugin/duration')
  dayjs.extend(duration)
  ```

### 14.3 友盟统计

- 在 `app.js` 中通过 `import 'umtrack-wx'` 引入
- 配置项在 `App()` 的 `umengConfig` 中定义

---

## 十五、性能优化规范

### 15.1 编译优化

- ✅ 启用 `lazyCodeLoading: "requiredComponents"` 按需加载组件
- ✅ 启用 `ignoreUploadUnusedFiles: true` 上传时忽略未使用的文件
- ✅ 启用代码压缩 `minified: true`、`minifyWXSS: true`、`minifyWXML: true`

### 15.2 请求优化

- **防重复请求**：PageUtil 使用 `isRequesting` 标志位防止并发请求
- **Token 单例**：NetworkUtil 使用 `tokenPromise` 防止并发获取 Token
- **按需 Loading**：仅在需要时传入 `loadingText` 参数

### 15.3 渲染优化

- **最小化 setData**：只更新需要变化的数据字段
- **长列表优化**：使用分页加载（`PageUtil.getListData`），避免一次性渲染大量数据
- **WXS 脚本**：将数据转换逻辑放入 WXS，减少 JS ↔ 渲染层通信

### 15.4 分包加载

大型项目采用分包结构，减小主包体积：

```json
{
  "subpackages": [
    { "root": "packageActivity", "pages": [...] },
    { "root": "packageGoods", "pages": [...] }
  ]
}
```

### 15.5 版本更新

使用 `AppUtil.checkUpdate()` 在启动时检查更新：

```javascript
async init(options) {
    AppUtil.checkUpdate()
    // ...
}
```

---

## 十六、安全规范

### 16.1 Token 安全

- 每次应用启动重新获取 Token，不持久化旧 Token
- Token 异常（`40000~41000`）时自动清除登录态并跳转登录页
- Token 仅通过请求头 `access-token` 传递，不放入 URL 参数

### 16.2 用户隐私

- 登录页面必须展示用户协议和隐私政策勾选
- 未勾选时使用透明遮罩层拦截按钮点击
- 使用 `wx.openPrivacyContract()` 打开隐私协议

### 16.3 权限申请

- 使用 `PermissionUtil` 分层检查权限：
  1. 系统级权限（如系统定位开关）
  2. 应用级权限（如微信定位权限）
  3. 小程序级权限（如用户授权）
- 权限拒绝后引导用户手动开启设置

### 16.4 参数安全

- URL 参数需编码：`encodeURIComponent()`
- 敏感数据不在 URL 中传递
- 接口参数统一通过 `buildParams()` 附加公共参数

---

## 十七、Git 与协作规范

### 17.1 提交信息

- **所有 Git 提交记录必须使用中文**
- 推荐格式：`类型: 描述`

| 类型 | 说明 | 示例 |
|------|------|------|
| 新增 | 新功能 | `新增: 首页轮播图组件` |
| 修复 | Bug 修复 | `修复: 登录页面验证码发送失败问题` |
| 优化 | 性能/体验优化 | `优化: 列表页分页加载逻辑` |
| 重构 | 代码重构 | `重构: 网络请求模块迁移至 async/await` |
| 样式 | 样式调整 | `样式: 登录页面适配暗色模式` |
| 文档 | 文档更新 | `文档: 更新开发规范` |
| 配置 | 构建/配置变更 | `配置: 新增 UAT 环境配置` |

### 17.2 .gitignore

```
.eslintrc.js
sitemap.json
.idea/
node_modules/
.DS_Store
```

### 17.3 代码审查清单

- [ ] 所有颜色是否使用 Less 变量
- [ ] 异步操作是否使用 `async/await`
- [ ] 网络请求是否使用 `NetworkUtil`
- [ ] 注释是否为中文
- [ ] 存储 Key 是否在 `Constant.js` 中定义
- [ ] 事件监听是否在 `onUnload` 中移除
- [ ] 文件命名是否符合规范
- [ ] 是否处理了错误和边界情况

---

## 附录：文件模板

### A. 新页面模板 (JS)

```javascript
// pages/moduleName/pageName.js
const Config = require("@/utils/Config")
const NetworkUtil = require("@/utils/NetworkUtil")

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

### B. 新页面模板 (WXML)

```html
<!--pages/moduleName/pageName.wxml-->
<view class="container">
    <!-- 页面内容 -->
</view>
```

### C. 新页面模板 (Less)

```less
/* pages/moduleName/pageName.less */
.container {
  // 页面样式
}
```

### D. 新页面模板 (JSON)

```json
{
  "usingComponents": {},
  "enablePullDownRefresh": false
}
```

### E. 新组件模板 (JS)

```javascript
// components/component-name/component-name.js
Component({
    /** 组件的属性列表 */
    properties: {},

    /** 组件的初始数据 */
    data: {},

    /** 组件的方法列表 */
    methods: {},
})
```

### F. 新组件模板 (JSON)

```json
{
  "component": true,
  "usingComponents": {}
}
```

---

> 📌 **本规范基于 `miniapp-starter` 项目模板提炼，适用于公司内所有微信小程序项目。团队成员应在开发前通读本规范，并在代码审查时对照执行。**
