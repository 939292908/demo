import m from 'mithril';
import Swiper from "swiper";
import trumpet from '@/assets/img/home/trumpet.png';
require('@/styles/components/slideshow.scss');

const vertical = {
    direction: 'vertical',
    loop: true,
    speed: 300,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    }
};

export default {
    data: {
        mySwiper: null
    },
    oncreate: function (vnode) {
        this.mySwiper = new Swiper('#slideShowNotice', vertical);
    },
    handleClickMore: () => {
        window.open('https://vbithelp.zendesk.com/hc/zh-cn/categories/360003415534-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83');
    },
    swiperVnode: function (vnode) {
        const { noticeList, click } = vnode.attrs;
        return m('div', { class: 'swiper-container border-radius-small', id: "slideShowNotice" }, m('div.swiper-wrapper', [
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
            m('div.slideshow-trumpet-more', { onclick: this.handleClickMore }, '更多')
        ]);
    },
    onremove: function () {
        this.mySwiper = null;
    }
};