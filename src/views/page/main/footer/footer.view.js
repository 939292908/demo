const m = require('mithril');
const Tooltip = require('@/views/components/common/Tooltip/Tooltip.view');
const utils = require('@/util/utils').default;
require('@/styles/pages/footer/footer.scss');
const I18n = require("../../../../languages/I18n").default;
const logic = require("./footer.logic");

module.exports = {
    view() {
        return m('div.views-pages-home-footer pt-7', [
            m('div', { class: `container` }, [
                // 底部
                m('div', { class: `pub-footer columns py-8` }, [
                    // 左边width
                    m('div', { class: `footer-left column is-6 pr-9` }, [
                        // logo
                        m('svg.icon.footer-logo', { "aria-hidden": true }, [
                            m('use', { "xlink:href": "#icon-white-logo" })
                        ]),
                        m('p', { class: `footer-title ${utils.isMobile() ? 'ml-6' : ''}` }, [
                            // "全球区块链资产衍生品交易平台"
                            m('p', { class: `` }, I18n.$t('10031'))
                            // m('p', { class: `` }, I18n.$t('10519'))
                        ]),
                        // 社区
                        m('div', { class: `is-flex mt-7 is-between is-hidden-mobile`, style: "width: 300px" }, [
                            logic.getIconList().map((item, index) => {
                                return m('a', {
                                    class: ``,
                                    onclick() {
                                        logic.handlerMenuClick(item);
                                    },
                                    key: item.name + index
                                }, [
                                    m(Tooltip, {
                                        label: m('i', { class: `iconfont ${item.name}` }),
                                        class: 'has-text-level-2 has-text-primary-hover',
                                        content: item.img ? m('img', { class: '', src: item.img }) : "",
                                        position: 'top'
                                    })
                                ]);
                            })
                        ])
                    ]),
                    // 右边
                    m('div', { class: `footer-right column columns is-6` }, [
                        logic.getMenuList().map((item, index) => {
                            return m('div', { class: `column bottom-navigation-tab-1  ${utils.isMobile() ? 'ml-6' : ''}`, key: 'item' + index }, [
                                // 菜单标题
                                m('div', { class: `body-4 is-between ${utils.isMobile() ? 'mt-7' : ''}` }, [
                                    m('span', { class: `mb-3` }, item.label),
                                    m('span', {
                                        class: `pr-5 ${utils.isMobile() ? '' : 'is-hidden'}`,
                                        onclick() {
                                            logic.handlerMenuTitleClick(item);
                                        }
                                    }, logic.openMenuIdList.some(id => id === item.id) ? '-' : '+')
                                ]),
                                // 子菜单
                                m('ul', { class: `${logic.openMenuIdList.some(id => id === item.id) || !utils.isMobile() ? '' : 'is-hidden'}` }, item.list.map((item1, index1) => {
                                    return m('li', {
                                        class: `body-4 has-text-white  has-text-primary-hover has-text-level-2`,
                                        onclick() {
                                            logic.handlerMenuClick(item1);
                                        },
                                        key: 'item1' + index1
                                    }, [
                                        m('span.curPri', (item1.render && item1.render()) || item1.label)
                                    ]);
                                }))
                            ]);
                        })
                    ])
                ]),
                m('p', { class: `bottom-copyright is-hidden-mobile my-3` }, [
                    `©2019-2020 Vbit ${I18n.$t('10505' /** 保留所有权利 */)}`
                ])
            ])
        ]);
    }
};