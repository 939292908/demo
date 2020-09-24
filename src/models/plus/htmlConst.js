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
    }
};