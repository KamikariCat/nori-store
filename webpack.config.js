const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
    entry: './src/index.ts',
    experiments: {
        outputModule: true,
    },
    output: {
       filename: 'index.js',
       path: path.resolve(__dirname, 'build'),
       library: {
           type: 'module'
       }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';


    } else {
        config.mode = 'development';
    }
    return config;
};
