const m = require("mithril");
const Swiper = require('swiper/bundle').default;
require('@/styles/components/slideshow.scss');

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
        mySwiper: null
    },
    oncreate: function (vnode) {
        this.mySwiper = new Swiper('#slideShowBTT', vertical);
    },
    bottomToTop: function (vnode) {
        const { banneList } = vnode.attrs;
        return banneList.map(item => {
            return m('div.swiper-slide', [
                item.map(item => m('div', { class: "imgBox" }, m('img', { src: item.image })))
            ]);
        });
    },
    view: function (vnode) {
        return m('div', { class: 'swiper-container', id: "slideShowBTT" }, [
            m('div.swiper-wrapper', [
                this.bottomToTop(vnode)
            ]),
            m('div.swiper-pagination')
        ]);
    },
    onremove: function () {
        this.mySwiper = null;
    }
};