const m = require('mithril');

require('@/styles/pages/home.css');
const top = require('./top/top.logic');
const picture = require('./picture/picture.view');
const advantage = require('./advantage/advantage.view');
const introduce = require('./introduce/introduce.view');
module.exports = {
    view: function () {
        return m('div.views-home-index', [
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