const m = require('mithril');
const Http = require('@/api').webApi;
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');

module.exports = {
    recordObj: {
        '01': { // 合约账户
            gift: [], // 合约赠金
            transfer: [] // 资产划转
        },
        '02': { // 币币账户
            transfer: [], // 资产划转
            other: [] // 其他类型
        },
        '03': { // 我的钱包
            recharge: [], // 钱包充币
            withdraw: [], // 钱包提币
            transfer: [], // 资产划转
            paymentTransfer: [], // 内部转账
            active: [], // 活动出入金
            exchange: [], // 系统兑换
            other: [] // 其他类型
        },
        '04': { // 法币账户
            transfer: [], // 资产划转
            otcSell: [] // 法币交易
        }
    },
    recordName: {
        "01": I18n.$t('10072')/* '合约账户' */,
        "02": I18n.$t('10073')/* '币币账户' */,
        "03": I18n.$t('10055')/* '我的钱包' */,
        "04": I18n.$t('10074')/* '法币账户' */,
        "05": '算力账户',
        "06": '跟单账户'
    },
    recordTypeName() {
        return {
            '02': {
                all: I18n.$t('10135'), /* '全部类型' */
                gift: I18n.$t('10142'), /* '合约赠金 */
                transfer: '资产划转'/* '资产划转' */
            },
            '01': {
                all: I18n.$t('10135'), /* '全部类型 */
                transfer: '资产划转', /* '资产划转 */
                other: I18n.$t('10140')/* '其他类型' */
            },
            '03': {
                all: I18n.$t('10135'), /* '全部类型  */
                recharge: I18n.$t('10136'), /* '钱包充币 */
                withdraw: I18n.$t('10137'), /* '钱包提币 */
                transfer: '资产划转', /* '资产划转  */
                paymentTransfer: I18n.$t('10058'), /* '内部转账 */
                active: I18n.$t('10138'), /* '活动出入金 */
                exchange: I18n.$t('10139'), /* '系统兑换 */
                other: I18n.$t('10140')/* '其他类型' */
            },
            '04': {
                all: I18n.$t('10135'), /* '全部类型  */
                transfer: '资产划转', /* '资产划转  */
                otcSell: I18n.$t('10001')/* '法币交易' */
            }
        };
    },
    showList: [], // 显示的列表
    tradeAccount: ['01', '02', '04'], // 交易账户
    aType: '03', // 子账户 默认为钱包
    filterTime: [],
    coinList: {
        '01': [],
        '02': [],
        '03': [],
        '04': []
    },
    coin: 'all',
    type: 'all',
    init(aType, type = 'all') {
        this.aType = aType;
        this.type = type;
        this.coin = 'all';
        this.filterTime = [];
        broadcast.emit({ cmd: 'assetsRecordOnInit' });
        this.getCoinList();
        this.getATypeRecords();
    },
    getCoinList() {
        Http.getWallet().then(res => {
            console.log('getWallet ', res);
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
    },
    /**
     * 获取子账户记录
     */
    getATypeRecords() {
        const walletLog = {};
        switch (this.aType) {
        case '03' :
            Http.assetRecordsAll([
                Http.assetRecords({ aType: this.aType, mhType: 1 }), // 充币
                Http.assetRecords({ aType: this.aType, mhType: 2 }), // 提币
                Http.assetRecords({ aType: this.aType, mhType: 4 }), // 划转
                Http.assetRecords({ aType: this.aType, mhType: 5 }) // 其他
            ]).then(res => {
                walletLog['1'] = res[0].result.code === 0 ? res[0].history : [];
                this.fillData(walletLog['1'], this.aType, '1');
                walletLog['2'] = res[1].result.code === 0 ? res[1].history : [];
                this.fillData(walletLog['2'], this.aType, '2');
                walletLog['4'] = res[2].result.code === 0 ? res[2].history : [];
                this.fillData(walletLog['4'], this.aType, '4');
                walletLog['5'] = res[3].result.code === 0 ? res[3].history : [];
                this.fillData(walletLog['5'], this.aType, '5');
                this.filterList();
            }).catch(err => {
                console.log('error ', err);
            });
            break;
        case '01':
        case '02':
            Http.assetRecordsAll([
                Http.assetRecords({ aType: this.aType, mhType: 4 }) // 划转
            ]).then(res => {
                walletLog['4'] = res[0].result.code === 0 ? res[0].history : [];
                this.fillData(walletLog['4'], this.aType, '4');
                this.filterList();
            }).catch(err => {
                console.log('error ', err);
            });
            break;
        case '04':
            Http.assetRecordsAll([
                Http.assetRecords({ aType: this.aType, mhType: 4 }), // 划转
                Http.assetRecords({ aType: this.aType, mhType: 5 }) // 其他
            ]).then(res => {
                walletLog['4'] = res[0].result.code === 0 ? res[0].history : [];
                this.fillData(walletLog['4'], this.aType, '4');
                walletLog['5'] = res[1].result.code === 0 ? res[1].history : [];
                this.fillData(walletLog['5'], this.aType, '5');
                this.filterList();
            }).catch(err => {
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
    /**
     * 数据填充
     */
    fillData(log, aType, mhType) {
        if (log.length <= 0) {
            return;
        }
        switch (mhType) {
        case '1':
            this.recordObj[aType].recharge = [];
            for (const item of log) {
                this.recordObj[aType].recharge.push({
                    coin: item.wType,
                    // wType: item.wType,
                    // addr: item.addr,
                    aType: item.aType,
                    // addrLink: item.addrLink,
                    // txIdLink: item.txIdLink,
                    num: utils.totalNumSub(item.num, 8),
                    time: utils.time(item.timestamp),
                    // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                    // icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`,//item.icon,
                    timestamp: item.timestamp,
                    status: utils.getTransferInfo(item.stat),
                    // stat: item.stat,
                    seq: item.seq,
                    des: I18n.$t('10056'), /* '充币' */
                    info: [
                        {
                            key: I18n.$t('10097'), /* '区块链交易ID' */
                            value: item.txId
                        }, {
                            key: I18n.$t('10102'), /* '链类型' */
                            value: item.wType.includes('USDT') ? (item.wType.split('USDT')[1] || 'Omni') : item.wType
                        }
                        // {
                        //     key: '标签',
                        //     value: item.addr
                        // }
                    ],
                    recharge: true
                });
            }
            break;
        case '2':
            this.recordObj[aType].withdraw = [];
            for (const item of log) {
                const wType = item.wType.includes('USDT') ? 'USDT' : item.wType;
                this.recordObj[aType].withdraw.push({
                    coin: wType,
                    // wType: wType,
                    // addr: item.addr,
                    aType: item.aType,
                    // addrLink: item.addrLink,
                    // txIdLink: item.txIdLink,
                    num: utils.totalNumSub(item.num, 8),
                    time: utils.time(item.timestamp),
                    // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                    // icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`,//item.icon,
                    timestamp: item.timestamp,
                    status: utils.getWithdrawArr(item.stat),
                    // stat: item.stat,
                    seq: item.seq,
                    des: I18n.$t('10057'), /* '提币' */
                    info: [
                        {
                            key: I18n.$t('10103'), /* '提币地址' */
                            value: item.addr
                        }, {
                            key: I18n.$t('10102'), /* '链类型' */
                            value: item.wType.includes('USDT') ? (item.wType.split('USDT')[1] || 'Omni') : item.wType
                        }, {
                            key: I18n.$t('10097'), /* '区块链交易ID' */
                            value: item.txId
                        }
                        // {
                        //     key: '标签',
                        //     value: item.addr
                        // }
                    ]
                    // chainType: item.wType.includes('USDT') ? (item.wType.split('USDT')[1] || 'Omni') : ''
                });
            }
            break;
        case '4':
            this.recordObj[aType].transfer = [];
            if (aType !== '04') {
                this.recordObj[aType].other = [];
            }
            if (aType === '03') {
                this.recordObj[aType].gift = [];
                this.recordObj[aType].active = [];
                this.recordObj[aType].exchange = [];
                this.recordObj[aType].paymentTransfer = [];
            }
            for (const item of log) {
                let des = '';
                const info = [];
                const aTypeArr = item.aType.indexOf('_') > -1 ? item.aType.split('_') : [];
                if (!(item.aType.indexOf('_') > -1 && aTypeArr.length === 2 && aTypeArr[0] === aTypeArr[1])) {
                    if (item.seq.search("UOUT") !== -1) {
                        const str = item.addr.split(':');
                        if (item.addr.search("from:") !== -1) {
                            des = '账户转入';
                            const index = item.addr.indexOf("from:");
                            info.account = [{
                                key: '账户名',
                                value: item.addr.substring(index + 1, item.addr.length)
                            }];
                            // des = I18n.$t('10800'); // '账户转入'
                        } else if (item.addr.search("to:") !== -1) {
                            des = '账户转出';
                            const index = item.addr.indexOf("to:");
                            info.account = [{
                                key: '账户名',
                                value: item.addr.substring(index + 1, item.addr.length)
                            }];
                            // des = I18n.$t('10799'); // '账户转出'
                        }
                        item.accountName = str[1];
                    } else if (item.wType.includes('@GIFT')) {
                        // des = '合约赠金';
                        des = I18n.$t('10142');
                    } else if (item.addr.search("tout_16") !== -1) { // 划至法币账户（给法币审核用）
                        // des = '划至法币账户';
                        des = I18n.$t('10149', {
                            value: I18n.$t('10074')
                        });
                    } else if (item.addr.search("otcuc") !== -1) { // 法币账户转入（给法币审核用）用户取消
                        // des = '法币账户转入';
                        des = I18n.$t('10145', {
                            value: I18n.$t('10074')
                        });
                    } else if (item.addr.search("otcaf") !== -1) { // 法币账户转入（给法币审核用）后台审核不通过
                        // des = '法币账户转入';
                        des = I18n.$t('10145', {
                            value: I18n.$t('10074')
                        });
                    } else if (item.addr.search("tin_") !== -1) {
                        des = this.recordName[item.addr.split("_")[1]] + '转入';
                        des = I18n.$t('10145', {
                            value: this.recordName[item.addr.split("_")[1]]
                        }); // XX账户转入
                    } else if (item.addr.search("tout_") !== -1) {
                        // des = '划至' + this.recordName[item.addr.split("_")[1]];
                        des = I18n.$t('10149', {
                            value: this.recordName[item.addr.split("_")[1]]
                        }); // 划至xx账户
                    } else if (item.addr.search("gf->btc") !== -1) {
                        des = 'GF兑换BTC';
                        // des = "GF" + I18n.$t('10099') + /**/ "BTC";// 兑换
                    } else if (item.addr.search("EVTIN") !== -1) {
                        des = '活动入金';
                        // des = I18n.$t('10149'); // '活动入金'
                    } else if (item.addr.search("EVTOUT") !== -1) {
                        des = '活动出金';
                        // des = I18n.$t('10150'); // '活动出金'
                    } else if (item.addr.search("BL/") !== -1) {
                        des = '百日矿池计划';
                        // des = item.wType === 'GF' ? I18n.$t('11507'/**/) : I18n.$t('10821'/**/);// 百日矿池计划   系统兑换
                    } else if (item.addr.search("BDL/") !== -1) {
                        des = '锁定激活';
                        // des = I18n.$t('10822'); // '锁定激活'
                    } else if (item.addr.search("TASK-IN") !== -1) {
                        des = '活动空投';
                        // des = I18n.$t('11361');// "活动空投" // '活动空投'
                    } else if (item.addr.search("TASK-OUT") !== -1) {
                        des = '活动清算';
                        // des = I18n.$t('11613'); // '活动清算'
                    } else if (item.addr.search("TASK-GIFT") !== -1) {
                        des = '活动奖励';
                        // des = I18n.$t('11614'); // '活动奖励'
                    } else if (item.addr.search("TASK-REG") !== -1) {
                        des = '注册赠金';
                        // des = I18n.$t('11616'); // 注册赠金
                    } else if (item.addr.search("TASK-CHARGE0") !== -1) {
                        des = '首充赠金';
                        // des = I18n.$t('11615'); // 首充赠金
                    } else if (item.addr.search("TASK-TRADE") !== -1) {
                        des = '交易赠金';
                        // des = I18n.$t('11617');// 交易赠金
                    } else if (item.addr.search("TASK-INVITE") !== -1) {
                        des = '邀请赠金';
                        // des = I18n.$t('11618');// 邀请赠金
                    } else if (item.addr.search("TASK-CS") !== -1) {
                        des = '客服赠金';
                        // des = I18n.$t('11619');// 客服赠金
                    } else if (item.addr.search("TASK-SIGN3") !== -1) {
                        des = '特殊签到';
                        // des = I18n.$t('11620');// 特殊签到
                    } else if (item.addr.search("TASK-SIGN2") !== -1) {
                        des = '签到暴击';
                        // des = I18n.$t('11621');// 签到暴击
                    } else if (item.addr.search("TASK-SIGN1") !== -1) {
                        des = '连续签到';
                        // des = I18n.$t('11622');// 连续签到
                    } else if (item.addr.search("TASK-SIGN") !== -1) {
                        des = '签到赠金';
                        // des = I18n.$t('11623');// 签到赠金
                    } else {
                        des = utils.getTransferHisStr(item.addr, item.wType);
                    }
                    if (item.addr.indexOf('M2O') !== -1) {
                        // des = '法币账户转入';
                        des = I18n.$t('10145', {
                            value: I18n.$t('10074')
                        });
                    } else if (item.addr.indexOf('O2M') !== -1) {
                        // des = '划至法币账户';
                        des = I18n.$t('10149', {
                            value: I18n.$t('10074')
                        });
                    }
                    const newLog = {
                        coin: this.removeGIFT(item.wType),
                        // wType: this.removeGIFT(item.wType),
                        // addr: item.addr,
                        aType: item.aType,
                        num: utils.totalNumSub(item.num, 8),
                        time: utils.time(item.timestamp),
                        // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                        // icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`, // item.icon,
                        timestamp: item.timestamp,
                        status: utils.getTransferInfo(item.stat),
                        // stat: item.stat,
                        seq: item.seq,
                        des: des,
                        info: info
                        // addrLink: item.addrLink,
                        // txIdLink: item.txIdLink
                    };
                    if (item.wType.includes('@GIFT')) { // 合约赠金
                        this.recordObj[aType].gift.push(newLog);
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
                this.recordObj[aType].otcSell = [];
                for (const item of log) {
                    this.recordObj[aType].otcSell.push({
                        coin: item.wType,
                        // wType: item.wType,
                        // addr: item.addr,
                        aType: item.aType,
                        // addrLink: item.addrLink,
                        // txIdLink: item.txIdLink,
                        num: utils.totalNumSub(item.addr === 'from' ? '-' + item.num : item.num, 8),
                        time: utils.time(item.timestamp),
                        // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                        // icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`,//item.icon,
                        timestamp: item.timestamp,
                        status: utils.getTransferInfo(item.stat),
                        // stat: item.stat,
                        seq: item.seq,
                        des: item.addr === 'to' ? '买入' : '卖出'
                    });
                }
                break;
            }
            this.recordObj[aType].transfer = [];
            this.recordObj[aType].other = [];
            for (const item of log) {
                let des = '';
                let num = 0;
                const toType = {
                    mineTransfer: false, // 矿池划转
                    transfer: false, // 资产划转
                    ore: false, // 矿池出矿
                    other: false, // 其它
                    openInfo: false
                };
                if (item.addr.search("tml2dl") !== -1 || item.addr.search("dl2tml") !== -1) {
                    toType.mineTransfer = true;
                    des = '矿池划转';
                    // des = I18n.$t('10864'); // '矿池划转'
                    // this.allType['mineTransfer'].show = true
                } else if (item.addr.search("tm") !== -1) {
                    toType.ore = true;
                    if (item.addr.search("tm35") !== -1) {
                        des = '赠送上级矿池';
                        // des = I18n.$t('11624'/**/);// 赠送上级矿池
                    } else if (item.addr.search("tm36") !== -1) {
                        des = '赠送上上级矿池';
                        // des = I18n.$t('11625'/**/); // 赠送上上级矿池
                    } else {
                        des = '矿池出矿';
                        // des = I18n.$t('10823'); // '矿池出矿'
                    }
                    // this.allType['ore'].show = true
                } else if (item.addr.search("adm") !== -1) {
                    toType.other = true;
                    // eslint-disable-next-line prefer-const
                    let num = item.addr.split('_')[1];
                    des = utils.getOtherStr(num, item.wType);
                    // this.allType['other'].show = true
                } else if (item.addr.search("VOTE") !== -1) {
                    toType.other = true;
                    // let num = item.addr.split('_')[1];
                    des = '投票上币'; // 投票上币
                    // des = I18n.$t('11626'/**/); // 投票上币
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
                } else if (aType === '03' && item.addr.search("foltra-1") !== -1) {
                    // des = '跟单账户转入';
                    des = I18n.$t('10145', { value: '跟单账户' }); // 跟单账户
                    toType.transfer = true;
                } else if (aType === '03' && item.addr.search("foltra") !== -1) {
                    // des = '划至跟单账户';
                    des = I18n.$t('10149', { value: I18n.$t('跟单账户') }); // 跟单账户
                    toType.transfer = true;
                } else if (aType === '06' && item.addr.search("foltra-1") !== -1) {
                    // des = '划至我的钱包';
                    des = I18n.$t('10149', { value: I18n.$t('10055') }); // 我的钱包
                    toType.transfer = true;
                } else if (aType === '06' && item.addr.search("foltra") !== -1) {
                    // des = '我的钱包转入';
                    des = I18n.$t('10145', { value: I18n.$t('10055') }); // 我的钱包
                    toType.transfer = true;
                } else if (aType === '06' && item.addr.search("fw_pnl") !== -1) {
                    des = '平仓盈利';
                    // des = I18n.$t('12523'); // 平仓盈利
                    toType.other = true;
                } else if (aType === '06' && item.addr.search("fw_fee") !== -1) {
                    des = '交易手续费';
                    // des = I18n.$t('12524'/**/);// 交易手续费
                    toType.other = true;
                } else if (aType === '06' && item.addr.search("fw_cls_MI") !== -1) {
                    des = '平仓解锁保证金';
                    // des = I18n.$t('12525'/**/); // '平仓解锁保证金'
                    toType.other = true;
                } else if (aType === '06' && item.addr.search("fw_open") !== -1) {
                    des = '开仓锁定保证金';
                    // des = I18n.$t('12526'/**/); // 开仓锁定保证金
                    toType.other = true;
                } else if (aType === '06' && item.addr.search("fw_repnl") !== -1) {
                    des = '推荐分红锁定';
                    // des = I18n.$t('12527'/**/); // 推荐分红锁定
                    toType.other = true;
                } else if (aType === '06' && item.addr.search("fw_ldpnl") !== -1) {
                    des = '带单分红锁定';
                    // des = I18n.$t('12528'/**/);// 带单分红锁定
                    toType.other = true;
                } else if (aType === '06' && item.addr.search("fw_res") !== -1) {
                    des = '盈利释放到可用';
                    // des = I18n.$t('12529'/**/); // 盈利释放到可用
                    toType.other = true;
                } else if (aType === '06' && item.addr.search("fw_loss") !== -1) {
                    des = '平仓亏损';
                    // des = I18n.$t('12530'/**/); // 平仓亏损
                    toType.other = true;
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
                        toType.openInfo = true;
                        break;
                    case 'bet':
                        num = Number(item.num || 0) + Number(item.fee || 0);
                        toType.openInfo = true;
                        break;
                    }
                    toType.other = true;
                    // this.allType['other']?this.allType['other'].show = true:''
                }
                const newLog = {
                    coin: item.wType,
                    // wType: item.wType,
                    // addr: item.addr,
                    aType: item.aType,
                    // addrLink: item.addrLink,
                    // txIdLink: item.txIdLink,
                    // eslint-disable-next-line no-unneeded-ternary
                    num: utils.totalNumSub(num ? num : item.num, 8),
                    time: utils.time(item.timestamp),
                    // img: this.wTypeObj[item.wType] ? this.wTypeObj[item.wType] : `${this.$params.baseURL}/coins/icon-${item.wType}.png`,
                    // icon: `${this.$params.baseURL + this.removeGIFT(item.icon)}`, // item.icon,
                    timestamp: item.timestamp,
                    status: utils.getTransferInfo(item.stat),
                    // stat: item.stat,
                    seq: item.seq,
                    des: des,
                    fee: item.fee
                };
                if (toType.transfer) {
                    this.recordObj[aType].transfer.push(newLog);
                } else {
                    this.recordObj[aType].other.push(newLog);
                }
            }
            break;
        }
    },
    /**
     * 选择类型
     */
    onSelectType(type) {
        this.type = type;
        this.filterList();
    },
    /**
     * 选择币种
     */
    onSelectCoin(coin) {
        this.coin = coin;
        this.filterList();
    },
    /**
     * 选择时间
     */
    onSelectTime(time) {
        this.filterTime = time;
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
                    (this.filterTime[0] <= Number(item.timestamp) && this.filterTime[1] >= Number(item.timestamp))
                );
        });
        this.showList.sort((a, b) => {
            return b.timestamp - a.timestamp;
        });
        m.redraw();
    }
};