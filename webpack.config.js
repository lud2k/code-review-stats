const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const path = require('path')

const frontendConfig = {
    entry: './src/index.tsx',
    target: 'web',
    output: {
        path: __dirname + '/build',
        filename: 'index.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        port: 9000
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.css']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        camelCase: true
                    }
                }]
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: 'tsconfig-frontend.json'
                }
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.json$/,
                loader: 'raw-loader',
            }
        ]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    }
}

const cliConfig = {
    entry: './cli/main.ts',
    target: 'node',
    output: {
        path: __dirname + '/build',
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.ts', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: 'tsconfig-cli.json'
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
    ],
    externals: [nodeExternals()]
}

if (process.env.npm_lifecycle_script === 'webpack-dev-server') {
    module.exports = frontendConfig
} else {
    module.exports = [
        frontendConfig,
        cliConfig
    ]
}
