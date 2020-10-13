const m = require('mithril');
const Slideshow = require('@/views/components/slideshow/leftToRight');
// const Slideshow2 = require('@/views/components/slideshow/leftToRight2');
const broadcast = require('@/broadcast/broadcast');
const { gMktApi } = require('@/api').wsApi;
const { getSortMarkets } = require('@/api').webApi;
require('@/views/page/home/picture/picture.scss');

const market = require('@/models/market/market');

module.exports = {
    oninit: function () {
        market.init();
        this.nameList = []; // init nameList
        broadcast.onMsg({
            key: "picture",
            cmd: broadcast.MSG_ASSETD_UPD,
            cb: this.assetDCallBack.bind(this)
        });
        gMktApi.displaySym.length > 0 && this.assetDCallBack();
    },
    assetDCallBack: function (arg) {
        const self = this;
        // const data = arg.data.filter(item => item.TrdCls === 3 && (item.Flag & 1) !== 1);
        var syms = [];
        var list = {};
        gMktApi.displaySym.forEach(item => {
            const sys = gMktApi.AssetD[item];
            if (sys.TrdCls === 3 && (sys.Flag & 1) !== 1) {
                syms.push(item);
                list[item] = sys;
            }
        });

        getSortMarkets({ vp: 30 }).then(res => {
            if (res.result.code === 0) {
                const data = res.result.data.symSort;
                const sortsyms = syms.sort((a, b) => {
                    return data[list[a].ToC] - data[list[b].ToC];
                });
                self.nameList = sortsyms;
                market.initHomeNeedSub(sortsyms, list);
            }
        });
    },
    view: function () {
        return m('div.views-pages-home-picture', {
        }, [
            // 大图
            m('div', { class: `home-picture container is-hidden-mobile` }, [
                m('img', { class: 'picture-layer border-radius-large', src: require("@/assets/img/home/layer-4.png").default }),
                // 轮播2
                m('div', { class: `rotationtwo-content container mt-8` }, [
                    Object.keys(market.tickData).length > 0 && Object.keys(market.tickData).length === this.nameList.length ? m(Slideshow, { list: this.nameList }) : m(Slideshow, { list: ['a', 'b', 'c', 'd'] })
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
