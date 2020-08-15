const m = require("mithril");
const Swiper = require('swiper/bundle').default;
// 轮播
require('@/styles/components/slideshow.scss');
const item1 = require('../../../assets/img/temImg/Group556.jpg').default;
const item2 = require('../../../assets/img/temImg/Group557.jpg').default;
const item3 = require('../../../assets/img/temImg/Group558.jpg').default;

module.exports = {
    data: {
        list: [],
        mySwiper: null
    },
    oninit: function (vnode) {
        const srcList = [item1, item2, item3];
        this.data.list = [1, 2, 3].map((item, index) => [1, 2, 3].map(i => srcList[index]));
        console.log(Swiper);
    },
    oncreate: function (vnode) {
        this.mySwiper = new Swiper('#slideShowLTR', {
            direction: 'vertical', // 垂直切换选项
            loop: true, // 循环模式选项
            speed: 300, // 跳转时间
            autoplay: {
                delay: 3000, // 显示时间
                disableOnInteraction: false
            },
            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });
    },
    view: function () {
        console.log(this.data.list, 'leez');
        return m('div', { class: 'swiper-container', id: "slideShowLTR" }, [
            m('div.swiper-wrapper', [
                this.data.list.map(item => {
                    return m('div.swiper-slide', [
                        item.map(node => m('div', { class: "imgBox" }, m('img', { src: node })))
                    ]);
                })
            ]),
            m('div.swiper-pagination')
        ]);
    },
    onremove: function () {
        this.mySwiper = null;
    }
};