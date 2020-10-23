const Http = require('@/api').webApi;
const m = require('mithril');
const redPacketUtils = require('@/util/redPacketUtils').default;
const share = require('@/views/page/main/share/share.logic');
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const Qrcode = require('qrcode');
const errCode = require('@/util/errCode').default;
const I18n = require('@/languages/I18n').default;
const globalModels = require('@/models/globalModels');

const logic = {
    shareLoading: false, // 分享按钮loading
    // 头部 组件配置
    headerOption: {
        left() {
            return {
                onclick() {
                    window.router.back();
                }
            };
        },
        center() {
            return {
                label: I18n.$t('20046')/* 详情记录 */
            };
        }
    },
    // 红包top 组件配置
    redPacketTopOption: {
        // guid: "", // 来源 (空为自己)
        // type: "", // 红包类型 type 0:为拼手气 / >0:普通红包
        // des: "", // 留言
        // quota: "", // 金额
        // coin: "", // 币种
        // msg: "" // 提示消息 (空为没有)
        // msg2: "" // 提示消息 (空为没有)
    },
    // 红包info 组件配置
    redPacketInfoOption: {
        // status: "", // 状态：0待领取，1已领完，2红包到期
        // count: "", // 总数
        // count2: "", // 未领数
        // quota: "", // 总额
        // quota2: "", // 未领额
        // coin: "" // 币种
    },
    // 已抢红包列表
    redPacketList: [],
    // 红包已领取记录 接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(arg => {
            if (arg.result.code === 0) {
                redPacketUtils.buildGiftrecData(arg.result.data).then(data => {
                    logic.redPacketList = data;
                    m.redraw();
                });
                m.redraw();
                console.log('红包已领取记录 success', arg);
            } else {
                window.$message({
                    content: errCode.getRedPacketErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
        }).catch(function(err) {
            console.log('红包已领取记录 error', err);
        });
    },
    // 红包详情 接口
    getdetails() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getdetails(params).then(function(arg) {
            if (arg.result.code === 0) {
                const data = arg.result.data;
                // 红包top 组件配置
                logic.redPacketTopOption = JSON.parse(JSON.stringify(data));
                logic.redPacketTopOption.msg = logic.redPacketTopOption.status * 1 === 2 ? "红包已过期" : ""; // msg
                logic.redPacketTopOption.guid = ""; // 空为来自自己
                // 红包Info 组件配置
                logic.redPacketInfoOption = JSON.parse(JSON.stringify(data));
                m.redraw();
                console.log('红包详情 success', arg);
            } else {
                window.$message({
                    content: errCode.getRedPacketErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
        }).catch(function(err) {
            console.log('红包详情 error', err);
        });
    },
    // 底部按钮click
    footerBtnClick() {
        if (logic.redPacketInfoOption.status === 0) { // 继续发送该红包
            logic.shareLoading = true;
            logic.toShare({
                link: window.location.origin + window.location.pathname + `/#!/receiveRedPacket?gid=${m.route.param().gid}&r=${globalModels.getAccount().uid}`
            });
        } else { // 知道了
            window.router.back();
        }
    },
    oninit(vnode) {
        this.redPacketList = [];
        this.getgiftrec(); // 红包已领取记录
        this.getdetails(); // 红包详情
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    },
    toShare: function(param) {
        const link = param.link; // 需要分享的链接
        const img1 = window.location.origin + window.location.pathname + require('@/assets/img/shareBg.jpg').default;
        const img2 = window.location.origin + window.location.pathname + require('@/assets/img/logo.png').default;
        console.log(img1, img2);
        if (window.plus) {
            Qrcode.toDataURL(link).then(base64 => {
                GetBase64.loadImageUrlArray([img1, img2, base64], arg => {
                    console.log('GetBase64 loadImageUrlArray', arg);
                    GetBase64.getWebView({
                        data: HtmlConst.shareRedPacket([I18n.$t('20050')/* 分享红包 */, I18n.$t('20051')/* 红包资产可用来提现，交易 */, I18n.$t('20064')/* 下载APP，轻松交易 */], arg),
                        W: 375,
                        H: 667
                    }, res => {
                        console.log('GetBase64 getWebView', res);
                        share.openShare({ needShareImg: res, link: link }); // 打开分享弹框
                        logic.shareLoading = false;
                        m.redraw();
                    });
                });
            }).catch(err => {
                console.log(err);
            });
        } else {
            logic.shareLoading = false;
            // h5分享红包
            window.router.push({
                path: "/shareH5", // h5分享红包
                data: {
                    link: link // 链接
                }
            });
        }
    }
};

module.exports = logic;