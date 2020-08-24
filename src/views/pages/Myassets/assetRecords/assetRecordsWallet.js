const m = require('mithril');
const commonSelectionBox = require('./commonSelectionBox');
const fundRecordsSelect = require('@/views/components/fundRecordsSelect');
const assetRecordsTable = require('@/models/assetRecords/assetRecordsTable');

const assetRecordsWallet = {
    assetValuation: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-myWallet-wrapper' }, [
            m(commonSelectionBox, { num: 0 }),
            m(fundRecordsSelect, { dataArrObj: assetRecordsTable.dataArrObj, grossValue: assetRecordsTable.grossValue })
        ]);
    }
};
module.exports = {
    oninit () {
        assetRecordsTable.oninit();
        console.log(assetRecordsTable.grossValue);
        // console.log(window.gI18n);
    },
    view () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-assetRecordsWallet' }, [
            assetRecordsWallet.assetValuation()
        ]);
    }
};