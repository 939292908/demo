const m = require("mithril");
const Swiper = require('swiper/bundle').default;
// 轮播
require('@/styles/components/slideshow.scss');
const TOLEFT = require('@/assets/img/home/toLeft.png').default;
const TORIGHT = require('@/assets/img/home/toRight.png').default;
const item1 = require('../../../assets/img/temImg/Group556.jpg').default;
const item2 = require('../../../assets/img/temImg/Group557.jpg').default;

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
    oninit: function (vnode) {
        const srcList = [item1, item2];
        this.data.list = [1, 2, 3, 4, 5, 6, 7].map((i, index) => srcList[index % 2]);
    },
    oncreate: function (vnode) {
        this.mySwiper = new Swiper('#slideShowLTR', horizontal);
    },
    leftToRight: function () {
        return this.data.list.map(item => {
            return m('div.swiper-slide', [
                m('div.imgBox', m('img', { src: item }))
            ]);
        });
    },
    view: function (vnode) {
        return m('div', { class: 'slideshow' }, [
            m('div', { class: 'swiper-container', id: "slideShowLTR" }, [
                m('div.swiper-wrapper', [
                    this.leftToRight()
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