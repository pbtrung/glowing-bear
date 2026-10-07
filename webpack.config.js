'use strict';

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

require('webpack');
module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './main.js',
    mode: 'production',
    performance: {
        maxEntrypointSize: 600000,
        maxAssetSize: 600000,
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'build'),
        },
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: false,
        }),
        new CopyWebpackPlugin({
            patterns: [
                // Static files, shared with the Vite build
                { from: '../public', to: '.' },
                { from: 'app/glowingbear.css', to: 'css/' },
                'directives/*.html',
                '../package.json',
                {
                    from: '../node_modules/bootstrap/dist/css/bootstrap.min.css',
                    to: 'css/',
                },
                {
                    from: '../node_modules/@fontsource-variable/inter/files/inter-*-wght-normal.woff2',
                    to: 'fonts/[name][ext]',
                },
                {
                    // Inter (variable weight) font faces, pointing at fonts/
                    from: '../node_modules/@fontsource-variable/inter/wght.css',
                    to: 'css/inter.css',
                    transform: function (content) {
                        return content.toString().replace(/\.\/files\//g, '../fonts/');
                    },
                },
                { from: '../node_modules/emojione/lib/js/emojione.min.js' },
                { from: '../node_modules/linkifyjs/dist/linkify.min.js' },
                { from: '../node_modules/linkify-string/dist/linkify-string.min.js' },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
        ],
    },
};
