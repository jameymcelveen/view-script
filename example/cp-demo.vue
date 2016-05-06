<template>
    <div class="cp-demo" >
        <p>{{message}}</p>
        <input v-model="message">
    </div>
</template>

<script>
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
</script>

<style>
.cp-demo {
    background-color: #cccccc;
}
</style>