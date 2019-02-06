<template>
  <span class="line" :data-line-index="lineIndex" @click.stop="captureLine">
    <content-char v-for="(char, charIndex) in chars" :key="charIndex"
                  :char="char" :charIndex="charIndex" :lineIndex="lineIndex"
                  :ref="`l${lineIndex}c${charIndex}`"
                  v-on:capture="capture"
    ></content-char>
  </span>
</template>

<script>
  import Vue from 'vue'
  import ContentChar from './ContentChar'

  export default Vue.extend({
    name: 'ContentLine',
    components: {
      ContentChar
    },
    props: {
      line: {
        type: String,
        required: true
      },
      lineIndex: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
      }
    },
    computed: {
      chars () {
        return this.line.split('')
      }
    },
    methods: {
      capture (e) {
        this.$emit('capture', e)
      },
      captureLine (e) {
        this.$emit('captureLine', e)
      }
    }
  })
</script>

<style scoped>
  .line {
    display: block;
  }
</style>
