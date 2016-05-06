////////NOTES/////////////
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
////////END-NOTES/////////////


//////////////////////////////
/// vue-compile.js
//////////////////////////////
///
/// need to add source map
/// this looks promising
/// https://github.com/mozilla/source-map/#generating-a-source-map

var fs = require('fs');

var vueComponentText = fs.readFileSync('./example/cp-demo.vue', 'utf8');

var browserComponent = compileComponent(vueComponentText);
//var loadComponent = createComponentLoader(browserComponent);

console.log(browserComponent);
// var obj = (new Function(browserComponent))();
//
// console.log('\n' + ToSource(obj) + '\n');

function createComponentLoader(browserComponent){
    return new Function(browserComponent);
}

// function createBrowserComponent2(name, template, script) {
//     var result = [];
//     var cleanedTemplate = stringReplaceAll(template, '"', '\\"');
//     cleanedTemplate = stringReplaceAll(cleanedTemplate, '/', '\\/');
//     //result.push('var template = "' + cleanedTemplate + '"\n');
//     result.push('var module = {exports:{}};\n');
//     result.push(script + '\n');
//     result.push('return module.exports;\n');
//     //result.push('module.exports.template = template;\n');
//     //result.push('Vue.component("' + name + '", module.exports);\n');
//     //result.push('})(Vue, module);\n');
//     var js = result.join('');
//     var obj = (new Function(js))();
//     obj.template = cleanedTemplate;
//     var compSource = ToSource(obj);
//     return 'Vue.component("' + name + '", '+ compSource +'\n);';
// }


/**
 * Converts any object into valid source code.
 *
 * If you dont pass a depth-parameter, all objects within an object or an
 * array are converted to undefined.
 */

function ToSource(the_obj) {             // wrapper to hide vars
    "use strict"; // run code in ES5 strict mode

    // Variables
    var knownObjs; // stores all nested structures that have been processed to detect circular references


    // Assigning a number to every type, so type-checking will be a bit faster
    var typeOfObject = 1,
        typeOfArray = 2,
        typeOfString = 3,
        typeOfNull = 4,
        typeOfUndefined = 5,
        typeOfFunction = 6,
        typeOfBoolean = 7,
        typeOfNumber = 8,
        typeOfRegExp = 9,
        typeOfDate = 10,
        possibleTypes = {
            Object: typeOfObject,
            Array: typeOfArray,
            String: typeOfString,
            Null: typeOfNull,
            Undefined: typeOfUndefined,
            Function: typeOfFunction,
            Boolean: typeOfBoolean,
            Number: typeOfNumber,
            RegExp: typeOfRegExp,
            Date: typeOfDate
        };

    /**
     * The only way to check for a type in JavaScript is to compare the
     * result of the internal .toString() method (returns something like [object Array])
     *
     * The type can be something of:
     *
     * - Object
     * - Array
     * - Date
     * - Function
     * - RegExp
     * - Number
     * - Boolean
     * - String
     * - Null
     * - Undefined
     *
     * The first character of the type must be a capital letter (unlike you may be
     * used to the typeof operator)
     *
     * @private
     * @param {*} obj
     * @returns {Boolean} result
     */
    function typeOf(obj) {
        if (obj === null) {
            return typeOfNull;
        } else if (obj === undefined) {
            return typeOfUndefined;
        } else {
            return possibleTypes[
                Object.prototype.toString.call(obj).slice(8, -1) // Returns a string like "Object", "Array", "String", ...
                ];
        }
    }

    /**
     * Serializes a function. Usually you can call .toString() on all functions
     * that are have been defined in JavaScript. Unfortunately this doesn't work
     * on native functions like Date, String, etc.. In this case this function
     * returns the function name;
     *
     * @param {Function} fn
     * @return {String}
     */
    function serializeFunction(fn) {
        var src = fn.toString();

        // Because search is faster than match, we perform first the .search().
        // We're assuming that native functions are less likely to be stringified
        // than custom functions
        if (src.search(/^function \w+\(\) \{\s*\[native code\]\s*\}$/) === -1) {  // IF TRUE: It's a regular function defined in JavaScript
            return src;
        } else {    // IF TRUE: It's a native function with native code that can't be stringified
            return src.match(/^function (\w+)\(\) \{\s*\[native code\]\s*\}$/)[1];  // returns the function name
        }
    }



    /**
     * Converts any object into valid source code.
     *
     * If you dont pass a depth-parameter, it will default to 1. In this case
     * all objects within an object or an array are converted to undefined.
     *
     * @private
     * @param {*} obj
     * @param {Integer} depth
     * @returns {String} source code
     */
    function toSrcRecursive(obj, depth) {
        var type = typeOf(obj),
            objString,
            key,
            i, l;

        if (depth === undefined || depth === null) {
            depth = 1;
        }

        // We start with nested structures like Objects or Arrays to make
        // recursion really fast
        if (type === typeOfObject) {
            if (depth > 0) {
                if (knownObjs.indexOf(obj) !== -1) {
                    console.log('toSrc warning: Circular reference detected within object ', obj);

                    return 'undefined';
                } else {
                    knownObjs.push(obj);
                }
                objString = '{';
                for(key in obj) { if(obj.hasOwnProperty(key)) {
                    objString += '"' + key + '": ' + toSrcRecursive(obj[key], depth - 1) + ', ';
                }}
                if (objString.length > 1) {
                    objString = objString.substring(0, objString.length - 2);
                }
                objString += '}';
            } else {
                objString = 'undefined';
            }

            return objString;
        } else if (type === typeOfArray) {
            if (depth > 0) {
                if (knownObjs.indexOf(obj) !== -1) {
                    console.log('toSrc warning: Circular reference detected within array ', obj);

                    return 'undefined';
                } else {
                    knownObjs.push(obj);
                }
                objString = '[';
                for(i=0, l=obj.length; i<l; i++) {
                    objString += toSrcRecursive(obj[i], depth - 1) + ', ';
                }
                if (objString.length > 1) {
                    objString = objString.substring(0, objString.length - 2);
                }
                objString += ']';
            } else {
                objString = 'undefined';
            }

            return objString;
        } else if (type === typeOfString) {
            return '"'+ obj + '"';
        } else if (type === typeOfNull) {
            return 'null';
        } else if (type === typeOfUndefined) {
            return 'undefined';
        } else if (type === typeOfFunction) {
            return serializeFunction(obj);
        } else if (type === typeOfBoolean) {
            return obj.toString();
        } else if (type === typeOfNumber) {
            if(obj === Number.MAX_VALUE) {
                return 'Number.MAX_VALUE';
            } else if(obj === Number.MIN_VALUE) {
                return 'Number.MIN_VALUE';
            } else if(obj === Math.E) {
                return 'Math.E';
            } else if(obj === Math.LN2) {
                return 'Math.LN2';
            } else if(obj === Math.LN10) {
                return 'Math.LN10';
            } else if(obj === Math.LOG2E) {
                return 'Math.LOG2E';
            } else if(obj === Math.LOG10E) {
                return 'Math.LOG10E';
            } else if(obj === Math.PI) {
                return 'Math.PI';
            } else if(obj === Math.SQRT1_2) {
                return 'Math.SQRT1_2';
            } else if(obj === Math.SQRT2) {
                return 'Math.SQRT2';
            } else {
                return obj.toString();
            }
        } else if (type === typeOfRegExp) {
            return obj.toString();
        } else if (type === typeOfDate) {
            return 'new Date(' + obj.getTime() + ')';
        } else {
            return 'undefined'; // fallback for not supported types like XML
        }
    }



    /**
     * Converts any object into valid source code.
     *
     * If you dont pass a depth-parameter, it will default to 1. In this case
     * all objects within an object or an array are converted to undefined.
     *
     * Types that can be converted by this module are:
     *
     * - Object
     * - Array
     * - Date
     * - Function
     * - RegExp
     * - Number
     * - Boolean
     * - String
     * - Null
     * - Undefined
     *
     * @param {*} obj
     * @param {Integer} depth
     * @returns {String} source code
     */
    function toSrc(obj, depth) {
        var result;

        knownObjs = []; // resetting the knownObjs
        result = toSrcRecursive(obj, depth);

        return result;
    }

    return toSrc(the_obj, 10);

    // if (typeof module !== "undefined") {
    //     module.exports = toSrc;
    // } else if (typeof window !== "undefined") {
    //     if (window.toSrc === undefined) {
    //         window.toSrc = toSrc;
    //     } else {
    //         console.log("Name collision: window.toSrc already exists...");
    //     }
    // }
}

///// VUE_PARSE.js

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