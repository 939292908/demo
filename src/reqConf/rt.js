
import { Conf } from "./Conf"
let api = Conf.GetActive()

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
    }
}
