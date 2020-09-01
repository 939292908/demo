const m = require('mithril');
const Slideshow = require('@/views/components/slideshow/leftToRight');
const broadcast = require('@/broadcast/broadcast');
const wsApi = require('@/api').wsApi;
require('@/views/page/home/picture/picture.scss');

const market = require('@/models/market/market');

const logic = {
    length: 0
};

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
        // const data = arg.data.filter(item => item.TrdCls === 3 && (item.Flag & 1) !== 1);
        var syms = [];
        var list = {};
        wsApi.displaySym.forEach(item => {
            const sys = wsApi.AssetD[item];
            if (sys.TrdCls === 3 && (sys.Flag & 1) !== 1) {
                syms.push(item);
                list[item] = sys;
            }
        });
        logic.length = syms.length;
        market.initHomeNeedSub(syms, list);
    },
    view: function () {
        return m('div.views-pages-home-picture', {
        }, [
            // 大图
            m('div', { class: `home-picture container is-hidden-mobile` }, [
                m('img', { class: 'picture-layer ', src: require("@/assets/img/home/layer-4.png").default }),
                // 轮播2
                m('div', { class: `rotationtwo-content container mt-7` }, [
                    Object.keys(market.tickData).length > 0 && Object.keys(market.tickData).length === logic.length ? m(Slideshow, { list: market.tickData }) : m(Slideshow, { list: { a: {}, b: {}, c: {}, d: {} } })
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