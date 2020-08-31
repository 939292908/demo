const m = require('mithril');
const AssetSelectBox = require('./assetSelectBox.model');
require('@/../node_modules/layui-laydate/src/theme/default/laydate.css');

module.exports = {
    oncreate (vnode) {
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
        return m('div', {
            class: vnode.attrs.class
        }, [
            m('div.columns.is-variable.is-6', {}, [
                m('div.column.is-3', {}, ['时间']),
                m('div.column.is-3', {}, ['币种']),
                m('div.column.is-3', {}, ['类型']),
                m('div.column', {}, [])
            ]),
            m('div.columns.is-variable.is-6', {}, [
                m('div.column.is-3', {}, [
                    m('.input.input[type=text]', {
                        id: 'asset-select-box-time-selector',
                        placeholder: '请选择时间',
                        required: 'required'
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
    }
};