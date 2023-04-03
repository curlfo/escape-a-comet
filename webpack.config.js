const path = require('path');

module.exports = {
    entry: './client/index.js',
    output: {
        filename: 'index.min.js',
        path: path.resolve(__dirname, 'client/')
    },
    optimization: {
        minimize: false
    },
    watch: true,
    devtool: 'source-map'
};