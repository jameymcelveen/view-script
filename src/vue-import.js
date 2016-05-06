/**
 * Created by jameym on 5/2/16.
 */

// look at tidy js for html
// http://stackoverflow.com/questions/3913355/how-to-format-tidy-beautify-in-javascript

// var VueComponent = null;
//
// if (typeof module !== "undefined") {
//     VueComponent = require('vue-component');
//     if (!VueComponent) {
//         var fs = require('fs');
//         VueComponent = {};
//         VueComponent.loadScript = function(url) {
//             return fs.readFileSync(url, 'utf8');
//         };
//         VueComponent.import = vueComponentImport;
//         module.exports = VueComponent;
//     }
// } else if (typeof window !== "undefined") {
//     if (window.VueComponent === undefined) {
//         VueComponent = {};
//         VueComponent.loadScript = function(url) {
//             console.log('not implemented');
//             return '';
//         };
//         VueComponent.import = vueComponentImport;
//         window.VueComponent = VueComponent;
//     }
// }
//
// function vueComponentImport(path) {
//
//     var _components = {};
//
//     function _import(url) {
//         var cpName = "cp-demo";
//         var cpScript = VueComponent.loadScript(url);
//         cpScript = parseComponent(cpScript);
//         _components[cpName] = _installComponentFunction(cpName, cpScript);
//     }
//
//     function _installComponentFunction(name, script) {
//         var result = [];
//         console.log(script);
//         result.push(';(function($vue){\n');
//         result.push('var module = {exports:{}};\n');
//         result.push(script);
//         result.push('$vue.component("' + name + '", module.exports);\n');
//         result.push('})(Vue);\n');
//         return new Function(result.join(''));
//     }
//
//     return _import(path);
// }

function parseComponent(componentName, vueText) {

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

    function stringReplaceAll(str, search, replacement) {
        return str.split(search).join(replacement);
    }

    function createBrowserComponent(tagName, template, script) {
        var result = [];
        var cleanedTemplate = stringReplaceAll(template, '"', '\\"');
        cleanedTemplate = stringReplaceAll(cleanedTemplate, '/', '\\/');
        // moduleRegex matches "module.exports = {"
        var moduleRegex =  /[\n\r\t]*?module[ \n\r\t]*?.[ \n\r\t]*?exports[ \n\r\t]*?=[ \n\r\t]*?{/g;
        var objName = toPascal(tagName);
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

    return createBrowserComponent(componentName, templateText, scriptText);
}

function prefix(n, width, z) {
    z = z || ' ';
    n = n + '';
    return new Array(width).join(z) + n;
}

function countCloseBlock(str) {
    return (str.match(/}/g) || []).length;
}

function toPascal(string) {
    var txt = string.replace(/-(\w)/g, function(_, c) {
        return c.toUpperCase()
    });
    return  txt.charAt(0).toUpperCase() + txt.substr(1);
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var testUrl = './example/cp-demo.vue';
var componentName = (testUrl.split('\\').pop().split('/').pop().split('.'))[0];
console.log(componentName);
//VueComponent.import(testUrl);
var fs = require('fs');
var vueCode = fs.readFileSync(testUrl, 'utf8');
var jsCode = parseComponent(componentName, vueCode);
// var block = jsCode.split('{');
// var depth = 0;
// for (var i=0; i<block.length; i++){
//     depth = depth - countCloseBlock(block[i]);
//     console.log(prefix(block[i], depth, '    ') + ' {');
//     depth++;
// }
console.log(jsCode);