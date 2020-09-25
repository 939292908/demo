const m = require('mithril');
const Qrcode = require('qrcode');
const Http = require('@/api').webApi;
const utils = require('@/util/utils').default;

const logic = {
    // 红包详情分享 弹框
    isShowShareDetailModal: false,
    fromTel: "12345", // 发红包人电话
    // 是否是手气最佳
    isLucky: true,
    // 二维码链接
    ewmLink: "www.baidu.com",
    // 二维码img
    ewmImg: "",
    // 头部 组件配置
    headerOption: {
        class: "",
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
                Qrcode.toDataURL(logic.ewmLink || '无').then(url => {
                    logic.ewmImg = url;
                }).catch(err => {
                    console.log(err);
                });
                logic.isShowShareDetailModal = true;
            }
        }
    },
    // 红包详情 api
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(arg => {
            console.log(arg.data, 66);
            if (arg.data.code === 0) {
                // logic.isLucky = arg.data.data.best * 1 === 1;
                // logic.fromTel = arg.data.data.best * 1 === 1;
                // 领取列表
                this.redPacketList = arg.data.data.map(item => {
                    item.time = utils.formatDate(item.ctm, 'yyyy-MM-dd hh:mm'); // 领取时间
                    item.phone = utils.hideAccountNameInfo(item.rtel); // 领取人手机号
                    return item;
                });
                m.redraw();
                console.log('红包详情 success', arg.data);
            } else {
                logic.passwordModel.updateErrMsg(arg.data.err_msg);
            }
        }).catch(function(err) {
            console.log('红包详情 error', err);
        });
    },
    // 已抢红包列表
    redPacketList: [],
    oninit(vnode) {
        this.getgiftrec();
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;