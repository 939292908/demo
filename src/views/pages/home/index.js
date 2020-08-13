const m = require('mithril');
//  const m = require('swiper')

require('@/styles/pages/home.css');
const top = require('./top');
const picture = require('./picture');
const rotationtwo = require('./rotationtwo');
const advantage = require('./advantage');
const introduce = require('./introduce');
const rotation = require('./rotation');
const notice = require('./notice');

//  const demo = require('@/views/pages/demo')
// var prev = document.getElementById("prev");
// var next = document.getElementById("next");
// var img = document.getElementsByTagName("img")[0];
// var imgArr = ["/user/cat.jpeg"];
// var index = 0;

// 点击左箭头，切换上一张
// function p() {
//     if (index === 0) {
//         index = imgArr.length;
//     }
//     index--;
//     img.src = imgArr[index];
// }
// 点击右箭头，切换下一张
// function n() {
//     if (index == imgArr.length) {
//         index = 0;
//     }
//     img.src = imgArr[index];
//     index++;
// }
// 设置自动播放
// const time = setInterval(p(), 2000);

// 鼠标移入箭头内，停止自动播放
// function cal() {
//     clearInterval(time);
// }
module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.views-pages-home-index', [
            // 顶部
            m(top),
            // 轮播
            m(rotation),
            //  公告
            m(notice),
            // 大图
            m(picture),
            // 轮播2
            m(rotationtwo),
            // 平台优势
            m(advantage),
            // 平台介绍+平台优势+交易
            m(introduce)
        ]);
    }
};