const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')//压缩混淆
const CleanWebpackPlugin = require('clean-webpack-plugin')//清除打包后的重复chunk
const ROOTPATH = process.cwd()
const bundleName = require('./config/lib.config.js').bundleName

module.exports = {
    entry: {
        [bundleName]: path.resolve(__dirname, './src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: bundleName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/, //打包js，转码ES6
                exclude: /(node_modules|bower_components)/,
                include: path.join(__dirname, 'src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'stage-3']
                    }
                }
            },
            {
                test: /\.vue$/, //打包vue
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            fallback: 'vue-style-loader',
                            use: [
                                {
                                    loader: 'css-loader',
                                    options: {
                                        minimize: true
                                    }
                                }
                            ]
                        })
                    }
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css', 
            allChunks: true
        }),
        new CleanWebpackPlugin('dist', { root: ROOTPATH, verbose: false }), //每次打包都会清除dist目录
        new UglifyJSPlugin({//压缩混淆代码，并且生成sourceMap调试
            uglifyOptions: {
                ecma: 8,//支持ECMA 8语法
                warnings: false//去掉警告
            },
            sourceMap: false
        })
    ]
}