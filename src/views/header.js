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
                m('div.navbar-end', {}, [
                    m('div.navbar-item', {}, [
                        m('div.buttons', {}, [
                            m('div.button.is-primary', {}, [
                                "Sign up"
                            ]),
                            m('div.button.is-light', {}, [
                                "Log in"
                            ]),
                        ]),
                    ]),
                ]),
            ])
        ])
    }
}