const m = require('mithril');
const assetRecordsTable = require('./assetTableList.model');
module.exports = {
    onupdate: function(vnode) {
        assetRecordsTable.type = vnode.attrs.num;
        assetRecordsTable.onupdate();
    },
    view: function (vnode) {
        return m('div', { class: 'views-pages-Myassets-assetRecords-myWalletTable' }, [
            m('div', {}, [
                m('table', { style: 'height:436px;width: 100%;' }, [
                    m('tbody', { class: (assetRecordsTable.datadisplayvalue === 1 ? '' : 'datadisplay ') + 'tbody' }, [
                        assetRecordsTable.dataArrObj.map(items => {
                            return m('tr', { class: 'has-text-level-2 body-4 pb-3' }, [
                                m('td', {}, [items.category]),
                                m('td.px-8 pb-4', {}, [items.type]),
                                m('td.px-8 pb-4', {}, [items.num]),
                                m('td.px-7 pb-4', {}, [items.state]),
                                m('td.px-8 pb-4', {}, [items.time]),
                                m('td', { class: 'tbodytd' }, [items.remarks])
                            ]);
                        }),
                        assetRecordsTable.grossValue.map((item) => {
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
                    m('div', { class: (assetRecordsTable.datadisplayvalue === 0 ? 'disdatadisplay' : 'datadisplay') + ' ' }, ['暂无数据'])
                ])
            ])
        ]);
    }
};