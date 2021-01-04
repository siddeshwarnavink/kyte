const webpack = require('webpack');

var pjson = require('../package.json');

const banner = [
    `Kyte v${pjson.version}`,
    "",
    "By Siddeshwar Navinkumar <https://www.github.com/siddeshwarnavink>",
    `Built on ${new Date().toLocaleString()}`
].join("\n");

const config = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner,
            entryOnly: true,
            raw: false
        })
    ],
    optimization: {
        minimize: true,
    }
};

module.exports = config;