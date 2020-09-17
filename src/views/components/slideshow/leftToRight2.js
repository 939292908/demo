const m = require("mithril");
const Swiper = require('swiper/bundle').default;
const market = require('@/models/market/market');
// 轮播
require('@/styles/components/slideshow.scss');
const TOLEFT = require('@/assets/img/home/toLeft.png').default;
const TORIGHT = require('@/assets/img/home/toRight.png').default;

const swiper = { Loadingnumber: 0 };

const horizontal = {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 4,
    spaceBetween: 24,
    observer: true,
    observeSlideChildren: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
    },
    navigation: {
        nextEl: '.button-next',
        prevEl: '.button-prev'
    }
};
module.exports = {
    data: {
        list: [],
        mySwiper: null
    },
    openUrl: function () {
        window.open('/w/trd/#!/future');
    },
    oncreate: function (vnode) {
        this.mySwiper = new Swiper('#slideShowLTR', horizontal);
    },
    leftToRight: function (vnode) {
        const data = market.tickData;
        return vnode.attrs.list.map(item => {
            return m('div.swiper-slide', { onclick: this.openUrl, style: 'cursor: pointer;' }, [
                m('div.imgBox', [
                    m('div.marketTitle', [
                        m('div.marketName', { class: 'title-small' }, data[item]?.distSym || '--'),
                        m('div.marketGrowth body-6', { class: data[item]?.rfpreColor > 0 ? 'has-bg-up' : data[item]?.rfpreColor === 0 ? 'is0Colorbg' : 'has-bg-down' }, data[item]?.rfpre || '--')
                    ]),
                    m('div.marketPrice title-large', { class: data[item]?.rfpreColor > 0 ? 'has-text-up' : data[item]?.rfpreColor === 0 ? 'is0ColorTxt' : 'has-text-down' }, `$${data[item]?.LastPrz || '--'}`),
                    m('div.marketNumber body-5', `24H量 ${data[item]?.Volume24 || '--'}`),
                    m('div.marketNumber body-5', `24H额 ${data[item]?.Turnover24 || '--'}`)
                ])
            ]);
        });
    },
    view: function (vnode) {
        if (swiper.Loadingnumber < 10) swiper.Loadingnumber += 1;
        if (swiper.Loadingnumber === 5) {
            this.mySwiper?.destroy();
            horizontal.loop = true;
            this.mySwiper = new Swiper('#slideShowLTR', horizontal);
            // this.mySwiper.removeSlide(0);
            // this.mySwiper.removeSlide(0);
            // this.mySwiper.removeSlide(0);
            // this.mySwiper.removeSlide(0);
            // this.mySwiper.params.loop = true;
            // this.mySwiper.update();
            // this.mySwiper.autoplay.start();
        }
        return m('div', { class: 'slideshow swiperLTF' }, [
            m('div', { class: 'swiper-container', id: "slideShowLTR" }, [
                m('div.swiper-wrapper', [
                    this.leftToRight(vnode)
                ])
            ]),
            m('div.button-prev', m('img', { src: TOLEFT })),
            m('div.button-next', m('img', { src: TORIGHT }))
        ]);
    },
    onremove: function () {
        this.mySwiper = null;
    }
};