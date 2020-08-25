const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');
const utils = require('@/util/utils').default;
require('@/styles/pages/Myassets/assetRecords.scss');

const commonSelectionBox = {
    timeValue: null,
    changeValue: '03',
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
        },
        {
            selected: false
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
    timestampToTime: function () {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        return year + "-" + month + "-" + day;
    },
    Repaint: function () {
        if (window.utils.getItem('currencyValue')) {
            for (var items of this.currencyValue) {
                if (Number(window.utils.getItem('currencyValue')) === items.name) {
                    console.log(items.name);
                    items.selected = true;
                }
            }
        }
    },
    assetValuation: function () {
        return m('div', { class: 'columns-flex-justify mb-7 body-2' }, [
            m('div', { class: 'mr-6' }, [
                m('p', { class: 'mb-2' }, ['时间']),
                m('input[type=date]', {
                    // value:utils.getItem('timeValue') ?utils.getItem('timeValue') : commonSelectionBox.typeValue,
                    class: 'has-line-level-1 identicalInput border-radius-small body-2',
                    id: 'fname',
                    required: 'required',
                    onchange: function (e) {
                        const data = {
                            name: this.value,
                            num: 0
                        };
                        broadcast.emit({ cmd: 'onAssetRecordsTable', data: data });
                        utils.setItem('timeValue', this.value);
                    }
                })
            ]),
            m('div', { class: 'mr-6' }, [
                m('p', { class: 'mb-2' }, ['币种']),
                m('select.select ', {
                    class: 'has-line-level-1 identicalInput border-radius-small body-2',
                    onchange: function (e) {
                        const data = {
                            name: this.value,
                            num: 1
                        };
                        utils.setItem('currencyValue', e.target.selectedOptions[0].attributes.name.value);
                        // console.log(e.target.selectedOptions[0].attributes.name.value);
                        broadcast.emit({ cmd: 'onAssetRecordsTable', data: data });
                    }
                },
                this.currencyValue.map(item => m('option', {
                    name: item.name
                }, item.value))
                )
            ]),
            m('div', { class: 'mr-6' }, [
                m('p', { class: 'mb-2' }, ['类型']),
                m('select.select ', {
                    class: 'has-line-level-1 identicalInput border-radius-small body-2',
                    onchange: function () {
                        const data = {
                            name: this.value,
                            num: 2
                        };
                        // utils.setItem('typeValue', this.value);
                        broadcast.emit({ cmd: 'onAssetRecordsTable', data: data });
                    }
                }, this.typeValue.map(item => m('option', {
                    name: item.name
                }, item.value))
                )
            ])
        ]);
    }
};
module.exports = {
    oninit: function (vnode) {
        commonSelectionBox.timeValue = commonSelectionBox.timestampToTime();
        // commonSelectionBox.Repaint();
        commonSelectionBox.changeValue = vnode.attrs.num;
        commonSelectionBox.dispalySelectEvent();
    },
    view: function () {
        return m('div', { class: 'views-pages-Myassets-assetRecords-commonSelectionBox' }, [
            commonSelectionBox.assetValuation()
        ]);
    }
};