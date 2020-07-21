import _axios from '@/api/request'
let reqest = new _axios()
class Conf  {

    
    constructor(aKey){
        this.BUILD_ENV = aKey

        this.Active = {}
        this.M = {
            "dev": {
                "data": [],
                netLines:[
                    {
                        Id: 0,
                        Name:"测试线路1",
                        WebAPI:"http://192.168.2.89:8888", 
                    },
                    {
                        Id: 1,
                        Name:"测试线路2",
                        WebAPI:"http://192.168.2.89:8888", 
                    },
                    {
                        Id: 2,
                        Name:"测试线路3",
                        WebAPI:"http://gs.eeeecloud.com:8888", 
                    }
                ]
            }
            ,"prod": {
                "data": [],
                netLines:[
                    {
                        Id: 0,
                        Name:"S00",
                        WebAPI:"https://ss.abkjl.com/www",
                    },
                    {
                        Id: 1,
                        Name:"S01",
                        WebAPI:"https://cdn01-np.gmexpro.com/www",
                    },
                    {
                        Id: 2,
                        Name:"S02",
                        WebAPI:"https://cdn01-np.jiyouai.top/www",
                    },
                    {
                        Id: 3,
                        Name:"S03",
                        WebAPI:"https://cdn02-np.yh334.top/www",
                    },
                ]
            }
        }
        //设置默认线路
        this.Active = this.M[aKey].netLines[0]

        let lines = localStorage.getItem('net_lines_config')
        if(lines){
            lines = JSON.parse(lines)
            this.M[aKey].netLines = lines
        }

        let active = localStorage.getItem('net_lines_active')
        if(active){
            active = JSON.parse(active)
            this.Active = active
        }


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
            localStorage.setItem('net_lines_active', JSON.stringify(this.Active))
        }
    }
    updateNetLines(){
        let s = this
        reqest.racerequest(s.GetLines().data).then((arg)=>{
            window._console.log('ht','reqest.racerequest', arg)
            if(arg.status == 200 && arg.data){
                let lines = []
                for(let item of arg.data.lines){
                    let obj = {
                        Id: item.id,
                        Name: item.name,
                        WebAPI: item.apihost+item.node,
                    }
                    lines.push(obj)
                }
                if(lines.length > 0){
                    s.M[s.BUILD_ENV].netLines = lines
                    localStorage.setItem('net_lines_config', JSON.stringify(lines))
                }
                
                gEVBUS.emit(gEVBUS.EV_NET_LINES_UPD, {Ev: gEVBUS.EV_NET_LINES_UPD, lines:lines})
            }
        }).catch((err)=>{
            window._console.log('ht','reqest.racerequest err', err)
        })
    }
}

export default Conf

