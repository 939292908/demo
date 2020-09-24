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
    handleClickItem: function (data, event) {
        event.target.title && data[this.mySwiper.realIndex][event.target.title]?.htmlUrl && window.open(data[this.mySwiper.realIndex][event.target.title]?.htmlUrl);
    },
    bottomToTop: function (banneList) {
        return banneList.map(item => {
            return m('div.swiper-slide', [
                item.map((item, i) => {
                    const srcUrl = item.image.indexOf('http') === 0 ? item.image : ActiveLine.WebAPI + item.image;
                    return m('div', { class: "imgBox" }, m('img', { class: "border-radius-large", src: srcUrl, title: i }));
                })
            ]);
        });
    },
    view: function (vnode) {
        const { banneList } = vnode.attrs;
        return m('div', { class: 'swiper-container', id: "slideShowBTT", onclick: this.handleClickItem.bind(this, banneList) }, [
            m('div.swiper-wrapper', [
                this.bottomToTop(banneList)
            ]),
            m('div.swiper-pagination')
        ]);
    },
    onremove: function () {
        this.mySwiper = null;
    }
};