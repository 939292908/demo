// 按照登录配置处理登录

let loginType = window.$config.loginType
switch(loginType){
    case 0:
        window.gWebAPI.ReqUserInfo()
        break;
    case 1:
        //token方式登录
        getToken()
        break;
}



function getToken(){
    /**
     * 可在此函数获取需要登录的账号的用户名以及token，获取完成调用loginTrd，示例如下
     * loginTrd({
            UserName: '324352@qq.com',
            Token: 'LgAAjGeYDMCYRtliJsQzGKGxDM6ZzM64g+FuNmNnMgbL',
        })
     */
    
    
}


function loginTrd({
    UserName,
    Token
}){
    if(Token && UserName){
        let s = window.gWebAPI
        s.CTX.account = {
            accountName: UserName,
            AuthType: 2,
            token: Token
        }
        gEVBUS.emit(gWebAPI.EV_WEB_LOGIN,{d:s.CTX})
    }
}