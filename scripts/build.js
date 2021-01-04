const fs = require('fs');

const webpack = require('webpack');

const config = require('./config');

const compilerConfig = [
    { entry: './src/platforms/web-cdn.js', output: { filename: 'kyte-cdn.js' }, ...config },
    { entry: './src/platforms/node-package.js', output: { filename: 'kyte-package.js' }, ...config }
];

const licenseCommentFormat = (filename) => `/*! For license information please see ${filename}.LICENSE.txt */`;

const compiler = webpack(compilerConfig);

compiler.run(function (err, stats) {
    if (stats.hasErrors()) {
        console.error(err);
    } else {
        compilerConfig.forEach(config => {
            fs.readFile(`./dist/${config.output.filename}.LICENSE.txt`, 'utf8', function (err, bannerText) {
                if (err) throw err;

                fs.readFile(`./dist/${config.output.filename}`, 'utf8', function (err, fileContnet) {
                    fs.writeFile(`./dist/${config.output.filename}`, fileContnet.replace(licenseCommentFormat(config.output.filename), bannerText), function (err, file) {
                        if (err) throw err;

                        fs.unlinkSync(`./dist/${config.output.filename}.LICENSE.txt`);
                    });
                });
            });
        });
    }

    process.stdout.write(stats.toString() + '\n');
});

exports.compiler = compiler;