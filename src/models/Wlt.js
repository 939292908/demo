import * as AssetAPI from "./Asset"
import * as PosAPI from "./Pos"
import * as RLAPI from "./RiskLimit"
import * as Calc from "./BaseCalc"
const PRZ_INVERSE = 1
const WltStatus_LIQUIDATION = 1
//填补的字段，用于调用Obj.AffirmFields,对一个Wlt进行缺省字段填充
let WltDefault = {
    //维持保证金率
    Depo:0,
    //委托保证金率
    Wdrw:0,
    //价值放大系数
    PNL:0,
    Spot:0,
    ////////////////////////////
    Gift:0,
    PNLG:0,
    //委托保证金
    MI:0,
    // 可取余额
    Wdrwable:0,
    // 仓位数组
    Poses:[]
    //
}

export function CalcWFPForPos(aWFPAll,aPoses, aPId) {
    aPoses.forEach(function (pos, idx) {
        if (pos.PId != aPId) {
            if (pos.Lever > 0) {
                aWFPAll -=pos.MgnCalc + pos.MgnIso
            } else {
                aWFPAll -= pos.MM;
                if (pos.UPNL < 0) {
                    aWFPAll += pos.UPNL;
                }
            }
        }
    });
    return aWFPAll;
}

export function CalcWltForPoses(aWlt) {
    return aWlt.Depo
        + aWlt.PNL
        + aWlt.Spot
        + aWlt.Gift
        + aWlt.PNLG
        - aWlt.Wdrw
}

export function IsReverse(aAd) {
    return (aAd.Flag & PRZ_INVERSE!=0)
}
export function RecalcMarginAndRisk(aWlt) {
    let MgnCrossCalc = {
        TUrL:0,
        TUrP:0,
        TMM:0,
        TMI:0,
        TFeeM:0,
        TSz:0
    }
    aWlt.Poses.forEach(function (tctx,idx) {
        let ad = AssetAPI.Find(tctx.Sym)
        let fPrzM = ad.PrzM
        let isReverse = IsReverse(ad)

        let RiskConf = RLAPI.Find(tctx.Sym);

        PosAPI.CalcMgnInit(tctx,isReverse,ad.LotSz,fPrzM,RiskConf)

        MgnCrossCalc.TMI+=tctx.MI;
        MgnCrossCalc.TMM+=tctx.MM;
        if (tctx.UPNL < 0) {
            MgnCrossCalc.TUrL+=tctx.UPNL;
        }

        if (tctx.Sz!=0) {
            PosAPI.CalcMgnMaint(tctx,isReverse,ad.LotSz,aPrzM,tctx.MMR)
        } else {
            tctx.Val = 0;
            tctx.RPNL = 0;
        }
    })
    var mgnCrossF64 = CalcWltForPoses(aWlt);
    var hasPos = false;
    aWlt.Poses.forEach(function (tctx,idx) {
        if (tctx.Sz == 0) {
            tctx.PrzLiq = 0
            tctx.PrzBr = 0
            tctx.ROE = 0;
            tctx.ADLIdx = 0;
            return;
        }
        hasPos = hasPos || true
        let UrL2 = 0;
        let MM2 = 0;
        if (tctx.Lever>0) {
            UrL2 = 0
        } else {					//全仓保证金
            UrL2 = MgnCrossCalc.TUrL;	//这个是负数 。
            if (tctx.UPNL<0) {
                UrL2 -= tctx.UPNL;			// 去掉自身的亏损
            }
            UrL2 -= MgnCrossCalc.TMI;		//留下所有的委托的保证金

            MM2 = MgnCrossCalc.TMM;
            MM2 -= tctx.MgnTakenCross;
        }
        let ad = AssetAPI.Find(tctx.Sym)
        let fPrzMinInc = ad.PrzMinInc
        let fLotSz = ad.LotSz
        let FeeR = ad.FeeTkrR
        let isReverse = IsReverse(ad)

        let fSz = tctx.Sz.F64()
        let MMR = tctx.MMR
        let PrzIni = tctx.PrzIni

        FeeR = 0;

        {
            let WltForPos = 0;
            if (tctx.Lever>0) {
                WltForPos = tctx.MgnCalcAndMgnISO + tctx.PNLISO.F64()
            } else {
                WltForPos = mgnCrossF64 + UrL2 - MM2;
            }

            if (isReverse) {
                {
                    var fSzLotSz = fSz * fLotSz
                    var fABSSzLotSz = math.Abs(fSzLotSz)
                    var F1 = fSzLotSz*PrzIni
                    var F2 = WltForPos*PrzIni
                    var F4 = fSzLotSz + F2;
                    var F5 = F4  - fABSSzLotSz * MMR
                    var ABSF1 = math.Abs(F1)

                    let liq = 0;
                    let br  = 0;

                    if (F4==0) {
                        if (tctx.Sz > 0) {
                            br = 0;
                        } else {
                            br = 99999999.0;
                        }
                    } else {
                        br = F1/F4
                    };

                    if (F5==0) {
                        if (tctx.Sz > 0) {
                            liq = 0;
                        } else {
                            liq = 99999999.0;
                        }
                    } else {
                        liq = (ABSF1*FeeR + F1)/F5;
                    }
                    if (tctx.Sz > 0) {
                        if (br<=0) {
                            br = fPrzMinInc;
                        }
                        if (liq<=0) {
                            liq = fPrzMinInc;
                        }
                    } else {
                        if (br<=0) {
                            br = 99999999.0;
                        }
                        if (liq<=0) {
                            liq = 99999999.0;
                        }
                    }
                    tctx.PrzLiq = liq
                    tctx.PrzBr = br
                }
            } else {

                let fSzLotSz = fSz * fLotSz
                let fABSSzLotSz = math.Abs(fSzLotSz)
                let F1 = fSzLotSz*PrzIni - WltForPos
                //var F2 = WltForPos*PrzIni
                let F4 = fSzLotSz ;
                let F5 = F4  - fABSSzLotSz * FeeR

                let liq = 0;
                let br = 0;

                if (F4==0) {
                    if (tctx.Sz > 0) {
                        br = fPrzMinInc;
                    } else {
                        br = 99999999.0;
                    }
                } else {
                    br = F1/F4
                };

                if (F5==0) {
                    if (tctx.Sz > 0) {
                        liq = fPrzMinInc;
                    } else {
                        liq = 99999999.0;
                    }
                } else {
                    liq = (fABSSzLotSz*MMR*PrzIni + F1)/F5;
                }

                if (tctx.Sz > 0) {
                    if (br<=0) {
                        br = fPrzMinInc;
                    }
                    if (liq<=0) {
                        liq = fPrzMinInc;
                    }
                } else {
                    if (br<=0) {
                        br = 99999999.0;
                    }
                    if (liq<=0) {
                        liq = 99999999.0;
                    }
                }
                tctx.PrzLiq = liq
                tctx.PrzBr = br
            }
        }
        {
            //////////////////////////////////////////////////////////
            if (tctx.Lever>0) {
                if (Calc.IsPrzDeniedForPos(aPos,fPrzM)) {
                    SetStatus(aWlt,WltStatus_LIQUIDATION)
                }
            } else {
                if (tctx.Sign() > 0 && (fPrzM < (tctx.PrzLiq) || (PrzIni < tctx.PrzLiq ))) {
                    SetStatus(aWlt,WltStatus_LIQUIDATION)
                } else if (tctx.Sign() < 0 && ((fPrzM > tctx.PrzLiq  ) || (PrzIni > tctx.PrzLiq )) ){
                    SetStatus(aWlt,WltStatus_LIQUIDATION)
                }
            }
        }
        PosAPI.CheckLiqOrder(tctx)
        tctx.OrdHasRisk = (tctx.LiqOrdCount>0)
        if (tctx.OrdHasRisk) {
            SetStatus(aWlt,WltStatus_LIQUIDATION)
        };
    })

}
