const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const config = {
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: 'static/js/[name].[chunkhash].js',
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
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                }
            },
        ]
    }, 
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/ejs/index.ejs"
            , filename: "index.html"
        }), 
        new UglifyjsPlugin({
            uglifyOptions: {
                warnings: true,
                compress: {
                    drop_debugger: true,
                    drop_console: true
                }
            },
            sourceMap: false,
            parallel: true
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[chunkhash].css'
        }), 
        new CopyPlugin([
            { from: './tplibs/iconfont', to: 'static/libs/iconfont' },
        ]),
        new CopyPlugin([
            { from: './tplibs/kline', to: 'static/libs/kline' },
        ]),
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
        }),
    ]
};

module.exports = config;

