let m = require('mithril')


module.exports = {
    oncreate: function(){

    },
    view:  function(){
        return m('div', [
            m('h1.title.is-1',['userCenter ']),
            m('a', {onclick:function(){
                window.router.push('/home')
            }},[
                'to home'
            ]),
            m('button.button', {
                onclick: function(){
                    gWebApi.getUserInfo({}, res=>{
                        window._console.log('ht','getUserInfo suc', res)
                    }, err=>{
                        window._console.log('ht','getUserInfo err', err)
                    })
                }
            }, [
                '获取用户信息'
            ])
        ])
    }
}