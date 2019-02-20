<template>
  <div class="outline">
    <div contenteditable="true" @keyup="calcCaret" ref="editable" class="editor" @scroll="position" :style="style">
      <p>hoge</p>
    </div>
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
        height: 200
      }
    },
    computed: {
      style () {
        return {
          height: `${this.height}.px`
        }
      }
    },
    methods: {
      calcCaret () {
        const sel = window.getSelection()
        const range = sel.getRangeAt(0)
        const anchor = document.createElement('span')
        anchor.innerText = '&#8203;'
        range.insertNode(anchor)
        const pos = anchor.getBoundingClientRect()
        const pPos = anchor.parentElement
        anchor.parentElement.removeChild(anchor)
        const parentPos = this.$refs.editable.getBoundingClientRect()
        const top = pos.top - parentPos.top + 'px'
        const left = pos.left - parentPos.left + 1 + 'px'
        console.log('Class: , Function: , Line 32 top, left: ', top, left)
        console.log('Class: , Function: , Line 36 pPos: ', pPos)

      },
      position (e) {
        // console.log(this.$refs.editable.getBoundingClientRect())
        const newHeight = this.$refs.editable.scrollHeight - this.$refs.editable.scrollTop
        if (newHeight <= 400) {
          this.height = this.$refs.editable.scrollHeight - this.$refs.editable.scrollTop
        }
        console.log(this.$refs.editable.scrollTop, this.$refs.editable.scrollHeight)
      }
    }
  })
</script>

<style scoped>
  .outline {
    border: 1px solid #ccc;
    padding: 15px;
    height: 400px;
  }
  .editor {
    width: 100%;
    overflow: scroll;
    outline: none;
  }
</style>
