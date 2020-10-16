const m = require('mithril');
const { Share, Model } = require('@/models/plus/index.js');
const I18n = require('@/languages/I18n').default;
module.exports = {
    isShare: false, // 是否分享了操作
    shareMsg: "", // 提示
    timeoutId: null, // 三秒清除提示消息 延时器id
    options: {
        isShow: false,
        needShareImg: null,
        link: null,
        cancelCallback: () => {} // 取消按钮回调
    },
    // 分享按钮list
    shareBtnList () {
        return [
            {
                key: "WXSceneSession",
                label: I18n.$t('20029')/* 微信好友 */,
                icon: "#icon-color-wechat"
            },
            {
                key: "WXSceneTimeline",
                label: I18n.$t('20030')/* 朋友圈 */,
                icon: "#icon-shareFriends"
            },
            {
                key: "CopyLink",
                label: I18n.$t('20031')/* 复制链接 */,
                icon: "#icon-CopyLink"
            },
            {
                key: "savePhoto",
                label: I18n.$t('20032')/* 保存图片 */,
                icon: "#icon-sharePhoto"
            }
        ];
    },
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
        this.options.cancelCallback = param.cancelCallback;
        m.redraw();
        console.log('options', this.options);
    },
    // 取消 分享红包 click
    cancelShareBtnClick() {
        const that = this;
        this.options.isShow = false;
        this.options.needShareImg = null;
        this.options.cancelCallback && this.options.cancelCallback({ isShare: that.isShare });
        this.isShare = false;
        this.shareMsg = "";
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
            that.isShare = true;
            that.shareMsg = I18n.$t('20033')/* 链接已复制，快去分享给你的好友吧！ */;
            window.clearTimeout(that.timeoutId);
            that.timeoutId = window.setTimeout(() => {
                that.shareMsg = "";
                m.redraw();
            }, 3000);
            // window.$message({ content: '已复制链接', type: 'success' });
            break;
        case "savePhoto":
            console.log('WXSceneSession', param);
            Share.photo(
                this.options.needShareImg,
                arg => {
                    that.isShare = true;
                    that.shareMsg = I18n.$t('20034')/* 图片已保存，快去分享给你的好友吧！ */;
                    m.redraw();
                    window.clearTimeout(that.timeoutId);
                    that.timeoutId = window.setTimeout(() => {
                        that.shareMsg = "";
                        m.redraw();
                    }, 3000);
                    // that.cancelShareBtnClick();
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