const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'throttle-queue.js',
        library: 'throttleQueue',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        libraryExport: 'default'
    }
};
