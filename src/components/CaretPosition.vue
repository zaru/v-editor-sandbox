<template>
  <div class="editor" :style="{ writingMode: verticalMode ? 'vertical-rl' : 'horizontal-tb' }">
    <!--<div contenteditable="true" class="editable" v-html="innerContent" @keydown="caret" @keyup="caret"></div>-->
    <textarea class="dummyTextarea"
              @keydown="expandTextarea"
              @keyup.delete.stop="deleteChar"
              @keyup.exact="syncData"
              :style="textareaStyle"></textarea>
    <div class="virtualEditor" @click="focusTextarea" v-html="nodeText"></div>
    <div class="virtualCaret" :style="virtualCaretStyle">
      <svg><rect x="0" y="0" width="1" height="100%"></rect></svg>
    </div>
    <div class="virtualComposite" v-text="composingContent" :style="virtualCompositeStyle"></div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'CaretPosition',
    watch: {
      // MEMO: DOM レンダリングが終わらないと正確なサイズが判定できないので…もっといい方法あるかな
      'nodeText' () {
        setTimeout(() => {
          this.moveTextarea()
        }, 50)
      }
    },
    components: {
    },
    props: ['verticalMode'],
    data () {
      return {
        content: '今日もいい天気です。',
        lineIndex: 0,
        caretIndex: 0,
        textareaStyle: {
          top: '0px',
          left: '0px',
          height: '0px',
          width: '0px',
          opacity: 0.5
        },
        virtualCaretStyle: {
          display: 'block',
          top: '0px',
          left: '0px',
          height: '0px'
        },
        virtualCompositeStyle: {
          top: '0px',
          left: '0px'
        },
        isComposing: false,
        innerContent: 'sample text',
        composingContent: ''
      }
    },
    computed: {
      nodeText () {
        const node = []
        const lines = this.content.split("\n")
        lines.forEach((line, lineIndex) => {
          const lineDom = document.createElement('span')
          lineDom.style.display = 'block'
          lineDom.className = `lines l-${lineIndex}`
          const chars = line.split('')
          chars.forEach((c, index) => {
            const dom = document.createElement('span')
            dom.innerText = c
            dom.className = `chars c-${index}`
            lineDom.append(dom)
          })
          node.push(lineDom.outerHTML)
        })
        return node.join('')
      }
    },
    methods: {
      caret () {
        // MEMO: このやり方だと、ctrl+f などで移動すると span 削除時に space が消えてしまう
        // const input = document.querySelector('.editable')
        // let anchor = document.createElement('span')
        // anchor.innerHTML = '&#200B'
        // let sel = window.getSelection()
        // let range = sel.getRangeAt(0)
        // range.insertNode(anchor)
        // let caret_position = anchor.getBoundingClientRect()
        // anchor.parentElement.removeChild(anchor)
        // console.log('x, y', caret_position.left, caret_position.top)
      },
      syncData (e) {
        if (!this.isComposing) {
          this.composingContent = ''

          const lines = this.content.split("\n")
          lines[this.lineIndex] = lines[this.lineIndex].slice(0, this.caretIndex) + e.target.value + lines[this.lineIndex].slice(this.caretIndex)
          this.content = lines.join("\n")
          this.caretIndex += e.target.value.length
          e.target.value = ''
          this.resetTextarea()

          // 日本語変換確定の Enter が拾われてしまう…
          if (e.key === 'Enter') {
            console.log('enter')
            // this.moveAhead()
          }
        } else {
          this.composingContent = e.target.value
          this.virtualCompositeStyle.top = this.virtualCaretStyle.top
          this.virtualCompositeStyle.left = this.virtualCaretStyle.left
        }
      },
      focusTextarea () {
        document.querySelector('.dummyTextarea').focus()
      },
      moveTextarea () {
        let current = document.querySelector(`.l-${this.lineIndex} .c-${this.caretIndex}`)
        let offsetWidth = 0
        if (!current) {
          // 次の char DOM が存在しないので、最後の DOM の後ろに位置を調整する
          const lines = this.content.split("\n")
          const caretIndex = lines[this.lineIndex].length - 1
          current = document.querySelector(`.l-${this.lineIndex} .c-${caretIndex}`)
          offsetWidth = current.getBoundingClientRect().width
        }
        const currentRect = current.getBoundingClientRect()
        console.log('Class: , Function: , Line 129 currentRect: ', currentRect)
        const parentRect = current.parentElement.getBoundingClientRect()
        console.log('Class: , Function: , Line 129 parentRect: ', parentRect)
        const top = currentRect.top - document.querySelector('.editor').getBoundingClientRect().top
        const left = currentRect.left - parentRect.left
        const caretHeight = currentRect.height * 0.8
        const caretTop = (currentRect.height - caretHeight) / 2
        this.textareaStyle.top = (top + caretTop) + 'px'
        this.textareaStyle.left = left + offsetWidth + 50 + 'px'
        this.textareaStyle.height = caretHeight + 'px'

        this.virtualCaretStyle.top = (top + caretTop) + 'px'
        this.virtualCaretStyle.left = left + offsetWidth + 'px'
        this.virtualCaretStyle.height = caretHeight + 'px'
      },
      expandTextarea (e) {
        const length = e.target.value.length
        this.textareaStyle.width = (length + 1) * 35 + 'px'
      },
      resetTextarea () {
        this.textareaStyle.width = '0px'
      },
      deleteChar () {
        if (!this.isComposing) {
          this.content = this.content.slice(0, this.caretIndex - 1) + this.content.slice(this.caretIndex)
          this.caretIndex -= 1
        }
      },
      moveAhead () {
        this.lineIndex += 1
        this.caretIndex = 0
      }
    },
    mounted() {
      document.addEventListener('click', e => {
        if (e.target && e.target.classList.contains('chars')) {
          // クリックした文字の幅を取得
          const charRect = e.target.getBoundingClientRect()
          const charWidth = charRect.width
          const clickLeft = e.pageX - charRect.left
          // クリックした位置によって caret 移動する先を前にするか後ろにするかを調整する
          const offset = clickLeft > charWidth / 2 ? 1 : 0
          const caretIndex = Number(e.target.classList.item(1).replace('c-', '')) + offset
          const lineIndex = Number(e.target.parentElement.classList.item(1).replace('l-', ''))
          this.caretIndex = caretIndex
          this.lineIndex = lineIndex
          this.moveTextarea()
        }
      })

      // IME 入力フラグ
      document.querySelector('.dummyTextarea').addEventListener('compositionstart', () => {
        this.isComposing = true
        this.textareaStyle.opacity = 0
        // this.textareaStyle.left = parseInt(this.textareaStyle.left) + 30 + 'px'
        this.virtualCaretStyle.display = 'none'
      })
      document.querySelector('.dummyTextarea').addEventListener('compositionend', () => {
        this.isComposing = false
        this.textareaStyle.opacity = 0.5
        this.virtualCaretStyle.display = 'block'
      })
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
  .lines {
    display: block;
  }
  .virtualEditor {
    width: 100%;
    font-size: 30px;
    text-align: left;
  }
  .dummyTextarea {
    font-size: 30px;
    position: absolute;
    /*background: #fff;*/
    background: #f00;
    width: 5px;
    height: 30px;
    appearance: none;
    border: 0;
    resize: none;
    outline: none;
    overflow: hidden;
  }
  .virtualComposite {
    position: absolute;
    font-size: 30px;
    white-space: nowrap;
    background-color: #fff;
  }
  .virtualCaret {
    position: absolute;
    width: 2px;
    height: 30px;
  }
  .virtualCaret svg {
    width: inherit;
    height: inherit;
    display: block;
    animation: blinkAnimation 500ms;
    animation-duration: 2500ms;
    animation-iteration-count: infinite;
  }
  .virtualCaret svg rect {
    fill: #555;
  }
  @keyframes blinkAnimation {
    0% { opacity: 0 }
    100% { opacity: 1 }
  }

</style>
