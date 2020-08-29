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
                            return m('tr', { class: 'has-text-level-2 body-4 pb-3' }, [
                                m('td.py-4', {}, [items.category]),
                                m('td.px-8.py-4', {}, [items.type]),
                                m('td.px-8.py-4', {}, [items.num]),
                                m('td.px-8.py-4', {}, [items.ServiceCharge]),
                                m('td.px-8.py-4', {}, [items.state]),
                                m('td.px-8.py-4', {}, [items.time]),
                                m('td.pl-8.py-4', { class: 'tbodytd' }, [items.remarks])
                            ]);
                        }),
                        vnode.attrs.grossValue.map((item, index) => {
                            return [
                                m('tr', { class: 'body-4' }, [
                                    m('td.py-4', {}, [item.wType]),
                                    m('td.px-8.py-4', {}, [item.status]),
                                    m('td.px-8.py-4', {}, [item.num]),
                                    m('td.px-7.py-4', {}, [item.num]),
                                    m('td.px-7.py-4', {}, [item.stat]),
                                    m('td.px-8.py-4', {}, [item.time]),
                                    m('td.pl-8.py-4.has-text-primary', {
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