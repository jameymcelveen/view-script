# Vue Load
Allows you to load and compile [Vuejs.org][1] `\*.vue` components directly into your browser without pre-compilation.

## Example

### cp-demo.vue

	<template>
	   <div>
	       <p>{{message}}</p>
	       <input v-model="message">
	   </div>
	</template>
	
	<script>
	   module.exports = {
	        data: {
	            message: 'Hello Vue.js!"
	        }
	   }
	</script>


### index.html
	<!DOCTYPE html>
	<html lang="en">
	<head>
	   <meta charset="UTF-8">
	    <title>Vue Compiler Demo</title>
	</head>
	<body>
	    <div id="app">
	        <cp-demo></cp-demo>
	    </div>
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.21/vue.common.min.js"></script>
	    <script src="cp-demo.vue" type="vue/component"></script>
	    <script>
	        var demo = new Vue({
	            el: '#app'
	        });
	    </script>
	</body>
	</html>

[1]:	http://vuejs.org