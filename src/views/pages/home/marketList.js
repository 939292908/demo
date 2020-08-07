const m = require('mithril');

const Table = require('@/components/common/Table.js');
const market = require('@/models/market/market');

let obj = {
    // 表头
    tableColumns: [
        {
            title: '风险限额档位',
            key: 'fx'
        },
        {
            title: '张数',
            key: 'zs'
        },
        {
            title: '仓位保证金率',
            key: 'cw'
        },
        {
            title: '委托保证金率',
            key: 'wt'
        },
        {
            title: '最高可用杠杆',
            key: 'zg'
        }
    ],
    // 表格
    tableData: [
        {
            fx: '1',
            zs: '0-999',
            cw: '0.50%',
            wt: '1.00%',
            zg: '100',
        },
        {
            fx: '2',
            zs: '0-999',
            cw: '0.50%',
            wt: '1.00%',
            zg: '100',
        },
        {
            fx: '3',
            zs: '0-999',
            cw: '0.50%',
            wt: '1.00%',
            zg: '100',
        },
    ]
}
module.exports = {
    oncreate: function () {
        market.init();
        market.initHomeNeedSub();
        window.gBroadcast.onMsg({
            key: 'marketList',
            cmd: window.gBroadcast.MSG_ASSETD_UPD,
            cb: function (arg) {
                market.initHomeNeedSub()
            }
        });
    },
    view: function () {
        return m('div.view-pages-home-marketlist', {}, [
            // '行情列表',
            m('div', { class: `frame w` }, [
                m('div', { class: `listing` }, [
                    m('div', { class: `` }, ['名称']),
                    m('div', { class: `` }, ['最新价']),
                    m('div', { class: `` }, ['涨跌桶']),
                    m('div', { class: `` }, ['24h交易量'])
                ]),
                m('div', { class: `Market-data` }, [
                    JSON.stringify(market.tickData),
                    // table
                    m(Table, {
                        columns: obj.tableColumns,
                        data: obj.tableData,
                        defaultColumnWidth: 200
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