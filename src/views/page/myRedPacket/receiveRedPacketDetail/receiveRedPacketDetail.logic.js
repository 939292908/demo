// 路由接收参数
// gid, // 红包id
// best, // 手气最佳(0:否 1:是)
// quota // 抢的金额

const m = require('mithril');
const Qrcode = require('qrcode');
const Http = require('@/api').webApi;
const utils = require('@/util/utils').default;
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const share = require('../../main/share/share.logic.js');

const logic = {
    fromName: "", // 发红包人
    redPacketType: 0, // 红包类型 0:拼手气 >0:普通
    redPacketState: 2, // 红包状态 1: 领完了 2: 未领完 3: 已过期
    redPacketDes: "", // 祝福留言
    coin: "", // 红包币种
    quota: "", // 总金额
    quota2: "", // 未领金额
    count: "", // 总红包数量
    count2: "", // 未领红包数量
    isLucky: true, // 是否是手气最佳
    currentQuota: "", // 当前抢到金额
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
            onclick() {
                // 生成二维码
                logic.doShare({
                    link: 'http://192.168.2.89:8888/register',
                    textArr: ['手气最佳', '8 USDT', '我抢到了来自', '178****7894', '的拼手气红包', '下载注册APP，轻松交易']
                });
            }
        }
    },
    // 领取记录 接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(arg => {
            if (arg.data.code === 0) {
                // 领取记录列表
                this.redPacketList = arg.data.data.map(item => {
                    item.time = utils.formatDate(item.rtm, 'yyyy-MM-dd hh:mm'); // 领取时间
                    item.phone = utils.hideAccountNameInfo(item.rtel); // 领取人手机号
                    return item;
                });
                m.redraw();
                console.log('领取记录 success', arg.data);
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
            if (arg.data.code === 0) {
                logic.isLucky = m.route.param().best * 1 === 1; // 是否手气最佳
                logic.currentQuota = m.route.param().quota; // 当前抢到金额
                logic.fromName = arg.data.data.guid; // 红包来源
                logic.redPacketType = arg.data.data.type; // 红包类型
                logic.redPacketDes = arg.data.data.des; // 祝福留言
                logic.coin = arg.data.data.coin; // 红包币种
                logic.quota = arg.data.data.quota; // 总金额
                logic.quota2 = arg.data.data.quota2; // 未领金额
                logic.count = arg.data.data.count; // 总红包数量
                logic.count2 = arg.data.data.count2; // 未领红包数量
                m.redraw();
                console.log('红包详情 success', arg.data);
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
                    });
                });
            }).catch(err => {
                console.log(err);
            });
        }
    },
    // 已抢红包列表
    redPacketList: [],
    oninit(vnode) {
        this.getdetails();// 红包详情
        this.getgiftrec();// 领取记录
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;