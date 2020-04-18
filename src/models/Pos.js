import * as WltAPI from "./Wlt"
import * as OrdAPI from "./Ord"
import * as RLAPI from "./RiskLimit"
//填补的字段，用于调用Obj.AffirmFields,对一个Position进行缺省字段填充
let PosDefault = {
    Sym:"",
    //委托保证金
    MI:0,
    //维持保证金
    MM:0,
    //账面盈亏
    UPNL:0,
    //涨跌幅. 当RFR接近或达到MMRReal的时候，仓位会被强制平仓(简称爆仓),如果平仓失败，则仓位会被系统接管。
    RFR:0,
    //仓位价值
    Val:0,
    // 下面两个概念是重叠的，互为倒数
    //实际杠杆
    LvrReal:0,
    //保证金率
    MMRReal:0,
    //所有委托
    Ords:[],
    OrdQtyL:0,
    OrdQtyS:0,
}

export function CalcVal(aIsReverse, aPrz, aLotSz, aSz) {
    if (aIsReverse) {
        return - ( aSz * aLotSz / aPrz )
    } else {
        return ( aSz * aLotSz * aPrz )
    }
}

export function UpdateVal_MM_UPNL(aPos, aIsReverse, aLotSz,  aPrz, aMMR) {
    if (aPrz<=0) {
        aPrz = aPos.PrzIni
    }
    if (aPos.Sz==0 || aPos.PrzIni <=0) {
        aPos.Val = aPos.MM = aPos.UPNL = 0;
    } else {
        aPos.Val = CalcVal(aIsReverse,aPos.PrzIni,aLotSz,aPos.Sz);
        let ValM = CalcVal(aIsReverse,aPos.aPrz,aLotSz,aPos.Sz);
        aPos.UPNL = ValM - aPos.Val
        if (aPos.Lever > 0) {
            aPos.MM = (math.abs(aPos.Val)/aPos.Lever) + pos.MgnIso
        } else {
            aPos.MM = aMMR * math.abs(aPos.Val)
        }
    }
    return aPos
}

export function Update_RFR(aPos, aIsReverse,aPrz) {
    if (aPrz==0 || aPos.PrzIni==0) {
        aPos.RFR = 0;
    } else {
        if (aIsReverse) {
            aPos.RFR = 1 - aPos.PrzIni / aPrz
        } else {
            aPos.RFR = aPrz / aPos.PrzIni
        }
    }
    return aPos
}

export function Update_FundUsage(aPos, aLever, aWltForPos) {
    if (aPos.Sz==0) {
        aPos.MMRReal = 0;
        aPos.LvrReal = 0;
    } else {
        if (aLever>0) {
            aWltForPos = aPos.MM
        }
        {
            aPos.LvrReal = math.abs(aPos.Val / aWltForPos)
            aPos.MMRReal = 1 / LvrReal
        }
    }
    return aPos;
}
export function Update_FundUsageForAll(aPoses,aWlt) {
    let wfp = WltAPI.CalcWltForPoses(WltAPI);
    aPoses.forEach(function (pos, idx) {
        if (pos.Lever>0) {
            Update_FundUsage(pos,pos.Lever,0)
        } else {
            Update_FundUsage(pos,pos.Lever,WltAPI.CalcWFPForPos(wfp,aPoses,pos.PId))
        }
    });
}

export function CalcMgnInit(aPos,aIsReverse,aLotSz,aPrzM,aRiskConf) {
    aPos.QtyS = 0;
    aPos.QtyL = 0;
    aPos.MI = 0;
    aPos.LiqOrdCount = 0;
    aPos.Ords.forEach(function (ord, idx) {
        OrdAPI.CalcMI_Step1(aPos,aIsReverse,aLotSz,aPrzM)
    })
    //计算风险限额
    RLAPI.Calc(aRiskConf,math.abs(aPos.Sz) + aPos.QtyL + aPos.QtyS,1,aPos);
    //计算委托保证金
    aPos.Ords.forEach(function (ord, idx) {
        OrdAPI.CalcMI_Step2(aPos,aIsReverse,aLotSz,ord,aPos.MIR,aPos.MMR);
    })
    //计算维持保证金
    CalcMgnMaint(aPos,aIsReverse,aLotSz,aPrzM,aPos.MMR);
    //计算强平价格
}

export function CalcMgnMaint(aPos,aIsReverse,aLotSz,aPrz,aMMR) {
    UpdateVal_MM_UPNL(aPos,aIsReverse,aLotSz,aPrz,aMMR)
}

export function CheckLiqOrder(aPos) {
    aPos.Ords.forEach(function (ord, idx) {
        OrdAPI.CalcMI_Step3(aPos,aIsReverse,ord,aPos.Sz);
    })
}

