const m = require('mithril');
const AssetSelectBox = require('./assetSelectBox.model');
// const InputWithComponent = require('../../../components/inputWithComponent/inputWithComponent.view');
const I18n = require('@/languages/I18n').default;
const Dropdown = require('@/views/components/common/newDropdown/dropdown.view');
require('./assetSelectBox.scss');

module.exports = {
    oncreate(vnode) {
        AssetSelectBox.oncreate(vnode);
    },
    view(vnode) {
        const coinList = [];
        coinList.push({
            isActive: vnode.attrs.coin === 'all',
            value: I18n.$t('10343')/* '全部币种' */,
            key: 'all'
        });
        for (const item of vnode.attrs.coinList) {
            coinList.push({
                isActive: vnode.attrs.coin === item,
                value: item,
                key: item
            });
        }
        const typeList = [];
        for (const k in vnode.attrs.typeList) {
            typeList.push({
                isActive: vnode.attrs.type === k,
                value: vnode.attrs.typeList[k],
                key: k
            });
        }
        return m('div.assetSelectBox', {
            class: vnode.attrs.class
        }, [
            m('div.columns.is-variable.is-6', {}, [
                m('div.column.is-3', {}, [I18n.$t('10091')/* '时间' */]),
                m('div.column.is-3', {}, [I18n.$t('10063')/* '币种' */]),
                m('div.column.is-3', {}, [I18n.$t('10088')/* '类型' */]),
                m('div.column', {}, [])
            ]),
            m('div.columns.is-variable.is-6', {}, [
                m('div.column.is-3', {}, [
                    m('div.dropdown.w100', {
                        class: AssetSelectBox.dateIsActive ? 'is-active' : ''
                    }, [
                        m('div.dropdown-trigger.w100', {}, [
                            m('button.button.has-text-left.w100', {
                                'aria-haspopup': true,
                                'aria-controls': 'assetSelectBox-date-dropdown-list',
                                onclick: e => {
                                    AssetSelectBox.openDate(vnode, e);
                                }
                            }, [
                                m('span.w100', {}, [AssetSelectBox.date]),
                                m('span.icon.is-small', { 'aria-hidden': true }, [
                                    m('i.iconfont.icon-xiala.iconfont-small')
                                ])
                            ])
                        ]),
                        m('div.dropdown-menu', {
                            id: 'assetSelectBox-date-dropdown-list',
                            role: 'menu'
                        }, [
                            m('div.dropdown-content.pa-0', {}, [
                                m('input', {
                                    id: 'asset-select-box-time-selector',
                                    style: 'display:none',
                                    autocomplete: "off",
                                    oninput: e => {},
                                    value: AssetSelectBox.date
                                }, [])
                            ])
                        ])
                    ])
                ]),
                m('div.column.is-3', {}, [
                    m(Dropdown, {
                        id: 'assetSelectBox-coin-dropdown-list',
                        class: 'w100',
                        isActive: AssetSelectBox.coinIsActive,
                        list: coinList,
                        onchange: item => {
                            AssetSelectBox.coinIsActive = false;
                            AssetSelectBox.dateIsActive = false;
                            vnode.attrs.onSelectCoin(item.key);
                        },
                        onActive: () => {
                            AssetSelectBox.typeIsActive = false;
                            AssetSelectBox.dateIsActive = false;
                            AssetSelectBox.coinIsActive = !AssetSelectBox.coinIsActive;
                        }
                    })
                ]),
                m('div.column.is-3', {}, [
                    m(Dropdown, {
                        id: 'assetSelectBox-type-dropdown-list',
                        class: 'w100',
                        isActive: AssetSelectBox.typeIsActive,
                        list: typeList,
                        onchange: item => {
                            AssetSelectBox.typeIsActive = false;
                            AssetSelectBox.dateIsActive = false;
                            vnode.attrs.onSelectType(item.key);
                        },
                        onActive: () => {
                            AssetSelectBox.coinIsActive = false;
                            AssetSelectBox.dateIsActive = false;
                            AssetSelectBox.typeIsActive = !AssetSelectBox.typeIsActive;
                        }
                    })
                ]),
                m('div.column', {}, [
                    m("button.button.is-primary.font-size-2.has-text-white.modal-default-btn.button-large.mr-4.btn-width", {
                        onclick () { vnode.attrs.onSearch(); }
                    }, [I18n.$t('10593')/* "查询" */]),
                    m("button.button.is-primary.is-outlined.font-size-2.button-large.has-text-primary.btn-width", {
                        onclick () {
                            AssetSelectBox.date = '';
                            vnode.attrs.onClean();
                        }
                    }, [I18n.$t('10345')/* '清除' */])
                ])
            ])
        ]);
    },
    onremove() {
        AssetSelectBox.onremove();
    }
};