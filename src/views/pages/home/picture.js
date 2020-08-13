const m = require('mithril');

require('@/styles/pages/home.css');

module.exports = {
    view: function () {
        return m('div.views-pages-home-picture', {
        }, [
            // 大图
            m('div', { class: `home-picture container` }, [
                m('img', { class: 'picture-layer', src: require("@/assets/img/home/layer 4.png").default }),
                // 轮播2
                m('div', { class: `rotationtwo-content container mt-7` }, ['轮播2'])
            ])
        ]);
    }
};