# website-project

> A mithril.js project


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start

# serve with hot reload at localhost:8080
npm run dev

# serve for production with hot reload at localhost:8080
npm run prod

# build for development with minification
npm run build_dev

# build for production with minification
npm run build

# watch the build for production with minification
npm run watch


```

## 代码规范

### 编辑器相关

+ 统一代码缩进为 4

### CSS相关
* 各模块内class类名命名规则按照目录进行命名，不能出现重复命名；
* 各模块内不能直接写`color`、`background-color`、`border-color`、`margin`、`padding`、`border-radius`、`font-size`、`font-weight`、`box-shadow`，统一使用规范内相应的类名；

### JS相关
* 各模块使用统一模版；  

```js
const m = require('mithril')

const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown
    }
}

module.exports = {
    oninit: function(vnode) {
        _console.log("ht","initialized")
    },
    oncreate: function(vnode) {
        _console.log("ht","DOM created")
    },
    onupdate: function(vnode) {
        _console.log("ht","DOM updated")
    },
    onremove: function(vnode) {

    },
    view:  function(){
        return m('nav.navbar.is-fixed-top', {role:"navigation", "aria-label":"main navigation"}, [
            m('.navbar-brand', {}, [
                m('a.navbar-item', {}, [
                    m('img', {"src":"https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height:"28"})
                ]),
                m('a.navbar-burger.burger', {class: ""+(methods.openNavbarDropdown?" is-active":""), role:"button", "aria-label": "menu", "aria-expanded": false, "data-target": "navbarBasicExample", onclick: methods.clickNavbarOpenBtn}, [
                    m('span', {"aria-hidden": true}),
                    m('span', {"aria-hidden": true}),
                    m('span', {"aria-hidden": true}),
                ])
            ]),
            m('div#navbarBasicExample.navbar-menu', {class: ""+(methods.openNavbarDropdown?" is-active":"")}, [
                m('div.navbar-start', {}, [
                    m('a.navbar-item', {onclick:function(){
                        window.router.push('/home')
                    }}, [
                        'Home'
                    ]),
                ]),
                m('div.navbar-end', {}, [
                    m('div.navbar-item', {}, [
                        m('div.buttons', {}, [
                            m('div.button.is-primary', {}, [
                                "Sign up"
                            ]),
                            m('div.button.is-light', {}, [
                                "Log in"
                            ]),
                        ]),
                    ]),
                ]),
            ])
        ])
    }
}
```  

* 日志输入使用统一方法，详情查看[log.js](./src/log/log.js)；
* 路由的文件引用方式以及路由跳转使用使用统一方法，详情查看[route.js](./src/route/index.js)；
* 全局广播使用统一方法，详情查看[broadcast.js](./src/broadcast/broadcast.js)；
* 多语言使用统一方法，详情查看[dI18n.js](./src/languages/dI18n.js)；
* API接口调用使用统一模版，详情查看[webApi.js](./src/api/webApi.js)；
* [utils.js](./src/util/utils.js)内禁止添加全局变量，统一通过函数传参的形式引用；
* 错误码统一写在[errCode.js](./src/util/errCode.js)内；  


## 各目录内容限制

`api`目录只写Api  
assets      只能放静态资源
broadcast   全局广播
config.js   项目配置
index.html  html
index.js    入口文件
languages   多语言
libs        第三方库
log         日志文件
models      公用逻辑库，禁止放UI相关内容
route       路由
styles      公用样式
util        工具类
views       视图，





