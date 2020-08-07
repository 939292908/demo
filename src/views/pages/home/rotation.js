const m = require('mithril');
// const m = require('swiper')

require('@/styles/pages/home.css');

// const marketList = require('./marketList');

module.exports = {
    view: function() {
        return m('views-pages-home-rotation', {}, [
            // 轮播 + 下拉
            m('div', { class: `home-banner` }, [
                m('div', { class: `index-info-box-right` }, [
                    m('div', { class: `index-info-box-right-1` }, ['我要买']),
                    m('div', { class: `index-info-box-right-2` }, ['参考价 6.95CNY/USDT'])
                ]),
                m('div', { class: `index-info-box` }, [
                    m('div', { class: `index-info-box-right` }, [
                        m('select', { class: `index-info-box-right-select` }, [
                            m('option', { class: `` }, ['USDT']),
                            m('option', { class: `` }, ['U']),
                            m('option', { class: `` }, ['S'])
                        ]),
                        m('select', { class: `select` }, [
                            m('option', { class: `` }, ['CNY']),
                            m('option', { class: `` }, ['100']),
                            m('option', { class: `` }, ['200'])
                        ]),
                        m('button', { class: `purchase-btn` }, ['购买USDT'])
                    ])
                ])
            ])
        ]);
    }
};