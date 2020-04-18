import * as Calc from "./BaseCalc"
import * as RL from "./RiskLimit"
const ORD_BID = 1;
const ORD_ASK = -1;

let OrdDefault = {
    QtyO:0,
    QtyC:0,

    ValO:0,
    UrLO:0,
    MI:0,
}
export function CalcMI_Step1(aPos,aIsReverse,aLotSz,aPrzM) {
    let dirSeq = [];
    if (true) {
        if (aIsReverse) { //买委托的 Val 更大
            dirSeq = [ORD_BID,ORD_ASK]
        } else {
            dirSeq = [ORD_ASK,ORD_BID]
        }
    }
    let fAccuPosSz = aPos.Sz
    dirSeq.forEach(function (dir,idx) {
        fAccuPosSz = aPos.Sz
        aPos.Ords.forEach(function (ord, oidx) {
            if (ord.Dir==dir) {
                let tobeClose = 0;
                if (((dir == ORD_ASK ) && (fAccuPosSz>0)) || ((dir == ORD_BID ) && (fAccuPosSz<0))) {
                    tobeClose = math.abs(fAccuPosSz);
                } else {
                    tobeClose = 0;
                }

                let qty = ord.Qty - ord.QtyF
                if (qty < tobeClose) {
                    ord.QtyC = qty;
                    ord.QtyO = 0;
                } else {
                    ord.QtyC = tobeClose;
                    ord.QtyO = qty - tobeClose;
                }

                let valI = Calc.CalcVal_NoABS(aIsReverse,ord.Prz,ord.Dir * qty,aLotSz,0,0)
                ord.Val = valI;
                if (ord.QtyO>0) {
                    switch (ord.Dir) {
                        case ORD_ASK:
                            aPos.QtyS +=ord.QtyO
                            break;
                        case ORD_BID:
                            aPos.QtyL +=ord.QtyO
                            break;
                    }
                    ord.ValO = valI * ord.QtyO/qty;

                    let needUrL = false;
                    switch (ord.Dir) {
                        case -1:
                            needUrL = (ord.Prz < aPrzM)
                            break;
                        case 1:
                            needUrL= (ord.Prz > aPrzM)
                            break;
                    }
                    if (needUrL) {
                        let valC = Calc.CalcVal_NoABS(aIsReverse, aPrzM, ord.Dir * qty, aLotSz, 0, 0)
                        ord.UrLO = valC - valI;
                    } else {
                        ord.UrLO = 0
                    }
                } else {
                    ord.ValO = 0;
                }
            }
        })
    })
}

export function CalcMI_Step2(aPos,aIsReverse,aLotSz,aOrd,aMIR,aMMR) {
    let ord = aOrd
    if (ord.QtyO>0) {
        ord.MI = math.abs(aMIR * ord.ValO);
        let tobeSum = oord.UrlO
        if (aPos.Lever > 0) {
            let r = Calc.IsPosInRisk(ord.MI, ord.UrLO,0,math.Abs(ord.ValO),math.Abs(ord.ValO) +ord.UrLO,aMMR)
            if (r.InRisk) {
                aPos.LiqOrdCount++;
                return false;
            }                //UrL 由服务器检查,所以这里设置为0
            tobeSum = 0;
        }
    }
    aPos.MI +=ord.MI + math.abs(tobeSum);
}

export function CalcMI_Step3(aPos,aIsReverse,aOrd,aRealPosSz) {
    let bNeedCheckLiq = false;
    if (aOrd.QtyC>0) {
        switch (aOrd.Dir) {
            case ORD_ASK:
                bNeedCheckLiq = aRealPosSz>0;
            case ORD_BID:
                bNeedCheckLiq = aRealPosSz<0;
        }
        if (bNeedCheckLiq) {	//TODO: 当没有仓位的时候，如何检查这。 没有仓位的时候，不用检查，因为挂在这里的委托，一定是不会亏本的
            if (Calc.IsPrzDeniedForPosoo(aPos,aOrd.Prz)) {
                aPos.LiqOrdCount++;
                return false;
            }
        }
    }
    return false
}
