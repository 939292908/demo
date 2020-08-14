const m = require('mithril');
const accountTable = require('./accountTable');

require('@/styles/pages/Myassets/assetRecords.scss');
const contractAccount = {
    assetValuation: function () {
        return m('div', {}, [
            m(accountTable)
        ]);
    }
};
module.exports = {
    oninit: function () {
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-contractAccount' }, [
            contractAccount.assetValuation()
        ]);
    }
};