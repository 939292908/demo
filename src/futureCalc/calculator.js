import utils from "../utils/utils";
import library from './library'
/**
 * 本文件为合约计算器相关计算方法
 */
let LotSz = 0 
let PrzM  = 0
let FeeTkR = 0
let PrzMinInc = 0
let PrzMax = 0
let PrzMinIncSize = 0
let zero = 0
let AssetDMIR = 0

// store.state.futures.assetD //当前
// state.RiskLimit[data.Sym].RiskLimit //风险限额

let params = {
    SZ: 0,         // 开仓数量
    PrzIni: 0,     // 开仓价格
    PrzCls: 0,     // 平仓价格
    type: 99,        // 合约类型 1：正向 ，-1：反向， 0：定期
    Base: 0,    // 基础风险限额：Base
    Step: 0,     // 基础风险限额：步长Step
    BaseMIR: 0,
    StepIR: 0, 
    BaseMMR: 0, 
    StepMR: 0,  
    Lever: 0,       // 杠杆Lever
    model: 0,       // 1:盈亏计算 2：平仓价格 3：强平价格
    Dir: 0,         // 1: 【做多】 -1: 【做空】
    buyModel: 0,    // 1: 【全仓】 -1：【逐仓】

    profit: 0,     // 目标收益 平仓
    profitType: 0,  // 目标收益类型 1【目标收益】 2【目标收益率】
    WltBal: 0,    // 钱包余额
    MgnISO: 0,    // 追加保证金
    aMMType: 0, //保证金公式选择，0: 默认，1: 开仓价值/杠杆 
}

function Calculator(curSym) {
    if(!curSym) return 
    // console.log("init Calculator=", curSym, this )
    LotSz         = this.LotSz = curSym.LotSz
    PrzM          = this.PrzM  = curSym.PrzM
    FeeTkR        = this.FeeTkR  = curSym.FeeTkrR
    PrzMinInc     = this.PrzMinInc = curSym.PrzMinInc
    PrzMax        = this.PrzMax = curSym.PrzMax
    PrzMinIncSize = curSym.PrzMinIncSize
    AssetDMIR     = curSym.MIR
    this.CurFutures_Sym = curSym
    this.params = params
}



Calculator.prototype.getResult = function( data ){
    if( data ){
        for(let key in data ){
            if( this.params.hasOwnProperty(key) ){
                this.params[key] = Number( data[key]  || 0 )
            }
        }
        params = Object.assign(params,this.params)
        params.SZ = params.Dir*params.SZ
    }
    getVal()
    // getRisklimit()
    getMMRMIR()
    let callFun = {1: getModel_1, 2: getModel_2, 3: getModel_3}
    return callFun[this.params.model]()
}


// 计算价值
let Val = 0
let ValCls = 0
let getVal = function() {
    let isReverse = (params.type==-1 ||  params.type==0)?1:0
    Val    = library.calcVal(isReverse, params.PrzIni, params.SZ, LotSz)
    ValCls = library.calcVal(isReverse, params.PrzCls, params.SZ, LotSz)
}

// 计算新的MMR和MIR
let MIR = { new:0 }
let MMR = { new:0 }
let Lvr = { new:0 }
let getMMRMIR  = function() {
    //此处风险限额无需检查已有仓位和委托，只计算当前面板输入的开仓数量
    let {aMIR, aMMR, aSzNetLong, aSzNetShort} = library.calcMMRAndMIR(false, 0, 0, params.SZ, params)
    MIR.new = aMIR
    MMR.new = aMMR
}

let getModel_1 = ()=> {
    let result = {
        'BaseKeepPrice': 0,         // 基础维持保证金
        'PositionPrice': 0,         // 仓位价值
        'ProfitLoss': 0,            // 盈亏
        'ProfitLossPer': 0,         // 盈亏百分比（收益率）
    }
    //基础保证金计算全仓：ValIni*MMR，逐仓：ValIni/Min(Lever, 1/MIR风险限额)
    if(params.buyModel == 1){ //全仓
        if(params.aMMType == 1){
            let Lever = 1/(AssetDMIR)
            result.BaseKeepPrice = Math.abs(Val)/Lever
        }else{
            result.BaseKeepPrice = Math.abs(Val) * MMR.new
        }
    }else if(params.buyModel == -1){ //逐仓
        result.BaseKeepPrice = Math.abs(Val) / Math.min(params.Lever, 1 / MIR.new)
    }
    
    //仓位价值
    result.PositionPrice = Math.abs(Val)
    //盈亏ValCls-ValIni
    result.ProfitLoss = ValCls - Val
    //盈亏百分比（收益率）
    result.ProfitLossPer = ( result.ProfitLoss*100 ) / result.BaseKeepPrice

    result = result
    result.ProfitLossPer = result.ProfitLossPer  + '%'
    return formateLen(result)
}

// 平仓价格
let getModel_2 = () => {
    let result = {
        'BaseKeepPrice': 0, // 基础维持保证金
        'PrzCls': 0, // 平仓价格
    }
    //基础保证金计算全仓：ValIni*MMR，逐仓：ValIni/Min(Lever, 1/MIR风险限额)
    if(params.buyModel == 1){ //全仓
        if(params.aMMType == 1){
            let Lever = 1/(AssetDMIR)
            result.BaseKeepPrice = Math.abs(Val)/Lever
        }else{
            result.BaseKeepPrice = Math.abs(Val) * MMR.new
        }
    }else if(params.buyModel == -1){ //逐仓
        result.BaseKeepPrice = Math.abs(Val) / Math.min(params.Lever, 1 / MIR.new)
    }

    if(params.type == -1 || params.type == 0){ //反向永续/定期
        if (params.profitType == 1) { 
            //收益 -(Sz*LotSz)/(PNL+ValIni)
            result.PrzCls = -(params.SZ*LotSz)/(params.profit+Val)
        }else if(params.profitType == 2){ 
            //收益率-(Sz*LotSz)/(ROE*MM+ValIni)
            result.PrzCls = -(params.SZ*LotSz)/(params.profit/100*result.BaseKeepPrice+Val)
        }
    }else if(params.type == 1){//正向永续
        if (params.profitType == 1) { 
            //收益 (PNL+ValIni)/(Sz*LotSz)
            result.PrzCls = (params.profit+Val)/(params.SZ*LotSz)
        }else if(params.profitType == 2){ 
            //收益率(ROE*MM+ValIni)/(Sz*LotSz)
            result.PrzCls = ((params.profit/100)*result.BaseKeepPrice+Val)/(params.SZ*LotSz)
        }
    }

    result = formateLen(result)
    result.PrzCls = result.PrzCls < 0 ? '--' : result.PrzCls
    return result
}

// 强平价格
let getModel_3 = () => {
    let result = {
        'QiangPingPrice': 0,            // 预估强平价
        "PoChanPrice": 0,               // 破产价
    }

    let WltForPos = 0;
    if(params.buyModel == 1){
        WltForPos = params.WltBal
    }else if(params.buyModel == -1){
        //ValIni/Min(Lever, 1/MIR风险限额) + MgnISO
        WltForPos = Math.abs(Val)/Math.min(params.Lever, 1/MIR.new) + params.MgnISO
    }
    FeeTkR = 0


    let isReverse = params.type==-1 || params.type==0?1:0
    let PrzLiq = library.calcPrzLiq(isReverse, params.PrzIni, Val, WltForPos, FeeTkR, MMR.new, LotSz, params.SZ, PrzMinInc, PrzMax)
    

    result.PoChanPrice    = '--'

    result.QiangPingPrice = PrzLiq
    let _result = formateLen( result );
    if( ( params.Dir==-1 && _result.QiangPingPrice< params.PrzIni ) || (params.Dir==1 && _result.QiangPingPrice> params.PrzIni) ){
        _result.QiangPingPrice = '--'
        _result.PoChanPrice = '--'
    }
    return result
}

let formateLen = (data,len) => {
    for(let key in data){
        if (isNaN(data[key].toString().split('%')[0]) || data[key].toString().indexOf('Infinity') != -1) {
          data[key] = 0
        }

        if (key == 'PrzCls' || key == 'QiangPingPrice' || key == "PoChanPrice") {
            data[key] = data[key].toFixed2(utils.getFloatSize(utils.getFullNum(PrzMinInc)) + 1) //平仓价格、强平价格类的计算保留最小价格变动+一位小数
        } else if (key == "ProfitLossPer") {
            data[key] = Number(data[key].toString().split('%')[0]).toFixed2(2) + '%' //盈亏%保留两位小数
        }else {
            if(params.type == 1){
                data[key] = data[key].toFixed2(4) //仓位价值 、基础保证金、盈亏 四位小数
            }else {
                data[key] = data[key].toFixed2(6) //仓位价值 、基础保证金、盈亏 六位小数
            }
            
        }
    }
    return data
}

export default Calculator