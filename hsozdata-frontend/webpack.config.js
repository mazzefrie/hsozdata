var webpack = require('webpack');

var URL = '"http://127.0.0.1:3000"';

function buildConfig(env) {
  
}



module.exports = function(env) {

  var URL = '"http://127.0.0.1:3000"';
  if( Object.keys(env)[0] == "build" ) {
    console.log("Build");
    URL = '"https://hsozdata.matfr.de:3000"';
  }

  return {
    entry: './src/index.js',

    output: {
      filename: 'public/scripts/bundle.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        HSKAPI: URL
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
