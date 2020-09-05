const m = require('mithril');
const AssetSelectBox = require('./assetSelectBox.model');
const InputWithComponent = require('../../../components/inputWithComponent/inputWithComponent.view');
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
            value: '全部币种',
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
                    m(InputWithComponent, {
                        hiddenLine: true,
                        options: {
                            id: 'asset-select-box-time-selector',
                            autocomplete: "off",
                            oninput: e => {},
                            value: AssetSelectBox.date
                        },
                        rightComponents: m('div..date-picker-icon', {
                            onclick: () => {
                                if (AssetSelectBox.date) {
                                    AssetSelectBox.date = '';
                                    AssetSelectBox.picker.reset();
                                } else {
                                    AssetSelectBox.picker.show();
                                }
                            }
                        }, [
                            m('i.iconfont.pr-2.iconfont-small', {
                                class: AssetSelectBox.date ? 'icon-Close' : 'icon-xiala'
                            })
                        ])
                    })
                ]),
                m('div.column.is-3', {}, [
                    m(Dropdown, {
                        id: 'assetSelectBox-icon-dropdown-list',
                        class: 'w100',
                        isActive: AssetSelectBox.iconIsActive,
                        list: coinList,
                        onchange: item => {
                            AssetSelectBox.iconIsActive = false;
                            vnode.attrs.onSelectCoin(item.key);
                        },
                        onActive: () => {
                            AssetSelectBox.typeIsActive = false;
                            AssetSelectBox.iconIsActive = !AssetSelectBox.iconIsActive;
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
                            vnode.attrs.onSelectType(item.key);
                        },
                        onActive: () => {
                            AssetSelectBox.iconIsActive = false;
                            AssetSelectBox.typeIsActive = !AssetSelectBox.typeIsActive;
                        }
                    })
                ]),
                m('div.column', {}, [])
            ])
        ]);
    },
    onremove() {
        AssetSelectBox.onremove();
    }
};