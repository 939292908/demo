const m = require('mithril');
// const m = require('swiper')

require('@/styles/pages/home.css');

const marketList = require('./marketList');

module.exports = {
    view: function () {
        return m('views-pages-home-buttom', {}, [
            // 底部 模块
            m('div', { class: `pub-footer is-around pt-7 pb-6` }, [
                m('div', { class: `` }, [
                    // logo
                    m('img', { class: '', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 200px;height:200px;" })
                ]),
                // 导航栏  
                m('div', { class: `bottom-navigation-tab-1` }, [
                    m('p', { class: `body-6` }, ['平台服务']),
                    m('a', { class: ``, href: "index.html", }, ["平台条款"]),
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
                // 社区
                m('div', { class: `is-between` }, [
                    m('a', { class: ``, href: "index.html" }, [
                        m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ]),
                    m('div', { class: `` }, [
                        m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                    ])
                ])
            ]),
            // 客服
            m('div', { class: `online-customer-service` }, [
                m('img', { class: '', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 30px;height:30px;href=index.html" })
            ]),
            m('p', { class: `bottom-copyright` }, ["© 2019-2020 Vbit 版权所有"])
        ]);
    }
};