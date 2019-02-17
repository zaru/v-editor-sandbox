<template>
  <div class="content-editable-page">
    <div contenteditable="true" class="editable"
         ref="editable"
         @compositionstart="compositionstart"
         @compositionend="compositionend"
         @keyup="moveCaret"
    ><p>test</p></div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Sync',
    components: {
    },
    data () {
      return {
        compositing: false
      }
    },
    computed: {
    },
    methods: {
      moveCaret (e) {
        // if (!this.compositing) {
        console.log(e.key)
        console.log(e.target.innerHTML)
        if (e.key !== 'Enter') {
        const anchor = document.createElement('span')
        // anchor.innerHTML = '&#200B'
        const sel = window.getSelection()
        const range = sel.getRangeAt(0)
        range.insertNode(anchor)
        const pos = anchor.getBoundingClientRect()
        anchor.parentElement.removeChild(anchor)
        }
        console.log(e.target.innerHTML)
      },
      compositionstart () {
        this.compositing = true
      },
      compositionend () {
        this.compositing = false
      }
    },
    mounted() {
    }
  })
</script>

<style scoped>
</style>
