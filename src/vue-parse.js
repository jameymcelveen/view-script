/**
 * Created by jameym on 5/2/16.
 */
function ParseVueComponent(vueText) {

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

    function createBrowserComponent(name, template, script) {
        var result = [];
        var cleanedTemplate = stringReplaceAll(template, '"', '\\"');
        cleanedTemplate = stringReplaceAll(cleanedTemplate, '/', '\\/');
        result.push('var template = "' + cleanedTemplate + '"\n');
        result.push(script + '\n');
        result.push('module.exports.template = template;\n');
        return result.join('');
    }

    return createBrowserComponent('cp-demo', templateText, scriptText);
}