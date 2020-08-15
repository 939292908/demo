const m = require("mithril");
const Swiper = require('swiper/bundle').default;

require('@/styles/components/slideshow.scss');
const trumpet = require('@/assets/img/home/trumpet.png').default;

const vertical = {
    direction: 'vertical',
    loop: true,
    speed: 300,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    }
};

module.exports = {
    data: {
        mySwiper: null
    },
    oncreate: function (vnode) {
        this.mySwiper = new Swiper('#slideShowNotice', vertical);
    },
    swiperVnode: function (vnode) {
        const { noticeList, click } = vnode.attrs;
        return m('div', { class: 'swiper-container', id: "slideShowNotice" }, m('div.swiper-wrapper', [
            noticeList.map(item => m('div.swiper-slide', { onclick: click.bind(this, item) }, m('div.noticeText', item.title)))
        ]));
    },
    view: function (vnode) {
        return m('div', { class: 'components-slideshow-trumpet' }, [
            m('div.slideshow-trumpet-icon', [
                m('img', { src: trumpet }),
                m('span', '最新公告:')
            ]),
            m('div.slideshow-trumpet-content', this.swiperVnode(vnode)),
            m('div.slideshow-trumpet-more', '更多')
        ]);
    },
    onremove: function () {
        this.mySwiper = null;
    }
};