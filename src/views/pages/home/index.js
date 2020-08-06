let m = require('mithril')
// let m = require('swiper')

require('@/styles/pages/home.css')
// let demo = require('@/views/pages/demo')
 var prev=document.getElementById("prev");
 var next=document.getElementById("next");
 var img=document.getElementsByTagName("img")[0];
 var imgArr=["/user/cat.jpeg",];
 var index=0;
  
 //点击左箭头，切换上一张
 function p(){
 if(index==0)
 {
 index=imgArr.length;
 }
 index--;
 img.src=imgArr[index];
 }
 //点击右箭头，切换下一张
 function n(){
 if(index==imgArr.length)
 {
 index=0;
 }
 img.src=imgArr[index];
 index++;
 }
 //设置自动播放
 time=setInterval(p(),2000);
  
 //鼠标移入箭头内，停止自动播放
 function cal(){
 clearInterval(time);
 }
module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.views-pages-home-index', [
            // 轮播 + 下拉            
            m('div', { class: `home-banner` }, [
                m('div', { class: `index-info-box-right` }, [
                    m('div', { class: `index-info-box-right-1` }, ['我要买']),
                    m('div', { class: `index-info-box-right-2` }, ['参考价 6.95CNY/USDT']),
                ]),
                m('div', { class: `index-info-box` }, [
                    m('div', { class: `index-info-box-right` }, [
                        m('select', { class: `index-info-box-right-select` }, [
                            m('option', { class: `` }, ['USDT']),
                            m('option', { class: `` }, ['U']),
                            m('option', { class: `` }, ['S']),
                        ]),
                        m('select', { class: `select` }, [
                            m('option', { class: `` }, ['CNY']),
                            m('option', { class: `` }, ['100']),
                            m('option', { class: `` }, ['200']),
                        ]),
                        m('button', { class: `purchase-btn` }, ['购买USDT'])
                    ])
                ])
            ]),
            // 公告
            m('div', { class: `Notice my-4 w` }, [
                m('div', { class: `Notice-content` }, [
                    m('div', { class: `Notice-1` }, ['我是公告我是公告']),
                    m('div', { class: `Notice-2` }, ['我是公告我是公告']),
                    m('div', { class: `Notice-3` }, ['我是公告我是公告']),
                    m('div', { class: `Notice-4` }, ['我是公告我是公告']),
                ])
            ]),
            // 行情表格
            m('div', { class: `frame w` }, [
                m('div', { class: `listing` }, [
                    m('div', { class: `` }, ['名称']),
                    m('div', { class: `` }, ['最新价']),
                    m('div', { class: `` }, ['涨跌桶']),
                    m('div', { class: `` }, ['24h交易量'])
                ])
            ]),
            // 介绍信息
            m('div', { class: `frame-1 w` }, [
                m('div', { class: `f` }, ["世界领先的专业数字资产衍生品交易平台。 Vbit平台金融量化团队均来自JP摩根、摩根士丹利、OKCoin、Binance等知名金融机构。Vbit平台由国际化各领域专家团队研发运营,确保平台拥有最前沿的技术，用户享有最极致的产品体验。Vbit秉承用户至上的服务理念，坚持公平、公正、公开的交易原则，致力于为全球投资者提供安全、快捷的数字货币衍生品交易服务。"])
            ]),
            // 介绍 (图片 + 文字)
            m('div', { class: `home-introduce is-around w py-5 mt-5 border-1` }, [
                // 1
                m('div', { class: `introduce-item` }, [
                    m('img', { class: '', "src": "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28"}),
                    m('p', { class: `` }, ["安全保障：世界顶级安全团队打造、主动安全的防御系统、银行级加密、冷热钱包分层体系，保障用户资金安全！"])
                ]),
                // 2
                m('div', { class: `introduce-item` }, [
                    m('img', { class: '', "src": "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28"}),
                    m('p', { class: `` }, ["专业可靠：华尔街金融管理团队护航，顶级风控系统、毫秒级判断、数万BTC备付金，强大的后盾实力。"])
                ]),
                // 3
                m('div', { class: `introduce-item` }, [
                    m('img', { class: '', "src": "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28"}),
                    m('p', { class: `` }, ["极致体验：业内领先的百万级交易撮合引擎，一站式交易服务。"])
                ]),
                // 4
                m('div', { class: `introduce-item` }, [
                    m('img', { class: '', "src": "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28"}),
                    m('p', { class: `` }, ["尊享服务：7*24全天候专业客服团队守候，快速反馈！"])
                ])
            ]),
            // 交易之旅
            m('div', { class: `my-7` }, [
                m('div', { class: `title-2` }, ['开启交易之旅']),
                m('button', { class: `register` }, ['立即注册']),
                m('button', { class: `transaction` }, ['即可交易']),
            ]),
            // 下载 模块
            m('div', { class: `border-1 w is-around is-align-items-center` }, [
                // 图片
                m('div', { class: `` }, [
                    m('img', { class: '', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 200px;height:200px;" })
                ]),
                // 下载信息
                m('div', { class: `body-6` }, [
                    m('p', { class: `` }, ['随时随地交易']),
                    m('p', { class: `` }, ['下载Vbit移动应用端'])
                ]),
                // iOS 二维码
                m('div', { class: `` }, [
                    m('img', { class: '', src: "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28" }),
                    m('p', { class: `` }, ['iOS 下载'])
                ]),
                // Android 二维码
                m('div', { class: `` }, [
                    m('img', { class: '', src: "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28" }),
                    m('p', { class: `` }, ['Android下载'])
                ])
            ]),
            // 底部 模块
            m('div', { class: `pub-footer is-around pt-7 pb-6` }, [
                m('div', { class: `` }, [
                    //logo
                    m('img', { class: '', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 200px;height:200px;" })
                ]),      
                //导航栏  
                m('div', { class: `bottom-navigation-tab-1` }, [
                    m('p', { class: `body-6` }, ['平台服务']),
                    m('a', { class: ``, href:"index.html", }, ["平台条款"]),
                    m('p', { class: `` }, ["币币交易"]),
                    m('p', { class: `` }, ["法币交易"]),
                    m('p', { class: `` }, ["永续合约"]),
                    m('p', { class: `` }, ["杠杆ETF"]),
                    m('p', { class: `` }, ["全币种合约"]),
                    m('p', { class: `` }, ["相关费率"])
                ]),        
                m('div', { class: `bottom-navigation-tab-2` }, [
                    m('p', { class: `body-6` }, ["平台条款"]),
                    m('p', { class: `` }, ["服务协议"]),
                    m('p', { class: `` }, ["法律声明"]),
                    m('p', { class: `` }, ["隐私条款"]),
                    m('p', { class: `` }, ["合约牌照"])
                ]),
                m('div', { class: `bottom-navigation-tab-2` }, [
                    m('p', { class: `body-6` }, ["服务支持"]),
                    m('p', { class: `` }, ["新手帮助"]),
                    m('p', { class: `` }, ["常见问题"]),
                    m('p', { class: `` }, ["公告中心"])
                ]),
                m('div', { class: `bottom-navigation-tab-2` }, [
                    m('p', { class: `body-6` }, ["联系我们"]),
                    m('p', { class: `` }, ["服务邮箱"]),
                    m('p', { class: `` }, ["加入社群"])
                ]),
                //社区
                m('div', { class: `is-between`}, [
                    m('a', { class: `` , href:"index.html"}, [
                        m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community',src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community',src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community',src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community',src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community',src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community',src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ])
                ])
            ]),
            //客服
            m('div', { class: `online-customer-service` }, [
                m('img', { class: '', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 30px;height:30px;href=index.html" })
            ]),   
            m('p', { class: `` }, ["© 2019-2020 Vbit 版权所有"]),
        ])
    }
}