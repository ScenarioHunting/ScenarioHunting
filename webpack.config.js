const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: 'none', // Tip! compile in 'production' mode before publish

	// Tip! Just delete not using files, but main.ts is required
	entry: {
		index: './src/index.ts',
		sidebar: './src/TestFactory/sidebar.tsx', // Example! It works with React.
		modal: './src/modal.ts'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
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
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.less', '.css']
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./index.html"
		})
	]
}
