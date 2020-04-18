
export class CConf  {
    Active = {
        Name:"www.gmex.io",
        WebAPI:"https://api-v1-01.gmex.io/www",
        WSMKT:"wss://ws-v1-01.gmex.io/v1/market",
        WSTRD:"wss://ws-v1-01.gmex.io/v1/trade"
    }
    M = {
        "dev": {
            Name:"开发89环境",
            WebAPI:"http://gs.gmex.io:8888",
            WSMKT:"ws://gs.gmex.io:20080/v1/market",
            WSTRD:"ws://gs.gmex.io:50301/v1/trade"
        }
        ,"prod": {
            Name:"www.gmex.io",
            WebAPI:"https://api-v1-01.gmex.io/www",
            WSMKT:"wss://ws-v1-01.gmex.io/v1/market",
            WSTRD:"wss://ws-v1-01.gmex.io/v1/trade"
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
