const m = require("mithril");
const Swiper = require('swiper/bundle').default;
// 轮播
require('@/styles/components/slideshow.scss');
const TOLEFT = require('@/assets/img/home/toLeft.png').default;
const TORIGHT = require('@/assets/img/home/toRight.png').default;

const swiper = { Loadingnumber: 0 };

const horizontal = {
    direction: 'horizontal',
    loop: true,
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
        this.mySwiper.autoplay.stop();
    },
    leftToRight: function (vnode) {
        const nameList = Object.keys(vnode.attrs.list);
        return nameList.map(item => {
            return m('div.swiper-slide', { onclick: this.openUrl, style: 'cursor: pointer;' }, [
                m('div.imgBox', [
                    m('div.marketTitle', [
                        m('div.marketName', { class: 'title-medium' }, vnode.attrs.list[item].distSym || '--'),
                        m('div.marketGrowth body-6', { class: vnode.attrs.list[item]?.rfpreColor > 0 ? 'has-bg-up' : 'has-bg-down' }, vnode.attrs.list[item].rfpre || '--')
                    ]),
                    m('div.marketPrice title-large', { class: vnode.attrs.list[item]?.rfpreColor > 0 ? 'has-text-up' : 'has-text-down' }, `$${vnode.attrs.list[item].LastPrz || '--'}`),
                    m('div.marketNumber body-5', `24H量 ${vnode.attrs.list[item].Volume24 || '--'}`),
                    m('div.marketNumber body-5', `24H额 ${vnode.attrs.list[item].Turnover24 || '--'}`)
                ])
            ]);
        });
    },
    view: function (vnode) {
        if (swiper.Loadingnumber < 10) swiper.Loadingnumber += 1;
        if (swiper.Loadingnumber === 8) {
            this.mySwiper.removeSlide(0);
            this.mySwiper.removeSlide(0);
            this.mySwiper.removeSlide(0);
            this.mySwiper.removeSlide(0);
            this.mySwiper.update();
            this.mySwiper.autoplay.start();
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