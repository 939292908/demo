const LOG = window.console.log;

const openStr = 'nzm';

window.console.log = function (str, ...text) {
    if (openStr === str) LOG(...text);
};