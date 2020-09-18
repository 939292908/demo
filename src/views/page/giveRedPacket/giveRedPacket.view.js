const m = require('mithril');
require('./giveRedPacket.scss');
const logic = require('./giveRedPacket.logic');
const Header = require('@/views/components/common/Header/Header.view');
const FormItem = require('@/views/components/common/FormItem/FormItem.view');
const Button = require('@/views/components/common/Button/Button.view');
const Modal = require('@/views/components/common/Modal/Modal.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view views-give-red-packet` }, [
            m(Header, logic.headerOption),
            m('div', { class: `pub-layout` }, [
                // title
                m('div', { class: `views-give-red-packet-title columns is-mobile` }, [
                    m('div', { class: `column is-7` }, [
                        m('p', { class: `` }, '分享红包'),
                        m('p', { class: `` }, '红包资产可用来提现，交易')
                    ]),
                    m('div', { class: `column is-5` }, [
                        '图片'
                    ])
                ]),
                // 币种
                m('div', { class: `` }, [
                    m('span', { class: `` }, '币种'),
                    m('span', { class: `` }, logic.currentCoin)
                ]),
                // 币种btn 列表
                m('div', { class: `` }, [
                    logic.coinBtnList.map(btnOption => m(Button, btnOption))
                ]),
                // 划转
                m('div', { class: `has-text-right` }, [
                    m('span', { class: `` }, '钱包可用：0.00USDT '),
                    m('span', { class: `has-text-primary`, onclick() { logic.transferBtnClick(); } }, ' 划转')
                ]),
                // 总金额
                m(FormItem, logic.moneyFormItemOption),
                m('div', { class: `` }, [
                    m('span', { class: `` }, [`当前为${logic.redPacketType === 1 ? '普通红包' : '拼手气红包'}，改为 `]),
                    m('span', { class: `has-text-primary`, onclick() { logic.switchRedPacketType(); } }, [logic.redPacketType === 1 ? '拼手气红包' : '普通红包'])
                ]),
                // 红包个数
                m(FormItem, logic.numberFormItemOption),
                // info信息
                m(FormItem, logic.infoFormItemOption),
                // 塞币进红包 btn
                m(Button, logic.coinToRedButtonOption),
                // 划转 Modal
                m(Modal, {
                    isShow: logic.transferModalOption.isShow,
                    updateOption(type) {
                        logic.transferModalOption.updateOption(type);
                    },
                    onOk() {
                        logic.transferModalOption.onOk();
                    },
                    onClose() {
                        logic.transferModalOption.onClose();
                    }
                })
            ])
        ]);
    }
};