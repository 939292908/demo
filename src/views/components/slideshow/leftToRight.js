/*
 * @Author: your name
 * @Date: 2020-09-24 15:28:40
 * @LastEditTime: 2020-09-24 15:29:44
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\views\components\slideshow\leftToRight.js
 */
const m = require("mithril");
const Swiper = require('swiper/bundle').default;
const market = require('@/models/market/market');
// 轮播
require('@/styles/components/slideshow.scss');
const TOLEFT = require('@/assets/img/home/toLeft.png').default;
const TORIGHT = require('@/assets/img/home/toRight.png').default;
const I18n = require('@/languages/I18n').default;
const slidesPerView = 4; // 一页显示几个
module.exports = {
    horizontal: {
        direction: 'horizontal',
        loop: false,
        slidesPerView,
        spaceBetween: 24,
        observer: true,
        observeSlideChildren: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        // navigation: {
        //     nextEl: '.button-next',
        //     prevEl: '.button-prev'
        // },
        on: {
            slideChangeTransitionEnd: function() {
                if (this.slides.length - slidesPerView === this.activeIndex) this.slideTo(0, 0, false);
            }
        }
    },
    data: {
        list: [],
        mySwiper: null
    },
    openUrl: function () {
        window.open('/w/trd/#!/future');
    },
    oncreate: function () {
        this.mySwiper = new Swiper('#slideShowLTR', this.horizontal);
    },
    leftToRight: function (vnode) {
        const data = market.tickData;
        return vnode.attrs.list.map(item => {
            return m('div.swiper-slide', { onclick: this.openUrl, style: 'cursor: pointer;' }, [
                m('div.imgBox', [
                    m('div.marketTitle', [
                        m('div.marketName', { class: 'title-small' }, data[item]?.distSym || '--'),
                        m('div.marketGrowth body-6', { class: data[item]?.rfpreColor < 0 ? 'has-bg-up' : data[item]?.rfpreColor === 0 ? 'is0Colorbg' : 'has-bg-down' }, `${data[item]?.rfpreColor > 0 ? '+' : ''}${data[item]?.rfpre || '--'}`)
                    ]),
                    m('div.marketPrice title-large', { class: data[item]?.rfpreColor < 0 ? 'has-text-up' : data[item]?.rfpreColor === 0 ? 'is0ColorTxt' : 'has-text-down' }, `$${data[item]?.LastPrz || '--'}`),
                    m('div.marketNumber body-5', `24H ${I18n.$t('10618')/* '量' */} ${data[item]?.Volume24 || '--'}`),
                    m('div.marketNumber body-5', `24H ${I18n.$t('10619')/* '额' */} ${data[item]?.Turnover24 || '--'}`)
                ])
            ]);
        });
    },
    handleNextEl: function () {
        const index = this.mySwiper.activeIndex === 0 ? this.mySwiper.slides.length : this.mySwiper.activeIndex - 1;
        this.mySwiper.slideTo(index, 0, false);
    },
    handlePrevEl: function () {
        const index = this.mySwiper.slides.length - slidesPerView === this.mySwiper.activeIndex ? 0 : this.mySwiper.activeIndex + 1;
        this.mySwiper.slideTo(index, 0, false);
    },
    view: function (vnode) {
        return m('div', { class: 'slideshow swiperLTF' }, [
            m('div', { class: 'swiper-container', id: "slideShowLTR" }, [
                m('div.swiper-wrapper', [
                    this.leftToRight(vnode)
                ])
            ]),
            m('div.button-prev', { onclick: this.handleNextEl.bind(this) }, m('img', { src: TOLEFT })),
            m('div.button-next', { onclick: this.handlePrevEl.bind(this) }, m('img', { src: TORIGHT }))
        ]);
    },
    onremove: function () {
        this.mySwiper = null;
    }
};