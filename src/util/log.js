const LOG = window.console.log;

const openStr = 'lz';

window.console.log = function (str, ...text) {
    if (openStr === str) LOG(text);
};