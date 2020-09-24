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
        const index = event.target.attributes.listi.value;
        index && data[this.mySwiper.realIndex][index]?.htmlUrl && window.open(data[this.mySwiper.realIndex][index]?.htmlUrl);
    },
    bottomToTop: function (banneList) {
        return banneList.map(item => {
            return m('div.swiper-slide', [
                item.map((item, i) => {
                    const srcUrl = item.image.indexOf('http') === 0 ? item.image : ActiveLine.WebAPI + item.image;
                    return m('div', { class: "imgBox" }, m('img', { class: "border-radius-large", src: srcUrl, listI: i }));
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