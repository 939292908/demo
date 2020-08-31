const m = require('mithril');
const Slideshow = require('@/views/components/slideshow/bottomToTop');
const SlideshowNotice = require('@/views/components/slideshow/notice').default;
const utils = require('@/util/utils').default;
// require('@/styles/pages/head/topView.scss');
require('@/styles/pages/home/top.scss');

module.exports = function (props) {
    const { banneList, noticeList } = props.data;
    return m('div.views-pages-home-top has-bg-sub-level-1 ', {
    }, [
        // 顶部
        m('div', { class: ` has-text-centered `, style: `background: url(${require("@/assets/img/home/vector.png").default}) no-repeat center center / 100% 100%;` }, [
            m('p', { class: `font-weight-regular pt-8 title-x-large-1 ${utils.isMobile() ? 'ml-7 mr-7' : 'pc才有的类名xx'}` }, ['最值得信任的数字资产交易平台']),
            m('p', { class: `mt-5 title-small  has-text-level-2 font-weight-regular  ${utils.isMobile() ? 'ml-8 mr-8' : 'pc才有的类名xx'}` }, ['自主研发钱包加密技术，全面保护用户数字资产安全']),
            m('a', { class: `border-radius-small height-auto mt-8 theme--light has-bg-primary btn-2 button font-weight-regular ${utils.isMobile() ? ' title-small body-5 px-4 py-2' : 'title-medium  px-8 py-3'}`, onclick: this.toPage, target: "_blank", href: "http://localhost:8080/#!/login" }, ['立即交易']),
            m('div', { class: `has-text-centered mt-4` }, [
                m('a', { class: `has-text-level-2 ${utils.isMobile() ? 'body-6' : 'pc才有的类名xx'}`, href: "/#!/register", target: "_blank" }, ['还没账号？立即前往账号注册 →'])
            ]),
            m('div', { class: `top-bottom-box mt-8 container is-hidden-mobile` }, [
                // 轮播
                m('div', { class: `top-banner ` }, [
                    banneList.length > 0 ? m(Slideshow, { banneList, click: props.handleNoticeClick }) : null
                ]),
                // 公告
                m('div', { class: `mt-6 mb-8` }, [
                    noticeList.length > 0 ? m(SlideshowNotice, { noticeList, click: props.handleNoticeClick }) : null
                ])
            ])
        ])
    ]);
};