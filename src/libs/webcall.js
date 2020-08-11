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
        let data = aReq.body
        delete aReq.body
        if (aReq.method == 'post' && data) {
            data = qs.stringify(data)
        }
        axios.request(aReq.method, aReq.url, data, aReq).then(function(res){
            aOnSucess(res.data)
        }).catch(aOnError);
    } else {
        m.request(aReq).then(aOnSucess)
            .catch(aOnError)
    }
}

