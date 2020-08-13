const m = require('mithril');

require('@/styles/pages/home.css');

module.exports = {
    view: function () {
        return m('views-pages-home-picture', {
        }, [
            // 大图
            m('div', { class: `home-picture container` }, [
                m('img', { class: ``, src: "~@/assets/img/home/layer 4.png", style: "width: 112;height:28px;" }, []),
                // 轮播2
                m('div', { class: `rotationtwo-content container mt-7` }, ['轮播2'])
            ])
        ]);
    }
};