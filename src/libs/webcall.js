const USE_AXIOS = true

var m = require("mithril")

import _axios from './_axios'


let axios
let qs
if (USE_AXIOS) {
    axios = new _axios();
    qs = require('qs');
}
function XHRConfig (xhr) {
//    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    return xhr;
}


export function RequestWarp(aReq,aOnSucess,aOnError) {
    if (USE_AXIOS) {
        aReq.data = aReq.body
        if (aReq.data) {
            aReq.data = qs.stringify(aReq.data)
        }
        axios.request(aReq.method, aReq.url, aReq.data, aReq).then(function(res){
            aOnSucess(res.data)
        }).catch(aOnError);
    } else {
        m.request(aReq).then(aOnSucess)
            .catch(aOnError)
    }
}

