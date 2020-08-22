const m = require('mithril');
const Http = require('@/newApi');

require('@/styles/pages/Myassets/assetRecords.scss');
const myWalletTable = {
    dataArrObj: [{
        category: '币种',
        type: '类型',
        num: '数量',
        state: '状态',
        time: '时间',
        remarks: '备注'
    }],
    dataObj: [],
    dataSelect: [],
    dataSelect1: [],
    dataSelect2: [],
    grossValue: [],
    displayValue: null,
    noDisplay: false,
    timeValue: null,
    currencyValue: '全部',
    typeValue: '全部类型',
    selectDisplay: function (type, val) {
        // var type1 = type.split('-').join('');
        this.dataSelect = [];
        for (const items of val) {
            if (this.timestampToTime1(items.timestamp) === type) {
                this.dataSelect.push(items);
                // console.log(this.dataSelect);
            }
        }
        this.grossValue = this.dataSelect;
    },
    selectDisplay1: function (type, val) {
        this.dataSelect1 = [];
        for (const items of val) {
            if (items.wType === type) {
                this.dataSelect1.push(items);
                // console.log(this.dataSelect1);
            }
        }
        this.grossValue = this.dataSelect1;
    },
    selectDisplay2: function (type, val) {
        this.dataSelect2 = [];
        for (const items of val) {
            if (items.addr === type) {
                this.dataSelect2.push(items);
                // console.log(this.dataSelect2);
            }
        }
        this.grossValue = this.dataSelect2;
    },
    initAssetList: function () {
        const arg = {
            aType: "03",
            mhType: 5
        };
        Http.assetRecords(arg).then(data => {
            if (data.result.code === 0) {
                myWalletTable.dataObj = data.history;
                myWalletTable.dataSelect = data.history;
                myWalletTable.grossValue = data.history;
                m.redraw();
            }
        }, err => {
            window.$message({
                content: `网络异常，请稍后重试 ${err}`,
                type: 'danger'
            });
        });
    },
    displayEvnet: function (val) {
        this.displayValue = val;
        this.noDisplay = !this.noDisplay;
    },
    bodydisplayEvnet: function () {
        if (this.noDisplay) {
            this.noDisplay = false;
        }
    },
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
    timestampToTime1: function (timestamp) {
        var date = new Date(timestamp * 1000);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate();
        return Y + M + D;
    },
    assetValuation: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-myWalletTable-content' }, [
            m('table', {}, [
                m('tbody', { class: 'tbody' }, [
                    myWalletTable.dataArrObj.map(items => {
                        return m('tr', { class: 'pb-2  pt-2 pl-2 mb-3 columns-flex-justify1 bgColor has-text-level-2 border-radius-small' }, [
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
                    myWalletTable.grossValue.map((item, index) => {
                        return m('tr', { class: 'pb-3 pl-2 columns-flex-justify1' }, [
                            m('td', {}, [item.wType]),
                            m('td', {}, [item.addr]),
                            m('td', {}, [item.num]),
                            m('td', {}, [myWalletTable.timestampToTime(item.timestamp)]),
                            m('td', {}, [item.stat]),
                            m('td', { class: '', style: 'width:100px' }, ['--'])
                        ]);
                    })
                ])
            ])
        ]);
    }
};

module.exports = {
    oninit: function () {
        window.gBroadcast.onMsg({
            key: 'myWalletTable',
            cmd: window.gBroadcast.CHANGE_SW_CURRENCY,
            cb: function (arg) {
                if (arg.num === 0) {
                    myWalletTable.selectDisplay(arg.name, myWalletTable.dataObj);
                } else if (arg.num === 1) {
                    myWalletTable.currencyValue = arg.name;
                    if (myWalletTable.typeValue === '全部类型') {
                        if (arg.name === '全部') {
                            myWalletTable.dataSelect1 = myWalletTable.dataSelect;
                            myWalletTable.grossValue = myWalletTable.dataSelect1;
                            return;
                        }
                        myWalletTable.selectDisplay1(arg.name, myWalletTable.dataSelect);
                    } else {
                        if (arg.name === '全部') {
                            myWalletTable.dataSelect1 = myWalletTable.dataSelect2;
                            myWalletTable.grossValue = myWalletTable.dataSelect1;
                            return;
                        }
                        myWalletTable.selectDisplay1(arg.name, myWalletTable.dataSelect2);
                    }
                } else if (arg.num === 2) {
                    myWalletTable.typeValue = arg.name;
                    if (myWalletTable.typeValue === '全部') {
                        if (arg.name === '全部类型') {
                            myWalletTable.dataSelect2 = myWalletTable.dataSelect;
                            myWalletTable.grossValue = myWalletTable.dataSelect2;
                            return;
                        }
                        myWalletTable.selectDisplay2(arg.name, myWalletTable.dataSelect);
                    } else {
                        if (arg.name === '全部类型') {
                            myWalletTable.dataSelect2 = myWalletTable.dataSelect1;
                            myWalletTable.grossValue = myWalletTable.dataSelect2;
                            return;
                        }
                        myWalletTable.selectDisplay2(arg.name, myWalletTable.dataSelect1);
                    }
                }
            }
        });
        myWalletTable.initAssetList();
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-myWalletTable' }, [
            myWalletTable.assetValuation()
        ]);
    },
    onremove: function () {
        window.gBroadcast.offMsg({
            key: 'myWalletTable',
            isall: true
        });
    }
};