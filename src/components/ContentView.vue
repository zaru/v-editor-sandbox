<template>
  <div class="content-view" ref="content-view" :style="style">
    <content-line v-for="(line, lineIndex) in lines" :key="lineIndex"
                  :line="line" :lineIndex="lineIndex"
                  :ref="`l${lineIndex}`"
                  v-on:capture="captureClick"
                  v-on:captureLine="captureLineClick"
    ></content-line>
    <virtual-caret :size="caretSize"
                   :verticalMode="verticalMode"
                   :x="x"
                   :y="y"
    ></virtual-caret>
    <virtual-textarea :size="caretSize"
                      :verticalMode="verticalMode"
                      :x="x"
                      :y="y"
                      ref="virtualTextarea"
                      v-on:insertContent="insertContent"
                      v-on:compositionStart="compositionStart"
                      v-on:compositionEnd="compositionEnd"
    ></virtual-textarea>
  </div>
</template>

<script>
  import Vue from 'vue'
  import ContentLine from './ContentLine'
  import VirtualCaret from './VirtualCaret'
  import VirtualTextarea from './VirtualTextarea'

  export default Vue.extend({
    name: 'ContentView',
    props: {
      content: {
        type: String,
        default: ''
      },
      fontSize: {
        type: Number,
        default: 16
      },
      verticalMode: {
        type: Boolean,
        default: false
      }
    },
    components: {
      ContentLine,
      VirtualCaret,
      VirtualTextarea
    },
    watch: {
      innerContent () {
        setTimeout(() => {
          // MEMO: ここ 0 index 参照が正しい？
          const target = this.$refs[`l${this.lineIndex}`][0].$refs[`l${this.lineIndex}c${this.charIndex}`][0]
          this.setCaretPosition(target.$el)
        }, 50)
      }
    },
    data () {
      return {
        lineIndex: 0,
        charIndex: 0,
        innerContent: '',
        target: {
          x: 0,
          y: 0,
          behind: false
        },
        isComposing: false
      }
    },
    computed: {
      lines () {
        return this.innerContent.split("\n")
      },
      caretSize () {
        return this.fontSize
      },
      style () {
        return {
          fontSize: this.fontSize + 'px'
        }
      },
      x () {
        return this.target.x
      },
      y () {
        return this.target.y
      },
      textareaDom () {
        return this.$refs['virtualTextarea'].$refs['textarea']
      }
    },
    methods: {
      captureClick (e) {
        this.textareaDom.focus()
        this.setBehind(e)
        this.setIndex(e.target)
        this.setCaretPosition(e.target)
      },
      captureLineClick (e) {
        this.textareaDom.focus()
        const lastChar = e.target.lastElementChild
        this.target.behind = true
        this.setIndex(lastChar)
        this.setCaretPosition(lastChar)
      },
      setBehind (e) {
        // クリックした位置が char の真ん中より後ろだったら、入力位置を1文字後ろにする
        const rect = e.target.getBoundingClientRect()
        if (this.verticalMode) {
          const pos = e.pageY - rect.top
          this.target.behind = pos > rect.height / 2
        } else {
          const pos = e.pageX - rect.left
          this.target.behind = pos > rect.width / 2
        }
      },
      setIndex (target) {
        this.lineIndex = Number(target.parentElement.dataset.lineIndex)
        this.charIndex = Number(target.dataset.charIndex) + (this.target.behind ? 1 : 0)
      },
      setCaretPosition (target) {
        const rect = target.getBoundingClientRect()
        const parentRect = this.$refs['content-view'].getBoundingClientRect()
        this.target.x = rect.left - parentRect.left + (this.target.behind && !this.verticalMode ? rect.width : 0)
        this.target.y = rect.top - parentRect.top + (this.target.behind && this.verticalMode ? rect.height : 0)
        // TODO: caret 位置の微調整、依存度が怪しいのでフォントサイズ変更などのデバッグが必要
        if (this.verticalMode) {
          this.target.x += rect.width / 2
          this.target.y -= this.caretSize / 2
        }
      },
      insertContent (value) {
        if (!this.isComposing) {
          const lines = this.innerContent.split("\n")
          lines[this.lineIndex] = lines[this.lineIndex].slice(0, this.charIndex) + value + lines[this.lineIndex].slice(this.charIndex)
          this.innerContent = lines.join("\n")
          this.charIndex += value.length
          this.textareaDom.value = ''
        } else {
          // this.composingContent = e.target.value
        }
      },
      compositionStart () {
        this.isComposing = true
      },
      compositionEnd () {
        this.isComposing = false
      }
    },
    mounted () {
      this.innerContent = this.content
      if (this.verticalMode) {
        const parentRect = this.$refs['content-view'].getBoundingClientRect()
        this.target.x = parentRect.width - this.caretSize / 2
      }
    }
  })
</script>

<style scoped>
  .content-view {
    position: relative;
  }
</style>
