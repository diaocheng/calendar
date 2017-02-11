var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: './demo/app.js'
    },
    output: {
        path: path.relative(__dirname, './dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': path.resolve(__dirname, './src'),
            'js': path.resolve(__dirname, './src/js')
        }
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' } // inline base64 URLs for <=8k images, direct URLs for the rest
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //         drop_console: false,
        //     }
        // }),
        // new ExtractTextPlugin({
        //     filename: path.posix.join('./dist', 'app.js'),
        //     allChunks: true,
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'manifest',
        //     chunks: ['vendor']
        // })
        new HtmlWebpackPlugin({
            minify:{
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
    // more options:
    // https://github.com/kangax/html-minifier#options-quick-reference
  }
            chunksSortMode:'dependency'
        })
    ]
};