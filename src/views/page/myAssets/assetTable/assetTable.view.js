const m = require('mithril');
const commonSelectionBox = require('../commonSelectionBox/commonSelectionBox.view');
const accountSelect = require('@/models/asset/accountSelect');

module.exports = {
    view: function (vnode) {
        return m('div', { class: 'views-pages-Myassets-assetRecords-assetTableView px-4' }, [
            m('div', { class: 'views-pages-Myassets-assetRecords-contractAccount' }, [
                m('div', { class: 'views-pages-Myassets-assetRecords-assetTableView-wrapper' }, [
                    m('div', { class: 'cursor-pointer mb-7 columns-flex-warp views-pages-Myassets-assetRecords-assetTableView-wrapper-head ' }, [
                        m('div', {
                            class: "cursor-pointer mr-7" + (accountSelect.getAccount() === '01' ? ' has-text-primary header-highlight' : ''),
                            onclick: function () {
                                accountSelect.setAccount('01');
                                vnode.attrs.changeSelect();
                            }
                        }, ['合约账户']),
                        m('div', {
                            class: "cursor-pointer mr-7" + (accountSelect.getAccount() === '02' ? ' has-text-primary header-highlight' : ''),
                            onclick: function () {
                                accountSelect.setAccount('02');
                                vnode.attrs.changeSelect();
                            }
                        }, ['币币账户']),
                        m('div', {
                            class: "cursor-pointer" + (accountSelect.getAccount() === '04' ? ' has-text-primary header-highlight' : ''),
                            onclick: function () {
                                accountSelect.setAccount('04');
                                vnode.attrs.changeSelect();
                            }
                        }, ['法币账户'])
                    ]),
                    // m(commonSelectionBox),
                    m('div', { class: 'views-pages-Myassets-assetRecords-contractAccount' }, [
                        m(commonSelectionBox, { num: accountSelect.getAccount() }),
                        m('div', { class: 'views-pages-Myassets-assetRecords-myWalletTable' }, [
                            m('div', {}, [
                                m('table', { style: 'height:436px;width: 100%;' }, [
                                    m('tbody', { class: (vnode.attrs.datadisplayvalue === 1 ? '' : 'datadisplay ') + 'tbody' }, [
                                        vnode.attrs.dataArrObj.map(items => {
                                            return m('tr', { class: 'has-text-level-2 body-4 pb-3' }, [
                                                m('td', {}, [items.category]),
                                                m('td.px-8 pb-4', {}, [items.type]),
                                                m('td.px-8 pb-4', {}, [items.num]),
                                                m('td.px-7 pb-4', {}, [items.state]),
                                                m('td.px-8 pb-4', {}, [items.time]),
                                                m('td', { class: 'tbodytd' }, [items.remarks])
                                            ]);
                                        }),
                                        vnode.attrs.grossValue.map((item) => {
                                            return m('tr', { class: 'body-4' }, [
                                                m('td', {}, [item.wType]),
                                                m('td.px-8 pb-7', {}, [item.status]),
                                                m('td.px-7 pb-7', {}, [item.num]),
                                                m('td.px-7 pb-7', {}, [item.stat]),
                                                m('td.px-8 pb-7', {}, [item.time]),
                                                m('td', { class: 'tbodytd' }, ['--'])
                                            ]);
                                        })
                                    ]),
                                    m('div', { class: (vnode.attrs.datadisplayvalue === 0 ? 'disdatadisplay' : 'datadisplay') + ' ' }, ['暂无数据'])
                                ])
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    }
};