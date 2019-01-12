<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
@import './assets/css/bootstrap_lumen.min.css';
/* Default sttyle 
  #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
body {
  background: linear-gradient(#83a4d4, #b6fbff);
}
pre {
  font-size: 1.2em;
}
</style>
