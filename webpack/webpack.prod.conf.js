const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Uglifyjs = require('uglifyjs-webpack-plugin');

const publicPath = "https://static.abkjl.com/vp3/m/redpacket/";

module.exports = {
    mode: "production",
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: 'static/js/[name].[chunkhash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: publicPath
    },
    optimization: {
        minimize: true, // 是否开启压缩
        minimizer: [
            new Uglifyjs({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    }
                },
                sourceMap: true,
                parallel: true
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin({ template: '../dist' }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[chunkhash].css'
        }),
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
        })
    ],
    resolve: {
        extensions: ['.js', '.json', '.css', '.scss'],
        alias: {
            '@': path.resolve('./src')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'eslint-loader',
                        options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
                            formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                        }

                    }
                ],
                exclude: /node_modules/ // 不检测的文件
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {}
                }]
            },
            {
                test: /\.(css|sass|scss)$/,
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
                        loader: 'url-loader',
                        options: {
                            name: '[name].[hash:5].[ext]',
                            limit: 1,
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
                            limit: 1,
                            outputPath: "static/font/"
                        }
                    }
                ]
            }
        ]
    }
};