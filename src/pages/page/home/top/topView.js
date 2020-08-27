const m = require('mithril');
const Slideshow = require('@/pages/components/slideshow/bottomToTop');
const SlideshowNotice = require('@/pages/components/slideshow/notice').default;
require('@/styles/pages/head/topView.scss');
require('@/styles/pages/home/top.scss');

module.exports = function (props) {
    const { banneList, noticeList } = props.data;
    return m('div.views-pages-home-top has-bg-sub-level-1 ', {
    }, [
        // 顶部
        m('div', { class: ` has-text-centered `, style: `background: url(${require("@/assets/img/home/vector.png").default}) no-repeat center center / 100% 100%;` }, [
            m('p', { class: `font-weight-regular pt-8 title-x-large-1 top-title-one` }, ['最值得信任的数字资产交易平台']),
            m('p', { class: `mt-5 title-small font-8eight-regular has-text-level-2 top-title-two` }, ['自主研发钱包加密技术，全面保护用户数字资产安全']),
            m('a', { class: `purchase-btn mt-8 theme--light has-bg-primary btn-2 button title-medium font-weight-regular top-button-transaction`, onclick: this.toPage, target: "_blank", href: "http://localhost:8080/#!/register" }, ['立即交易']),
            m('div', { class: `has-text-centered mt-4` }, [
                m('a', { class: `has-text-level-2 top-button-register`, href: "http://localhost:8080/#!/register", target: "_blank" }, ['还没账号？立即前往账号注册 →'])
            ]),
            m('div', { class: `top-bottom-box mt-8 container is-hidden-mobile` }, [
                // 轮播
                m('div', { class: `top-banner` }, [
                    banneList.length > 0 ? m(Slideshow, { banneList }) : null
                ]),
                // 公告
                m('div', { class: `mt-6 mb-8` }, [
                    noticeList.length > 0 ? m(SlideshowNotice, { noticeList, click: props.handleNoticeClick }) : null
                ])
            ])
        ])
    ]);
};