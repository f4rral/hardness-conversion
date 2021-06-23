const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssUrlRelativePlugin = require('css-url-relative-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  devServer: {
    // host:'192.168.1.51',
    port: 8081,
    disableHostCheck: true
  },

  context: path.resolve(__dirname, 'src'),
  entry: {
    index: ['./js/index.js']
  },
  output: {
    filename: './js/bundle.js',
    clean: true,
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false,
    },
  },

  resolve: {
    alias: {
      html: path.resolve(__dirname, 'src/html'),
      js: path.resolve(__dirname, 'src/js'),
      scss: path.resolve(__dirname, 'src/scss'),
      json: path.resolve(__dirname, 'src/json'),
      assets: path.resolve(__dirname, 'src/assets'),
    }
  },

  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          }
        }
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: [
          {
            loader: 'html-loader',
            options: {
              sources: true,
            }
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  require('postcss-preset-env')({
                    browsers: 'last 2 versions',
                  }),
                ]
              }
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    'edge': '17',
                    'firefox': '60',
                    'chrome': '67',
                    'safari': '11.1',
                    'ie': '11'
                  },
                  corejs: '3.14.0'
                }
              ]
            ]
          },
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            }
          },
        ]
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/images',
              publicPath: 'assets/images',
              emitFile: true,
              esModule: false
            }
          },
        ]
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './html/views/index.html',
      scriptLoading: 'blocking',
      inject: true
    }),

    new MiniCssExtractPlugin({
      filename: './css/style.bundle.css'
    }),

    new CssUrlRelativePlugin(),
    new FaviconsWebpackPlugin({
      logo: 'assets/icon/icon-blue.png',
      outputPath: path.resolve(__dirname, 'dist/assets/icon'),
      prefix: 'assets/icon/',
      favicons: {
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false,
        }
      }
    }),
  ]
};