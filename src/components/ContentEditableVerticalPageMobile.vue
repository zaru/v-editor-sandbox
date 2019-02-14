<template>
  <div class="content-editable-page">
    <div contenteditable="true" class="editable"
         v-html="editContent"
         ref="editable"
         :style="editorStyle"
         @focus="autoHeight"
    ></div>

    <div class="caret" :style="caretStyle">
      <svg><rect x="0" y="0" width="100%" height="1"></rect></svg>
    </div>
    <!--<div contenteditable="true" style="{position: absolute; top: 500px;}">abced</div>-->
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'ContentEditableVerticalPage',
    components: {
    },
    data () {
      return {
        innerContent: '',
        content: "<p>今日は暖かいという噂だったけど、そんなことはなかった。</p>" +
          "<h3>小見出しです</h3>" +
          "<p>The Logical Framework Approach (LFA) is a methodology mainly used for designing, monitoring, and evaluating international development projects.</p>" +
          "<p>カリスト (Jupiter IV Callisto) は、<strong>木星の第4衛星である。</strong>ガニメデに次いで2番目に大きい木星の衛星であり、太陽系の衛星の中ではガニメデと土星最大の衛星タイタンに次ぐ3番目の大きさを持つ。</p>",
        caret: {
          style: {
            display: 'none',
            width: '22px',
            top: '0px',
            left: '0px'
          }
        },
        editor: {
          style: {
            height: window.innerHeight - 50 + 'px'
          }
        }
      }
    },
    computed: {
      editContent: {
        get () {
          // MEMO: 識別用の data-key を付与する
          const div = document.createElement('div')
          div.innerHTML = this.innerContent
          div.childNodes.forEach((node, index) => {
            if (node.dataset) {
              node.dataset.key = index
            }
            node.childNodes.forEach((node, c_index) => {
              if (node.dataset) {
                node.dataset.key = `${index}-${c_index}`
              }
            })
          })
          return div.innerHTML
        },
        set (value) {
          console.log('ここが実行されることはないはず: ', value)
          return this.innerContent = value
        }
      },
      contentHtml () {
        // MEMO: 識別用の data-key を付与する
        const div = document.createElement('div')
        div.innerHTML = this.content
        div.childNodes.forEach((node, index) => {
          if (node.dataset) {
            node.dataset.key = index
          }
          node.childNodes.forEach((node, c_index) => {
            if (node.dataset) {
              node.dataset.key = `${index}-${c_index}`
            }
          })
        })
        return div.innerHTML
      },
      caretStyle () {
        return {
          display: this.caret.style.display,
          width: this.caret.style.width,
          top: this.caret.style.top,
          left: this.caret.style.left
        }
      },
      editorStyle () {
        return {
          height: this.editor.style.height
        }
      }
    },
    methods: {
      autoHeight(e) {
        this.editor.style.height = window.innerHeight - 273 + 'px'
      },
      sync () {
        const nodes = this.$refs.editable.childNodes
        // MEMO: データベースに保存する必要のない属性などは削除する
        // 実際はもっとクレジングが必要な気がする
        // const cleanHTML = [...e.target.childNodes].map(e => {
        const cleanHTML = [...nodes].map(e => {
          e.removeAttribute('data-key')
          return e.outerHTML
        }).join('')
        this.content = cleanHTML
      },
      editorKeyUp (e) {
        this.moveCaret(e.target)
      },
      focusAndMoveCaret (e) {
        // テキスト以外のエディタ部分をクリックした場合は、フォーカスを末尾へ
        if (e.target.className === 'preview') {
          const p = this.$refs.editable.childNodes[this.$refs.editable.childNodes.length - 1]
          const t = p.childNodes[p.childNodes.length - 1]
          this.activeFocus(t, t.length)
          this.moveCaret(this.$refs.editable)
        } else {
          this.moveCaret(e.target)
          const activeRange = this.getActiveRange(e.target)
          this.mergeTextNode(e)
          // MEMO: ここで editor の DOM を全部もとに戻す、こうすうことで re-render させずに node を戻せるっぽい
          this.$refs.editable.innerHTML = this.$refs.preview.innerHTML
          this.focusEditor(activeRange)
        }
      },
      moveCaret (target) {
        this.caret.style.display = 'block'
        const anchor = document.createElement('span')
        anchor.innerHTML = '&#200B'
        const sel = window.getSelection()
        const range = sel.getRangeAt(0)
        range.insertNode(anchor)
        const pos = anchor.getBoundingClientRect()
        anchor.parentElement.removeChild(anchor)
        const parentPos = this.$refs.editable.getBoundingClientRect()
        const offset = target.className === 'editable' ? 28 : 0
        this.caret.style.top = pos.top - parentPos.top + 'px'
        this.caret.style.left = pos.left - offset - parentPos.left + 1 + 'px'
      },
      getActiveRange (target) {
        // クリックした位置の range を前もって抜き出しておく
        // mergeTextNode で内包 node を書き換えてしまうと range 情報が失われてしまうので
        const previewSel = window.getSelection()
        const previewRange = previewSel.getRangeAt(0)
        return {
          key: target.dataset.key,
          startOffset: previewRange.startOffset
        }
      },
      mergeTextNode (e) {
        // span を差し込むことで textnode が分割されるのをもとに戻す
        // TODO: おそらく太字とかを考えると単純な textnode だけではないので対応する
        // MEMO: ↓ これが preview の方だと textnode だけなので OK なんだけど
        const mergedNode = [...e.target.childNodes].map(node => node.nodeValue).join('')
        e.target.innerHTML = mergedNode
      },
      activeFocus (node, offset) {
        const editorRange = document.createRange()
        const editorSel = window.getSelection()
        editorRange.setStart(node, offset)
        editorRange.collapse(true)
        editorSel.removeAllRanges()
        editorSel.addRange(editorRange)
        this.$refs.editable.focus()
      },
      focusEditor (activeRange) {
        // 指定された node と offset から editor node を探索して focus させる
        const key = activeRange.key
        const targetNode = [...this.$refs.editable.childNodes].find(node => {
          return node.dataset && node.dataset.key === key
        })
        // TODO: nest された node の中身を探索する効率的な方法を考える
        // flat() は良さそうだったが、そもそも childNodes が配列の塊じゃないから事前に列挙する必要があり、それなら最初からそうしてる
        if (!targetNode) {
          const hoge = [...this.$refs.editable.childNodes].flat(2).find(node => {
            return node.dataset && node.dataset.key === key
          })
        }
        this.activeFocus(targetNode.childNodes[0], activeRange.startOffset)
      },
      focusOut () {
        this.caret.style.display = 'none'
      },
      selected (e) {
        const sel = window.getSelection()
        const range = sel.getRangeAt(0)
        // 範囲選択ではない場合はフォーカスさせる
        if (range.startOffset === range.endOffset) {
          this.focusAndMoveCaret(e)
        }
      },
      pasteText (e) {
        const text = window.clipboardData ? window.clipboardData.getData('text') : e.clipboardData.getData('text/plain')
        const sel = window.getSelection()
        const range = sel.getRangeAt(0)
        const node = document.createTextNode(text)
        range.insertNode(node)
        range.setStartAfter(node)
        range.setEndAfter(node)
        sel.removeAllRanges()
        sel.addRange(range)
        this.sync()
      }
    },
    mounted() {
      this.innerContent = this.content
      document.execCommand('DefaultParagraphSeparator', false, 'p')
    }
  })
</script>

<style scoped>
  .content-editable-page {
    width: 100%;
    height: 80%;
    position: relative;
    word-break: break-all;
    writing-mode: vertical-rl;
  }
  .editable {
    width: 100%;
    position: absolute;
    z-index: 2;
    top: 0px;
    /*caret-color: transparent;*/
    opacity: 1;
  }
  .preview {
    width: 100%;
    position: absolute;
    z-index: 3;
    right: 28px;
    opacity: 1;
  }

  .caret {
    position: absolute;
    width: 2px;
  }
  .caret svg {
    width: inherit;
    height: inherit;
    display: block;
    animation: blinkAnimation;
    animation-duration: 1500ms;
    animation-iteration-count: infinite;
  }
  .caret svg rect {
    fill: #333;
  }
  @keyframes blinkAnimation {
    0% { opacity: 0 }
    100% { opacity: 1 }
  }
</style>
