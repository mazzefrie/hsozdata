var webpack = require('webpack');

module.exports = options => {
  return {
    entry: './src/index.js',

    output: {
      filename: 'public/scripts/bundle.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        HSKAPI: '"https://hsozdata.matfr.de:3000"'
      })
    ],
    module: {

      rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
      ],
    },
  }
}
