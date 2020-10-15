const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');
const utils = require('@/util/utils').default;
const { gMktApi } = require('@/api').wsApi;
const { getSortMarkets } = require('@/api').webApi;

const I18n = require('@/languages/I18n').default;

module.exports = {
    sortState: 0, // 行情排序状态： 0未排序 1已排序
    sortDisplaySym: {
        // mian
        cashSale: [], // 现货 Trdcls = 1
        futures: [], // 期货 Trdcls = 2
        // swap: { // 永续 Trdcls = 3
        forward: [], // 正向
        reverse: [], // 反向
        // },
        // ...name
        ACF: [],
        DeFi: [],
        inv: [],
        ETF: [],
        Act: [],
        third: []
    },
    //  行情数据
    tickData: {},
    //  已订阅列表
    subList: [],
    //  最后行情更新时间
    lastTickTm: 0,
    //  待更新的行情数据
    needUpdTick: {},
    //  限制行情更新时间间隔
    tickUpdInterval: 500,
    tickDefault: {
        //  显示的合约名称
        distSym: '--',
        rfpre: '0.00%',
        rfpreColor: 0,
        rf: 0,
        // 最新价格
        LastPrz: '--',
        // 24H成交量
        Volume24: '--',
        Volume24ForUSDT: '--',
        // 24H成交额
        Turnover24: '--',
        Turnover24ForUSDT: '--',
        // 标记价格
        SettPrz: '--',
        // 指数价格
        indexPrz: '--',
        // 24小时最高
        High24: '--',
        // 24小时最低
        Low24: '--',
        // 当前周期资金费率
        FundingLongR: '--',
        // 下个周期预测的资金费率
        FundingPredictedR: '--',

        // 持仓量
        OpenInterest: '--',
        OpenInterestForUSDT: '--',

        TrdCls: '--',
        FromC: '--',
        ToC: '--'
    },
    init: function () {
        const that = this;
        //  添加最新价行情更新监听
        broadcast.onMsg({
            key: 'market',
            cmd: broadcast.MSG_TICK_UPD,
            cb: function (arg) {
                that.onTick(arg);
            }
        });
        if (!this.sortState) {
            broadcast.onMsg({
                key: "market",
                cmd: broadcast.MSG_ASSETD_UPD,
                cb: this.assetDCallBack.bind(this)
            });
        }
    },
    remove: function () {
        broadcast.offMsg({
            key: 'market',
            isall: true
        });

        this.unSubTick([...this.subList]);
    },
    // 全部行情排序
    assetDCallBack: function (res) {
        const displaySym = {};
        res.data.forEach(item => {
            let key = item.Lbl;
            if (item.Lbl === 'main') {
                switch (item.TrdCls) {
                case 1: key = 'cashSale';
                    break;
                case 2: key = 'futures';
                    break;
                case 3:
                    key = (item.Flag & 1) === 1 ? 'reverse' : 'forward';
                    break;
                }
            }
            if (!Object.prototype.hasOwnProperty.call(displaySym, key)) {
                displaySym[key] = [];
            }
            displaySym[key].push(item);
        });
        this.sortAssetD(displaySym);
    },
    sortAssetD: function (displaySym) {
        const self = this;
        getSortMarkets({ vp: window.exchId }).then(res => {
            if (res.result.code === 0) {
                this.sortState = 1;
                const data = res.result.data.symSort;
                for (const key in displaySym) {
                    const item = displaySym[key];
                    self.sortDisplaySym[key] = item.sort((a, b) => {
                        return (data[a.ToC] || 9999) - (data[b.ToC] || 999);
                    });
                }
                broadcast.emit({
                    cmd: broadcast.MSG_SORT_ASSETD,
                    data: {
                        key: '排序后的全部AssetD',
                        sortDisplaySym: self.sortDisplaySym // 所有排序后的行情
                    }
                });
            }
        });
    },
    //  订阅行情
    subTick: function (subArr) {
        if (!subArr || subArr.length === 0) {
            return;
        }

        for (const key of subArr) {
            this.subList.push(key);
            gMktApi.TpcAdd(key);
        }
    },
    //  取消订阅
    unSubTick: function (subArr) {
        if (!subArr || subArr.length === 0) {
            return;
        }

        for (const key of subArr) {
            gMktApi.TpcDel(key);
            const idx = this.subList.findIndex(t => {
                return t === key;
            });
            if (idx > -1) {
                this.subList.splice(idx, 1);
            }
        }
    },
    //  最新价行情更新
    onTick: function (arg) {
        const tm = Date.now();
        this.needUpdTick[arg.Sym] = arg.data;
        if (tm - this.lastTickTm >= this.tickUpdInterval) {
            this.updTickData(this.needUpdTick);
            this.needUpdTick = {};
            this.lastTickTm = tm;
        }
    },
    //  更新最新价行情数据
    updTickData: function (param) {
        for (const key in param) {
            this.tickData[key] = this.createTickData(param[key]);
        }
        m.redraw();
    },
    createTickData: function (param) {
        const AssetD = gMktApi.AssetD[param.Sym];
        if (param.Sym.indexOf('CI_') > -1) {
            let tick = Object.assign({}, this.tickDefault);
            tick = Object.assign(tick, param);
            const PrzMinIncSize = 6;// indexPrzSize[Sym]
            const VolMinValSize = 0;
            tick.LastPrz = utils.toPrecision2(Number(tick.Prz || 0), PrzMinIncSize, 8);
            const rfpre = tick.Prz24 === 0 ? 0 : (tick.Prz - tick.Prz24) / tick.Prz24 * 100;
            tick.rfpre = (rfpre).toFixed(2) + '%';
            tick.rfpreColor = rfpre > 0 ? 1 : rfpre === 0 ? 0 : -1;
            tick.rf = utils.toPrecision2(Number(tick.Prz || 0) - Number(tick.Prz24 || 0), PrzMinIncSize, 8);
            tick.Volume24 = Number(tick.Volume24 || 0).toFixed(VolMinValSize);
            tick.distSym = (param.Sym).split('_')[1] + window.gI18n.$t('10413');// 指数
        } else if (AssetD) {
            let tick = Object.assign({}, this.tickDefault);
            tick = Object.assign(tick, param);
            const PrzMinIncSize = utils.getFloatSize(utils.getFullNum(AssetD.PrzMinInc || 0));
            const VolMinValSize = utils.getFloatSize(utils.getFullNum(AssetD.OrderMinQty || 0));

            const rfpre = tick.Prz24 === 0 ? 0 : (tick.LastPrz - tick.Prz24) / tick.Prz24 * 100;
            tick.distSym = this.getSymDisplayName(AssetD, tick.Sym);
            tick.rfpre = (rfpre).toFixed(2) + '%';
            tick.rfpreColor = rfpre > 0 ? 1 : rfpre === 0 ? 0 : -1;
            tick.rf = (Number(tick.LastPrz || 0) - Number(tick.Prz24 || 0)).toFixed(PrzMinIncSize);
            // 最新价格
            tick.LastPrz = Number(tick.LastPrz || 0).toFixed(PrzMinIncSize);
            // 24H成交量
            tick.Volume24 = Number(tick.Volume24 || 0).toFixed(VolMinValSize);
            tick.Volume24ForUSDT = (Number(tick.Volume24 || 0) * tick.LastPrz).toFixed(4);
            // 24H成交额
            tick.Turnover24 = Number(tick.Turnover24 || 0).toFixed(VolMinValSize);
            tick.Turnover24ForUSDT = (Number(tick.Turnover24 || 0) * tick.LastPrz).toFixed(4);
            // 标记价格
            tick.SettPrz = Number(tick.SettPrz || 0).toFixed(PrzMinIncSize);
            // 指数价格
            //  tick.indexPrz = indexTick?Number(indexTick.Prz || indexTick.LastPrz || 0).toFixed(PrzMinIncSize):'--';
            // 24小时最高
            tick.High24 = Number(tick.High24 || 0).toFixed(PrzMinIncSize);
            // 24小时最低
            tick.Low24 = Number(tick.Low24 || 0).toFixed(PrzMinIncSize);
            // 当前周期资金费率
            tick.FundingLongR = (Number(tick.FundingLongR || 0) * 100).toFixed(4) + '%';
            // 下个周期预测的资金费率
            tick.FundingPredictedR = (Number(tick.FundingPredictedR || 0) * 100).toFixed(4) + '%';

            // 持仓量
            tick.OpenInterest = Number(tick.OpenInterest || 0).toFixed(VolMinValSize);
            tick.OpenInterestForUSDT = (Number(tick.OpenInterest || 0) * tick.LastPrz * (AssetD.LotSz || 0)).toFixed(4);

            tick.TrdCls = AssetD.TrdCls;
            tick.FromC = AssetD.FromC;
            tick.ToC = AssetD.ToC;

            return tick;
        } else {
            return false;
        }
    },
    //  获取显示的合约名称
    getSymDisplayName: function (ass, Sym) {
        if (ass) {
            if (ass.TrdCls === 3) {
                if ((ass.Flag & 1) === 1) {
                    return I18n.$t('10048', { value: ass.ToC });// ass.ToC + ' 永续'
                } else {
                    return I18n.$t('10048', { value: ass.ToC + '/' + ass.SettleCoin });// ass.ToC + '/' + ass.SettleCoin + ' 永续'
                }
            } else if (ass.TrdCls === 1) {
                if (Sym && Sym.includes(`@`)) {
                    return Sym.split('@')[0];
                } else {
                    return Sym;
                }
            } else if (ass.TrdCls === 2) {
                return I18n.$t('10255', { value1: ass.SettleCoin, value2: new Date(ass.Expire).format('MMdd') });// ass.SettleCoin + ' 季度' + new Date(ass.Expire).format('MMdd')
            } else {
                return Sym;
            }
        } else if (Sym && Sym.includes(`@`)) {
            return Sym.split('@')[0];
        } else {
            return Sym;
        }
    },
    //  初始化首页需要请阅的行情
    initHomeNeedSub: function (syms, list) {
        const tickList = JSON.parse(JSON.stringify(list));
        this.subTick(utils.setSubArrType('tick', [...syms]));
        this.tickData = tickList;
    }
};