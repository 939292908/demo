import Conf from '@/config';
import Axios from './request';
import BaseConf from "@/api/apiConf";

const instConf = new BaseConf(process.env.BUILD_ENV);
instConf.updateNetLines();

const api = instConf.GetActive();
const Http = new Axios(api.WebAPI).service;

const Interval = 1000;
const WSApi = require('@/api/wsApi');
gWsApi = new WSApi({
    baseUrl: api.WSMKT,
    Typ: 'mkt'
});
setInterval(function () {
    gWsApi.stately.do(gWsApi);
}, Interval);

export default {
    api,
    Conf,
    Http,
    gWsApi
};