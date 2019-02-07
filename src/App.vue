<template>
  <div id="app">
    <router-view></router-view>
    <!--<HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
    <!--<hoge-virtual-moveCaret></hoge-virtual-moveCaret>-->
    <!--<moveCaret-position key="vertical" :vertical-mode="true"></moveCaret-position>-->
    <!--<moveCaret-position key="horizontal" :vertical-mode="false"></moveCaret-position>-->
    <!--<div class="section">-->
      <!--<flex-editor></flex-editor>-->
    <!--</div>-->
    <!--<div class="section">-->
      <!--<flex-editor :vertical-mode="true" style="height: 500px"></flex-editor>-->
    <!--</div>-->
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  // import HelloWorld from './components/HelloWorld.vue';
  // import HogeVirtualCaret from './components/HogeVirtualCaret.vue'
  // import CaretPosition from './components/CaretPosition.vue'
  import FlexEditor from './components/FlexEditor.vue'

  export default Vue.extend({
    name: 'app',
    components: {
      // HelloWorld,
      // HogeVirtualCaret
      // CaretPosition
      // FlexEditor
    }
  });
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
    padding: 50px;
  }
  .section {
    padding: 20px 0;
  }
</style>
