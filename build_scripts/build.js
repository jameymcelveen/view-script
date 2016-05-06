/**
 * Created by jameym on 5/2/16.
 */
var compressor = require('node-minify');

console.log('\r\n\r\n= Building ===\r\n');
console.log('Minify scripts');
new compressor.minify({
    type: 'gcc',
    fileIn: 'src/htmlparser.js',
    fileOut: 'dist/htmlparser.min.js',
    callback: function(err, min){
        if(err) {
            console.log(err);
            exit()();
        }
        console.log('  htmlparser.js - minified to ' + min.length + ' bytes');
    }
});

new compressor.minify({
    type: 'gcc',
    fileIn: 'src/vue-loader.js',
    fileOut: 'dist/vue-loader.min.js',
    callback: function(err, min){
        if(err) {
            console.log(err);
            exit()();
        }
        console.log('  vue-loader.js - minified to ' + min.length + ' bytes');
    }
});