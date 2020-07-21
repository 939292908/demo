const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    mode: "production",
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: 'static/js/[name].[chunkhash].js',
        path: path.resolve(__dirname, '../dist')
    },
    plugins: [
        new CleanWebpackPlugin({ template: '../dist' }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[chunkhash].css',
        }),
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
        }),
    ],
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
          '@': path.resolve('./src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {}
                }]
            },
            {
                test: /\.(css|sass)$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {}
                    },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    {
                        loader: 'css-loader',
                        options: {}
                    },
                    {
                        loader: 'sass-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:5].[ext]',
                            outputPath: "static/img/"
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:5].[ext]',
                            outputPath: "static/font/"
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use:[{loader:'eslint-loader',
                    options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
                        formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                    }
                }],
                enforce: "pre", // 编译前检查
                exclude: /node_modules/, // 不检测的文件
                include: [path.resolve(__dirname, 'src')], // 指定检查的目录
            },
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader:'babel-loader',
                    options:{//options、query不能和loader数组一起使用
                        cacheDirectory:true//利用缓存，提高性能，babel is slow
                    },
                }],
                include: path.resolve(__dirname, 'src'),
                
            },
        ]
    }
};