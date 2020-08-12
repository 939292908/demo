const m = require('mithril');
// const m = require('swiper')

require('@/styles/pages/home.css');

// const marketList = require('./marketList');

module.exports = {
    view: function() {
        return m('views-pages-home-notice', {}, [
            // 公告
            m('div', { class: `Notice my-4 w` }, [
                m('div', { class: `Notice-content container` }, [
                    m('div', { class: `Notice-1` }, ['我是公告我是公告']),
                    m('div', { class: `Notice-2` }, ['我是公告我是公告']),
                    m('div', { class: `Notice-3` }, ['我是公告我是公告']),
                    m('div', { class: `Notice-4` }, ['我是公告我是公告'])
                ])
            ])
        ]);
    }
};