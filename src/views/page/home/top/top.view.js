const m = require('mithril');
const Slideshow = require('@/views/components/slideshow/bottomToTop');
const SlideshowNotice = require('@/views/components/slideshow/notice').default;
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n.js').default;
require('@/views/page/home/top/top.scss');

module.exports = function (props) {
    const { banneList, noticeList } = props.data;
    return m('div.views-pages-home-top ', {
    }, [
        m('div.bg-father.w100', {}, [
            m('div.bg.has-bg-sub-level-1', {}, [
                m('img.bg-img', { src: require("@/assets/img/home/vector.png").default }, [])
            ])
        ]),
        // 顶部
        m('div.top', { class: ` has-text-centered pt-7` }, [
            m('p', { class: `font-weight-regular title-x-large-1 ${utils.isMobile() ? 'ml-7 mr-7 pt-7' : 'pt-9'}` }, [
                // '最值得信任的数字资产交易平台'
                I18n.$t('10008')
            ]),
            m('p', { class: `mt-6 title-small  has-text-level-2 font-weight-regular  ${utils.isMobile() ? 'ml-8 mr-8' : 'pc才有的类名xx'}` }, [
                // '自主研发钱包加密技术，全面保护用户数字资产安全'
                I18n.$t('10009')
            ]),
            m('button', { class: `button button-large mt-8 theme--light has-bg-primary min-width-200 ${utils.isMobile() ? ' title-small body-5 px-4 py-2' : 'title-medium  px-8 py-3'}`, onclick: props.toTrade }, [
                // '立即交易'
                I18n.$t('10010')
            ]),
            m('div', { class: `has-text-centered mt-4` }, [
                m('a', { class: `has-text-level-2 ${utils.isMobile() ? 'body-6' : 'pc才有的类名xx'}`, href: "/w/#!/register", target: "_blank" }, [
                    // '还没账号？立即前往账号注册 →'
                    I18n.$t('10011')
                ])
            ]),
            m('div', { class: `top-bottom-box mt-9 container is-hidden-mobile` }, [
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
