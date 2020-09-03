const m = require('mithril');
const AssetSelectBox = require('./assetSelectBox.model');
const InputWithComponent = require('../../../components/inputWithComponent/inputWithComponent.view');
const I18n = require('@/languages/I18n').default;
require('./assetSelectBox.scss');

module.exports = {
    oncreate(vnode) {
        AssetSelectBox.oncreate(vnode);
    },
    view(vnode) {
        const coinList = [];
        coinList.push(m('option', { value: 'all' }, ['全部币种']));
        for (const item of vnode.attrs.coinList) {
            coinList.push(m('option', {}, [item]));
        }
        const typeList = [];
        for (const k in vnode.attrs.typeList) {
            typeList.push(m('option', { value: k }, [vnode.attrs.typeList[k]]));
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
                            value: vnode.attrs.dateStr
                        },
                        rightComponents: m('div..date-picker-icon', {
                            onclick: () => {
                                if (vnode.attrs.dateStr) {
                                    vnode.attrs.setDateStr('');
                                    AssetSelectBox.picker.reset();
                                } else {
                                    AssetSelectBox.picker.show();
                                }
                            }
                        }, [
                            m('i.iconfont.pr-2.iconfont-small', {
                                class: vnode.attrs.dateStr ? 'icon-Close' : 'icon-xiala'
                            })
                        ])
                    })
                ]),
                m('div.column.is-3', {}, [
                    m('div.select.w100', {}, [
                        m('select.w100', {
                            onchange: e => {
                                vnode.attrs.onSelectCoin(e.target.value);
                            },
                            value: vnode.attrs.coin
                        }, coinList)
                    ])
                ]),
                m('div.column.is-3', {}, [
                    m('div.select.w100', {}, [
                        m('select.w100', {
                            onchange: e => {
                                vnode.attrs.onSelectType(e.target.value);
                            },
                            value: vnode.attrs.type
                        }, typeList)
                    ])
                ]),
                m('div.column', {}, [])
            ])
        ]);
    },
    onremove() {
        AssetSelectBox.onremove();
    }
};