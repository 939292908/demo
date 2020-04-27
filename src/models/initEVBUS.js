
import EVBUS  from '../libs/evbus'
window.gEVBUS = new EVBUS();

const ev_name = Object.freeze({
    EV_ClICKBODY: 'EV_ClICKBODY',

    EV_ClOSEHEADERMENU: 'EV_closeHeaderMenu',
})

window.gEVBUS = Object.assign(window.gEVBUS, ev_name)