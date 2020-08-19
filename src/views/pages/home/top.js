const m = require('mithril');
const Slideshow = require('@/views/components/slideshow/bottomToTop');
const SlideshowNotice = require('@/views/components/slideshow/notice');
require('@/styles/pages/home/top.scss');

module.exports = {
    data: {
        banneList: [],
        noticeList: []
    },
    toPage() {
        if (window.gWebApi.loginState) {
            window.router.push('/chargeMoney');
        } else {
            window.router.push('/login');
        }
    },
    oninit: function () {
        this.getBanne();
        this.getnotice();
    },
    getBanne() {
        window.gWebApi.getBanne({ locale: window.gI18n.locale, vp: window.exchId }, res => {
            if (res.result.code === 0) {
                var bannList = [];
                const list = res.result.data;
                for (let i = 0; i < list.length && i < 9; i += 3) {
                    bannList.push(list.slice(i, i + 3));
                }

                // for (let i = 0; i < 3 - bannList[bannList.length - 1].length; i++) {
                //     bannList[bannList.length - 1].push({});
                // }
                this.data.banneList = bannList;
                m.redraw();
            }
        });
    },
    getnotice() {
        window.gWebApi.getNotice({ locale: window.gI18n.locale, vp: window.exchId }, res => {
            if (res.result.code === 0) {
                this.data.noticeList = res.result.data;
                m.redraw();
            }
        });
    },
    handleNoticeClick(item) {
        if (item) window.open(item.html_url);
    },
    view: function () {
        const { banneList, noticeList } = this.data;
        return m('div.views-pages-home-top', {
        }, [
            // 顶部
            m('div', { class: `home-banner rotation container` }, [
                m('p', { class: `font-weight-regular pt-8 title-large ` }, ['最值得信任的数字资产交易平台']),
                m('p', { class: `mt-5 title-small` }, ['自主研发钱包加密技术，全面保护用户数字资产安全']),
                m('button', { class: `purchase-btn theme--light has-bg-primary btn-2 button `, onclick: this.toPage }, ['立即交易']),
                m('div', { class: `has-text-centered mt-5` }, [
                    m('a', { class: `has-text-white`, href: "http://localhost:8080/#!/register" }, ['还没账号？立即前往账号注册 →'])
                ]),
                m('div', { class: `top-bottom-box mt-8` }, [
                    // 轮播
                    m('div', { class: `top-banner` }, [
                        banneList.length > 0 ? m(Slideshow, { banneList }) : null
                    ]),
                    // 公告
                    m('div', { class: `mt-6 mb-8` }, [
                        noticeList.length > 0 ? m(SlideshowNotice, { noticeList, click: this.handleNoticeClick }) : null
                    ])
                ])
            ])
        ]);
    }
};