<template>
  <div class="flex-editor" :class="{ 'vertical-editor': verticalMode }">
    <content-view :content="content" :font-size="16" :vertical-mode="verticalMode"></content-view>
  </div>
</template>

<script>
  import Vue from 'vue'
  import ContentView from './ContentView'

  export default Vue.extend({
    name: 'FlexEditor',
    components: {
      ContentView
    },
    props: {
      verticalMode: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        content: "今日はとてもいい天気です\n改行もします。どうでしょうか。\nMic check, One two."
      }
    },
    computed: {
    },
    methods: {
    }
  })
</script>

<style scoped>
  .flex-editor {
    width: 100%;
    background-color: #e0e0e0;
  }
  .vertical-editor {
    writing-mode: vertical-rl;
  }
</style>
