export function Calc(aRL, aSz,aOrdMinQty, oR) {
    oR.Steps = 0;
    oR.MIR = s.BaseMIR
    oR.MMR = s.BaseMMR
    oR.LiqCnt = 0;
    {
        if (aSz == 0) {
            return
        } else {
            let oMMR = aRL.BaseMMR;
            let oMIR = aRL.BaseMIR;
            let oLiqCnt = 0;
            aSz = math.abs(aSz)
            var steps = (aSz - aRL.Base) / aRL.Step;
            if (steps > 0) {		//升档了
                steps = math.Floor(steps);
                let szForSteps = aRL.Base + steps * aRL.Step;	//当前档位的最低张数
                if (szForSteps < aSz) {
                    oLiqCnt = aSz - szForSteps //超出的张数
                } else {
                    oLiqCnt = aOrdMinQty;
                }
                oR.Steps = int(steps + 1);
                oLiqCnt = math.Max(1,oLiqCnt);
                oMMR +=(steps+1) * aRL.StepMR
                oMIR +=(steps+1) * aRL.StepIR
                oMMR = math.Min(1.0,oMMR)
                oMIR = math.Min(1.0,oMIR)
            } else {
                steps = 0;
            }
            oR.LiqCnt = oLiqCnt;
            oR.MMR = oMMR
            oR.MIR = oMIR
        }
    }
}

export function Find(aSym) {
    return {}
}
