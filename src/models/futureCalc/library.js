import ObjectDefault from './objectDefault';
const library = {};
/**
 * 计算仓位相关价值
 * @isReverse 1:反向，0:正向
 */
library.calcVal = function(isReverse, Prz, Sz, LotSz) {
    if (!Prz) {
        return 0;
    }
    if (isReverse) {
        return -1 / Prz * Sz * LotSz;
    } else {
        return Prz * Sz * LotSz;
    }
};

/**
 * 计算强平价格
 */

library.calcPrzLiq = function(isReverse, PrzIni, ValIni, WltForPos, FeeTkrR, MMR, LotSz, Sz, PrzMinInc, PrzMax) {
    let f1 = 0; let f2 = 0; let f3 = 0; let PrzLiq = 0;

    f1 = (LotSz || 0) * PrzIni * Sz;
    f2 = (LotSz || 0) * Sz;

    if (isReverse) {
        f3 = PrzIni * WltForPos;

        PrzLiq = (Math.abs(f1) * FeeTkrR + f1) / (f2 + f3 - Math.abs(f2) * MMR);
    } else {
        f3 = Math.abs(Sz) * FeeTkrR * LotSz;

        PrzLiq = (Math.abs(ValIni) * MMR + f1 - WltForPos) / (f2 - f3);
    }

    if (Sz > 0) {
        if (PrzLiq <= 0) {
            PrzLiq = PrzMinInc;
        } else {
            PrzLiq = PrzLiq < PrzMinInc ? PrzMinInc : PrzLiq > PrzMax ? PrzMax : PrzLiq;
        }
    } else if (Sz < 0) {
        if (PrzLiq <= 0) {
            PrzLiq = PrzMax;
        } else {
            PrzLiq = PrzLiq < PrzMinInc ? PrzMinInc : PrzLiq > PrzMax ? PrzMax : PrzLiq;
        }
    }

    return PrzLiq;
};

/**
 *
 * @param {Array} orderArr
 */
library.orderArrToPId = function(orderArr) {
    const orderForPid = [];
    for (let i = 0; i < orderArr.length; i++) {
        const order = orderArr[i];
        if (!orderForPid[order.PId]) {
            orderForPid[order.PId] = [];
        }
        orderForPid[order.PId].push(order);
    }
    return orderForPid;
};

/**
 *
 * @param {Array} walletArr
 */
library.walletArrToSym = function(walletArr) {
    const walletObj = {};
    for (let i = 0; i < walletArr.length; i++) {
        const wallet = walletArr[i];
        walletObj[wallet.Coin] = walletArr[i];
    }
    return walletObj;
};

/**
 * 委托按价格排序
 * @param {Array} orderArr
 */
library.orderSplitAndSort = function(orderArr) {
    const orderBuy = []; const orderSell = []; let QtyBuy = 0; let QtySell = 0;
    for (let i = 0; i < orderArr.length; i++) {
        const item = orderArr[i];
        if (item.Dir === 1) {
            orderBuy.push(item);
            QtyBuy += item.Qty;
        } else if (item.Dir === -1) {
            orderSell.push(item);
            QtySell += item.Qty;
        }
    }
    orderBuy.sort(function(a, b) { // 买委托按委托价降序排列
        return b.Prz - a.Prz;
    });
    orderSell.sort(function(a, b) { // 买委托按委托价升序排列
        return a.Prz - b.Prz;
    });
    return { orderBuy, orderSell, QtyBuy, QtySell };
};

/**
 * 计算风险限额
 */
library.calcMMRAndMIR = function(isStopLAndP, orderBuy, orderSell, Sz, RS) {
    const absSz = Math.abs(Sz); let SzNetLong = 0; let SzNetShort = 0;

    let SzBuy = Sz > 0 && !isStopLAndP ? absSz : 0;
    let SzSell = Sz > 0 || isStopLAndP ? 0 : absSz;

    // 买委托
    for (let i = 0; i < orderBuy.length; i++) {
        const item = orderBuy[i];
        const _Qty = item.Qty - item.QtyF;
        if (SzSell > 0) {
            SzSell -= _Qty;
            if (SzSell < 0) {
                if (!((item.OrdFlag & 2) !== 0)) { // 不是只减仓
                    SzNetLong += Math.abs(SzSell);
                }
            }
        } else {
            if (!((item.OrdFlag & 2) !== 0)) { // 不是只减仓
                SzNetLong += _Qty;
            }
        }
    }

    // 卖委托
    for (let i = 0; i < orderSell.length; i++) {
        const item1 = orderSell[i];
        const _Qty = item1.Qty - item1.QtyF;
        if (SzBuy > 0) {
            SzBuy -= _Qty;
            if (SzBuy < 0) {
                if (!((item1.OrdFlag & 2) !== 0)) { // 不是只减仓
                    SzNetShort += Math.abs(SzBuy);
                }
                SzBuy = 0;
            }
        } else {
            if (!((item1.OrdFlag & 2) !== 0)) { // 不是只减仓
                SzNetShort += _Qty;
            }
        }
    }

    const f1 = SzNetLong + SzNetShort + absSz;

    const baseMIR = RS.BaseMIR; const baseMMR = RS.BaseMMR; let aMIR = 0; let aMMR = 0;
    if (f1 < RS.Base) {
        aMIR = baseMIR;
        aMMR = baseMMR;
    } else {
        aMIR = baseMIR + (parseInt((f1 - RS.Base) / RS.Step + 1) * RS.StepIR);
        aMMR = baseMMR + (parseInt((f1 - RS.Base) / RS.Step + 1) * RS.StepMR);
    }

    return { aMIR, aMMR, aSzNetLong: SzNetLong, aSzNetShort: SzNetShort };
};

/**
 * 计算委托保证金
 * @param {Array} orderBuy
 * @param {Array} orderSell
 * @param {Number} SettPrz
 * @param {Object} ass
 * @param {Number} aMIR
 * @param {Number} Lever
 * @param {Number} MIR 委托保证金率（不是风险限额）
 */
library.calcOrderMI = function(isStopLAndP, orderBuy, orderSell, SettPrz, ass, aMIR, Lever, Sz, NewMIR, MIRMy) {
    let SzBuy = Sz > 0 && !isStopLAndP ? Math.abs(Sz) : 0;
    let SzSell = Sz > 0 || isStopLAndP ? 0 : Math.abs(Sz);
    const _aMIR = NewMIR || aMIR;
    let aMISum = 0;
    let _MIR = 0;
    const isReverse = (ass.Flag & 1) === 1 || ass.TrdCls === 2 ? 1 : 0;

    if (Lever === 0) {
        _MIR = Math.max(MIRMy || 0, _aMIR);
    } else {
        _MIR = 1 / Math.min(Lever, 1 / _aMIR);
    }

    for (let i = 0; i < orderBuy.length; i++) {
        const item = orderBuy[i]; let ValIni = 0; let ValM = 0; /* let rateMIR = 0; */ let MI = 0; let FeeIni = 0; let UrL = 0; let aMI;

        const Qty = item.Qty - item.QtyF;
        if (SzSell > 0) {
            SzSell -= Qty;
            if (SzSell < 0) {
                const Sz = Math.abs(SzSell);

                ValIni = this.calcVal(isReverse, item.Prz, item.Dir * Sz, ass.LotSz);
                ValM = this.calcVal(isReverse, SettPrz, item.Dir * Sz, ass.LotSz);
                SzSell = 0;
            }
        } else if (SzSell === 0) {
            ValIni = this.calcVal(isReverse, item.Prz, item.Dir * Qty, ass.LotSz);
            ValM = this.calcVal(isReverse, SettPrz, item.Dir * Qty, ass.LotSz);
        }
        if (SzSell <= 0 && !((item.OrdFlag & 2) !== 0)) { // 不是只减仓
            if (item.MIRMy) {
                if (Lever === 0) {
                    _MIR = Math.max(item.MIRMy, _aMIR);
                }
            }
            MI = Math.abs(ValIni) * _MIR;
            FeeIni = Math.abs(ValIni) * (ass.FeeTkrR || 0);
            UrL = ValM - ValIni < 0 ? ValM - ValIni : 0;
            if (Lever === 0) {
                // rateMIR = _MIR;
                aMI = MI + FeeIni + Math.abs(UrL);
            } else {
                // rateMIR = 1 / Math.min(Lever, 1 / _MIR);// Math.max(1/Lever, _MIR)
                aMI = MI + FeeIni;
            }
            aMISum += aMI;
        }
    }
    for (let i = 0; i < orderSell.length; i++) {
        const item1 = orderSell[i]; let ValIni1 = 0; let ValM1 = 0; /* let rateMIR1 = 0; */ let MI1 = 0; let FeeIni1 = 0; let UrL1 = 0; let aMI1 = 0;

        const Qty = item1.Qty - item1.QtyF;
        if (SzBuy > 0) {
            SzBuy -= Qty;
            if (SzBuy < 0) {
                const Sz1 = Math.abs(SzBuy);
                ValIni1 = this.calcVal(isReverse, item1.Prz, item1.Dir * Sz1, ass.LotSz);
                ValM1 = this.calcVal(isReverse, SettPrz, item1.Dir * Sz1, ass.LotSz);
                SzBuy = 0;
            }
        } else if (SzBuy === 0) {
            ValIni1 = this.calcVal(isReverse, item1.Prz, item1.Dir * Qty, ass.LotSz);
            ValM1 = this.calcVal(isReverse, SettPrz, item1.Dir * Qty, ass.LotSz);
        }
        if (SzBuy <= 0 && !((item1.OrdFlag & 2) !== 0)) { // 不是只减仓
            if (item1.MIRMy) {
                if (Lever === 0) {
                    _MIR = Math.max(item1.MIRMy, _aMIR);
                }
            }
            MI1 = Math.abs(ValIni1) * _MIR;
            FeeIni1 = Math.abs(ValIni1) * (ass.FeeTkrR || 0);
            UrL1 = ValM1 - ValIni1 < 0 ? ValM1 - ValIni1 : 0;
            if (Lever === 0) {
                // rateMIR1 = _MIR;
                aMI1 = MI1 + FeeIni1 + Math.abs(UrL1);
            } else {
                // rateMIR1 = 1 / Math.min(Lever, 1 / _MIR);// Math.max(1/Lever, _MIR)
                aMI1 = MI1 + FeeIni1;
            }

            aMISum += aMI1;
        }
    }
    return aMISum;
};

/**
 * 对象字段补充
 * @params {Object} obj 需要补充字段的对象
 * @params {Object} objDefault 字段模版
 */
library.completionFields = function(obj, objDefault) {
    for (const key in objDefault) {
        const item = objDefault[key];
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            obj[key] = item;
        }
    }
};

library.addFieldForPosAndWltAndOrd = function(posArr, wallets, orderArr, assetD) {
    for (let i = 0; i < posArr.length; i++) {
        this.completionFields(posArr[i], ObjectDefault.PosDefault);
    }

    // 补充wallets中缺少的币种
    for (const key in assetD) {
        const item = assetD[key];
        if (item.TrdCls === 2 || item.TrdCls === 3) {
            const SettleCoin = item.SettleCoin;
            const i = wallets.findIndex(item => {
                return item.Coin === SettleCoin;
            });
            if (i === -1) {
                wallets.push({
                    Coin: SettleCoin
                });
            }
        }
    }

    for (let i = 0; i < wallets.length; i++) {
        this.completionFields(wallets[i], ObjectDefault.WltDefault);
    }

    for (let i = 0; i < orderArr.length; i++) {
        this.completionFields(orderArr[i], ObjectDefault.OrdDefault);
    }
};

export default library;