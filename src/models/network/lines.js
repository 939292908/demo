const m = require('mithril');
const { apiLines } = require('@/api/index.js');
const TradeNetSpeed = require('./TradeNetSpeed').default;
const HttpNetSpeed = require('./HttpNetSpeed').default;
module.exports = {
    // 线路
    netLines: [],
    activeLine: null,
    // api测速结果
    apiResponseSpeed: [],
    // ws测速结果
    wsResponseSpeed: [],
    // 测速开始时间
    testStartTime: 0,
    initLines: function () {
        this.netLines = apiLines.GetLines().netLines;
        this.activeLine = apiLines.GetActive();
        this.apiResponseSpeed = [];
        this.wsResponseSpeed = [];
        this.testTick();
        m.redraw();
    },
    updateLines: function () {
        apiLines.updateNetLines(this.initLines);
    },
    setLinesActive(id) {
        window.console.log('setLinesActive', id);
        apiLines.SetActive(id);
        this.activeLine = apiLines.GetActive();
        m.redraw();
    },
    getActive() {
        return apiLines.GetActive();
    },
    testTick: function () {
        const tm = Date.now();
        if (tm - this.testStartTime < 60 * 1000) return;
        this.testStartTime = Date.now();
        // ws测速
        // this.testTradeNetSpeed();
        // api测速
        this.testHttpNetSpeed();
    },
    // ws测速
    testTradeNetSpeed: function () {
        const that = this;
        this.wsResponseSpeed = [];
        const testWsList = [];
        for (let i = 0; i < this.netLines.length; i++) {
            const item = {
                trade: this.netLines[i].WSTRD
            };
            const testItem = new TradeNetSpeed(item);
            testItem.test().then(net => {
                // vm.$set(this.wsResponseSpeed, i, net.duration);
                that.wsResponseSpeed[i] = net.duration;
                m.redraw();
                console.log('----------ws test ok speeds----------: ', net.duration, net.name, that.wsResponseSpeed);
            }).catch(net => {
                that.wsResponseSpeed[i] = '--';
                m.redraw();
                console.log('----------ws test CANCEL speeds----------: ', net.duration, net.name, that.wsResponseSpeed);
            });
            testWsList.push(testItem);
        }
        // this.testWsList = testWsList
        // console.log('this.testWsList: ', this.testWsList.length);
    },
    // api测速
    testHttpNetSpeed: function () {
        const that = this;
        this.apiResponseSpeed = [];
        // for(let item of this.netLines){
        for (let i = 0; i < this.netLines.length; i++) {
            const item = {
                node: this.netLines[i].WebAPI
            };
            const netSpeed = new HttpNetSpeed(item);
            netSpeed.test().then(net => {
                // vm.$set(this.apiResponseSpeed, i, net.duration);
                that.apiResponseSpeed[i] = net.duration;
                m.redraw();
                console.log('**********api test ok speeds*********: ', net.duration, net.name, i, that.apiResponseSpeed);
            }).catch(net => {
                that.apiResponseSpeed[i] = '--';
                m.redraw();
                console.log('**********api test CANCEL speeds*********: ', net.duration, net.name, i, that.apiResponseSpeed);
            });
        }
    }
};