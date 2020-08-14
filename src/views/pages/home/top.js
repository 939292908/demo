const m = require('mithril');

require('@/styles/pages/home.css');

module.exports = {
    view: function () {
        return m('div.views-pages-home-top', {
        }, [
            // 顶部
            m('div', { class: `home-banner rotation container ` }, [
                // m('div', { class: `home-banner-top` }, [
                m('p', { class: `title-5 font-weight-regular pt-8` }, ['最值得信任的数字资产交易平台']),
                m('p', { class: `mt-5 title-1` }, ['自主研发钱包加密技术，全面保护用户数字资产安全']),
                m('button', { class: `purchase-btn theme--light has-bg-primary btn-2 button ` }, ['立即交易']),
                m('div', { class: `has-text-centered mt-5` }, [
                    m('a', { class: ``, href: "http://localhost:8080/#!/register" }, ['还没账号？立即前往账号注册 →'])
                ]),
                // 轮播
                m('div', { class: `rotation-content container` }, [
                    m('p', { class: `` }, ['轮播1'])
                ]),
                // 公告
                m('div', { class: `notice w` }, [
                    m('div', { class: `notice-content container` }, [
                        m('p', { class: `` }, ['公告'])
                    ])
                    // ])
                ])
            ])
        ]);
    }
};