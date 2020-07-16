
export class CConf  {
    Active = {
        Name:"生产环境",
        WebAPI:"https://ss.abkjl.com/www",
        WSMKT:"wss://ss.abkjl.com/v1/market",
        WSTRD:"wss://ss.abkjl.com/v1/trade"
    }
    M = {
        "dev": {
            Name:"开发测试环境",
            WebAPI:"http://gs.eeeecloud.com:8888", 
            WSMKT:"ws://gs.eeeecloud.com:20080/v1/market", 
            WSTRD:"ws://gs.eeeecloud.com:50301/v1/trade", 
        }
        ,"prod": {
            Name:"生产环境",
            WebAPI:"https://ss.abkjl.com/www",
            WSMKT:"wss://ss.abkjl.com/v1/market",
            WSTRD:"wss://ss.abkjl.com/v1/trade"
        }
    }
    GetActive() {
        return this.Active
    }
    SetActive(aKey) {
        let newCfg = this.M[aKey]
        if (newCfg) {
            this.Active = newCfg
        }
    }
}


let instConf = new CConf()

instConf.SetActive(process.env.BUILD_ENV)

export {instConf as Conf}
