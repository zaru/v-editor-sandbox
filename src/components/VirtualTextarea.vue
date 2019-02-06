<template>
  <div>
    <textarea :style="style" ref="textarea"
              @keyup="insertContent"
              @compositionstart="compositionStart"
              @compositionupdate="compositionUpdate"
              @compositionend="compositionEnd"
    ></textarea>
    <div v-show="verticalMode && compositeContent.length > 0" class="composite" v-text="compositeContent" :style="compositeStyle"></div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'VirtualTextarea',
    props: {
      size: {
        type: Number
      },
      verticalMode: {
        type: Boolean,
        default: false
      },
      x: {
        type: Number,
        default: 0
      },
      y: {
        type: Number,
        default: 0
      },
      active: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        composition: false,
        compositeContent: ''
      }
    },
    computed: {
      style () {
        return {
          top: this.y + 'px',
          left: this.textareaLeft + 'px',
          // width: (this.compositeContent.length + 1) * this.size + 'px',
          width: '5px',
          height: this.size + 'px',
          fontSize: this.size + 'px',
          opacity: this.verticalMode || !this.composition ? 0 : 1
        }
      },
      compositeStyle () {
        // TODO: 手動で位置を調整しているので、自動調整するようにする
        return {
          top: this.y + 9 + 'px',
          left: this.x - 12 + 'px',
          fontSize: this.size + 'px'
        }
      },
      textareaLeft () {
        if (this.verticalMode) {
          return this.x + this.size
        }
        return this.x
      }
    },
    methods: {
      insertContent (e) {
        this.content = e.target.value
        if (this.composition) {
          this.compositeContent = e.target.value
        }
        this.$emit('insertContent', e.target.value)
      },
      compositionStart () {
        this.composition = true
        this.$emit('compositionStart')
      },
      compositionUpdate () {
        // TODO: idea, textarea をこのタイミングでずらせば候補まどはそのままで入力しているかのように見せることができるかも
        // this.$refs.textarea.style.left = '0px'
        // this.$refs.textarea.style.width = this.size + 'px'
        // this.$refs.textarea.style.height = '100px'
      },
      compositionEnd () {
        this.composition = false
        this.compositeContent = ''
        this.$emit('compositionEnd')
      }
    }
  })
</script>

<style scoped>
  textarea {
    position: absolute;
    background-color: #e0e0e0;
    /*background-color: #f00;*/
    width: 5px;
    appearance: none;
    border: 0;
    resize: none;
    outline: none;
    overflow: hidden;
  }
  .composite {
    position: absolute;
    opacity: 1;
    white-space: nowrap;
    background-color: #e0e0e0;
  }
</style>
