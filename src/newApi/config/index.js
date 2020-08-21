import Conf from '@/config';
import Axios from './request';
import BaseConf from "@/api/apiConf";

const instConf = new BaseConf(process.env.BUILD_ENV);
instConf.updateNetLines();

const api = instConf.GetActive();
const Http = new Axios(api.WebAPI).service;

export default {
    api,
    Conf,
    Http
};