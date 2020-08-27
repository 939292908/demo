import _axios from '../webApi/request';
const reqest = new _axios();
class Conf {
    constructor(aKey) {
        this.BUILD_ENV = aKey;

        this.Active = {};
        this.M = {
            dev: {
                data: [],
                netLines: [
                    {
                        Id: 0,
                        Name: "测试线路1",
                        WebAPI: "http://192.168.2.89:8888",
                        WSMKT: "ws://192.168.2.85:20080/v1/market",
                        WSTRD: "ws://192.168.2.85:50301/v1/trade"
                    },
                    {
                        Id: 1,
                        Name: "测试线路2",
                        WebAPI: "http://192.168.2.89:8888",
                        WSMKT: "ws://192.168.2.85:20080/v1/market",
                        WSTRD: "ws://192.168.2.85:50301/v1/trade"
                    },
                    {
                        Id: 2,
                        Name: "测试线路3",
                        WebAPI: "http://gs.eeeecloud.com:8888",
                        WSMKT: "ws://gs.eeeecloud.com:20080/v1/market",
                        WSTRD: "ws://gs.eeeecloud.com:50301/v1/trade"
                    }
                ]
            },
            prod: {
                data: [],
                netLines: [
                    {
                        Id: 0,
                        Name: "S00",
                        WebAPI: "https://ss.abkjl.com/www",
                        WSMKT: "wss://ss.abkjl.com/v1/market",
                        WSTRD: "wss://ss.abkjl.com/v1/trade"
                    },
                    {
                        Id: 1,
                        Name: "S01",
                        WebAPI: "https://cdn01-np.gmexpro.com/www",
                        WSMKT: "wss://cdn01-np.gmexpro.com/v1/market",
                        WSTRD: "wss://cdn01-np.gmexpro.com/v1/trade"
                    },
                    {
                        Id: 2,
                        Name: "S02",
                        WebAPI: "https://cdn01-np.jiyouai.top/www",
                        WSMKT: "wss://cdn01-np.jiyouai.top/v1/market",
                        WSTRD: "wss://cdn01-np.jiyouai.top/v1/trade"
                    },
                    {
                        Id: 3,
                        Name: "S03",
                        WebAPI: "https://cdn02-np.yh334.top/www",
                        WSMKT: "wss://cdn02-np.yh334.top/v1/market",
                        WSTRD: "wss://cdn02-np.yh334.top/v1/trade"
                    }
                ]
            }
        };
        // 设置默认线路
        this.Active = this.M[aKey].netLines[0];
        let lines = window.localStorage.getItem('net_lines_config');
        if (lines) {
            lines = JSON.parse(lines);
            this.M[aKey].netLines = lines;
        }
        let active = window.localStorage.getItem('net_lines_active');
        if (active) {
            active = JSON.parse(active);
            this.Active = active;
        }
    }

    GetActive() {
        return this.Active;
    }

    GetLines(aKey) {
        return this.M[this.BUILD_ENV];
    }

    SetActive(idx) {
        const newCfg = this.M[this.BUILD_ENV];
        if (newCfg) {
            this.Active = newCfg.netLines[idx];
            window.localStorage.setItem('net_lines_active', JSON.stringify(this.Active));
        }
    }

    updateNetLines() {
        const s = this;
        reqest.racerequest(s.GetLines().data).then((arg) => {
            window._console.log('ht', 'reqest.racerequest', arg);
            if (arg.status === 200 && arg.data) {
                const lines = [];
                for (const item of arg.data.lines) {
                    const obj = {
                        Id: item.id,
                        Name: item.name,
                        WebAPI: item.apihost + item.node,
                        WSMKT: item.market,
                        WSTRD: item.trade
                    };
                    lines.push(obj);
                }
                if (lines.length > 0) {
                    s.M[s.BUILD_ENV].netLines = lines;
                    window.localStorage.setItem('net_lines_config', JSON.stringify(lines));
                }
                window.gBroadcast.emit(window.gBroadcast.EV_NET_LINES_UPD, { Ev: window.gBroadcast.EV_NET_LINES_UPD, lines: lines });
            }
        }).catch((err) => {
            window._console.log('ht', 'reqest.racerequest err', err);
        });
    }
}
export default Conf;
