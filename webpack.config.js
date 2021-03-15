const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const templateRepositoryPath = './src/test-factory/template-repository.ts'
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
	mode: 'production', // Tip! compile in 'production' mode before publish
	// mode: 'development', // Tip! compile in 'production' mode before publish

	// Tip! Just delete not using files, but main.ts is required
	entry: {
		index: './src/index.ts',
		sidebar: {
			import: './src/sidebar.tsx',
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
				test: /\.less$/,
				use: [{
					loader: "style-loader"
				}, {
					loader: "css-loader"
				}, {
					loader: "less-loader"
				}],
				exclude: /node_modules/
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader',
				]
			},
			{
				test: '/src/test-templates/monaco-editor.js',
				use: [
					'file-loader',
				]
			},
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.less', '.css', '.svg']
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
	mode: 'development', // Tip! compile in 'production' mode before publish
	entry: {
		// monacoEditor: {
		// 	import: './src/test-templates/monaco-editor.ts',
		// 	// dependOn: 'templateRepositoryLib'
		// },
		monacoLanguage: './src/test-templates/monaco-languages.js',
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
	output: {
		path: path.resolve(__dirname, 'dist'),
		chunkFilename: '[id].chunk.js',

		// filename: 'template-repository-lib.js',
		libraryTarget: 'var',
		library: 'templateRepository'
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/test-templates/monaco-editor.html",
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