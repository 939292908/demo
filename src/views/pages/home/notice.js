const m = require('mithril');
// const m = require('swiper')

require('@/styles/pages/home.css');

// const marketList = require('./marketList');

module.exports = {
    view: function() {
        return m('views-pages-home-notice', {}, [
            // // 公告
            // m('div', { class: `notice my-4 w` }, [
            //     m('div', { class: `notice-content container` }, [
            //     ])
            // ])
        ]);
    }
};