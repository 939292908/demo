// 路由接收参数
// gid, // 红包id
// best, // 手气最佳(0:否 1:是)
// quota // 抢的金额

const m = require('mithril');
const Qrcode = require('qrcode');
const Http = require('@/api').webApi;
const redPacketUtils = require('@/util/redPacketUtils').default;
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const share = require('../../main/share/share.logic.js');

const logic = {
    best: 0, // 手气最佳(0:否 1:是)
    // 已抢红包列表
    redPacketList: [],
    // 头部 组件配置
    headerOption: {
        left: {
            onclick() {
                window.router.back();
            }
        },
        center: {
            label: "详情记录"
        },
        right: {
            label: m('i', { class: `iconfont icon-otc-editName` }),
            loading: false, // 分享按钮loading
            onclick() {
                logic.headerOption.right.loading = true; // 分享按钮loading
                console.log(logic.redPacketTopOption, 65555);
                const params = logic.redPacketTopOption;
                // 生成二维码
                logic.doShare({
                    link: window.location.origin + '/m/register/',
                    // textArr: ['手气最佳', '8 USDT', '我抢到了来自', '178****7894', '的拼手气红包', '下载注册APP，轻松交易']
                    textArr: [
                        `${logic.best === 1 ? '手气最佳' : '我抢到了'}`,
                        `${params.quota} ${params.coin}`,
                        '我抢到了来自',
                        `${params.guid}`,
                        `的${params.type * 1 === 0 ? '拼手气红包' : '普通红包'}`,
                        `下载注册APP，轻松交易`]
                });
            }
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
    // 领取记录 接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(arg => {
            if (arg.code === 0) {
                // 领取记录列表
                redPacketUtils.buildGiftrecData(arg.data).then(data => {
                    logic.redPacketList = data;
                    m.redraw();
                });
                console.log('领取记录 success', arg);
            }
        }).catch(function(err) {
            console.log('领取记录 error', err);
        });
    },
    // 红包详情 接口
    getdetails() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getdetails(params).then(function(arg) {
            if (arg.code === 0) {
                const data = arg.data;
                logic.redPacketTopOption = JSON.parse(JSON.stringify(data)); // 红包top 组件配置
                logic.redPacketTopOption.quota = m.route.param().quota; // 自定义修改当前抢到金额

                logic.redPacketInfoOption = JSON.parse(JSON.stringify(data)); // 红包Info 组件配置

                m.redraw();
                console.log('红包详情 success', arg);
            }
        }).catch(function(err) {
            console.log('红包详情 error', err);
        });
    },
    doShare(param) {
        const link = param.link; // 需要分享的链接
        const img1 = window.location.origin + window.location.pathname + require('@/assets/img/work.png').default;
        const img2 = window.location.origin + window.location.pathname + require('@/assets/img/logo.png').default;
        console.log(img1, img2);
        if (window.plus) {
            Qrcode.toDataURL(link).then(base64 => {
                GetBase64.loadImageUrlArray([img1, img2, base64], arg => {
                    console.log('GetBase64 loadImageUrlArray', arg);
                    GetBase64.getWebView({
                        data: HtmlConst.shareLucky(param.textArr, arg),
                        W: 276,
                        H: 390
                    }, res => {
                        console.log('GetBase64 getWebView', res);
                        share.openShare({ needShareImg: res, link: link });
                        logic.headerOption.right.loading = false; // 分享按钮loading
                    });
                });
            }).catch(err => {
                console.log(err);
            });
        }
    },
    oninit(vnode) {
        this.getdetails();// 红包详情
        this.getgiftrec();// 领取记录
        logic.best = m.route.param().best * 1; // 是否手气最佳
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;