const m = require('mithril');

require('@/styles/pages/home.css');
const top = require('../home/top/topIndex');
const picture = require('./picture/pictureIndex');
const advantage = require('./advantage/advantageIndex');
const introduce = require('./introduce/introduceIndex');
module.exports = {
    view: function () {
        return m('div.views-pages-home-index', [
            // 顶部+轮播+公告
            m(top),
            // // 大图+轮播2
            m(picture),
            // // 平台优势
            m(advantage),
            // // 平台介绍+平台优势+交易
            m(introduce)
        ]);
    }
};