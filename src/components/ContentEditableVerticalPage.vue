<template>
  <div class="content-editable-page"
       ref="container"
       :style="containerStyle"
  >
    <div contenteditable="true" class="editable"
         v-html="editContent"
         ref="editable"
         @compositionstart="compositionstart"
         @compositionend="compositionend"
         @input="sync"
         @keyup.exact="editorKeyUp"
         @keyup.enter="hoge"
         @keydown.meta.65="selectAll"
         @paste.prevent="pasteText"
         @focus="focus"
         @blur="focusOut"
    ></div>

    <div class="preview"
         v-html="contentHtml"
         ref="preview"
         @mouseup="selected"
    ></div>

    <div class="caret" :style="caretStyle">
      <svg><rect x="0" y="0" width="100%" height="1"></rect></svg>
    </div>
    <!--<div contenteditable="true" style="{position: absolute; top: 500px;}">abced</div>-->
  </div>
</template>

<script>
  import browser from 'browser-detect'
  import Vue from 'vue'
  const ua = browser()

  export default Vue.extend({
    name: 'ContentEditableVerticalPage',
    components: {
    },
    data () {
      return {
        innerContent: '',
        content: "<p>今日は暖かいという噂だったけど、そんなことはなかった。</p>" +
          "<h3>小見出しです</h3>" +
          "<p><br></p>" +
          "<p><br></p>" +
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
        container: {
          style: {
            boxShadow: 'none'
          }
        },
        compositing: false,
        selecting: false
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
      containerStyle () {
        return {
          boxShadow: this.container.style.boxShadow
        }
      }
    },
    methods: {
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
      focusAndMoveCaret (e, range) {
        // テキスト以外のエディタ部分をクリックした場合は、フォーカスを末尾へ
        if (e.target.className === 'preview') {
          const p = this.$refs.editable.childNodes[this.$refs.editable.childNodes.length - 1]
          const t = p.childNodes[p.childNodes.length - 1]
          this.activeFocus(t, t.length)
          this.moveCaret(this.$refs.editable)
        } else {
          this.moveCaret(e.target)
          // クリックした位置の range を前もって抜き出しておく
          // mergeTextNode で内包 node を書き換えてしまうと range 情報が失われてしまうので
          if (!range) {
            const previewSel = window.getSelection()
            range = previewSel.getRangeAt(0)
          }
          const activeRange = this.getActiveRange(range, e.target)
          this.mergeTextNode(e.target)
          // MEMO: ここで editor の DOM を全部もとに戻す、こうすうことで re-render させずに node を戻せるっぽい
          this.$refs.editable.innerHTML = this.$refs.preview.innerHTML
          this.focusEditor(activeRange)
        }
      },
      moveCaret (target, range) {
        if (!range) {
          const sel = window.getSelection()
          range = sel.getRangeAt(0)
        }
        // MEMO: safari で日本語変換中に node をいじると二重でテキストが入ってしまうため変換中は caret 移動させない
        if (ua.name === 'safari' && this.compositing) {
          this.caret.style.display = 'none'
        } else {
          this.caret.style.display = 'block'
          const anchor = document.createElement('span')
          // MEMO: 先頭に空の span いれると座標がずれるため zero-width-space 入れる
          anchor.innerText = '&#8203;'
          range.insertNode(anchor)
          const pos = anchor.getBoundingClientRect()
          anchor.parentElement.removeChild(anchor)
          const parentPos = this.$refs.editable.getBoundingClientRect()
          const offset = target.className === 'editable' ? 28 : 0
          this.caret.style.top = pos.top - parentPos.top + 'px'
          this.caret.style.left = pos.left - offset - parentPos.left + 1 + 'px'
        }
      },
      getActiveRange (range, target) {
        // MEMO: 自身の textnode が親から見て何番目のインデックスなのかを知る
        let targetNode = range.startContainer
        let i = 0
        if (range.startContainer.nodeType === 3) {
          while ((targetNode = targetNode.previousSibling) !== null) {
            i++
          }
        }
        return {
          key: target.dataset.key,
          index: i,
          startOffset: range.startOffset
        }
      },
      mergeTextNode (e) {
        // span を差し込むことで textnode が分割されるのをもとに戻す
        let joinNode = ''
        ;[...e.childNodes].forEach(node => {
          if (node.nodeType !== 3) {
            node.innerText = [...node.childNodes].map(node => node.nodeValue).join('')
            joinNode += node.outerHTML
          } else {
            joinNode += node.nodeValue
          }
        })
        // const mergedNode = [...e.childNodes].map(node => node.nodeValue).join('')
        // MEMO: 空白の改行の場合、<br> だけなので nodeValue でテキストにすると削除されてしまうので入れ直す
        // e.innerHTML = mergedNode ? mergedNode : '<br>'
        e.innerHTML = joinNode
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
        let targetNode = [...this.$refs.editable.childNodes].find(node => {
          return node.dataset && node.dataset.key === key
        })
        // MEMO: ネストされた node がある場合の対応
        if (!targetNode) {
          targetNode = [...this.$refs.editable.childNodes].map(node => [...node.childNodes]).flat().find(node => {
            return node.dataset && node.dataset.key === key
          })
        }
        this.activeFocus(targetNode.childNodes[activeRange.index], activeRange.startOffset)
      },
      focus () {
        this.container.style.boxShadow = '0 0 5px 0px rgba(0, 123, 255, .4)'
      },
      focusOut () {
        if (!this.selecting) {
          this.container.style.boxShadow = 'none'
        }
        this.caret.style.display = 'none'
      },
      selected (e) {
        const sel = window.getSelection()
        const range = sel.getRangeAt(0)
        // 範囲選択ではない場合はフォーカスさせる
        if (range.startOffset === range.endOffset) {
          this.focusAndMoveCaret(e, range)
        } else {
          this.selecting = true
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
      },
      compositionstart () {
        this.compositing = true
      },
      compositionend () {
        this.compositing = false
      },
      deleteSelectNode (e) {
        if (this.selecting && (e.key === 'Backspace' || e.key === 'Delete')) {
          e.stopPropagation()
          e.preventDefault()

          // MEMO: 選択削除後、キャレットの位置を復元
          const sel = window.getSelection()
          const range = sel.getRangeAt(0)

          const acrossNode = range.startContainer !== range.endContainer
          const target = range.startContainer.parentNode
          sel.deleteFromDocument()
          this.moveCaret(this.$refs.preview, range)

          const activeRange = this.getActiveRange(range, target)
          // MEMO: node またぎのときには先頭 node の末尾にキャレットを移動させる
          if (acrossNode) {
            activeRange.startOffset = target.innerText.length
          }
          this.mergeTextNode(target)

          // MEMO: 全て消した場合、なにもないと入力できないので zero-width-space を入れる
          if (!this.$refs.preview.innerText) {
            this.$refs.preview.innerHTML = '<p>&#8203;</p>'
          }

          // MEMO: ここで editor の DOM を全部もとに戻す、こうすうことで re-render させずに node を戻せるっぽい
          this.$refs.editable.innerHTML = this.$refs.preview.innerHTML
          this.focusEditor(activeRange)
          this.selecting = false
        }
      },
      selectAll (e) {
        // TODO: Windows の場合は ctrl なので、それにも対応させる
        e.stopPropagation()
        e.preventDefault()
        this.selecting = true
        document.activeElement.blur()
        const range = document.createRange()
        const sel = window.getSelection()
        // range.selectNodeContents(this.$refs.preview)
        range.setStart(this.$refs.preview.childNodes[0], 0)
        const endNode = this.$refs.preview.childNodes[this.$refs.preview.childNodes.length - 1]
        range.setEnd(endNode, endNode.childNodes.length)
        sel.removeAllRanges()
        sel.addRange(range)
      },
      hoge (e) {
        // TODO: これなにがしたかったんだっけ…？
        if (!this.isComposing) {
          console.log('Class: , Function: , Line 318 e: ', e)
        }
      }
    },
    mounted() {
      this.innerContent = this.content
      document.execCommand('DefaultParagraphSeparator', false, 'p')
      window.addEventListener('keydown', this.deleteSelectNode, true)
      // window.addEventListener('mousewheel', e => {
      //   // TODO: イベントを関数にして removeEvent する
      //   // エディタ以外のスクロールには関与しない
      //   if (!e.path.find(dom => dom.className === 'content-editable-page') ){
      //     return
      //   }
      //   const container = this.$refs.container.getBoundingClientRect()
      //   const preview = this.$refs.preview.getBoundingClientRect()
      //   if (container.x - 2 < preview.x && e.deltaX < 0) {
      //     e.preventDefault()
      //   }
      // })
    },
    destroyed() {
      window.removeEventListener('keydown', this.deleteSelectNode, true)
    }
  })
</script>

<style scoped>
  .content-editable-page {
    overflow: scroll;
    width: 400px;
    height: 500px;
    margin: auto;
    position: relative;
    word-break: break-all;
    writing-mode: vertical-rl;
  }
  .editable {
    box-sizing: border-box;
    position: absolute;
    z-index: 2;
    top: 0px;
    padding: 1rem;
    /*caret-color: transparent;*/
    opacity: 0;
  }
  .preview {
    border-radius: 3px;
    box-sizing: border-box;
    position: absolute;
    z-index: 3;
    top: 0px;
    right: 28px;
    opacity: 1;
    padding: 1rem;
  }
  .editable, .preview {
    padding-left: 3rem;
    /* TODO: ここを100% にしないと width が自動計算になって各種計算が小数点でずれる…
       でも auto にしないと横スクロール時の戻るアクションキャンセル判定の計算が面倒くさい
    */
    width: 100%;
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
