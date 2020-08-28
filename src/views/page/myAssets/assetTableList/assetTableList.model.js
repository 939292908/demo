const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');
const Http = require('@/api').webApi;
// const Axios = require('@/api/config/request').default;
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;
module.exports = {
    type: '03',
    readyAlldata: [],
    allType: { // 主钱包类型
        allType: {
            value: I18n.$t('10131'), // '全部类型',
            key: 'allType',
            show: true
        },
        recharge: {
            value: I18n.$t('10246'), // '钱包充币',
            key: 'recharge',
            show: true
        },
        withdrawa: {
            value: I18n.$t('10247'), // '钱包提币',
            key: 'withdrawa',
            show: true
        },
        transfer: {
            value: I18n.$t('10408'), // '资产划转',
            key: 'transfer',
            show: true
        },
        paymentTransfer: {
            value: I18n.$t('10502', {
                // value: $params.exchInfo.exchName
                value: ""
            }), // $params.exchInfo.exchName + '支付',
            key: 'paymentTransfer',
            show: true
        },
        gf: {
            value: I18n.$t('10249'), // 'GF兑换',
            key: 'gf',
            show: true
        },
        active: {
            value: I18n.$t('10132'), // '活动资金',
            key: 'active',
            show: true
        },
        exchange: {
            value: I18n.$t('10821'), // '系统兑换',
            key: 'exchange',
            show: true
        },
        Active: {
            value: I18n.$t('10822'), // '锁定激活',
            key: 'Active',
            show: true
        },
        ore: {
            value: I18n.$t('10823'), // '矿池出矿',
            key: 'ore',
            show: true
        },
        mineTransfer: {
            value: I18n.$t('10864'), // '矿池划转',
            key: 'mineTransfer',
            show: true
        },
        other: {
            value: I18n.$t('10824'), // '其他类型',
            key: 'other',
            show: true
        }
    },
    hyType: {
        allType: {
            value: I18n.$t('10131'), // '全部类型',
            key: 'allType',
            show: true
        },
        transfer: {
            value: I18n.$t('10408'), // '资产划转',
            key: 'transfer',
            show: true
        },
        gift: {
            value: I18n.$t('11610'), // 合约赠金
            key: 'gift',
            show: true
        }
    },
    bbType: {
        allType: {
            value: I18n.$t('10131'), // '全部类型',
            key: 'allType',
            show: true
        },
        transfer: {
            value: I18n.$t('10408'), // '资产划转',
            key: 'transfer',
            show: true
        },
        other: {
            value: I18n.$t('10824'), // '其他类型',
            key: 'other',
            show: true
        }
    },
    otcType: {
        allType: {
            value: I18n.$t('10131'), // '全部类型',
            key: 'allType',
            show: true
        },
        transfer: {
            value: I18n.$t('10408'), // '资产划转',
            key: 'transfer',
            show: true
        },
        otcSell: {
            value: I18n.$t('10676'), // '法币交易',
            key: 'otcSell',
            show: true
        }
    },
    documentaryType: {
        allType: {
            value: I18n.$t('10131'), // '全部类型',
            key: 'allType',
            show: true
        },
        transfer: {
            value: I18n.$t('10408'), // '资产划转',
            key: 'transfer',
            show: true
        },
        other: {
            value: I18n.$t('10824'), // '其他类型',
            key: 'other',
            show: true
        }
    },
    walletLog: {
        '01': {}, // 合约
        '02': {}, // 币币
        '03': {}, // 钱包
        '04': {}, // 法币
        '05': {}, // 算力
        '06': {} // 跟单
    },
    dataArrObj: [{
        category: '币种',
        type: '类型',
        num: '数量',
        ServiceCharge: '手续费',
        state: '状态',
        time: '时间',
        remarks: '备注'
    }],
    walletType: {
        "03": '我的钱包', // "我的钱包",
        "02": '我的钱包', // "币币账户",
        "01": '合约账户', // "合约账户",
        "04": '法币账户', // "法币账户"
        "05": '算力账户', // "算力账户"
        "06": '跟单账户'// '跟单账户', //"跟单账户"
    },
    dataObj: [],
    dataSelect: [],
    dataSelect1: [],
    dataSelect2: [],
    grossValue: [],
    displayValue: null,
    noDisplay: false,
    timeValue: null,
    currencyValue: '全部',
    datadisplayvalue: 1,
    typeValue: '全部类型',
    dataArrObjEvent () {
        if (this.grossValue.length === 0) {
            this.datadisplayvalue = 0;
        } else {
            this.datadisplayvalue = 1;
        }
    },
    timestampToTime1 (timestamp) {
        var date = null;
        console.log(timestamp.toString().length);
        if (timestamp.toString().length > 10) {
            date = new Date(timestamp);
        } else {
            date = new Date(timestamp * 1000);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        }
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return Y + M + D;
    },
    selectDisplay (type, val) {
        // var type1 = type[0].replace(' 00:00:00', '');
        const dateObj = [];
        for (var i = 0; i < type.length; i++) {
            var date = new Date(type[i]);
            var d = date.getTime(date);
            if (d.toString().length > 10) {
                dateObj.push(d.toString().substr(0, 10));
            }
        }
        console.log(dateObj);
        // var type1 = type.split('-').join('');
        this.dataSelect = [];
        for (const items of val) {
            if (Number(dateObj[0]) === Number(dateObj[1])) {
                console.log(1111111);
                if (Number(dateObj[0]) === Number(items.timestamp)) {
                    console.log(222222);
                    this.dataSelect.push(items);
                }
            } else if (Number(dateObj[0]) < Number(items.timestamp) < Number(dateObj[1])) {
                console.log(33333);
                this.dataSelect.push(items);
            } else {
                console.log(4444444);
                this.dataSelect = [];
            }
        }
        this.grossValue = this.dataSelect;
        this.dataArrObjEvent();
        console.log(this.grossValue);
    },
    selectDisplay1 (type, val) {
        this.dataSelect1 = [];
        for (const items of val) {
            if (items.wType === type) {
                this.dataSelect1.push(items);
                // console.log(this.dataSelect1);
            }
        }
        this.grossValue = this.dataSelect1;
        this.dataArrObjEvent();
    },
    selectDisplay2 (type, val) {
        this.dataSelect2 = [];
        for (const items of val) {
            if (items.addr === type) {
                this.dataSelect2.push(items);
                // console.log(this.dataSelect2);
            }
        }
        this.grossValue = this.dataSelect2;
        this.dataArrObjEvent();
    },
    displayEvnet (val) {
        this.displayValue = val;
        this.noDisplay = !this.noDisplay;
        console.log(val);
    },
    bodydisplayEvnet () {
        if (this.noDisplay) {
            this.noDisplay = false;
        }
    },
    onupdate() {
        console.log(this.type, '1111111111111111111111111111');
        const that = this;
        broadcast.onMsg({
            key: 'assetRecordsTable',
            cmd: 'onAssetRecordsTable',
            cb: function (arg) {
                if (arg.num === 0) {
                    console.log(arg);
                    that.selectDisplay(arg.name, that.readyAlldata);
                } else if (arg.num === 1) {
                    that.currencyValue = arg.name;
                    if (that.typeValue === '全部类型') {
                        if (arg.name === '全部') {
                            that.dataSelect1 = that.dataSelect;
                            that.grossValue = that.dataSelect1;
                            that.dataArrObjEvent();
                            return;
                        }
                        that.selectDisplay1(arg.name, that.dataSelect);
                    } else {
                        if (arg.name === '全部') {
                            that.dataSelect1 = that.dataSelect2;
                            that.grossValue = that.dataSelect1;
                            that.dataArrObjEvent();
                            return;
                        }
                        that.selectDisplay1(arg.name, that.dataSelect2);
                    }
                } else if (arg.num === 2) {
                    that.typeValue = arg.name;
                    if (that.currencyValue === '全部') {
                        if (arg.name === '全部类型') {
                            that.dataSelect2 = that.dataSelect;
                            that.grossValue = that.dataSelect2;
                            that.dataArrObjEvent();
                            return;
                        }
                        that.selectDisplay2(arg.name, that.dataSelect);
                    } else {
                        if (arg.name === '全部类型') {
                            that.dataSelect2 = that.dataSelect1;
                            that.grossValue = that.dataSelect2;
                            that.dataArrObjEvent();
                            return;
                        }
                        that.selectDisplay2(arg.name, that.dataSelect1);
                    }
                }
            }
        });
        this.getAllList();
    },
    onremove () {
        broadcast.offMsg({
            key: 'assetRecordsTable',
            cmd: 'onAssetRecordsTable',
            isall: true
        });
    },
    getAllList() {
        // eslint-disable-next-line prefer-const
        let that = this;
        if (that.type === '03') {
            Http.assetRecordsAll([
                Http.assetRecords({ aType: that.type, mhType: 1 }), // 充币
                Http.assetRecords({ aType: that.type, mhType: 2 }), // 提币
                Http.assetRecords({ aType: that.type, mhType: 4 }), // 划转
                Http.assetRecords({ aType: that.type, mhType: 5 }) // 其他
            ]).then(res => {
                console.log(res);
                // eslint-disable-next-line prefer-const
                let walletLog = that.walletLog[that.type];
                that.walletLog[that.type]['1'] = res[0].result.code === 0 ? res[0].history : walletLog['1'] ? walletLog['1'] : [];
                that.walletLog[that.type]['2'] = res[1].result.code === 0 ? res[1].history : walletLog['2'] ? walletLog['2'] : [];
                that.walletLog[that.type]['4'] = res[2].result.code === 0 ? res[2].history : walletLog['4'] ? walletLog['4'] : [];
                that.walletLog[that.type]['5'] = res[3].result.code === 0 ? res[3].history : walletLog['5'] ? walletLog['5'] : [];
                that.updateList();
            }).catch(err => {
                console.log('error ', err);
            });
        } else if (that.type === '01' || that.type === '02') {
            Http.assetRecordsAll([
                Http.assetRecords({ aType: that.type, mhType: 4 }) // 划转
            ]).then(res => {
                // eslint-disable-next-line prefer-const
                let walletLog = that.walletLog[that.type];
                that.walletLog[that.type]['4'] = res[0].result.code === 0 ? res[0].history : walletLog['4'] ? walletLog['4'] : [];
                that.updateList();
            }).catch(err => {
                console.log('error ', err);
            });
        } else if (that.type === '04') {
            Http.assetRecordsAll([
                Http.assetRecords({ aType: that.type, mhType: 4 }), // 划转
                Http.assetRecords({ aType: that.type, mhType: 5 }) // 其他
            ]).then(res => {
                // eslint-disable-next-line prefer-const
                let walletLog = that.walletLog[that.type];
                that.walletLog[that.type]['4'] = res[0].result.code === 0 ? res[0].history : walletLog['4'] ? walletLog['4'] : [];
                that.walletLog[that.type]['5'] = res[1].result.code === 0 ? res[1].history : walletLog['5'] ? walletLog['5'] : [];
                that.updateList();
            }).catch(err => {
                console.log('error ', err);
            });
        } else if (that.type === '06') {
            Http.assetRecordsAll([
                Http.assetRecords({ aType: '018', mhType: 5 })// 其他
            ]).then(res => {
                // eslint-disable-next-line no-undef
                that.walletLog[that.type]['5'] = res[0].result.code === 0 ? res[0].history : walletLog['5'] ? walletLog['5'] : [];
                that.updateList();
            }).catch(err => {
                console.log('error ', err);
            });
        }
    },
    updateList() {
        // eslint-disable-next-line prefer-const
        let that = this;
        // eslint-disable-next-line prefer-const
        let walletLog = that.walletLog[this.type];
        let allHistoryList = [];
        // 充币
        if (walletLog['1'] && walletLog['1'].length > 0) {
            // eslint-disable-next-line prefer-const
            let list = [];
            // eslint-disable-next-line prefer-const
            for (let item of walletLog['1']) {
                list.push({
                    coin: item.wType,
                    wType: item.wType,
                    addr: item.addr,
                    aType: item.aType,
                    addrLink: item.addrLink,
                    txIdLink: item.txIdLink,
                    num: utils.totalNumSub(item.num, 8),
                    time: utils.time(item.timestamp),
                    // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                    // icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`, // item.icon,
                    timestamp: item.timestamp,
                    status: utils.getTransferInfo(item.stat),
                    stat: item.stat,
                    seq: item.seq,
                    des: '充币', // "充币"
                    recharge: true
                });
            }
            allHistoryList = allHistoryList.concat(list);
            allHistoryList.sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });
            console.log(list, 1111111111111111111);
        }
        // 提币
        if (walletLog['2'] && walletLog['2'].length > 0) {
            // eslint-disable-next-line prefer-const
            let list = [];
            // eslint-disable-next-line prefer-const
            for (let item of walletLog['2']) {
                // eslint-disable-next-line prefer-const
                let wType = item.wType.includes('USDT') ? 'USDT' : item.wType;
                list.push({
                    coin: wType,
                    wType: wType,
                    addr: item.addr,
                    aType: item.aType,
                    addrLink: item.addrLink,
                    txIdLink: item.txIdLink,
                    num: utils.totalNumSub(item.num, 8),
                    time: utils.time(item.timestamp),
                    // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                    // icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`, // item.icon,
                    timestamp: item.timestamp,
                    status: utils.getWithdrawArr(item.stat),
                    stat: item.stat,
                    seq: item.seq,
                    des: '提币', // "提币"
                    chainType: item.wType.includes('USDT') ? (item.wType.split('USDT')[1] || 'Omni') : '',
                    withdrawa: true
                });
            }
            // this.allType['withdrawa'].show = list.length > 0?true:false
            allHistoryList = allHistoryList.concat(list);
            allHistoryList.sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });
            console.log(list, '22222222222222222222222222222');
        }
        // 划转
        if (walletLog['4'] && walletLog['4'].length > 0) {
            // eslint-disable-next-line prefer-const
            let list = [];
            // eslint-disable-next-line prefer-const
            for (let item of walletLog['4']) {
                let des = '';
                let active = false;
                let exchange = false;
                let Active = false;
                let transfer = false;
                let paymentTransfer = false;
                let gf = false;
                let gift = false;
                // eslint-disable-next-line prefer-const
                let aTypeArr = item.aType.indexOf('_') > -1 ? item.aType.split('_') : [];
                if (!(item.aType.indexOf('_') > -1 && aTypeArr.length === 2 && aTypeArr[0] === aTypeArr[1])) {
                    if (item.wType.includes('@GIFT')) {
                        gift = true;
                        // this.allType['gift']?this.allType['gift'].show = true:''
                    } else if (item.addr.search("gf->btc") !== -1) {
                        gf = true;
                        // this.allType['gf'].show = true
                    } else if (item.addr.search("EVT") !== -1) {
                        active = true;
                        // this.allType['active'].show = true
                    } else if (item.addr.search("BL/") !== -1) {
                        exchange = true;
                        // this.allType['exchange'].show = true
                    } else if (item.addr.search("BDL/") !== -1) {
                        Active = true;
                        // this.allType['Active'].show = true
                    } else if (item.seq.search("UOUT") !== -1 && (item.addr.search("from:") !== -1 || item.addr.search("to:") !== -1)) {
                        paymentTransfer = true;
                        // this.allType['paymentTransfer'].show = true
                    } else {
                        transfer = true;
                        // this.allType['transfer'].show = true
                    }

                    if (item.seq.search("UOUT") !== -1) {
                        // eslint-disable-next-line prefer-const
                        let str = item.addr.split(':');
                        if (item.addr.search("from:") !== -1) {
                            des = I18n.$t('10800'); // '账户转入'
                        } else if (item.addr.search("to:") !== -1) {
                            des = I18n.$t('10799'); // '账户转出'
                        }
                        item.accountName = str[1];
                    } else if (item.wType.includes('@GIFT')) {
                        des = I18n.$t('11610' /**/);// 合约赠金
                    } else if (item.addr.search("tout_16") !== -1) { // 划至法币账户（给法币审核用）
                        des = I18n.$t('10148', {
                            value: I18n.$t('10085')
                        });
                    } else if (item.addr.search("otcuc") !== -1) { // 法币账户转入（给法币审核用）用户取消
                        des = I18n.$t('10147', {
                            value: I18n.$t('10085')
                        });
                    } else if (item.addr.search("otcaf") !== -1) { // 法币账户转入（给法币审核用）后台审核不通过
                        des = I18n.$t('10147', {
                            value: I18n.$t('10085')
                        });
                    } else if (item.addr.search("tin_") !== -1) {
                        des = I18n.$t('10147', {
                            value: this.walletType[item.addr.split("_")[1]]
                        }); // XX账户转入
                    } else if (item.addr.search("tout_") !== -1) {
                        des = I18n.$t('10148', {
                            value: this.walletType[item.addr.split("_")[1]]
                        }); // 划至xx账户
                        console.log(item.addr.split("_")[1], this.walletType[item.addr.split("_")[1]], des);
                    } else if (item.addr.search("gf->btc") !== -1) {
                        des = "GF" + I18n.$t('10099') + /**/ "BTC";// 兑换
                    } else if (item.addr.search("EVTIN") !== -1) {
                        des = I18n.$t('10149'); // '活动入金'
                    } else if (item.addr.search("EVTOUT") !== -1) {
                        des = I18n.$t('10150'); // '活动出金'
                    } else if (item.addr.search("BL/") !== -1) {
                        des = item.wType === 'GF' ? I18n.$t('11507'/**/) : I18n.$t('10821'/**/);// 百日矿池计划   系统兑换
                    } else if (item.addr.search("BDL/") !== -1) {
                        des = I18n.$t('10822'); // '锁定激活'
                    } else if (item.addr.search("TASK-IN") !== -1) {
                        des = I18n.$t('11361');// "活动空投" // '活动空投'
                    } else if (item.addr.search("TASK-OUT") !== -1) {
                        des = I18n.$t('11613'); // '活动清算'
                    } else if (item.addr.search("TASK-GIFT") !== -1) {
                        des = I18n.$t('11614'); // '活动奖励'
                    } else if (item.addr.search("TASK-REG") !== -1) {
                        des = I18n.$t('11616'); // 注册赠金
                    } else if (item.addr.search("TASK-CHARGE0") !== -1) {
                        des = I18n.$t('11615'); // 首充赠金
                    } else if (item.addr.search("TASK-TRADE") !== -1) {
                        des = I18n.$t('11617');// 交易赠金
                    } else if (item.addr.search("TASK-INVITE") !== -1) {
                        des = I18n.$t('11618');// 邀请赠金
                    } else if (item.addr.search("TASK-CS") !== -1) {
                        des = I18n.$t('11619');// 客服赠金
                    } else if (item.addr.search("TASK-SIGN3") !== -1) {
                        des = I18n.$t('11620');// 特殊签到
                    } else if (item.addr.search("TASK-SIGN2") !== -1) {
                        des = I18n.$t('11621');// 签到暴击
                    } else if (item.addr.search("TASK-SIGN1") !== -1) {
                        des = I18n.$t('11622');// 连续签到
                    } else if (item.addr.search("TASK-SIGN") !== -1) {
                        des = I18n.$t('11623');// 签到赠金
                    } else {
                        des = utils.getTransferHisStr(item.addr, item.wType);
                    }
                    // eslint-disable-next-line no-unused-expressions
                    item.addr.indexOf('M2O') !== -1 ? des = I18n.$t('10147', {
                        value: I18n.$t('10085')
                    }) : item.addr.indexOf('O2M') !== -1 ? des = I18n.$t('10148', {
                        value: I18n.$t('10085')
                    }) : '';
                    list.push({
                        coin: this.removeGIFT(item.wType),
                        wType: this.removeGIFT(item.wType),
                        addr: item.addr,
                        aType: item.aType,
                        num: utils.totalNumSub(item.num, 8),
                        time: utils.time(item.timestamp),
                        // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                        // icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`, // item.icon,
                        timestamp: item.timestamp,
                        status: utils.getTransferInfo(item.stat),
                        stat: item.stat,
                        seq: item.seq,
                        des: des,
                        active: active,
                        addrLink: item.addrLink,
                        txIdLink: item.txIdLink,
                        exchange: exchange,
                        Active: Active,
                        transfer: transfer,
                        paymentTransfer: paymentTransfer,
                        gf: gf,
                        gift
                    });
                }
            }
            allHistoryList = allHistoryList.concat(list);
            allHistoryList.sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });
            console.log(list, '3333333333333333333333333');
        }
        // 其他
        if (this.type === '04' && walletLog['5'] && walletLog['5'].length > 0) {
            // eslint-disable-next-line prefer-const
            let list = [];
            // eslint-disable-next-line prefer-const
            for (let item of walletLog['5']) {
                // let des = '';
                list.push({
                    coin: item.wType,
                    wType: item.wType,
                    addr: item.addr,
                    aType: item.aType,
                    addrLink: item.addrLink,
                    txIdLink: item.txIdLink,
                    num: utils.totalNumSub(item.addr === 'from' ? '-' + item.num : item.num, 8),
                    time: utils.time(item.timestamp),
                    // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                    icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`, // item.icon,
                    timestamp: item.timestamp,
                    status: utils.getTransferInfo(item.stat),
                    stat: item.stat,
                    seq: item.seq,
                    des: item.addr === 'to' ? I18n.$t('10313') : I18n.$t('10314'), // '买入':"卖出"
                    otcSell: true
                });
            }
            allHistoryList = allHistoryList.concat(list);
            allHistoryList.sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });
            console.log(list, 555555555555);
        } else if (walletLog['5'] && walletLog['5'].length > 0) {
            // eslint-disable-next-line prefer-const
            let list = [];
            // eslint-disable-next-line prefer-const
            for (let item of walletLog['5']) {
                let des = '';
                let mineTransfer = false;
                let transfer = false;
                let ore = false;
                let other = false;
                let openInfo = false;
                let num = 0;
                if (item.addr.search("tml2dl") !== -1 || item.addr.search("dl2tml") !== -1) {
                    mineTransfer = true;
                    des = I18n.$t('10864'); // '矿池划转'
                    // this.allType['mineTransfer'].show = true
                } else if (item.addr.search("tm") !== -1) {
                    ore = true;
                    if (item.addr.search("tm35") !== -1) {
                        des = I18n.$t('11624'/**/);// 赠送上级矿池
                    } else if (item.addr.search("tm36") !== -1) {
                        des = I18n.$t('11625'/**/); // 赠送上上级矿池
                    } else {
                        des = I18n.$t('10823'); // '矿池出矿'
                    }
                    // this.allType['ore'].show = true
                } else if (item.addr.search("adm") !== -1) {
                    other = true;
                    // eslint-disable-next-line prefer-const
                    let num = item.addr.split('_')[1];
                    des = utils.getOtherStr(num, item.wType);
                    // this.allType['other'].show = true
                } else if (item.addr.search("VOTE") !== -1) {
                    other = true;
                    // let num = item.addr.split('_')[1];
                    des = I18n.$t('11626'/**/); // 投票上币
                    // this.allType['other'].show = true
                } else if (item.addr.search("ahp_buy") !== -1) {
                    des = '算力本金锁定';
                } else if (item.addr.search("ahp_earn") !== -1) {
                    des = '挖矿收益';
                } else if (item.addr.search("ahp_draw") !== -1) {
                    des = '提取算力本金';
                } else if (item.addr.search("ce_in") !== -1) {
                    des = '兑换获得';
                } else if (item.addr.search("ce_out") !== -1) {
                    des = '兑换消耗';
                } else if (this.type === '03' && item.addr.search("foltra-1") !== -1) {
                    // des = '跟单账户转入'
                    des = I18n.$t('10147', { value: I18n.$t('12522'/**/) }); // 跟单账户
                    transfer = true;
                } else if (this.type === '03' && item.addr.search("foltra") !== -1) {
                    // des = '划至跟单账户'
                    des = I18n.$t('10148', { value: I18n.$t('12522'/**/) }); // 跟单账户
                    transfer = true;
                } else if (this.type === '06' && item.addr.search("foltra-1") !== -1) {
                    // des = '划至我的钱包'
                    des = I18n.$t('10148', { value: I18n.$t('10082'/**/) }); // 我的钱包
                    transfer = true;
                } else if (this.type === '06' && item.addr.search("foltra") !== -1) {
                    // des = '我的钱包转入'
                    des = I18n.$t('10147', { value: I18n.$t('10082'/**/) }); // 我的钱包
                    transfer = true;
                } else if (this.type === '06' && item.addr.search("fw_pnl") !== -1) {
                    des = I18n.$t('12523'); // 平仓盈利
                    other = true;
                } else if (this.type === '06' && item.addr.search("fw_fee") !== -1) {
                    des = I18n.$t('12524'/**/);// 交易手续费
                    other = true;
                } else if (this.type === '06' && item.addr.search("fw_cls_MI") !== -1) {
                    des = I18n.$t('12525'/**/); // '平仓解锁保证金'
                    other = true;
                } else if (this.type === '06' && item.addr.search("fw_open") !== -1) {
                    des = I18n.$t('12526'/**/); // 开仓锁定保证金
                    other = true;
                } else if (this.type === '06' && item.addr.search("fw_repnl") !== -1) {
                    des = I18n.$t('12527'/**/); // 推荐分红锁定
                    other = true;
                } else if (this.type === '06' && item.addr.search("fw_ldpnl") !== -1) {
                    des = I18n.$t('12528'/**/);// 带单分红锁定
                    other = true;
                } else if (this.type === '06' && item.addr.search("fw_res") !== -1) {
                    des = I18n.$t('12529'/**/); // 盈利释放到可用
                    other = true;
                } else if (this.type === '06' && item.addr.search("fw_loss") !== -1) {
                    des = I18n.$t('12530'/**/); // 平仓亏损
                    other = true;
                } else {
                    // des = utils.getRecordsType5Str(item.addr, item.wType);
                    switch (item.addr) {
                    case 'g103wdrw':
                    case 'g103depo':
                    case 'g103depo2':
                    case 'prix':
                    case 'bonus':
                    case 'lot':
                    case 'betfee':
                        openInfo = true;
                        break;
                    case 'bet':
                        num = Number(item.num || 0) + Number(item.fee || 0);
                        openInfo = true;
                        break;
                    }
                    other = true;
                    // this.allType['other']?this.allType['other'].show = true:''
                }
                list.push({
                    coin: item.wType,
                    wType: item.wType,
                    addr: item.addr,
                    aType: item.aType,
                    addrLink: item.addrLink,
                    txIdLink: item.txIdLink,
                    // eslint-disable-next-line no-unneeded-ternary
                    num: utils.totalNumSub(num ? num : item.num, 8),
                    time: utils.time(item.timestamp),
                    // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                    // icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`, // item.icon,
                    timestamp: item.timestamp,
                    status: utils.getTransferInfo(item.stat),
                    stat: item.stat,
                    seq: item.seq,
                    des: des,
                    mineTransfer: mineTransfer,
                    transfer: transfer,
                    ore: ore,
                    fee: item.fee,
                    other: other,
                    openInfo: openInfo
                });
            }
            allHistoryList = allHistoryList.concat(list);
            allHistoryList.sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });
            console.log(list, '444444444444444444444444444');
        }
        // eslint-disable-next-line no-empty
        if (this.type === '06' && walletLog['5'] && walletLog['5'].length) {

        }
        // eslint-disable-next-line prefer-const
        // let obj = {
        //     '03': '1',
        //     '01': '2',
        //     '02': '3',
        //     '04': '4',
        //     '06': '6'
        // };
        // that.Wallet[obj[this.type]].map(item => {
        //     this.allCoin[this.removeGIFT(item.wType)] = {
        //         wType: this.removeGIFT(item.wType),
        //         key: this.removeGIFT(item.wType),
        //         icon: item.url
        //     };
        // });
        // console.log('this.allCoin', that.Wallet[obj[this.type]], this.allCoin);
        // console.log(allHistoryList);

        allHistoryList.sort(function (a, b) {
            // console.log(b.timestamp - a.timestamp)
            return b.timestamp - a.timestamp;
        });
        this.allData = allHistoryList;
        this.allInfo = allHistoryList;
        // this.readyAlldata = allHistoryList.slice(0,this.listNum)
        this.readyAlldata = allHistoryList;
        this.grossValue = allHistoryList;
        this.dataObj = allHistoryList;
        this.dataSelect = allHistoryList;
        this.dataArrObjEvent();
        m.redraw();
        console.log(this.readyAlldata, '------------------------------');
        setTimeout(() => {
            that.loadingProgress = false;
            // document.getElementsByClassName('records_wrap')[0].style.height = `calc(100%)`;
        }, 100);
        // this.switchCoin();
    },
    removeGIFT(value) {
        if (value.includes('@GIFT')) {
            return value.split('@')[0] + '赠金'; // 赠金
        } else {
            return value;
        }
    }
};
