<template>
  <div id="app">
    <!--<HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
    <!--<virtual-caret></virtual-caret>-->
    <!--<caret-position key="vertical" :vertical-mode="true"></caret-position>-->
    <!--<caret-position key="horizontal" :vertical-mode="false"></caret-position>-->
    <div class="section">
      <flex-editor></flex-editor>
    </div>
    <div class="section">
      <flex-editor :vertical-mode="true" style="height: 500px"></flex-editor>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  // import HelloWorld from './components/HelloWorld.vue';
  // import VirtualCaret from './components/VirtualCaret.vue'
  // import CaretPosition from './components/CaretPosition.vue'
  import FlexEditor from './components/FlexEditor.vue'

  export default Vue.extend({
    name: 'app',
    components: {
      // HelloWorld,
      // VirtualCaret
      // CaretPosition
      FlexEditor
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
