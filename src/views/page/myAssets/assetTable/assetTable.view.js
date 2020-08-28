const m = require('mithril');
const assetTableList = require('../assetTableList/assetTableList.view');
const commonSelectionBox = require('../commonSelectionBox/commonSelectionBox.view');

module.exports = {
    view: function (vnode) {
        return m('div', { class: 'views-pages-Myassets-assetRecords-assetTableView px-4' }, [
            m('div', { class: 'views-pages-Myassets-assetRecords-contractAccount' }, [
                m('div', { class: 'views-pages-Myassets-assetRecords-assetTableView-wrapper' }, [
                    m('div', { class: 'cursor-pointer mb-7 columns-flex-warp views-pages-Myassets-assetRecords-assetTableView-wrapper-head ' }, [
                        m('div', {
                            class: "cursor-pointer mr-7" + (vnode.attrs.switchValue === '01' ? ' has-text-primary header-highlight' : ''),
                            onclick: function () {
                                vnode.attrs.onSwitchValue('01');
                            }
                        }, ['合约账户']),
                        m('div', {
                            class: "cursor-pointer mr-7" + (vnode.attrs.switchValue === '02' ? ' has-text-primary header-highlight' : ''),
                            onclick: function () {
                                vnode.attrs.onSwitchValue('02');
                            }
                        }, ['币币账户']),
                        m('div', {
                            class: "cursor-pointer" + (vnode.attrs.switchValue === '04' ? ' has-text-primary header-highlight' : ''),
                            onclick: function () {
                                vnode.attrs.onSwitchValue('04');
                            }
                        }, ['法币账户'])
                    ]),
                    // m(commonSelectionBox),
                    m('div', { class: 'views-pages-Myassets-assetRecords-contractAccount' }, [
                        m(commonSelectionBox, { num: vnode.attrs.switchValue }),
                        m(assetTableList, { num: vnode.attrs.switchValue })
                    ])
                ])
            ])
        ]);
    }
};