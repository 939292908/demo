const m = require('mithril');
const { Share, Model } = require('@/models/plus/index.js');
module.exports = {
    options: {
        isShow: false,
        needShareImg: null,
        link: null
    },
    // 分享按钮list
    shareBtnList: [
        {
            key: "WXSceneSession",
            label: "微信好友",
            icon: "#icon-color-wechat"
        },
        {
            key: "WXSceneTimeline",
            label: "朋友圈",
            icon: "#icon-shareFriends"
        },
        {
            key: "CopyLink",
            label: "复制链接",
            icon: "#icon-CopyLink"
        },
        {
            key: "savePhoto",
            label: "保存图片",
            icon: "#icon-sharePhoto"
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
        this.options.link = param.link;
        m.redraw();
        console.log('options', this.options);
    },
    // 取消 分享红包 click
    cancelShareBtnClick() {
        this.options.isShow = false;
        this.options.needShareImg = null;
        m.redraw();
    },
    doShare: function(param) {
        const that = this;
        switch (param.key) {
        case "WXSceneSession":
        case "WXSceneTimeline":
            Share.ShareService(
                'weixin',
                this.options.needShareImg,
                param.key,
                arg => {
                    that.cancelShareBtnClick();
                },
                err => {
                    console.log('err', err);
                }
            );
            console.log('WXSceneSession', param);
            break;
        case "CopyLink":
            console.log('WXSceneSession', param);
            Model.plusCopyToClipboard(this.options.link);
            window.$message({ content: '已复制链接', type: 'success' });
            break;
        case "savePhoto":
            console.log('WXSceneSession', param);
            Share.photo(
                this.options.needShareImg,
                arg => {
                    that.cancelShareBtnClick();
                },
                err => {
                    console.log('err', err);
                }
            );
            break;
        default:
            // 什么都不做
        }
    }
};