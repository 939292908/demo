const m = require("mithril");
const Swiper = require('swiper/bundle').default;
// 轮播
require('@/styles/components/slideshow.scss');
const TOLEFT = require('@/assets/img/home/toLeft.png').default;
const TORIGHT = require('@/assets/img/home/toRight.png').default;

const horizontal = {
    direction: 'horizontal',
    loop: true,
    slidesPerView: 4,
    spaceBetween: 32,
    autoplay: {
        delay: 3000,
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
    oncreate: function (vnode) {
        this.mySwiper = new Swiper('#slideShowLTR', horizontal);
    },
    leftToRight: function (vnode) {
        const nameList = Object.keys(vnode.attrs.list);
        return nameList.map(item => {
            return m('div.swiper-slide', [
                m('div.imgBox', [
                    m('div.marketTitle', [
                        m('div.marketName', vnode.attrs.list[item].distSym),
                        m('div.marketGrowth has-bg-up', vnode.attrs.list[item].rfpre)
                    ]),
                    m('div.marketPrice', `$${vnode.attrs.list[item].LastPrz}`),
                    m('div.marketNumber', `24H量 ${vnode.attrs.list[item].Volume24}`),
                    m('div.marketNumber', `24H额 ${vnode.attrs.list[item].Turnover24}`)
                ])
            ]);
        });
    },
    view: function (vnode) {
        console.log(vnode);
        return m('div', { class: 'slideshow' }, [
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