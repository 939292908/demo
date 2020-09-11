import axios from 'axios';
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
                        WSTRD: "ws://192.168.2.85:50301/v1/trade",
                        // 邀请链接
                        INVITE: "http://192.168.2.89:11080",
                        // 网站地址
                        WEBSITE: "http://192.168.2.89:11080"
                    },
                    {
                        Id: 1,
                        Name: "测试线路2",
                        WebAPI: "http://192.168.2.89:8888",
                        WSMKT: "ws://192.168.2.85:20080/v1/market",
                        WSTRD: "ws://192.168.2.85:50301/v1/trade",
                        // 邀请链接
                        INVITE: "http://192.168.2.89:11080",
                        // 网站地址
                        WEBSITE: "http://192.168.2.89:11080"
                    },
                    {
                        Id: 2,
                        Name: "测试线路3",
                        WebAPI: "http://gs.eeeecloud.com:8888",
                        WSMKT: "ws://gs.eeeecloud.com:20080/v1/market",
                        WSTRD: "ws://gs.eeeecloud.com:50301/v1/trade",
                        // 邀请链接
                        INVITE: "http://192.168.2.89:11080",
                        // 网站地址
                        WEBSITE: "http://192.168.2.89:11080"
                    }
                ]
            },
            prod: {
                data: [
                    "https://exsoss.oss-cn-hongkong.aliyuncs.com/svrs/vbit_lines_conf.json",
                    "https://np-oss-web.oss-cn-shanghai.aliyuncs.com/svrs/vbit_lines_conf.json"
                ],
                netLines: [
                    {
                        Id: 0,
                        Name: "S00",
                        // HTTP请求地址
                        WebAPI: "https://cdn00.mcdztelegram.com/www",
                        // 行情websocket地址
                        WSMKT: "wss://cdn00.mcdztelegram.com/v1/market",
                        // 交易websocket地址
                        WSTRD: "wss://cdn00.mcdztelegram.com/v1/trade",
                        // 邀请链接
                        INVITE: "https://y2.vbit.one",
                        // 网站地址
                        WEBSITE: "https://w2.vbit.one"
                    },
                    {
                        Id: 1,
                        Name: "S01",
                        WebAPI: "https://cdn00.yh334.top/www",
                        WSMKT: "wss://cdn00.yh334.top/v1/market",
                        WSTRD: "wss://cdn00.yh334.top/v1/trade",
                        // 邀请链接
                        INVITE: "https://y2.vbit.one",
                        // 网站地址
                        WEBSITE: "https://w2.vbit.one"
                    },
                    {
                        Id: 2,
                        Name: "S02",
                        WebAPI: "https://cdn00.jiyouai.top/www",
                        WSMKT: "wss://cdn00.jiyouai.top/v1/market",
                        WSTRD: "wss://cdn00.jiyouai.top/v1/trade",
                        // 邀请链接
                        INVITE: "https://y2.vbit.one",
                        // 网站地址
                        WEBSITE: "https://w2.vbit.one"
                    }
                ]
            }
        };
        // 设置默认线路
        this.Active = this.M[aKey].netLines[0];
        let lines = window.localStorage.getItem('net_lines_config_web');
        if (lines) {
            lines = JSON.parse(lines);
            this.M[aKey].netLines = lines;
        }
        let active = window.localStorage.getItem('net_lines_active_web');
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

    SetActive(Id) {
        const newCfg = this.M[this.BUILD_ENV];
        if (newCfg) {
            for (const item of newCfg.netLines) {
                if (item.Id === Id) {
                    this.Active = item;
                }
            }
            window.localStorage.setItem('net_lines_active_web', JSON.stringify(this.Active));
        }
    }

    updateNetLines(CallBack) {
        const s = this;
        const pool = [];
        for (const url of s.GetLines().data) {
            pool.push(axios.get(url + '?timestamp=' + (new Date()).getTime()));
        }
        Promise.race(pool).then((arg) => {
            console.log(arg);
            const data = arg.data;
            if (data) {
                const lines = [];
                for (const item of data.lines) {
                    const obj = {
                        Id: item.id,
                        Name: item.name,
                        // HTTP请求地址
                        WebAPI: item.apihost + item.node,
                        // 行情websocket地址
                        WSMKT: item.market,
                        // 交易websocket地址
                        WSTRD: item.trade,
                        // 邀请链接
                        INVITE: item.inviteUrl,
                        // 网站地址
                        WEBSITE: item.webSite
                    };
                    lines.push(obj);
                }
                if (lines.length > 0) {
                    s.M[s.BUILD_ENV].netLines = lines;
                    window.localStorage.setItem('net_lines_config_web', JSON.stringify(lines));
                }
                CallBack && CallBack();
            }
        }).catch((err) => {
            console.log('ht', 'reqest.racerequest err', err);
        });
    }
}
export default Conf;
