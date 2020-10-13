const m = require('mithril');
const Http = require('@/api').webApi;
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');
const assetsRecordsType = require('./assetsRecordsType');
const config = require('../../config');

module.exports = {
    Record() {
        this['01'] = { // 合约账户
            other: [], // 合约赠金
            transfer: [] // 资产划转
        };
        this['02'] = { // 币币账户
            transfer: [], // 资产划转
            other: [] // 其他类型
        };
        this['03'] = { // 我的钱包
            recharge: [], // 钱包充币
            withdraw: [], // 钱包提币
            transfer: [], // 资产划转
            paymentTransfer: [], // 内部转账
            active: [], // 活动出入金
            exchange: [], // 系统兑换
            other: [] // 其他类型
        };
        this['04'] = { // 法币账户
            transfer: [], // 资产划转
            otcSell: [] // 法币交易
        };
        if (config.openFollow) {
            this['06'] = { // 跟单账户
                transfer: [], // 资产划转
                other: [] // 其他类型
            };
        }
    },
    recordObj: null,
    walletLog: { // 原始数据
        '01': {},
        '02': {},
        '03': {},
        '04': {},
        '06': {}
    },
    recordName() {
        return {
            "01": I18n.$t('10072')/* '合约账户' */,
            "02": I18n.$t('10073')/* '币币账户' */,
            "03": I18n.$t('10055')/* '我的钱包' */,
            "04": I18n.$t('10074')/* '法币账户' */,
            "05": I18n.$t('10547')/* '算力账户' */,
            "06": I18n.$t('10548')/* '跟单账户' */
        };
    },
    recordTypeName() {
        const typeList = {
            '01': {
                all: I18n.$t('10135'), /* '全部类型 */
                transfer: I18n.$t('10346'), /* '资产划转 */
                other: I18n.$t('10140')/* '其他类型' */
            },
            '02': {
                all: I18n.$t('10135'), /* '全部类型' */
                transfer: I18n.$t('10346'), /* '资产划转' */
                other: I18n.$t('10140') /* '其他类型 */
            },
            '03': {
                all: I18n.$t('10135'), /* '全部类型  */
                recharge: I18n.$t('10136'), /* '钱包充币 */
                withdraw: I18n.$t('10137'), /* '钱包提币 */
                transfer: I18n.$t('10346'), /* '资产划转  */
                paymentTransfer: I18n.$t('10058'), /* '内部转账 */
                active: I18n.$t('10138'), /* '活动出入金 */
                exchange: I18n.$t('10139'), /* '系统兑换 */
                other: I18n.$t('10140')/* '其他类型' */
            },
            '04': {
                all: I18n.$t('10135'), /* '全部类型  */
                transfer: I18n.$t('10346'), /* '资产划转  */
                otcSell: I18n.$t('10001')/* '法币交易' */
            }
        };
        if (config.openFollow) {
            typeList['06'] = {
                all: I18n.$t('10135'), /* '全部类型  */
                transfer: I18n.$t('10346'), /* '资产划转  */
                other: I18n.$t('10140')/* '其他类型' */
            };
        }
        return typeList;
    },
    showList: [], // 显示的列表
    tradeAccount: ['01', '02', '04'], // 交易账户
    otherAccount: [],
    aType: '03', // 子账户 默认为钱包
    filterTime: [],
    coinList: { // 币种列表
        '01': [],
        '02': [],
        '03': [],
        '04': [],
        '06': []
    },
    coin: 'all', // 币种
    type: 'all', // 类型 用于过滤
    loading: false,
    length: -1, // 显示条数
    mhType: 'all', // 类型 用于请求
    setLanguageListen() {
        broadcast.onMsg({
            key: 'assetRecords',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: lang => {
                this.fillDataAll();
            }
        });
        broadcast.onMsg({
            key: 'assetRecords',
            cmd: broadcast.MSG_ASSET_RECORD_UPD,
            cb: () => {
                this.getATypeRecords();
            }
        });
    },
    destroy() {
        broadcast.offMsg({
            key: 'assetRecords',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            isall: true
        });
        broadcast.offMsg({
            key: 'assetRecords',
            cmd: broadcast.MSG_ASSET_RECORD_UPD,
            isall: true
        });
        this.recordObj = null;
        this.aType = '03';
        this.type = 'all';
        this.coin = 'all';
        this.mhType = 'all';
        this.filterTime = [];
        this.showList = [];
        this.walletLog = { // 清空原始数据
            '01': {},
            '02': {},
            '03': {},
            '04': {},
            '06': {}
        };
    },
    init(aType, type = 'all', mhType = 'all', length = -1) {
        this.aType = aType;
        this.type = type;
        this.mhType = mhType;
        this.length = length;
        this.coin = 'all';
        this.filterTime = [];
        this.walletLog = { // 初始化清空原始数据
            '01': {},
            '02': {},
            '03': {},
            '04': {},
            '06': {}
        };
        if (config.openFollow) {
            this.otherAccount.push('06');
        }
        broadcast.emit({ cmd: 'assetsRecordOnInit' });
        this.getCoinList();
        this.getATypeRecords();
    },
    getCoinList() {
        if (this.aType === '06') {
            Http.subAssets({ exChannel: window.exchId, aType: '018' }).then(res => {
                if (res.result.code === 0) {
                    for (const coin of res.assetLists03) {
                        this.coinList['06'].push(coin.wType);
                    }
                }
            }).catch(
                err => {
                    console.log('error ', err);
                }
            );
        } else {
            Http.getWallet().then(res => {
                this.coinList['01'] = [];
                for (const coin of res.assetLists01) {
                    this.coinList['01'].push(coin.wType);
                }
                this.coinList['02'] = [];
                for (const coin of res.assetLists02) {
                    this.coinList['02'].push(coin.wType);
                }
                this.coinList['03'] = [];
                for (const coin of res.assetLists03) {
                    this.coinList['03'].push(coin.wType);
                }
                this.coinList['04'] = [];
                for (const coin of res.assetLists04) {
                    this.coinList['04'].push(coin.wType);
                }
                m.redraw();
            }).catch(
                err => {
                    console.log('error ', err);
                }
            );
        }
    },
    /**
     * 获取子账户记录
     */
    getATypeRecords: function() {
        this.loading = true;
        let httpList = [];
        switch (this.aType) {
        case '03' :
            if (this.mhType === 'all') {
                httpList = [
                    Http.assetRecords({ aType: this.aType, mhType: 1 }), // 充币
                    Http.assetRecords({ aType: this.aType, mhType: 2 }), // 提币
                    Http.assetRecords({ aType: this.aType, mhType: 4 }), // 划转
                    Http.assetRecords({ aType: this.aType, mhType: 5 }) // 其他
                ];
            } else {
                httpList.push(Http.assetRecords({ aType: this.aType, mhType: this.mhType }));
            }
            Http.assetRecordsAll(httpList).then(res => {
                this.loading = false;
                if (this.mhType === 'all') {
                    this.walletLog[this.aType][1] = res[0].result.code === 0 ? res[0].history : [];
                    this.walletLog[this.aType][2] = res[1].result.code === 0 ? res[1].history : [];
                    this.walletLog[this.aType][4] = res[2].result.code === 0 ? res[2].history : [];
                    this.walletLog[this.aType][5] = res[3].result.code === 0 ? res[3].history : [];
                } else {
                    this.walletLog[this.aType][this.mhType] = res[0].result.code === 0 ? res[0].history : [];
                }
                this.fillDataAll();
            }).catch(err => {
                this.loading = false;
                console.log('error ', err);
            });
            break;
        case '01':
        case '02':
            httpList = [Http.assetRecords({ aType: this.aType, mhType: 4 })]; // 划转
            Http.assetRecordsAll(httpList).then(res => {
                this.loading = false;
                this.walletLog[this.aType][4] = res[0].result.code === 0 ? res[0].history : [];
                this.fillDataAll();
            }).catch(err => {
                this.loading = false;
                console.log('error ', err);
            });
            break;
        case '04':
            httpList = [
                Http.assetRecords({ aType: this.aType, mhType: 4 }), // 划转
                Http.assetRecords({ aType: this.aType, mhType: 5 }) // 其他
            ];
            Http.assetRecordsAll(httpList).then(res => {
                this.loading = false;
                this.walletLog[this.aType][4] = res[0].result.code === 0 ? res[0].history : [];
                this.walletLog[this.aType][5] = res[1].result.code === 0 ? res[1].history : [];
                this.fillDataAll();
            }).catch(err => {
                this.loading = false;
                console.log('error ', err);
            });
            break;
        case '06':
            httpList = [
                Http.assetRecords({ aType: '018', mhType: 5 }) // 其他
            ];
            Http.assetRecordsAll(httpList).then(res => {
                this.loading = false;
                this.walletLog[this.aType][5] = res[0].result.code === 0 ? res[0].history : [];
                this.fillDataAll();
            }).catch(err => {
                this.loading = false;
                console.log('error ', err);
            });
            break;
        }
    },
    removeGIFT(value) {
        if (value.includes('@GIFT')) {
            return value.split('@GIFT').join('');
        } else {
            return value;
        }
    },
    fillDataAll() {
        this.recordObj = new this.Record();
        for (const aType in this.walletLog) {
            for (const mhType in this.walletLog[aType]) {
                this.fillData(this.walletLog[aType][mhType], aType, mhType);
            }
        }
        this.filterList();
    },
    /**
     * 数据填充
     */
    fillData(log, aType, mhType) {
        if (log.length <= 0) {
            return;
        }
        switch (mhType) {
        case '1':
            for (const item of log) {
                this.recordObj[aType].recharge.push({
                    coin: item.wType,
                    aType: item.aType,
                    num: utils.totalNumSub(item.num, 8),
                    time: utils.time(item.timestamp),
                    timestamp: item.timestamp,
                    status: assetsRecordsType.getTransferInfo(item.stat),
                    stat: item.stat,
                    seq: item.seq,
                    des: I18n.$t('10056'), /* '充币' */
                    info: [
                        {
                            key: I18n.$t('10097'), /* '区块链交易ID' */
                            value: item.txId
                        }
                    ],
                    recharge: true
                });
            }
            break;
        case '2':
            for (const item of log) {
                const wType = item.wType.includes('USDT') ? 'USDT' : item.wType;
                const info = [];
                info.push({
                    key: I18n.$t('10103'), /* '提币地址' */
                    value: item.addr
                });
                if (item.wType.includes('USDT')) {
                    info.push({
                        key: I18n.$t('10102'), /* '链类型' */
                        value: item.wType.split('USDT')[1] || 'Omni'
                    });
                }
                info.push({
                    key: I18n.$t('10097'), /* '区块链交易ID' */
                    value: item.txId
                });
                this.recordObj[aType].withdraw.push({
                    coin: wType,
                    aType: item.aType,
                    num: utils.totalNumSub(item.num, 8),
                    time: utils.time(item.timestamp),
                    timestamp: item.timestamp,
                    status: assetsRecordsType.getWithdrawArr(item.stat),
                    stat: item.stat,
                    seq: item.seq,
                    des: I18n.$t('10057'), /* '提币' */
                    info: info
                });
            }
            break;
        case '4':
            for (const item of log) {
                let des = '';
                const info = [];
                const aTypeArr = item.aType.indexOf('_') > -1 ? item.aType.split('_') : [];
                if (!(item.aType.indexOf('_') > -1 && aTypeArr.length === 2 && aTypeArr[0] === aTypeArr[1])) {
                    if (item.seq.search("UOUT") !== -1) {
                        const str = item.addr.split(':');
                        if (item.addr.search("from:") !== -1) {
                            // des = '账户转入';
                            des = I18n.$t('10347'); // '账户转入'
                            const index = item.addr.indexOf("from:");
                            info.account = [{
                                // key: '账户名',
                                key: I18n.$t('10348'),
                                value: item.addr.substring(index + 1, item.addr.length)
                            }];
                        } else if (item.addr.search("to:") !== -1) {
                            // des = '账户转出';
                            des = I18n.$t('10349'); // '账户转出'
                            const index = item.addr.indexOf("to:");
                            info.account = [{
                                // key: '账户名',
                                key: I18n.$t('10348'),
                                value: item.addr.substring(index + 1, item.addr.length)
                            }];
                        }
                        item.accountName = str[1];
                    } else if (item.wType.includes('@GIFT')) {
                        // des = '合约赠金';
                        des = I18n.$t('10142');
                    } else {
                        // addr先判断包含再判断全匹配
                        des = assetsRecordsType.getRecordsType4SearchStr(item.addr, item.wType) ||
                            assetsRecordsType.getRecordsType4Str(item.addr, item.wType) ||
                            I18n.$t('10140')/* 其他类型 */;
                    }
                    const newLog = {
                        coin: this.removeGIFT(item.wType),
                        aType: item.aType,
                        num: utils.totalNumSub(item.num, 8),
                        time: utils.time(item.timestamp),
                        timestamp: item.timestamp,
                        status: assetsRecordsType.getTransferInfo(item.stat),
                        stat: item.stat,
                        seq: item.seq,
                        des: des,
                        info: info
                    };
                    if (item.wType.includes('@GIFT')) { // 合约赠金
                        this.recordObj[aType].other.push(newLog);
                    } else if (item.addr.search("gf->btc") !== -1) { // GF兑换
                        this.recordObj[aType].other.push(newLog);
                    } else if (item.addr.search("EVT") !== -1) { // 活动资金
                        this.recordObj[aType].active.push(newLog);
                    } else if (item.addr.search("BL/") !== -1) { // 系统兑换
                        this.recordObj[aType].exchange.push(newLog);
                    } else if (item.addr.search("BDL/") !== -1) { // 锁定激活
                        this.recordObj[aType].other.push(newLog);
                    } else if (item.seq.search("UOUT") !== -1 && (item.addr.search("from:") !== -1 || item.addr.search("to:") !== -1)) { // 内部转账
                        this.recordObj[aType].paymentTransfer.push(newLog);
                    } else { // 资产划转
                        this.recordObj[aType].transfer.push(newLog);
                    }
                }
            }
            break;
        case '5':
            if (aType === '04') {
                for (const item of log) {
                    this.recordObj[aType].otcSell.push({
                        coin: item.wType,
                        aType: item.aType,
                        num: utils.totalNumSub(item.addr === 'from' ? '-' + item.num : item.num, 8),
                        time: utils.time(item.timestamp),
                        timestamp: item.timestamp,
                        status: assetsRecordsType.getTransferInfo(item.stat),
                        stat: item.stat,
                        seq: item.seq,
                        // des: item.addr === 'to' ? '买入' : '卖出'
                        des: item.addr === 'to' ? I18n.$t('10367') : I18n.$t('10368')
                    });
                }
                break;
            }
            for (const item of log) {
                let des = '';
                const num = 0;
                // addr先判断包含再判断全匹配
                des = assetsRecordsType.getRecordsType5SearchStr(aType, item.addr) ||
                    assetsRecordsType.getRecordsType5Str(item.addr, item.wType) ||
                    I18n.$t('10140')/* 其他类型 */;
                const newLog = {
                    coin: this.removeGIFT(item.wType),
                    aType: item.aType,
                    num: utils.totalNumSub(num || item.num, 8),
                    time: utils.time(item.timestamp),
                    timestamp: item.timestamp,
                    status: assetsRecordsType.getTransferInfo(item.stat),
                    stat: item.stat,
                    seq: item.seq,
                    des: des,
                    fee: item.fee
                };
                this.recordObj[aType][assetsRecordsType.getRecordsType5Type(item.addr)].push(newLog);
            }
            break;
        }
    },
    /**
     * 选择类型
     */
    onSelectType(type) {
        this.type = type;
    },
    /**
     * 选择币种
     */
    onSelectCoin(coin) {
        this.coin = coin;
    },
    /**
     * 选择时间
     */
    onSelectTime(time) {
        this.filterTime = time;
    },
    onSearch() {
        this.filterList();
    },
    onClean() {
        this.filterTime = [];
        this.coin = 'all';
        this.type = 'all';
        this.filterList();
    },
    /**
     * 筛选列表
     */
    filterList() {
        this.showList = [];
        const obj = this.recordObj[this.aType];
        if (this.type !== 'all') {
            this.showList = obj[this.type];
        } else {
            for (const k in obj) {
                this.showList.push(...obj[k]);
            }
        }
        if (!this.showList) {
            m.redraw();
            return;
        }
        this.showList = this.showList.filter(item => {
            return (this.coin === 'all' || this.coin === item.coin) &&
                (!this.filterTime.length || !this.filterTime[0] || !this.filterTime[1] ||
                    (this.compareDate(this.filterTime[1], Number(item.timestamp)) && this.compareDate(Number(item.timestamp), this.filterTime[0]))
                );
        });
        this.showList.sort((a, b) => {
            return b.timestamp - a.timestamp;
        });
        if (this.length !== -1) {
            this.showList.splice(this.length);
        }
        m.redraw();
    },
    compareDate(d1, d2) {
        const date1 = new Date(d1 * 1000);
        const date2 = new Date(d2 * 1000);
        let result = false;
        if (date1.getFullYear() > date2.getFullYear()) {
            result = true;
        } else if (date1.getFullYear() === date2.getFullYear()) {
            if (date1.getMonth() > date2.getMonth()) {
                result = true;
            } else if (date1.getMonth() === date2.getMonth()) {
                if (date1.getDate() >= date2.getDate()) {
                    result = true;
                }
            }
        }
        return result;
    }
};
