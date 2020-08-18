const m = require('mithril');
const Slideshow = require('@/views/components/slideshow/leftToRight');
require('@/styles/pages/home/picture.scss');

const market = require('@/models/market/market');

module.exports = {
    oninit: function () {
        market.init();
        window.gBroadcast.onMsg({
            key: "picture",
            cmd: window.gBroadcast.MSG_ASSETD_UPD,
            cb: this.assetDCallBack
        });
    },
    assetDCallBack: function(arg) {
        market.initHomeNeedSub();
    },
    view: function () {
        return m('div.views-pages-home-picture', {
        }, [
            // 大图
            m('div', { class: `home-picture container` }, [
                m('img', { class: 'picture-layer', src: require("@/assets/img/home/layer 4.png").default }),
                // 轮播2
                m('div', { class: `home-picture-banner container my-7` }, [
                    Object.keys(market.tickData).length > 0 ? m(Slideshow, { list: market.tickData }) : null
                ])
            ])
        ]);
    },
    onremove: function() {
        market.remove();
        window.gBroadcast.onMsg({
            key: "picture",
            isall: true
        });
    }
};