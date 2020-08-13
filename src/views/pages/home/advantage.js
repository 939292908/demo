const m = require('mithril');
// const m = require('swiper')

require('@/styles/pages/home.css');

// const marketList = require('./marketList');

module.exports = {
    view: function () {
        return m('views-pages-home-advantage', {}, [
            m('div', { class: `pages-home-advantage container` }, [
                m('div', { class: `home-introduce is-around  w container py-5 mt-5 border-1` }, [
                    // 平台优势
                    // 1
                    m('div', { class: `introduce-item` }, [
                        m('img', { class: 'advantage-icon-1', src: "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28" }),
                        m('div', { class: `title-2` }, ["安全保障"]),
                        m('p', { class: `` }, ["世界顶级安全团队打造、主动安全的防御系统、银行级加密、冷热钱包分层体系，保障用户资金安全！"])
                    ]),
                    // 2
                    m('div', { class: `introduce-item` }, [
                        m('img', { class: 'advantage-Icon-1', src: "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28" }),
                        m('div', { class: `title-2 ` }, ["专业可靠"]),
                        m('p', { class: `` }, ["华尔街金融管理团队护航，顶级风控系统、毫秒级判断、数万BTC备付金，强大的后盾实力！"])
                    ]),
                    // 3
                    m('div', { class: `introduce-item` }, [
                        m('img', { class: 'advantage-Icon-1', src: "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28" }),
                        m('div', { class: `title-2 ` }, ["极致体验"]),
                        m('p', { class: `` }, ["业内领先的百万级交易撮合引擎，一站式交易服务！"])
                    ]),
                    // 4
                    m('div', { class: `introduce-item` }, [
                        m('img', { class: 'advantage-Icon-1', src: "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28" }),
                        m('div', { class: `title-2 ` }, ["尊享服务"]),
                        m('p', { class: `` }, ["7*24全天候专业客服团队守候，快速反馈！"])
                    ])
                ])
            ])
        ]);
    }
};