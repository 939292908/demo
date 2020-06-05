
import Conf from "./Conf"
let instConf = new Conf(process.env.BUILD_ENV)

let api = instConf.GetActive()

console.log('instConf.GetActive', api, api.WSMKT, api.WSTRD, api.WebAPI)

export default {
    Mkt:{
        Host: api.WSMKT,//"wss://ws-v1-01.xmex.co/v1/market",
        Type: "mkt", //mkt/ trd
    },
    Trd:{
        Host: api.WSTRD,//"wss://ws-v1-01.xmex.co/v1/trade",
        Type: "trd", //mkt/ trd
        UserSecr: "", //请自行申请
        SecretKey: "",//请自行申请
        UserName: "",//请自行申请
        AuthType: 2
    },
    Web:{
        WebAPI: api.WebAPI,//"wss://ws-v1-01.xmex.co/v1/trade",
        Type: "web", 
    },
    Conf: instConf
}
