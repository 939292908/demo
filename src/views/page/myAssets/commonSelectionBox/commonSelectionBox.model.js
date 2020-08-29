const broadcast = require('@/broadcast/broadcast');
const utils = require('@/util/utils').default;
const laydate = require('@/../node_modules/layui-laydate/src/laydate');

module.exports = {
    timeValue: null,
    changeValue: '03',
    displaySelect: false,
    displaySelect2: false,
    typeValue0: [
        {
            value: '全部类型',
            name: 1
        },
        {
            value: '钱包充币',
            name: 2
        },
        {
            value: '钱包提币',
            name: 3
        },
        {
            value: '资金划转',
            name: 4
        },
        {
            value: '内部转账',
            name: 5
        },
        {
            value: '活动出入金',
            name: 6
        },
        {
            value: '系统兑换',
            name: 7
        }, {
            value: '其他类型',
            name: 8
        }
    ],
    currencyValue: [
        {
            name: 1,
            value: "全部"
        },
        {
            name: 2,
            value: "USDT"
        },
        {
            name: 3,
            value: "XUSD"
        },
        {
            name: 4,
            value: "BTC"
        },
        {
            name: 5,
            value: "ETH"
        }
    ],
    typeValue1: [
        {
            value: '全部类型',
            name: 1
        },
        {
            value: '资金划转',
            name: 2
        },
        {
            value: '合约赠金',
            name: 3
        }
    ],
    typeValue2: [
        {
            value: '全部类型',
            name: 1
        },
        {
            value: '资金划转',
            name: 2
        }
    ],
    typeValue3: [
        {
            value: '全部类型',
            name: 1
        },
        {
            value: '资金划转',
            name: 2
        },
        {
            value: '法币买入',
            name: 3
        },
        {
            value: '法币卖入',
            name: 3
        }
    ],
    currencyValueChange: '全部',
    typeValueChange: '全部类型',
    typeValue: [],
    dispalySelectEvent: function () {
        if (this.changeValue === '03') { // 我的钱包
            this.typeValue = this.typeValue0;
        } else if (this.changeValue === '01') { // 合约账户
            this.typeValue = this.typeValue1;
        } else if (this.changeValue === '02') { // 币币账户
            this.typeValue = this.typeValue2;
        } else if (this.changeValue === '04') {
            this.typeValue = this.typeValue3; // 法币账户
        }
    },
    currencyValueEvent: function (val) {
        event.stopPropagation();
        this.currencyValueChange = val;
        this.displaySelect = !this.displaySelect;
    },
    dispalySelectEvent1: function() {
        this.displaySelect = !this.displaySelect;
    },
    dispalySelectEvent2: function() {
        this.displaySelect2 = !this.displaySelect2;
    },
    typeValueEvent: function (val) {
        event.stopPropagation();
        this.typeValueChange = val;
        this.displaySelect2 = !this.displaySelect2;
    },
    timestampToTime: function () {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        return year + "-" + month + "-" + day;
    },
    selectTime(val) {
        const data = {
            name: val,
            num: 0
        };
        broadcast.emit({ cmd: 'onAssetRecordsTable', data: data });
        utils.setItem('timeValue', val);
    },
    onDropdownClick(item) {
        this.currencyValueEvent(item.value);
        const data = {
            name: item.value,
            num: 1
        };
        broadcast.emit({ cmd: 'onAssetRecordsTable', data: data });
        utils.setItem('currencyValue', item.value);
        console.log(item.value);
    },
    onnMenuClick (item) {
        this.typeValueEvent(item.value);
        const data = {
            name: item.value,
            num: 2
        };
        utils.setItem('typeValue', item.value);
        broadcast.emit({ cmd: 'onAssetRecordsTable', data: data });
        console.log(item.value);
    },
    oncreate(vnode) {
        // const that = this;
        laydate.render({
            elem: '#test10',
            type: 'datetime',
            range: true,
            trigger: 'click', // 事件类型
            done: function(value, date, endDate) {
                // 回调函数
                console.log(value.split(' - '));
                const data = {
                    name: value.split(' - '),
                    num: 0
                };
                utils.setItem('timeSolt', value.split(' - '));
                broadcast.emit({ cmd: 'onAssetRecordsTable', data: data });
            }
        });
        this.timeValue = this.timestampToTime();
        // this.Repaint();
        this.changeValue = vnode.attrs.num;
        this.dispalySelectEvent();
        broadcast.onMsg({
            key: 'this',
            cmd: 'displaySelect',
            cb: function(arg) {
                if (arg === 1) {
                    if (this.displaySelect) {
                        this.dispalySelectEvent1();
                    } else if (this.displaySelect2) {
                        this.dispalySelectEvent2();
                    }
                }
            }
        });
    },
    onremove() {
        broadcast.offMsg({
            key: 'this',
            cmd: 'displaySelect',
            isall: true
        });
    }
};