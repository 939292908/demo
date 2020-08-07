const m = require('mithril');

const Table = require('@/components/common/Table.js');
const market = require('@/models/market/market');

const obj = {
    // 表头
    tableColumns: [
        {
            title: '名称',
            key: 'distSym'
        },
        {
            title: '最新价',
            key: 'SettPrz'
        },
        {
            title: '涨跌幅',
            key: 'FundingLongR'
        },
        {
            title: '24h交易量',
            key: 'Low24'
        }
    ],
    buildTableData(oldData) {
        return Object.values(oldData);
    },
    // 表格
    tableData: [
        {
            fx: '1',
            zs: '0-999',
            cw: '0.50%',
            wt: '1.00%',
            zg: '100'
        },
        {
            fx: '2',
            zs: '0-999',
            cw: '0.50%',
            wt: '1.00%',
            zg: '100'
        },
        {
            fx: '3',
            zs: '0-999',
            cw: '0.50%',
            wt: '1.00%',
            zg: '100'
        }
    ]
};
module.exports = {
    oncreate: function () {
        market.init();
        market.initHomeNeedSub();
        window.gBroadcast.onMsg({
            key: 'marketList',
            cmd: window.gBroadcast.MSG_ASSETD_UPD,
            cb: function (arg) {
                market.initHomeNeedSub();
            }
        });
    },
    view: function () {
        return m('div.view-pages-home-marketlist', {}, [
            // '行情列表',
            m('div', { class: `frame w` }, [
                // m('div', { class: `listing` }, [
                //     m('div', { class: `` }, ['名称']),
                //     m('div', { class: `` }, ['最新价']),
                //     m('div', { class: `` }, ['涨跌桶']),
                //     m('div', { class: `` }, ['24h交易量'])
                // ]),
                m('div', { class: `Market-data` }, [
                    // JSON.stringify(market.tickData),
                    // table
                    // m(Table, {
                    //     columns: obj.tableColumns,
                    //     data: obj.tableData,
                    //     defaultColumnWidth: 200
                    // }),
                    m(Table, {
                        columns: obj.tableColumns,
                        data: obj.buildTableData(market.tickData),
                        defaultColumnWidth: "25%"
                    })
                ])
            ])
        ]);
    },
    onremove: function () {
        market.remove();
        window.gBroadcast.offMsg({
            key: 'marketList',
            isall: true
        });
    }
};