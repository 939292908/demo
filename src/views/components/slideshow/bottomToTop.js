const m = require("mithril");
const Swiper = require('swiper/bundle').default;
const { ActiveLine } = require('@/api');
require('@/styles/components/slideshow.scss');

const vertical = {
    direction: 'vertical',
    loop: true,
    speed: 300,
    spaceBetween: 10,
    // preventClicks: false,
    autoplay: {
        delay: 5000,
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
        const { banneList, click } = vnode.attrs;
        return banneList.map(item => {
            return m('div.swiper-slide', [
                item.map(item => {
                    const srcUrl = item.image.indexOf('http') === 0 ? item.image : ActiveLine.WebAPI + item.image;
                    return m('div', { class: "imgBox", onclick: click.bind(this, item) }, m('img', { class: "border-radius-medium", src: srcUrl }));
                })
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