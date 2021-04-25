const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const templateRepositoryPath = './src/adopters/template-repository.ts'
const appConfig = {
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
	mode: 'development',

	entry: {
		index: './src/index.ts',
		sidebar: {
			import: './src/app/app.tsx',
			//To split this file in order to be able to access it by the template editor:
			dependOn: 'templateRepository'
		},
		//To split this file in order to be able to access it by the template editor:
		templateRepository: templateRepositoryPath
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
		library: 'templateRepo'
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./index.html",
			excludeChunks: ['templateRepository'],
		}),
		new HtmlWebPackPlugin({
			template: "./src/sidebar.html",
			filename: "./sidebar.html",
			excludeChunks: ['index']
		}),
	]
}
const editorConfig = {
	name: 'editor',
	// mode: 'production',
	mode: 'development',
	entry: {
		// monacoEditor: {
		// 	import: './src/template-processing/monaco-editor.ts',
		// 	// dependOn: 'templateRepositoryLib'
		// },
		monacoLanguage: './src/app/template-processing/monaco-languages.js',
		templateRepositoryLib: templateRepositoryPath,

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

		// filename: 'template-repository-lib.js',
		libraryTarget: 'var',
		library: 'templateRepository'
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/app/template-processing/monaco-editor.html",
			filename: "./monaco-editor.html",
			chucks: ['templateRepository'],
			inject: 'head',
			scriptLoading: 'blocking'
		}),
		// new MonacoWebpackPlugin()
	]
}
module.exports = [appConfig, editorConfig]
module.exports.parallelism = 1;