<template>
  <div class="hello">
    <div contenteditable="true" class="editable" v-html="editContent" @input="sync" @keydown="moveCaret" @keyup="moveCaret"></div>
    <div v-html="content"></div>

    <div class="virtual-caret" :style="caretStyle"></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { position, offset } from 'caret-pos'

  export default Vue.extend({
    name: 'HogeVirtualCaret',
    components: {
    },
    data () {
      return {
        innerContent: '',
        content: 'sample text',
        caretStyle: {
          top: '0px',
          left: '0px'
        }
      }
    },
    computed: {
      editContent: {
        get () {
          return this.innerContent.replace(' ', '&nbsp;')
        },
        set (value) {
          this.innerContent = value.replace('&nbsp;', ' ')
        }
      }
    },
    methods: {
      sync (e) {
        this.content = e.target.innerHTML
      },
      moveCaret () {
        const input = document.querySelector('.editable')
        const pos = position(input); // { left: 15, top: 30, height: 20, pos: 15 }
        const off = offset(input); // { left: 15, top: 30, height: 20 }
        // console.log('Class: , Function: , Line 27 pos: ', pos)
        // console.log('Class: , Function: , Line 28 off: ', off)
        this.caretStyle.top = pos.top + 'px'
        this.caretStyle.left = pos.left + 'px'
      }
    },
    mounted() {
      this.innerContent = this.content
    }
  })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    position: relative;
  }
  .editable {
    /*moveCaret-color: transparent;*/
  }
  .virtual-caret {
    background-color: #72f5be;
    width: 2px;
    height: 20px;
    position: absolute;
    opacity: 0.5;
  }
</style>
