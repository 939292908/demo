module.exports = {
    demo: function(title, img) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>测试分享图片生成</title>
        </head>
        <body>
            <div>
                <h1>${title}</h1>
                <img src="${img}" alt="" width="100%" height="100%">
            </div>
        </body>
        </html>`;
    },
    /**
     * 分享红包
     * @param {Array} textArr 文字列表
     * @param {Array} imgArr 图片列表，图片格式base64
     */
    shareRedPacket: function(textArr, imgArr) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>测试分享图片生成</title>
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                    font-family: PingFang SC;
                    font-style: normal;
                }
                html,
                body{
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    line-height: 1.5;
                }
                .box {
                    background: url('${imgArr[0]}') no-repeat 0 0 / 100% 100%;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .box .top {
                    height: 70%;
                }
                .box .top > div {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 50%;
                    text-align: center;
                }
                .box .top .title {
                    font-size: 64px;
                    background-image:-webkit-linear-gradient(bottom, #FFE294,#FFFBEF); 
                    -webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;
                }
                .box .top .sub-title {
                    font-size: 14px;
                    color: #201D17;
                    background-image:-webkit-linear-gradient(bottom, #FFE294,#FFFBEF);
                    height: 36px;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .box .bottom {
                    position: relative;
                    height: 30%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .box .bottom>div {
                    width: 85%;
                    border-radius: 10px;
                    background-color: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    box-sizing: border-box;
                }
                .box .bottom-content {
                    background: #FDF4ED;
                    display: flex;
                    padding: 20px;
                    border-radius: 2px;
                }
                .box .bottom-content>div:first-child {
                    width: calc(100% - 68px);
                    height: 68px;
                    font-size: 12px;
                    color: #9EA2AF;
                    display: flex;
                    align-items: center;
                }
                .box .bottom-content>div:last-child {
                    width: 68px;
                    height: 68px;
                }
            </style>
        </head>
        <body>
            <div class="box">
                <div class="top">
                    <div>
                        <div>
                            <h1 class="title">${textArr[0]}</h1>
                            <div class="sub-title">${textArr[1]}</div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div >
                        <div class="bottom-content">
                            <div>
                                <div>
                                    <p>
                                        <img src="${imgArr[1]}" width="100px" alt="">
                                    </p>
                                    <p>${textArr[2]}</p>
                                </div>
                            </div>
                            <div>
                                <img src="${imgArr[2]}" width="100%" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    },
    /**
     * 分享红包
     * @param {Array} textArr 文字列表
     * @param {Array} imgArr 图片列表，图片格式base64
     */
    shareLucky: function(textArr, imgArr) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>测试分享图片生成</title>
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                    font-family: PingFang SC;
                    font-style: normal;
                }
                html,
                body{
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    line-height: 1.5;
                }
                .box {
                    padding: 32px;
                }
                .box .top > div {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 50%;
                    text-align: center;
                }
                .box .top > div > div > * {
                    display: inline-block;
                    padding-bottom: 10px;
                }
                .box .top .title {
                    font-size: 24px;
                    color: #181818;
                }
                .box .top .lucky {
                    font-size: 24px;
                    color: #FF6F1E;
                }
                .box .top .sub-title {
                    font-size: 14px;
                    color: #212941;
                    text-align: center;
                    padding-bottom: 32px;
                }
                .box .top .sub-title > span {
                    color: #FF6F1E;
                }
                .box hr {
                    background-color: #F5F5F5;
                    height: 1px;
                    border: none;
                }
                .box .bottom {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .box .bottom-content {
                    width: 100%;
                    display: flex;
                    padding: 20px 0;
                }
                .box .bottom-content>div:first-child {
                    width: calc(100% - 68px);
                    height: 68px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    color: #9EA2AF;
                }
                .box .bottom-content>div:last-child {
                    width: 68px;
                    height: 68px;
                }
            </style>
        </head>
        <body>
            <div class="box">
                <div class="top">
                    <div>
                        <div>
                            <img src="${imgArr[0]}" width="60px" alt="">
                            <br>
                            <h1 class="title">${textArr[0]}</h1>
                            <br>
                            <h2 class="lucky">${textArr[1]}</h2>
                            <br>
                            <div class="sub-title">
                            ${textArr[2]}<span>${textArr[3]}</span>${textArr[4]}
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="bottom">
                    <div class="bottom-content">
                        <div>
                            <div>
                                <p>
                                    <img src="${imgArr[1]}" width="100px" alt="">
                                </p>
                                <p>${textArr[5]}</p>
                            </div>
                        </div>
                        <div>
                            <img src="${imgArr[2]}" width="100%" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    }
};