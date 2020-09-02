/*
 * @Author: your name
 * @Date: 2020-08-17 13:35:47
 * @LastEditTime: 2020-08-25 20:20:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \website-project\src\views\pages\home\top.js
 */
const m = require('mithril');
const Http = require('@/api').webApi;
const l180n = require('@/languages/I18n').default;
const TopView = require('./top.view');
const Conf = require('@/api').Conf;

module.exports = {
    data: {
        banneList: [],
        noticeList: []
    },
    toPage() {
        if (window.gWebApi.loginState) {
            window.router.push('/chargeMoney');
        } else {
            window.router.push('/login');
        }
    },
    oninit: function () {
        this.locale = l180n.getLocale();
        this.getBanne();
        this.getnotice();
    },
    getBanne () {
        const params = { locale: this.locale, vp: Conf.exchId };
        Http.getBanne(params).then(res => {
            if (res.result.code === 0) {
                var bannList = [];
                const list = res.result.data;
                for (let i = 0; i < list.length && i < 9; i += 3) {
                    bannList.push(list.slice(i, i + 3));
                }
                this.data.banneList = bannList;
                m.redraw();
            }
        });
    },
    getnotice () {
        Http.getNotice({ locale: this.locale, vp: Conf.exchId }).then(res => {
            if (res.result.code === 0) {
                this.data.noticeList = res.result.data;
                m.redraw();
            }
        });
    },
    handleNoticeClick(item) {
        if (item) window.open(item.html_url);
    },
    view: function () {
        const props = {
            data: this.data,
            toPage: this.toPage,
            handleNoticeClick: this.handleNoticeClick
        };
        return TopView(props);
    }
};