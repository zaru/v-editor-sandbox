<template>
  <div class="outline">
    <div contenteditable="true" class="editor">
      <p>hoge</p>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'NormalVertical',
    components: {
    },
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {
    }
  })
</script>

<style scoped>
  .outline {
  }
  .editor {
    width: 100%;
    height: 400px;
    riting-mode: vertical-rl;
  }
</style>
