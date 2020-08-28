const m = require('mithril');
const accountTable = require('../assetRecords/accountTable');
const commonSelectionBox = require('../assetRecords/commonSelectionBox');
const assetTable = require('./assetTable.model');

module.exports = {
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-assetTableView px-4' }, [
            m('div', { class: 'views-pages-Myassets-assetRecords-contractAccount' }, [
                m('div', { class: 'views-pages-Myassets-assetRecords-assetTableView-wrapper' }, [
                    m('div', { class: 'cursor-pointer mb-7 columns-flex-warp views-pages-Myassets-assetRecords-assetTableView-wrapper-head ' }, [
                        m('div', {
                            class: "cursor-pointer mr-7" + (assetTable.switchValue === '01' ? ' has-text-primary header-highlight' : ''),
                            onclick: function () {
                                assetTable.switchValue = '01';
                                m.redraw();
                            }
                        }, ['合约账户']),
                        m('div', {
                            class: "cursor-pointer mr-7" + (assetTable.switchValue === '02' ? ' has-text-primary header-highlight' : ''),
                            onclick: function () {
                                assetTable.switchValue = '02';
                                m.redraw();
                            }
                        }, ['币币账户']),
                        m('div', {
                            class: "cursor-pointer" + (assetTable.switchValue === '04' ? ' has-text-primary header-highlight' : ''),
                            onclick: function () {
                                assetTable.switchValue = '04';
                                m.redraw();
                            }
                        }, ['法币账户'])
                    ]),
                    // m(commonSelectionBox),
                    m('div', { class: 'views-pages-Myassets-assetRecords-contractAccount' }, [
                        m(commonSelectionBox, { num: assetTable.switchValue }),
                        m(accountTable, { num: assetTable.switchValue })
                    ])
                ])
            ])
        ]);
    }
};