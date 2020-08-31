const m = require('mithril');
const commonSelectionBox = require('../commonSelectionBox/commonSelectionBox.view');

module.exports = {
    view(vnode) {
        return m('div', { class: 'views-pages-Myassets-assetRecords-assetRecordsWallet mt-7 px-4' }, [
            m(commonSelectionBox, { num: '03' }),
            m('div', {}, [
                m('table', { style: 'height:436px;width: 100%;' }, [
                    m('tbody', { class: (vnode.attrs.datadisplayvalue === 1 ? '' : 'datadisplay') + ' tbody' }, [
                        vnode.attrs.dataArrObj.map(items => {
                            return m('div.columns.has-text-level-3.py-4.body-4', {}, [
                                m('div.column.is-1', {}, [items.category]),
                                m('div.column.is-1', {}, [items.type]),
                                m('div.column.is-2', {}, [items.num]),
                                m('div.column.is-2', {}, [items.ServiceCharge]),
                                m('div.column.is-3', {}, [items.state]),
                                m('div.column.is-2', {}, [items.time]),
                                m('div.column.is-1.is-one-fifth', { class: 'tbodytd' }, [items.remarks])
                            ]);
                        }),
                        vnode.attrs.grossValue.map((item, index) => {
                            return [
                                m('div.columns.py-4.body-4', {}, [
                                    m('div.column.is-1', {}, [item.wType]),
                                    m('div.column.is-1', {}, [item.des]),
                                    m('div.column.is-2', {}, [item.num]),
                                    m('div.column.is-2', {}, [item.num]),
                                    m('div.column.is-3', {}, [item.status]),
                                    m('div.column.is-2', {}, [item.time]),
                                    m('div.column.is-1.has-text-primary', {
                                        onclick: function() {
                                            vnode.attrs.displayEvnet(index);
                                        }
                                    }, [
                                        m('span', { ariaHaspopup: 'true', ariaControls: 'dropdown-menu6' }, ['详情']),
                                        m('i.iconfont', {
                                            class: vnode.attrs.displayValue === index && vnode.attrs.noDisplay ? 'icon-xiala' : 'icon-xiala'
                                        }, [])
                                    ])
                                ]),
                                m('tr.has-bg-level-3', { hidden: !(vnode.attrs.displayValue === index && vnode.attrs.noDisplay) }, [
                                    m('td.px-5.body-4.has-text-level-3', { colspan: 7 }, [
                                        m('div.my-3.columns', {}, [
                                            m('div.column', {}, ['提币地址：']),
                                            m('div.column', {}, ['链类型：',
                                                m('span.has-text-level-1', {}, [item.wType])
                                            ])
                                        ]),
                                        m('div.columns.mb-3', {}, [
                                            m('div.column', {}, ['提币地址：']),
                                            m('div.column', {}, ['链类型：',
                                                m('span.has-text-level-1', {}, [item.wType])
                                            ])
                                        ])
                                    ])
                                ])
                            ];
                        }),
                        m('div', { class: vnode.attrs.datadisplayvalue === 0 ? 'disdatadisplay' : 'datadisplay' + ' ' }, ['暂无数据'])
                    ])
                ])
            ])
        ]);
    }
};