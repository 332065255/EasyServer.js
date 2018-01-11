var path=require('path');
module.exports={
    entry: {
        index : './index.js'
    },
    output:{
        path:path.resolve('./dist'),
        filename:'[name].js',
        library: "EasyServer",
        libraryTarget: "umd"
    },
    module:{
        loaders: [
            { test: /\.js$/, loader: 'babel-loader' },
        ]
    }
}
