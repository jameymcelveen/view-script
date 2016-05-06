/**
 * Created by jameym on 5/2/16.
 */

var fs = require('fs');

var componentTemplateText = fs.readFileSync('./example/cp-demo.vue', 'utf8');

console.log(componentTemplateText);