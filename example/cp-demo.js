var module = module || {};
;(function(Vue, module){
var template = "<div class=\"cp-demo\" ><p>{{message}}<\/p><input v-model=\"message\"><\/div>"
module.exports = {};
module.exports = {
    data: function() {
        return {
            message: "Hello Vue.js!"
        }
    },
    loaded: function() {
        return true;
    }
}
module.exports.template = template;
Vue.component("cp-demo", module.exports);
})(Vue, module);

