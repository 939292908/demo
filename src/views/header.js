let m = require('mithril')

const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown
    }
}

module.exports = {
    view:  function(){
        return m('nav.navbar.is-fixed-top', {role:"navigation", "aria-label":"main navigation"}, [
            m('.navbar-brand', {}, [
                m('a.navbar-item', {}, [
                    m('img', {"src":"https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height:"28"})
                ]),
                m('a.navbar-burger.burger', {class: ""+(methods.openNavbarDropdown?" is-active":""), role:"button", "aria-label": "menu", "aria-expanded": false, "data-target": "navbarBasicExample", onclick: methods.clickNavbarOpenBtn}, [
                    m('span', {"aria-hidden": true}),
                    m('span', {"aria-hidden": true}),
                    m('span', {"aria-hidden": true}),
                ])
            ]),
            m('div#navbarBasicExample.navbar-menu', {class: ""+(methods.openNavbarDropdown?" is-active":"")}, [
                m('div.navbar-start', {}, [
                    m('a.navbar-item', {onclick:function(){
                        window.router.push('/home')
                    }}, [
                        'Home'
                    ]),
                    m('a.navbar-item', {onclick:function(){
                        window.router.push('/userCenter')
                    }}, [
                        'userCenter'
                    ]),
                    m('a.navbar-item', {}, [
                        gI18n.$t('10002', {value: "BTC"})
                    ]),
                    m('a.navbar-item', {
                        onclick: function(){
                            window.themeDark = !window.themeDark
                        }
                    }, [
                        m('i.iconfont'+(window.themeDark?'.icon-baitian':'.icon-night'))
                    ]),
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('div.navbar-link', {}, [
                            '切换语言'
                        ]),
                        m('div.navbar-dropdown', {}, [
                            m('a.navbar-item', {
                                class: ""+(gI18n.locale == 'zh'?' is-active':''),
                                onclick:function(){
                                    gI18n.setLocale('zh', res=>{
                                        _console.log('header setLocale',res)
                                    })
                                }
                            }, [
                                '简体中文'
                            ]),
                            m('a.navbar-item', {
                                class: ""+(gI18n.locale == 'en'?' is-active':''),
                                onclick:function(){
                                    gI18n.setLocale('en', res=>{
                                        _console.log('header setLocale',res)
                                    })
                                }
                            }, [
                                'English'
                            ]),
                            m('a.navbar-item', {
                                class: ""+(gI18n.locale == 'tw'?' is-active':''),
                                onclick:function(){
                                    gI18n.setLocale('tw', res=>{
                                        _console.log('header setLocale',res)
                                    })
                                }
                            }, [
                                '繁体中文'
                            ]),
                        ])
                    ]),
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('div.navbar-link', {}, [
                            'More'
                        ]),
                        m('div.navbar-dropdown', {}, [
                            m('a.navbar-item', {}, [
                                'About'
                            ]),
                            m('a.navbar-item', {}, [
                                'Content'
                            ]),
                            m('hr.navbar-divider'),
                            m('a.navbar-item', {}, [
                                'Report an issue'
                            ]),
                        ])
                    ])
                ]),
                m('a.navbar-item', {onclick:function(){
                    window.router.push('/myWallet')
                }}, [
                    '资产'
                ]),
                m('div.navbar-end', {}, [
                    m('div.navbar-item', {}, [
                        m('div.buttons', {}, [
                            m('div.button.has-bg-primary', {}, [
                                "Sign up"
                            ]),
                            m('div.button', {
                                onclick:function(){
                                    window.router.push('/login')
                                }
                            }, [
                                "Log in"
                            ]),
                        ]),
                    ]),
                ]),
            ])
        ])
    }
}