
import EVBUS  from '../libs/evbus'
window.gEVBUS = new EVBUS();

const ev_name = Object.freeze({
    EV_ClICKBODY: 'EV_ClICKBODY',

    EV_ClOSEHEADERMENU: 'EV_closeHeaderMenu',

    EV_CHANGEPLACEORDPRZABDNUM: 'EV_changePlaceOrdPrzAndNum',
     
    EV_ONRESIZE_UPD: "EV_ONRESIZE_UPD",

    EV_NET_LINES_UPD: "EV_NET_LINES_UPD"
})

window.gEVBUS = Object.assign(window.gEVBUS, ev_name)