const webpack = require('webpack');
const path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin');

const config = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
    },
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: 'static/js/[name].[hash].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /\/node_modules\//,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            // options...
                        }
                    }
                ]
            },
            {
                test:/\.(png|jpg|gif|jpeg|svg)$/,
                use:[
                    {
                        loader: "url-loader",
                        options: {
                            name: "[name].[hash:5].[ext]",
                            limit: 1024, // size <= 1kib
                            outputPath: "img"
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                }
            },
        ]
    }, 
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/ejs/index.ejs"
            , filename: "index.html"
        }),
        new MiniCssExtractPlugin({
            filename: 'css/mystyles.css'
        }), 
        new CopyPlugin([
            { from: './tplibs/iconfont', to: 'libs/iconfont' },
        ]),
        new CopyPlugin([
            { from: './tplibs/kline', to: 'libs/kline' },
        ]),
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
};

module.exports = config;

