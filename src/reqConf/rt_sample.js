// 请复制一份，命名为 rt.js
module.exports =  {
    Mkt:{
        Host: "wss://api-market.gmex.io/v1/market",
        Type: "mkt", //mkt/ trd
    }
    ,Trd:{
        Host: "wss://api-trade.gmex.io/v1/trade",
        Type: "trd", //mkt/ trd
        UserSecr: "请自行申请",
        SecretKey: "请自行申请",
        UserName: "请自行申请"
    }
}
