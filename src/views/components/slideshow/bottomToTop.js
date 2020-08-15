const m = require("mithril");
const Swiper = require('swiper/bundle').default;
// 轮播
require('@/styles/components/slideshow.scss');
const item1 = require('../../../assets/img/temImg/Group556.jpg').default;
const item2 = require('../../../assets/img/temImg/Group557.jpg').default;
const item3 = require('../../../assets/img/temImg/Group558.jpg').default;

const vertical = {
    direction: 'vertical',
    loop: true,
    speed: 300,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    }
};

module.exports = {
    data: {
        list: [],
        mySwiper: null
    },
    oninit: function (vnode) {
        const srcList = [item1, item2, item3];
        this.data.list = [1, 2, 3].map((item, index) => [1, 2, 3].map(i => srcList[index]));
    },
    oncreate: function (vnode) {
        this.mySwiper = new Swiper('#slideShowBTT', vertical);
    },
    bottomToTop: function () {
        return this.data.list.map(item => {
            return m('div.swiper-slide', [
                item.map(node => m('div', { class: "imgBox" }, m('img', { src: node })))
            ]);
        });
    },
    view: function (vnode) {
        return m('div', { class: 'swiper-container', id: "slideShowBTT" }, [
            m('div.swiper-wrapper', [
                this.bottomToTop()
            ]),
            m('div.swiper-pagination')
        ]);
    },
    onremove: function () {
        this.mySwiper = null;
    }
};