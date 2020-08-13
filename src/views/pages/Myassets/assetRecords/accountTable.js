const m = require('mithril');

require('@/styles/pages/Myassets/assetRecords.scss');
const accountTable = {
    dataArrObj: [{
        category: '币种',
        type: '类型',
        num: '数量',
        ServiceCharge: '手续费',
        state: '状态',
        time: '时间',
        remarks: '备注'
    }],
    dataObj: [],
    displayValue: null,
    noDisplay: false,
    timestampToTime: function (timestamp) {
        var date = new Date(timestamp * 1000);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
    },
    assetValuation: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-accountTable-content' }, [
            m('tbody', { class: 'tbody' }, [
                accountTable.dataArrObj.map(items => {
                    return m('tr', { class: 'pb-2  pt-2 pl-2 mb-3 columns-flex-justify1 bgColor has-text-level-2 border-radius-small' }, [
                        m('td', {}, [items.category]),
                        m('td', {}, [items.type]),
                        m('td', {}, [items.num]),
                        m('td', {}, [items.ServiceCharge]),
                        m('td', {}, [items.time]),
                        m('td', {}, [items.state]),
                        m('td', { style: 'width:100px' }, [items.remarks])
                    ]);
                })
            ]),
            m('tbody', { class: 'tbody' }, [
                accountTable.dataObj.map((item, index) => {
                    return m('tr', { class: 'pb-3 pl-2 columns-flex-justify1' }, [
                        m('td', {}, [item.wType]),
                        m('td', {}, [item.addr]),
                        m('td', {}, [item.num]),
                        m('td', {}, [item.addr]),
                        m('td', {}, [item.addr]),
                        m('td', {}, [accountTable.timestampToTime(item.timestamp)]),
                        m('td', { style: 'width:100px' }, ['--'])
                    ]);
                })
            ])
        ]);
    },
    initAssetList: function () {
        const arg = {
            aType: "03",
            mhType: 5
        };
        window.gWebApi.assetRecords(arg, data => {
            if (data.result.code === 0) {
                accountTable.dataObj = data.history;
                m.redraw();
            }
        }, err => {
            window.$message({
                content: `网络异常，请稍后重试 ${err}`,
                type: 'danger'
            });
        }
        );
    },
    displayEvnet: function (val) {
        this.displayValue = val;
        this.noDisplay = !this.noDisplay;
    },
    bodydisplayEvnet: function () {
        if (this.noDisplay) {
            this.noDisplay = false;
        }
    }
};

module.exports = {
    oninit: function () {
        accountTable.initAssetList();
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-accountTable' }, [
            accountTable.assetValuation()
        ]);
    }
};