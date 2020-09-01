const m = require('mithril');
const AreaCodeSelect = require('./areaCodeSelect.model');
const I18n = require('@/languages/I18n').default;

import('./areaCodeSelect.css');

module.exports = {
    oninit(vnode) {
        AreaCodeSelect.oninit(vnode);
    },
    onupdate(vnode) {
        AreaCodeSelect.onupdate(vnode);
    },
    onremove(vnode) {
        AreaCodeSelect.onremove(vnode);
    },
    view(vnode) {
        const list = [];
        for (const item of AreaCodeSelect.showList) {
            list.push(m('div.dropdown-item.columns.px-5.py-2', {
                onclick: e => { AreaCodeSelect.itemClick(vnode, item); }
            }, [
                m('div.column.pa-0', {}, [I18n.getLocale() === "zh" ||
                I18n.getLocale() === "tw" ? item.cn_name : item.us_name]),
                m('div.column.has-text-right.pa-0', {}, [`+${item.code}`])
            ]));
        }
        return m('div.dropdown', { class: AreaCodeSelect.show ? 'is-active' : '' }, [
            m('div.dropdown-trigger', {}, [
                m('button.button.without-border.area-code-select-national-select', {
                    'aria-haspopup': true,
                    'aria-controls': 'views-pages-register-area-code-dropdown-menu',
                    id: 'views-pages-register-area-code-dropdown-button',
                    onclick: e => {
                        AreaCodeSelect.show = !AreaCodeSelect.show;
                        AreaCodeSelect.stopFunc(e);
                    }
                }, [
                    m('span', {}, [`+${vnode.attrs.areaCode}`]),
                    m('span.icon.is-small', {}, [
                        m('i.iconfont.icon-xiala', {
                            'aria-hidden': true
                        }, [])
                    ])
                ])
            ]),
            m('div.dropdown-menu', {
                id: 'views-pages-register-area-code-dropdown-menu',
                role: 'menu',
                onclick: e => {
                    AreaCodeSelect.stopFunc(e);
                }
            }, [
                m('div.dropdown-content.pa-0.views-page-login-area-code-select-box', {},
                    m('div.pa-5', {}, [
                        m('div.control.has-icons-left', {}, [
                            m('span.icon.is-left.area-code-select-search-icon', {}, [
                                m('i.iconfont.icon-Search', {}, [])
                            ]),
                            m('input.input', {
                                placeholder: '搜索',
                                oninput: e => {
                                    AreaCodeSelect.search = e.target.value;
                                    AreaCodeSelect.showList = AreaCodeSelect.showList = vnode.attrs.selectList.filter(
                                        item => {
                                            return AreaCodeSelect.listFilter(item);
                                        }
                                    );
                                },
                                value: AreaCodeSelect.search
                            }, [])
                        ])
                    ]),
                    m('div.views-page-login-area-code-select-content', {}, list)
                )
            ])
        ]);
    }
};