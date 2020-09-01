const m = require('mithril');
const Slideshow = require('@/views/components/slideshow/leftToRight');
const broadcast = require('@/broadcast/broadcast');
// require('@/styles/pages/home.css');
require('@/views/page/home/picture/picture.scss');

const market = require('@/models/market/market');

module.exports = {
    oninit: function () {
        market.init();
        broadcast.onMsg({
            key: "picture",
            cmd: broadcast.MSG_ASSETD_UPD,
            cb: this.assetDCallBack
        });
    },
    assetDCallBack: function (arg) {
        market.initHomeNeedSub();
    },
    view: function () {
        return m('div.views-pages-home-picture', {
        }, [
            // 大图
            m('div', { class: `home-picture container is-hidden-mobile` }, [
                m('img', { class: 'picture-layer ', src: require("@/assets/img/home/layer-4.png").default }),
                // 轮播2
                m('div', { class: `rotationtwo-content container mt-7` }, [
                    Object.keys(market.tickData).length > 0 ? m(Slideshow, { list: market.tickData }) : null
                ])
            ])
        ]);
    },
    onremove: function () {
        market.remove();
        broadcast.onMsg({
            key: "picture",
            isall: true
        });
    }
};