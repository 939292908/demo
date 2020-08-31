const m = require('mithril');
require('@/views/page/bindGoogle/open/openGoogleVerify.scss');

const openGView = {
    nav: [ // 上方导航（下载App，扫描二维码，备份密钥，开启谷歌验证）
        {
            id: 1,
            title: '下载App'
        },
        {
            id: 2,
            title: '扫描二维码'
        },
        {
            id: 3,
            title: '备份密钥'
        },
        {
            id: 4,
            title: '开启谷歌验证'
        }
    ],
    checkFlag: 4, // 当前选中哪个步骤
    modifyCheckFlag(type) { // 上一步 下一步
        type === 'prev' ? this.checkFlag = this.checkFlag - 1 : this.checkFlag = this.checkFlag + 1;
    },
    copyText(type) {
        let ele;
        if (type === 'one') {
            ele = document.getElementsByClassName('keyText')[0];
        } else if (type === 'two') {
            ele = document.getElementsByClassName('keyText')[1];
        }
        ele.select(); // 选择对象
        document.execCommand("copy", false, null);
        alert('复制成功');
    },
    oninit: () => {
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-bindGoogle-open theme--light` }, [
            m('div', { class: `operation mb-7 has-bg-level-2` }, [
                m('i', { class: `iconfont icon-Return has-text-title` }),
                m('span', { class: `has-text-title my-4 ml-4 title-medium` }, '您正在绑定谷歌验证')
            ]),
            m('div', { class: `center content-width` }, [
                m('div', { class: `center-top mt-7` }, [
                    openGView.nav.map(item => {
                        return m('div', { class: `column my-7 pb-7 ` + (item.id <= openGView.checkFlag ? 'is-active' : '') }, [
                            m('span', { class: `title-small` }, item.id),
                            m('span', { class: `body-5` }, item.title)
                        ]);
                    })
                ]),
                m('div', { class: `center-center` }, [
                    m('div', { class: `stepOne pt-7`, style: { display: (openGView.checkFlag === 1 ? '' : 'none') } }, [
                        m('div', { class: `desc1 body-5 mb-3` }, '下载谷歌验证器'),
                        m('div', { class: `desc2 body-5` }, '扫码下载或者在应用商店中搜索“Google Authentication”应用'),
                        m('div', { class: `qrcode mt-6` }, [
                            m('div', { class: `qrcode-left mr-8` }, [
                                m('div', {}),
                                m('span', {}, 'IOS')
                            ]),
                            m('div', { class: `qrcode-right` }, [
                                m('div', {}),
                                m('span', {}, 'Android')
                            ])
                        ])
                    ]),
                    m('div', { class: `stepTwo pt-7`, style: { display: (openGView.checkFlag === 2 ? '' : 'none') } }, [
                        m('div', { class: `desc1 body-5` }, '用谷歌验证App扫描以下二维码'),
                        m('div', { class: `qrcode my-7` }),
                        m('div', { class: `desc2 body-5 mb-3` }, '如果您无法扫描这个二维码，请在App中手动输入这串字符'),
                        m('div', { class: `key` }, [
                            m('input', { class: `keyText title-small`, type: 'text', readOnly: `readOnly`, value: 'P6IQFDD4XT7Q314W' }),
                            m('i', { class: `iconfont icon-copy`, onclick: () => { openGView.copyText('one'); } })
                        ])
                    ]),
                    m('div', { class: `stepThree pt-7`, style: { display: (openGView.checkFlag === 3 ? '' : 'none') } }, [
                        m('div', { class: `mb-1` }, '请妥善保管好该密钥，以免丢失!'),
                        m('div', { class: `mb-7` }, '如果该密钥丢失，需要联系客服处理，这通常需要一定的时间'),
                        m('div', { class: `key` }, [
                            m('input', { class: `keyText title-small`, type: 'text', readOnly: `readOnly`, value: 'P6IQFDD4XT7Q314W' }),
                            m('i', { class: `iconfont icon-copy`, onclick: () => { openGView.copyText('two'); } })
                        ])
                    ]),
                    m('div', { class: `stepFour pt-7`, style: { display: (openGView.checkFlag === 4 ? '' : 'none') } }, [
                        m('div', { class: `desc1 title-small mb-7` }, '完成以下验证，开启谷歌验证'),
                        m('div', { class: `pwd` }, [
                            m('span', { class: `body-5` }, '登录密码'),
                            m('br'),
                            m('input', { class: `border-radius-small mb-5 mt-2`, type: `text` })
                        ]),
                        m('div', { class: `code` }, [
                            m('span', { class: `body-5 mb-2` }, '谷歌验证码'),
                            m('br'),
                            m('input', { class: `border-radius-small mt-2`, type: `text` })
                        ]),
                        m('div', { class: `btn mt-8` }, [
                            m('button', { class: `has-bg-primary` }, '确定')
                        ])
                    ])
                ]),
                m('div', { class: `center-btn px-7`, style: { display: (openGView.checkFlag !== 4 ? '' : 'none') } }, [
                    m('button', { class: `prev mt-6 border-radius-small cursor-pointer`, style: { display: (openGView.checkFlag === 1 || openGView.checkFlag === 4 ? 'none' : '') }, onclick: () => { openGView.modifyCheckFlag('prev'); } }, '上一步'),
                    m('button', { class: `next mt-6 has-bg-primary border-radius-small cursor-pointer`, style: { display: (openGView.checkFlag === 4 ? 'none' : '') }, onclick: () => { openGView.modifyCheckFlag('next'); } }, '下一步')
                ])
            ])
        ]);
    },
    onremove: () => {

    }
};
module.exports = openGView;