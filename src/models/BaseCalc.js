export function CalcVal_NoABS(aIsreverse,aPrz,aSz,aLotSz,aR1,aR2) {
    let val = 0
    let valR1 = 0
    let valR2 = 0
    if (aIsreverse) {
        val = -aSz*aLotSz/aPrz
    } else {
        val = aSz*aLotSz*aPrz
    }
    valR1 = val * aR1
    valR2 = val * aR2
    return val;
}


export function IsPosInRisk(aWltForPos, aUPNL, aFeeEst, aABSValIni, aMinRate){
    let rMissingMgn = aABSValIni * aMinRate
    rMissingMgn = (aWltForPos+aUPNL-aFeeEst) - rMissingMgn
    return {
        Missing:rMissingMgn,
        InRisk: rMissingMgn < 0
    }
}

export function IsPrzDeniedForPos(aPos, aPrz) {
    if (aPos.Sz < 0) {
        return aPrz > s.PrzLiq;
    } else if (aPos.Sz > 0) {
        return (aPrz < s.PrzLiq)
    }
    return false;
}
