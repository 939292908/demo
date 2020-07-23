# website-project

> A mithril.js project


## Build Setup

``` bash
# install dependencies
npm install

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

### CSS相关
* 各模块内class类名命名规则按照目录进行命名，不能出现重复命名；
* 各模块内不能直接写`color`、`background-color`、`border-color`、`margin`、`padding`、`border-radius`、`font-size`、`font-weight`、`box-shadow`，统一使用规范内相应的类名；

### JS相关
* 各模块使用统一模版；  

```js
let m = require('mithril')

const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown
    }
}

module.exports = {
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

* ；





