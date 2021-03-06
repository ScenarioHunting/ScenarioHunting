const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
	optimization: {
		minimize: true,
		emitOnErrors: true,
		mergeDuplicateChunks: true,
		removeAvailableModules: true,
		removeEmptyChunks: true,
		flagIncludedChunks: true,
	},
	mode: 'production', // Tip! compile in 'production' mode before publish
	// mode: 'development', // Tip! compile in 'production' mode before publish

	// Tip! Just delete not using files, but main.ts is required
	entry: {
		index: './src/index.ts',
		sidebar: './src/sidebar.tsx', // Example! It works with React.
		modal: './src/modal.ts',
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
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.less', '.css', '.svg']
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./index.html"
		}),
		new HtmlWebPackPlugin({
			template: "./src/sidebar.html",
			filename: "./sidebar.html"
		}),
		new HtmlWebPackPlugin({
			template: "./src/test-templates/monaco-editor.html",
			filename: "./monaco-editor.html"
		}),
		// new webpack.optimize.DedupePlugin(), //dedupe similar code 
		// new webpack.optimize.UglifyJsPlugin(), //minify everything
		// new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
		// new webpack.DefinePlugin({"process.env.NODE_ENV":JSON.stringify("development")})
	]
}
