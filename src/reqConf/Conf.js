import _axios from '../libs/_axios'
let reqest = new _axios()
class Conf  {

    Active = {
        Id: 0,
        Name:"www.gmex.io",
        WebAPI:"https://ss.abkjl.com/www",
        WSMKT:"wss://ss.abkjl.com/v1/market",
        WSTRD:"wss://ss.abkjl.com/v1/trade"
    }
    M = {
        "dev": {
            "data": [],
            netLines:[
                {
                    Id: 0,
                    Name:"测试线路1",
                    WebAPI:"http://192.168.2.89:8888", //"http://gs.gmex.in:8888",
                    WSMKT:"ws://192.168.2.85:20080/v1/market", //"ws://gs.gmex.in:20080/v1/market",
                    WSTRD: "ws://192.168.2.85:50301/v1/trade", //"ws://gs.gmex.in:50301/v1/trade"
                },
                {
                    Id: 1,
                    Name:"测试线路1",
                    WebAPI:"http://192.168.2.89:8888", //"http://gs.gmex.in:8888",
                    WSMKT:"ws://192.168.2.85:20080/v1/market", //"ws://gs.gmex.in:20080/v1/market",
                    WSTRD: "ws://192.168.2.85:50301/v1/trade", //"ws://gs.gmex.in:50301/v1/trade"
                }
            ]
        }
        ,"prod": {
            "data": [
                "https://exsoss.oss-cn-hongkong.aliyuncs.com/svrs/gmex_lines_conf.json",
                "https://np-oss-web.oss-cn-shanghai.aliyuncs.com/svrs/gmex_lines_conf.json"
            ],
            netLines:[
                {
                    Id: 0,
                    Name:"S00",
                    WebAPI:"https://ss.abkjl.com/www",
                    WSMKT:"wss://ss.abkjl.com/v1/market",
                    WSTRD:"wss://ss.abkjl.com/v1/trade"
                },
                {
                    Id: 1,
                    Name:"S01",
                    WebAPI:"https://cdn01-np.gmexpro.com/www",
                    WSMKT:"wss://cdn01-np.gmexpro.com/v1/market",
                    WSTRD:"wss://cdn01-np.gmexpro.com/v1/trade"
                },
                {
                    Id: 2,
                    Name:"S02",
                    WebAPI:"https://cdn01-np.jiyouai.top/www",
                    WSMKT:"wss://cdn01-np.jiyouai.top/v1/market",
                    WSTRD:"wss://cdn01-np.jiyouai.top/v1/trade"
                },
                {
                    Id: 3,
                    Name:"S03",
                    WebAPI:"https://cdn02-np.yh334.top/www",
                    WSMKT:"wss://cdn02-np.yh334.top/v1/market",
                    WSTRD:"wss://cdn02-np.yh334.top/v1/trade"
                },
            ]
        }
    }
    constructor(aKey){
        this.BUILD_ENV = aKey
    }

    GetActive() {
        return this.Active
    }
    GetLines(aKey) {
        return this.M[this.BUILD_ENV]
    }
    SetActive(idx) {
        let newCfg = this.M[this.BUILD_ENV]
        if (newCfg) {
            this.Active = newCfg.netLines[idx]
        }
    }
    updateNetLines(){
        let s = this
        reqest.racerequest(s.GetLines().data).then((arg)=>{
            console.log('reqest.racerequest', arg)
            if(arg.status == 200 && arg.data){
                let lines = []
                for(let item of arg.data.lines){
                    let obj = {
                        Id: item.id,
                        Name: item.name,
                        WebAPI: item.apihost+item.node,
                        WSMKT: item.market,
                        WSTRD: item.trade,
                    }
                    lines.push(obj)
                }
                s.M[s.BUILD_ENV].netLines = lines
                gEVBUS.emit(gEVBUS.EV_NET_LINES_UPD, {Ev: gEVBUS.EV_NET_LINES_UPD, lines:lines})
            }
        }).catch((err)=>{
            console.log('reqest.racerequest err', err)
        })
    }
}

export default Conf

