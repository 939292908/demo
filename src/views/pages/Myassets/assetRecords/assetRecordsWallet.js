const m = require('mithril');
const commonSelectionBox = require('./commonSelectionBox');
const fundRecordsSelect = require('@/views/components/fundRecordsSelect');
const assetRecordsTable = require('@/models/assetRecords/assetRecordsTable');

const assetRecordsWallet = {
    assetValuation: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-myWallet-wrapper' }, [
            // m('div', { class: 'cursor-pointer mb-3 has-text-primary' }, [
            //     m('span', {}, ['我的钱包'])
            // ]),
            m(commonSelectionBox, { num: 0 }),
            m(fundRecordsSelect, { dataArrObj: assetRecordsTable.dataArrObj, grossValue: assetRecordsTable.readyAlldata })
        ]);
    }
};
module.exports = {
    oninit () {
        assetRecordsTable.oninit();
        console.log(assetRecordsTable.readyAlldata);
    },
    view () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-assetRecordsWallet' }, [
            assetRecordsWallet.assetValuation()
        ]);
    }
};