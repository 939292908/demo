const m = require('mithril');
// const m = require('swiper')
const utils = require('@/util/utils').default;

// require('@/styles/pages/home.css');
require('@/styles/pages/home/advantage.scss');

// const marketList = require('./marketList');

module.exports = {
    view: function () {
        return m('div.views-pages-home-advantage theme--light advantage-div mt-7', {}, [
            m('div', { class: `container` }, [
                m('div', { class: `mt-7 w container py-8 border-1 columns ${utils.isMobile() ? 'has-bg-level-2' : ''}` }, [
                    // 平台优势
                    // 1
                    m('div', { class: `introduce-item column is-3 mt-6` }, [
                        m('img', { class: '', src: require("@/assets/img/home/Object1.png").default }),
                        m('div', { class: `has-text-primary title-large font-weight-regular is-12` }, ["安全保障"]),
                        m('p', { class: `pt-5 ${utils.isMobile() ? 'ml-8 mr-8' : 'ml-7 mr-7'}` }, ["世界顶级安全团队打造，主动安全 防御系统，银行级加密，冷热钱包 分层体系，保障用户资金安全！"])
                    ]),
                    // 2
                    m('div', { class: `introduce-item column is-3 ${utils.isMobile() ? 'mt-8' : 'mt-6'}` }, [
                        m('img', { class: ' ', src: require("@/assets/img/home/Object2.png").default }),
                        m('div', { class: ` mt-4 has-text-primary title-large font-weight-regular ` }, ["专业可靠"]),
                        m('p', { class: `pt-5 ${utils.isMobile() ? 'ml-8 mr-8' : 'ml-7 mr-7'}` }, ["华尔街金融管理团队护航，顶级风 控系统，毫秒级判断，数万BTC备 付金，强大的后盾实力！"])
                    ]),
                    // 3
                    m('div', { class: `introduce-item column is-3 ${utils.isMobile() ? 'mt-8' : 'mt-4'}` }, [
                        m('img', { class: '', src: require("@/assets/img/home/Object3.png").default }),
                        m('div', { class: `has-text-primary  title-large font-weight-regular` }, ["极致体验"]),
                        m('p', { class: `pt-5 ${utils.isMobile() ? 'ml-8 mr-8' : 'ml-7 mr-7'}` }, ["业内领先的百万级交易撮合引擎， 一站式交易服务，重视产品体验让 用户想到即实现!"])
                    ]),
                    // 4
                    m('div', { class: `introduce-item column is-3  ${utils.isMobile() ? 'mt-8' : 'mt-5'}` }, [
                        m('img', { class: '', src: require("@/assets/img/home/Object4.png").default }),
                        m('div', { class: ` mt-4 has-text-primary title-large font-weight-regular` }, ["尊享服务"]),
                        m('p', { class: `pt-6 ${utils.isMobile() ? 'ml-8 mr-8' : 'ml-7 mr-7'}` }, ["7*24全天候专业客服团队守候，快速反馈，第一时间得到极致的体验 与帮助！"])
                    ])
                ])
            ])
        ]);
    }
};