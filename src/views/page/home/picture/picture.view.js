const m = require('mithril');
const Slideshow = require('@/views/components/slideshow/leftToRight');
// const Slideshow2 = require('@/views/components/slideshow/leftToRight2');
const broadcast = require('@/broadcast/broadcast');
// const { gMktApi } = require('@/api').wsApi;
// const { getSortMarkets } = require('@/api').webApi;
require('@/views/page/home/picture/picture.scss');

const market = require('@/models/market/market');

module.exports = {
    oninit: function () {
        market.init();
        this.nameList = [];
        broadcast.onMsg({
            key: "picture",
            cmd: broadcast.MSG_SORT_ASSETD,
            cb: this.assetDCallBack.bind(this)
        });
        market.sortState && this.assetDCallBack();
    },
    assetDCallBack: function (arg) {
        const list = [...market.sortDisplaySym.forward];
        const tickData = {};
        list.forEach(item => {
            tickData[item.Sym] = item;
        });
        this.nameList = list.map(item => item.Sym);
        market.initHomeNeedSub(this.nameList, tickData);
    },
    view: function () {
        return m('div.views-pages-home-picture', {
        }, [
            // 大图
            m('div', { class: `home-picture container is-hidden-mobile` }, [
                m('img', { class: 'picture-layer border-radius-large', src: require("@/assets/img/home/layer-4.png").default }),
                // 轮播2
                m('div', { class: `rotationtwo-content container mt-8` }, [
                    this.nameList.length > 0 ? m(Slideshow, { list: this.nameList }) : m(Slideshow, { list: ['a', 'b', 'c', 'd'] })
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
