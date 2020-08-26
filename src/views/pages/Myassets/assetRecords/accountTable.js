const m = require('mithril');
const assetRecordsTable = require('@/models/assetRecords/assetRecordsTable');
module.exports = {
    oninit: function (vnode) {
        assetRecordsTable.type = vnode.attrs.num;
        console.log(assetRecordsTable.type, vnode.attrs.num);
        assetRecordsTable.oninit();
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-myWalletTable' }, [
            m('table.mb-4', {}, [
                m('tbody', { class: 'tbody' }, [
                    assetRecordsTable.dataArrObj.map(items => {
                        return m('tr', { class: ' columns-flex-justify1 bgColor has-text-level-2 border-radius-small' }, [
                            m('td', {}, [items.category]),
                            m('td', {}, [items.type]),
                            m('td', {}, [items.num]),
                            m('td', {}, [items.time]),
                            m('td', {}, [items.state]),
                            m('td', { style: 'width:100px' }, [items.remarks])
                        ]);
                    })
                ])
            ]),
            m('table', {}, [
                m('tbody', { class: 'tbody' }, [
                    assetRecordsTable.grossValue.map((item) => {
                        return m('tr', { class: 'pb-7 columns-flex-justify1' }, [
                            m('td', {}, [item.wType]),
                            m('td', {}, [item.addr]),
                            m('td', {}, [item.num]),
                            m('td', {}, [item.time]),
                            m('td', {}, [item.stat]),
                            m('td', { class: '', style: 'width:100px' }, ['--'])
                        ]);
                    })
                ])
            ])
        ]);
    }
};