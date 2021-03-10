const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
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
		templateRepository: './src/test-factory/template-repository.ts'

		// editor: './src/test-templates/monaco-editor.ts',
		// modal: './src/modal.ts',

	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				// test: /\.tsx?$/,
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
		clean: true
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./index.html",
			excludeChunks: ['templateRepository']
		}),
		new HtmlWebPackPlugin({
			template: "./src/sidebar.html",
			filename: "./sidebar.html",
			excludeChunks: ['index']
		}),
		new HtmlWebPackPlugin({
			template: "./src/test-templates/monaco-editor.html",
			filename: "./monaco-editor.html",
			excludeChunks: ['index', 'sidebar']
		}),
		// new MonacoWebpackPlugin(),
		// new webpack.optimize.DedupePlugin(), //dedupe similar code 
		// new webpack.optimize.UglifyJsPlugin(), //minify everything
		// new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
		// new webpack.DefinePlugin({"process.env.NODE_ENV":JSON.stringify("development")})
	]
}
