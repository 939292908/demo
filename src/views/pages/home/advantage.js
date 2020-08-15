const m = require('mithril');
// const m = require('swiper')

require('@/styles/pages/home.css');

// const marketList = require('./marketList');

module.exports = {
    view: function () {
        return m('div.views-pages-home-advantage.theme--light container', {}, [
            m('div', { class: `pages-home-advantage container` }, [
                m('div', { class: `home-introduce is-around  w container py-8 border-1` }, [
                    // 平台优势
                    // 1
                    m('div', { class: `introduce-item` }, [
                        m('img', { class: '', src: require("@/assets/img/home/Object1.png").default }),
                        m('div', { class: `title-medium` }, ["安全保障"]),
                        m('p', { class: `pt-5` }, ["世界顶级安全团队打造、主动安全的防御系统、银行级加密、冷热钱包分层体系，保障用户资金安全！"])
                    ]),
                    // 2
                    m('div', { class: `introduce-item` }, [
                        m('img', { class: 'introduce-item-Object2', src: require("@/assets/img/home/Object2.png").default }),
                        m('div', { class: `title-medium` }, ["专业可靠"]),
                        m('p', { class: `pt-5` }, ["华尔街金融管理团队护航，顶级风控系统、毫秒级判断、数万BTC备付金，强大的后盾实力！"])
                    ]),
                    // 3
                    m('div', { class: `introduce-item` }, [
                        m('img', { class: '', src: require("@/assets/img/home/Object3.png").default }),
                        m('div', { class: `title-medium` }, ["极致体验"]),
                        m('p', { class: `pt-5` }, ["业内领先的百万级交易撮合引擎，一站式交易服务！"])
                    ]),
                    // 4
                    m('div', { class: `introduce-item` }, [
                        m('img', { class: 'mt-4', src: require("@/assets/img/home/Object4.png").default }), m('div', { class: `title-medium` }, ["尊享服务"]),
                        m('p', { class: `pt-5` }, ["7*24全天候专业客服团队守候，快速反馈！"])
                    ])
                ])
            ])
        ]);
    }
};