const { VueLoaderPlugin } = require('vue-loader')
const rspack = require('@rspack/core')
const path = require('path')
const NodePolyfill = require('@rspack/plugin-node-polyfill')

const isProduction = process.env.NODE_ENV === 'production'
console.log('isProduction: ', process.env.NODE_ENV)

/** @type {import('@rspack/cli').Configuration} */
const config = {
	mode: isProduction ? 'production' : 'development',
	context: __dirname,
	entry: {
		main: './src/main.js'
	},
	output: isProduction ? {
    clean: true,
		filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].js',
    cssFilename: 'static/css/[name].[contenthash:8].css',
    cssChunkFilename: 'static/css/[name].[contenthash:8].css',
    assetModuleFilename: 'static/assets/[name][ext]',
    publicPath: '/'
	} : {
    publicPath: '/'
  },
	optimization: isProduction ? {
    splitChunks: {
      // chunks: 'all'
    }
  } : {},
	devServer: {
		historyApiFallback: true,
		port: 8030,
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		proxy: {
      '/prod-api': {
        target: 'https://vue.ruoyi.vip',
        changeOrigin: true
      }
    }
	},
	devtool: false,
	plugins: [
    new VueLoaderPlugin(),
    new rspack.HtmlRspackPlugin({
      template: './index.html'
    }),
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      'process.env.VUE_APP_BASE_API': "'/prod-api'",
      'process.env.VUE_APP_PREVIEW': `"${isProduction ? 'false' : 'true'}"`,
      'process.env': JSON.stringify(process.env)
    }),
    new rspack.ProgressPlugin({
      prefix: 'Client'
    })
  ].concat(isProduction ? [
    new NodePolyfill(),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ] : []),
	resolve: {
		extensions: ['.js', '.jsx', '.vue', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src')
		},
    fallback: {
    }
	},
	experiments: {
		css: false
	},
	module: {
		rules: [
			{
				test: /\.(ttf|png|jpg|eot|woff2?)$/,
				type: 'asset/resource'
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
        options: {
          experimentalInlineMatchResource: true,
          compilerOptions: { preserveWhitespace: false }
        }
			},
			{
				test: /\.(js|jsx)$/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: [
              ['@vue/babel-preset-jsx', {
                injectH: true,
                compositionAPI: true
              }]
            ]
					}
				}],
				exclude: /node_modules/
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'vue-style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								modifyVars: {
									'primary-color': '#42b883',
									'link-color': '#42b883'
								},
								javascriptEnabled: true
							}
						}
					}],
				type: 'javascript/auto'
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {},
                  autoprefixer: {}
                }
              }
            }
          }
				],
				type: 'javascript/auto'
			},
      {
        test: /\.svg$/,
        use: {
          loader: 'vue-svg-icon-loader',
          options: {
            resourceQuery: /inline/
          }
        }
      }
		]
	}
}
module.exports = config
