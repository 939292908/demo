const m = require('mithril');
const apiLines = require('@/models/network/lines.js');
const header = require('./header.logic.js');

module.exports = {
    oncreate: function() {
        // 初始化线路数据
        apiLines.initLines();
    },
    view: function () {
        return m('nav.navbar.is-fixed-top.theme--darken.body-5', {
            role: "navigation",
            "aria-label": "main navigation",
            class: "has-bg-sub-level-1"
        }, [
            m('.navbar-brand', {}, [
                m('a.navbar-item.cursor-pointer', {
                    onclick: function () {
                        window.open('/w/', '_self');
                    }
                }, [
                    m('svg.icon.header-logo', { "aria-hidden": true }, [
                        m('use', { "xlink:href": "#icon-white-logo" })
                    ])
                ]),
                m('a.navbar-burger.burger', {
                    class: "" + (header.openNavbarDropdown ? " is-active" : ""),
                    role: "button",
                    "aria-label": "menu",
                    "aria-expanded": false,
                    "data-target": "navbarBasicExample",
                    onclick: header.clickNavbarOpenBtn
                }, [
                    m('span', { "aria-hidden": true }),
                    m('span', { "aria-hidden": true }),
                    m('span', { "aria-hidden": true })
                ])
            ]),
            // 未登录样式  pc
            m('div#navbarBasicExample.navbar-menu', { class: '' + (header.openNavbarDropdown ? " is-active" : "") }, [
                m('div.navbar-start', {}, []),
                m('div.navbar-end.mr-3', {}, [])
            ])
        ]);
    }
};