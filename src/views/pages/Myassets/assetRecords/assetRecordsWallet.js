const m = require('mithril');
const commonSelectionBox = require('./commonSelectionBox');
const assetRecordsTable = require('@/models/assetRecords/assetRecordsTable');

module.exports = {
    oninit () {
        assetRecordsTable.type = '03';
        assetRecordsTable.oninit();
        console.log('lm', assetRecordsTable.grossValue);
        // assetRecordsTable.dataArrObjEvent();
        console.log('lm', assetRecordsTable.dataArrObjEvent());
    },
    view () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-assetRecordsWallet mt-7 px-4' }, [
            m(commonSelectionBox, { num: '03' }),
            m('div', {}, [
                // m('table', { class: 'mb-4' }, [
                //     m('tbody', { class: 'tbody' }, [
                //         assetRecordsTable.dataArrObj.map(items => {
                //             return m('tr', { class: 'has-text-level-2 border-radius-small body-4' }, [
                //                 m('td', {}, [items.category]),
                //                 m('td', {}, [items.type]),
                //                 m('td', {}, [items.num]),
                //                 m('td', {}, [items.ServiceCharge]),
                //                 m('td', {}, [items.state]),
                //                 m('td', {}, [items.time]),
                //                 m('td', { style: 'width:100px' }, [items.remarks])
                //             ]);
                //         })
                //     ])
                // ]),
                m('table', {}, [
                    m('tbody', { class: 'tbody' }, [
                        assetRecordsTable.dataArrObj.map(items => {
                            return m('tr', { class: 'has-text-level-2 border-radius-small body-4' }, [
                                m('td', {}, [items.category]),
                                m('td', {}, [items.type]),
                                m('td', {}, [items.num]),
                                m('td', {}, [items.ServiceCharge]),
                                m('td', {}, [items.state]),
                                m('td', {}, [items.time]),
                                m('td', { style: 'width:100px' }, [items.remarks])
                            ]);
                        }),
                        assetRecordsTable.grossValue.map((item, index) => {
                            return m('tr', { class: 'pb-7 body-4' }, [
                                m('td', {}, [item.wType]),
                                m('td', {}, [item.status]),
                                m('td', {}, [item.num]),
                                m('td', {}, [item.num]),
                                m('td', {}, [item.stat]),
                                m('td', {}, [item.time]),
                                m('td', { class: 'has-text-primary cursor-pointer ', style: 'width:100px;' }, [
                                    m('div', { class: 'dropdown is-right is-active' }, [
                                        m('div', {
                                            class: 'dropdown-trigger',
                                            onclick: function () {
                                                assetRecordsTable.displayEvnet(index);
                                            }
                                        }, [
                                            m('span', { ariaHaspopup: 'true', ariaControls: 'dropdown-menu6' }, ['详情']),
                                            m('span', { class: 'icon is-small' }, [
                                                m('i', { class: 'fas fa-angle-down', ariaHidden: 'true' }, [])
                                            ])
                                        ]),
                                        m('div', { class: assetRecordsTable.displayValue === index && assetRecordsTable.noDisplay ? 'dropdown-menu' : 'dropdown-menu1', id: 'dropdown-menu6', role: 'menu' }, [
                                            m('div', { class: 'dropdown-content' }, [
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
                    ])
                ])
            ])
        ]);
    }
};