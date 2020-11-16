const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '/js': require('path').resolve(__dirname, 'src/publics/js/'),
        },
        symlinks: false,
        extensions: ['.js'],
    },
    entry: {
        'base': path.resolve(__dirname, 'src/publics/js/dev/page/base.js'),
        'editor': path.resolve(__dirname, 'src/publics/js/dev/page/editor.js'),
        //'css/base': path.resolve(__dirname, 'src/publics/css/base.less'),
    },
    output: {
        path: path.resolve(__dirname, 'src/dist'),
        filename: 'js/[name].min.js',
    },
};
