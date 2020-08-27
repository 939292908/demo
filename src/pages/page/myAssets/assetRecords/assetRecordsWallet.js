const m = require('mithril');
const commonSelectionBox = require('./commonSelectionBox');
const assetRecordsTable = require('@/models/assetRecords/assetRecordsTable');

module.exports = {
    oninit () {
        assetRecordsTable.type = '03';
        assetRecordsTable.oninit();
        console.log('lm', assetRecordsTable.grossValue);
        console.log(assetRecordsTable.datadisplayvalue);
    },
    view () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-assetRecordsWallet mt-7 px-4' }, [
            m(commonSelectionBox, { num: '03' }),
            m('div', {}, [
                m('table', { style: 'height:436px;width: 100%;' }, [
                    m('tbody', { class: (assetRecordsTable.datadisplayvalue === 1 ? '' : 'datadisplay') + ' tbody' }, [
                        assetRecordsTable.dataArrObj.map(items => {
                            return m('tr', { class: 'has-text-level-2 body-4 pb-3' }, [
                                m('td', {}, [items.category]),
                                m('td.px-8 pb-4', {}, [items.type]),
                                m('td.px-8 pb-4', {}, [items.num]),
                                m('td.px-7 pb-4', {}, [items.ServiceCharge]),
                                m('td.px-7 pb-4', {}, [items.state]),
                                m('td.px-8 pb-4', {}, [items.time]),
                                m('td', { class: 'tbodytd' }, [items.remarks])
                            ]);
                        }),
                        assetRecordsTable.grossValue.map((item, index) => {
                            return m('tr', { class: 'body-4' }, [
                                m('td', {}, [item.wType]),
                                m('td.px-8 pb-7', {}, [item.status]),
                                m('td.px-8 pb-7', {}, [item.num]),
                                m('td.px-7 pb-7', {}, [item.num]),
                                m('td.px-7 pb-7', {}, [item.stat]),
                                m('td.px-8 pb-7', {}, [item.time]),
                                m('td', { class: 'has-text-primary cursor-pointer tbodytd' }, [
                                    m('div', { class: 'dropdown is-right is-active' }, [
                                        m('div', {
                                            class: 'dropdown-trigger',
                                            onclick: function () {
                                                assetRecordsTable.displayEvnet(index);
                                            }
                                        }, [
                                            m('span', { ariaHaspopup: 'true', ariaControls: 'dropdown-menu6' }, ['详情']),
                                            m('span', { class: '' }, [
                                                m('i', { class: 'iconfont ' + (assetRecordsTable.displayValue === index && assetRecordsTable.noDisplay ? 'icon-xiala' : 'icon-xiala'), ariaHidden: 'true' })
                                            ])
                                        ]),
                                        m('div', { class: assetRecordsTable.displayValue === index && assetRecordsTable.noDisplay ? 'dropdown-menu' : 'dropdown-menu1', id: 'dropdown-menu6', role: 'menu' }, [
                                            m('div', { class: 'dropdown-content', style: 'width:1170px' }, [
                                                m('div', { class: 'dropdown-item' }, [
                                                    m('div', { class: '' }, [
                                                        m('div', { class: 'mb-3' }, [
                                                            m('span', { class: 'pr-7' }, ['提币地址:']),
                                                            m('span', {}, ['链类型:' + item.wType])
                                                        ]),
                                                        m('div', {}, [
                                                            m('span', { class: 'pr-7' }, ['提币地址:']),
                                                            m('span', {}, ['链类型:' + item.wType])
                                                        ])
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ])
                                ])
                            ]);
                        })
                    ]),
                    m('div', { class: assetRecordsTable.datadisplayvalue === 0 ? 'disdatadisplay' : 'datadisplay' + ' ' }, ['暂无数据'])
                ])
            ])
        ]);
    }
};