
import EVBUS  from '../libs/evbus'
window.gEVBUS = new EVBUS();

const ev_name = Object.freeze({
    EV_ClICKBODY: 'EV_ClICKBODY',

    EV_ClOSEHEADERMENU: 'EV_closeHeaderMenu',

    EV_CHANGEPLACEORDPRZABDNUM: 'EV_changePlaceOrdPrzAndNum',
     
    EV_ONRESIZE_UPD: "EV_ONRESIZE_UPD",

    EV_NET_LINES_UPD: "EV_NET_LINES_UPD",

    EV_OPEN_NET_SWITCH: "EV_OPEN_NET_SWITCH",
    
    EV_THEME_UP: 'EV_THEME_UP',

    EV_OPENCLOSEPOSITION_UPD: 'EV_OPENCLOSEPOSITION_UPD',

    EV_ALL_CLOSE_LIST_UPD: 'EV_ALL_CLOSE_LIST_UPD',

    EV_OPENCALCULATORVIEW_UPD: 'EV_OPENCALCULATORVIEW_UPD'
})

window.gEVBUS = Object.assign(window.gEVBUS, ev_name)