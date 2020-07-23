const utils = {}
const DBG_TAG = "UTILS"

utils.setItem = function (key, val) {
    try {
        window.localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {
        window._console.log(DBG_TAG,JSON.stringify(e));
    }
};

utils.getItem = function (key) {
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch(e) {
        return null;
    }
};
utils.removeItem = function (key) {
    try {
        window.localStorage.removeItem(key);
    } catch(e) {
        window._console.log(DBG_TAG,JSON.stringify(e));
    }
};

utils.isMobile = function() {
    let userAgentInfo = navigator.userAgent;
 
    let mobileAgents = [ "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad","iPod"];
 
    let mobile_flag = false;
 
    //根据userAgent判断是否是手机
    for (let v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobile_flag = true;
            break;
        }
    }
 
    let screen_width = window.screen.width;
    let screen_height = window.screen.height;    
 
    //根据屏幕分辨率判断是否是手机
    if(screen_width < 500 && screen_height < 800){
        mobile_flag = true;
    }

    return mobile_flag;
}

export default utils