let m = require('mithril')
// let m = require('swiper')

require('@/styles/pages/home.css')


let marketList = require('./marketList')
let introduce = require('./introduce')
let advantage = require('./advantage')
let transaction = require('./transaction')
let download = require('./download')
// let buttom = require('./buttom')
let rotation = require('./rotation')
let notice = require('./notice')



// let demo = require('@/views/pages/demo')
 var prev=document.getElementById("prev");
 var next=document.getElementById("next");
 var img=document.getElementsByTagName("img")[0];
 var imgArr=["/user/cat.jpeg",];
 var index=0;
  
 //点击左箭头，切换上一张
 function p(){
 if(index==0)
 {
 index=imgArr.length;
 }
 index--;
 img.src=imgArr[index];
 }
 //点击右箭头，切换下一张
 function n(){
 if(index==imgArr.length)
 {
 index=0;
 }
 img.src=imgArr[index];
 index++;
 }
 //设置自动播放
 time=setInterval(p(),2000);
  
 //鼠标移入箭头内，停止自动播放
 function cal(){
 clearInterval(time);
 }
module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.views-pages-home-index', [
            // 轮播 + 下拉            
            m(rotation),
            // 公告
            m(notice),
            // 行情表格
            m(marketList),
            // 平台介绍
            m(introduce),   
             //平台优势         
            m(advantage),            
            // 交易之旅
            m(transaction),    
            // 二维码下载
            m(download),    
            // 底部 模块
            // m(buttom),
        ])
    }
}