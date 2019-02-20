<template>
  <div>
    <div class="editor" contenteditable="true" ref="editor">
      <p>test<strong>strong</strong></p>
    </div>
    <button @click="top">最初</button>
    <button @click="last">最後</button>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'CaretMove',
    components: {
    },
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {
      top () {
        const node = this.$refs.editor.childNodes[0]
        const editorRange = document.createRange()
        const editorSel = window.getSelection()
        editorRange.setStart(node, 0)
        editorRange.collapse(true)
        editorSel.removeAllRanges()
        editorSel.addRange(editorRange)
      },
      last () {
        const p = this.$refs.editor.childNodes[this.$refs.editor.childNodes.length - 1]
        const node = p.childNodes[p.childNodes.length - 1]
        const editorRange = document.createRange()
        const editorSel = window.getSelection()
        editorRange.setStart(node, node.childNodes.length ? node.childNodes.length : node.length)
        editorRange.collapse(true)
        editorSel.removeAllRanges()
        editorSel.addRange(editorRange)
      }
    }
  })
</script>

<style scoped>
  .editor {
    width: 100%;
    height: 500px;
    position: relative;
    background-color: #e0e0e0;
    word-break: break-all;
  }
</style>
