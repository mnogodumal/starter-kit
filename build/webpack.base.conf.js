const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Main const
const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: ''
}

// Pages const for HtmlWebpackPlugin
const PAGES_DIR = PATHS.src
const isProd = process.env.NODE_ENV === 'production'

const PAGES = [
  {
    templateName: `${PAGES_DIR}/index.html`,
    filenameName: './index.html',
    minify: isProd ? true : false,
    chunks: ['main']
  }
]

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    main: `${PATHS.src}/index.js`,
  },
  output: {
    filename: `${PATHS.assets}js/[name].[contenthash].js`,
    path: PATHS.dist,
    publicPath: isProd ? './' : '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimize: true, // minify js files
    // runtimeChunk: "single",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loader: {
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          options: {
            name: '[name].[ext]',
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            // for scss path rewriting
            // https://github.com/bholloway/resolve-url-loader 
            // https://github.com/bholloway/resolve-url-loader/blob/v5/packages/resolve-url-loader/README.md
            loader: 'resolve-url-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              // postcssOptions: {
              //   plugins: [
              //     ['postcss-url', {
              //       url: 'inline',
              //       filter: /\.(png|jpg|gif|svg)$/,
              //       basePath: `${PATHS.src}/assets/img`
              //     }]
              //   ],
              // },
              sourceMap: true,
            }
          },

          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true, url: false }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-url', {
                    url: 'inline',
                    basePath: `${PATHS.src}/img`
                  }]
                ],
              },
              sourceMap: true,
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '~': PATHS.src,
      '@': `${PATHS.src}/js`,
      vue$: 'vue/dist/vue.js'
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[contenthash].css`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.src}/${PATHS.assets}img`,
          to: `${PATHS.assets}img`,
          noErrorOnMissing: true,
        },
        {
          from: `${PATHS.src}/${PATHS.assets}fonts`,
          to: `${PATHS.assets}fonts`,
          noErrorOnMissing: true,
        },
        // {
        //   from: `${PATHS.src}/static`,
        //   to: ''
        // }
      ]
    }),
    ...PAGES.map(p => {
      const baseOptions = {
        filename: `./${p.name}`,
        ...(p && {
          minify: {
            collapseWhitespace: false,
            removeComments: true,
          }
        }),
        // inject: 'head',
        chunks: p.chunks
      }

      const templateOptions = {
        filename: p.filenameName,
        template: p.templateName,
        chunks: p.chunks
      }

      return new HtmlWebpackPlugin({
        ...baseOptions,
        ...templateOptions
      })
    })
  ]
}
