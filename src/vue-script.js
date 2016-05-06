

var VueScript = (function() {

    return {
        parseComponent: _parseComponent
    };
    
    function _parseComponent(componentName, vueText) {

        var vueLines = vueText.split('\n');

        var tagStartTemplate = /^<template(.*?)>$/;
        var tagEndTemplate = /^<\/template>$/;
        var isTemplate = false;
        var templateLines = [];

        var tagStartScript = /^<script(.*?)>$/;
        var tagEndScript = /^<\/script>$/;
        var isScript = false;
        var scriptLines = [];

        for (var i = 0; i < vueLines.length; i++) {

            if (!isTemplate && tagStartTemplate.test(vueLines[i])) {
                isTemplate = true;
            } else if (isTemplate && tagEndTemplate.test(vueLines[i])) {
                isTemplate = false;
            } else if (isTemplate) {
                templateLines.push(vueLines[i].trim());
            }

            if (!isScript && tagStartScript.test(vueLines[i])) {
                isScript = true;
            } else if (isScript && tagEndScript.test(vueLines[i])) {
                isScript = false;
            } else if (isScript) {
                scriptLines.push(vueLines[i]);
            }
        }

        var templateText = templateLines.join('');
        var scriptText = scriptLines.join('\n');

        function _stringReplaceAll(str, search, replacement) {
            return str.split(search).join(replacement);
        }

        function _createBrowserComponent(tagName, template, script) {
            var result = [];
            var cleanedTemplate = _stringReplaceAll(template, '"', '\\"');
            cleanedTemplate = _stringReplaceAll(cleanedTemplate, '/', '\\/');
            // moduleRegex matches "module.exports = {"
            var moduleRegex = /[\n\r\t]*?module[ \n\r\t]*?.[ \n\r\t]*?exports[ \n\r\t]*?=[ \n\r\t]*?{/g;
            var objName = _toPascal(tagName);
            script = script.replace(moduleRegex,
                'var ' + objName + ' = Vue.extend({\n' +
                '    template: "' + cleanedTemplate + '",'
            );
            //result.push('var template = "' + cleanedTemplate + '"\n');
            result.push(script + ');\n');
            result.push('Vue.component("' + tagName + '", ' + objName + ');\n');
            //result.push('module.exports.template = template;\n');
            return result.join('');
        }

        return _createBrowserComponent(componentName, templateText, scriptText);
    }

    function _toPascal(string) {
        var txt = string.replace(/-(\w)/g, function (_, c) {
            return c.toUpperCase()
        });
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    }

})();

var testUrl = './example/cp-demo.vue';
var componentName = (testUrl.split('\\').pop().split('/').pop().split('.'))[0];
console.log(componentName);
//VueComponent.import(testUrl);
var fs = require('fs');
var vueCode = fs.readFileSync(testUrl, 'utf8');
var jsCode = VueScript.parseComponent(componentName, vueCode);
// var block = jsCode.split('{');
// var depth = 0;
// for (var i=0; i<block.length; i++){
//     depth = depth - countCloseBlock(block[i]);
//     console.log(prefix(block[i], depth, '    ') + ' {');
//     depth++;
// }
console.log(jsCode);