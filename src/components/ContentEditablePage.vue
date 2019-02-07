<template>
  <div class="content-editable-page">
    <div contenteditable="true" class="editable"
         v-html="editContent"
         ref="editable"
         @input="sync"
         @keyup="editorKeyUp"
    ></div>

    <div class="preview"
         v-html="contentHtml"
         ref="preview"
         @click="focusAndMoveCaret"
    ></div>

    <div class="virtual-caret" :style="caretStyle"></div>
    <!--<div contenteditable="true" style="{position: absolute; top: 500px;}">abced</div>-->
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'ContentEditablePage',
    components: {
    },
    data () {
      return {
        innerContent: '',
        content: "<p>今日は暖かいという噂だったけど、そんなことはなかった。</p>" +
          "<p>The Logical Framework Approach (LFA) is a methodology mainly used for designing, monitoring, and evaluating international development projects.</p>" +
          "<p>カリスト (Jupiter IV Callisto) は、木星の第4衛星である。ガニメデに次いで2番目に大きい木星の衛星であり、太陽系の衛星の中ではガニメデと土星最大の衛星タイタンに次ぐ3番目の大きさを持つ。</p>",
        caret: {
          style: {
            top: '0px',
            left: '0px'
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
            node.dataset.key = index
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
          node.dataset.key = index
        })
        return div.innerHTML
      },
      caretStyle () {
        return {
          top: this.caret.style.top,
          left: this.caret.style.left
        }
      }
    },
    methods: {
      sync (e) {
        // MEMO: データベースに保存する必要のない属性などは削除する
        // 実際はもっとクレジングが必要な気がする
        const cleanHTML = [...e.target.childNodes].map(e => {
          e.removeAttribute('data-key')
          return e.outerHTML
        }).join('')
        this.content = cleanHTML
      },
      editorKeyUp (e) {
        this.moveCaret(e)
      },
      focusAndMoveCaret (e) {
        this.moveCaret(e)
        const activeRange = this.getActiveRange()
        this.mergeTextNode(e)
        // MEMO: ここで editor の DOM を全部もとに戻す、こうすうことで re-render させずに node を戻せるっぽい
        this.$refs.editable.innerHTML = this.$refs.preview.innerHTML
        this.focusEditor(activeRange)
      },
      moveCaret (e) {

        const anchor = document.createElement('span')
        anchor.innerHTML = '&#200B'
        const sel = window.getSelection()
        const range = sel.getRangeAt(0)
        range.insertNode(anchor)
        const pos = anchor.getBoundingClientRect()
        anchor.parentElement.removeChild(anchor)
        const parentPos = this.$refs.editable.getBoundingClientRect()
        const offsetTop = e.target.className === 'editable' ? 16 : 0
        this.caret.style.top = pos.top + offsetTop - parentPos.top + 'px'
        this.caret.style.left = pos.left - parentPos.left + 'px'
      },
      getActiveRange () {
        // クリックした位置の range を前もって抜き出しておく
        // mergeTextNode で内包 node を書き換えてしまうと range 情報が失われてしまうので
        const previewSel = window.getSelection()
        const previewRange = previewSel.getRangeAt(0)
        return {
          key: previewRange.commonAncestorContainer.dataset.key,
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
      focusEditor (activeRange) {
        // 指定された node と offset から editor node を探索して focus させる
        const key = activeRange.key
        const targetNode = [...this.$refs.editable.childNodes].find(node => {
          return node.dataset.key === key
        })

        const editorRange = document.createRange()
        const editorSel = window.getSelection()
        editorRange.setStart(targetNode.childNodes[0], activeRange.startOffset)
        editorRange.collapse(true)
        editorSel.removeAllRanges()
        editorSel.addRange(editorRange)
        this.$refs.editable.focus()
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
    position: relative;
    word-break: break-all;
    /*writing-mode: vertical-rl;*/
  }
  .editable {
    position: absolute;
    z-index: 2;
    top: 0px;
    /*caret-color: transparent;*/
    opacity: 0.2;
  }
  .preview {
    position: absolute;
    z-index: 3;
    top: 16px;
  }
  .virtual-caret {
    background-color: #f00;
    width: 2px;
    height: 20px;
    position: absolute;
    opacity: 0.5;
  }
</style>
