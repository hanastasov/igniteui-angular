import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
import * as angularExternals from "webpack-angular-externals";
import * as rxjsExternals from "webpack-rxjs-externals";

export default {
    entry: {
        "index.umd": ["./src/main.ts", "./src/services/index.ts"],
        "index.umd.min": ["./src/main.ts", "./src/services/index.ts"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "igniteui-angular"
    },
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    externals: [
        function(context, request, callback) {
            if (/^jszip/i.test(request)) {
                return callback(null, {
                  commonjs: request,
                  commonjs2: request,
                  amd: request
                });
              }
              callback();
        },
        angularExternals(),
        rxjsExternals()
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            configFileName: "tsconfig.json"
                        }
                    },
                    {
                        loader: "angular2-template-loader"
                    }
                ],
                exclude: [
                    /node_modules/,
                    /\.(spec|e2e)\.ts$/
                ]
            },

            {
                test: /\.json$/,
                use: "json-loader"
            },

            {
                test: /\.css$/,
                use: [
                    {
                        loader: "to-string-loader"
                    },
                    {
                        loader: "css-loader",
                        options: { minimize: true }
                    }
                ]
            },

            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "to-string-loader",
                    },
                    {
                        loader: "css-loader",
                        options: { minimize: true }
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },

            {
                test: /\.html$/,
                use: "raw-loader"
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, "src")
        ),

        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            sourceMap: true,
            compress: true
        })
    ]
} as webpack.Configuration;
