const m = require("mithril");
const Dropdown = require('./dropdown.model');
require('./dropdown.scss');
/**
 * 下拉列表
 * @type {{view(vnode): *}}
 * vnode.attrs {
 *     id: 'id', 下拉列表id
 *     isActive: ture, 显示下拉
 *     list: [ 下拉列表
 *         {
 *             isActive: true, 选中
 *             value: '', 显示的值
 *             ... 扩展
 *         },
 *         ...
 *     ],
 *     onchange(val) { 选中回调 val: list中的item
 *
 *     },
 * }
 */
module.exports = {
    view(vnode) {
        const dropdownList = [];
        let activeValue = '';
        for (const item of vnode.attrs.list) {
            if (item.isActive) {
                activeValue = item.value;
            }
            dropdownList.push(m('a.dropdown-item.pl-7.py-3.pr-0', {
                class: item.isActive ? 'is-active' : '',
                onclick: e => {
                    Dropdown.show = false;
                    vnode.attrs.onchange(item);
                    Dropdown.stopFunc(e);
                }
            }, item.value));
        }

        return m('div.dropdown.common-dropdown', {
            class: `${vnode.attrs.isActive ? 'is-active' : ''} ${vnode.attrs.class}`
        }, [
            m('div.dropdown-trigger.w100', {}, [
                m('button.button.w100.has-text-left', {
                    'aria-haspopup': true,
                    'aria-controls': vnode.attrs.id,
                    onclick: e => {
                        vnode.attrs.onActive();
                        Dropdown.stopFunc(e);
                    }
                }, [
                    m('span.w100', {}, [activeValue]),
                    m('span.icon.is-small', { 'aria-hidden': true }, [
                        m('i.iconfont.icon-xiala')
                    ])
                ])
            ]),
            m('div.dropdown-menu', {
                id: vnode.attrs.id,
                role: 'menu'
            }, [
                m('div.dropdown-content.pa-0', {}, dropdownList)
            ])
        ]);
    }
};