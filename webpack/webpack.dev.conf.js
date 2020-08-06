const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: 'static/js/[name].[hash].js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[chunkhash].css',
        }),
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        // port:8080,
        // host:'localhost', 
        overlay:{
            errors:true, //编译过程中如果有任何错误，都会显示到页面上
        },
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.scss'],
        alias: {
            '@': path.resolve('./src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use:[
                    {
                        loader:'babel-loader',
                    },
                    // {
                    //     loader:'eslint-loader',
                    //     options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
                    //         formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                    //     },
                        
                    // }
                ],
                exclude: /node_modules/, // 不检测的文件
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
            
        ]
    }
};