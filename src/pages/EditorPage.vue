<template>
  <content-editable-vertical-page :content="content" @updated="updatedData"></content-editable-vertical-page>
</template>

<script>
  import Vue from 'vue'
  import ContentEditableVerticalPage from '../components/ContentEditableVerticalPage.vue'

  export default Vue.extend({
    name: 'app',
    components: {
      ContentEditableVerticalPage
    },
    data () {
      return {
        content: "<p>今日は暖かいという噂だったけど、そんなことはなかった。</p>" +
          "<h3>小見出しです</h3>" +
          "<p><br></p>" +
          "<p><br></p>" +
          "<p>The Logical Framework Approach (LFA) is a methodology mainly used for designing, monitoring, and evaluating international development projects.</p>" +
          "<p>カリスト (Jupiter IV Callisto) は、<b>木星の第4衛星である。</b>ガニメデに次いで2番目に大きい木星の衛星であり、太陽系の衛星の中ではガニメデと土星最大の衛星タイタンに次ぐ3番目の大きさを持つ。</p>" +
          "<p><br></p>" +
          "<p><br></p>" +
          "<p>abc</p>" +
          "<p>def</p>"
      }
    },
    methods: {
      updatedData (data) {
      }
    }
  })
</script>

<style scoped>
</style>
