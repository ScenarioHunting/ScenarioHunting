const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

// const externalServicesPath = './src/external-services.tsx'
function appConfig(options) {
	return {
		name: 'app',
		optimization: {
			minimize: true,
			emitOnErrors: true,
			mergeDuplicateChunks: true,
			removeAvailableModules: true,
			removeEmptyChunks: true,
			flagIncludedChunks: true,
			// runtimeChunk: 'single',
		},
		// mode: 'production',
		// mode: 'development',
		mode: options.mode,

		entry: {
			index: './src/index.ts',
			app: {
				import: './src/app/app.tsx',
				//To split this file in order to be able to access it by the template editor:
				dependOn: ['ExternalServices']

			},
			//To split this file in order to be able to access it by the template editor:
			ExternalServices: options.externalServicesPath
		},
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					use: [{
						loader: "style-loader"
					},
					{ loader: "css-modules-typescript-loader" },
					{
						loader: "css-loader",

						options: {
							importLoaders: 1,
							modules: {
								localIdentName: '[name]__[local]___[hash:base64:5]'
							}
						}
					},
						// {
						// 	loader: "less-loader"
						// }
					],
					exclude: /node_modules/
				},
				{
					test: /\.(png|svg|jpg|gif)$/,
					use: [
						'file-loader',
					]
				},
				{
					test: '/src/template-processing/monaco-editor.js',
					use: [
						'file-loader',
					]
				},
			]
		},
		resolve: {
			extensions: ['.tsx', '.ts', 'css', '.js', '.svg']
		},
		output: {
			filename: '[name].js',
			// chunkFilename: '[id].chunk.js',
			path: path.resolve(__dirname, 'dist'),
			// clean: true,
			libraryTarget: 'var',
			library: 'ExternalServices'
		},
		plugins: [
			new HtmlWebPackPlugin({
				template: "./src/index.html",
				filename: "./index.html",
				excludeChunks: ['ExternalServices'],
			}),
			new HtmlWebPackPlugin({
				template: "./src/app/app.html",
				filename: "./app.html",
				excludeChunks: ['index']
			}),
		]
	}
}
function editorConfig(options) {
	return {
		name: 'editor',
		// mode: 'production',
		// mode: 'development',
		mode: options.mode,
		entry: {
			editor: "./src/app/template-processing/editor.js",
			monacoLanguage: './src/app/template-processing/monaco-languages.js',
			ExternalServices: options.externalServicesPath

		},
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				},
			]
		},
		resolve: {
			extensions: ['.tsx', '.ts', 'css', '.js', '.svg']
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			chunkFilename: '[id].chunk.js',
			libraryTarget: 'var',
			library: 'ExternalServices'

		},
		plugins: [
			new HtmlWebPackPlugin({
				template: "./src/app/template-processing/monaco-editor.html",
				filename: "./monaco-editor.html",
				// chucks: ['ExternalServices'],
				inject: 'body',
				scriptLoading: 'blocking'
			}),
			// new MonacoWebpackPlugin()
		]
	}
}

//=>webpack --env= production
module.exports = (env) => {
	console.log('Webpack env:', env)
	if (!['production', 'development'].includes(env))
		env = 'production'
	const options = {
		mode: env,
		externalServicesPath: './src/external-services.tsx'
	}
	return [appConfig(options), editorConfig(options)]
}
module.exports.parallelism = 1;