const m = require('mithril');
module.exports = {
    options: {
        isShow: false,
        needShareImg: null
    },
    // 分享按钮list
    shareBtnList: [
        {
            label: "微信好友",
            icon: "icon-shareWeixin",
            onclick() {
                console.log(this.label);
            }
        },
        {
            label: "朋友圈",
            icon: "icon-shareFriends",
            onclick() {
                console.log(this.label);
            }
        },
        {
            label: "复制链接",
            icon: "icon-qiehuan3",
            onclick() {
                console.log(this.label);
            }
        },
        {
            label: "保存图片",
            icon: "icon-xiaqiehuan",
            onclick() {
                console.log(this.label);
            }
        }
    ],
    /**
     * 打开分享弹框
     * @param {Object} param {
     * needShareImg: '***' // 需要分享的图片，base64格式
     * }
     */
    openShare: function(param) {
        this.options.isShow = true;
        this.options.needShareImg = param.needShareImg;
        m.redraw();
        console.log('options', this.options);
    },
    // 取消 分享红包 click
    cancelShareBtnClick() {
        this.options.isShow = false;
        this.options.needShareImg = null;
        m.redraw();
    }
};