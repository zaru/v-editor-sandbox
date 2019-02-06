<template>
  <span :data-char-index="charIndex" v-text="char" @click.stop="capture"></span>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Char',
    props: {
      char: {
        type: String,
        required: true
      },
      lineIndex: {
        type: Number,
        required: true
      },
      charIndex: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {
      capture (e) {
        this.$emit('capture', e)
      }
    }
  })
</script>

<style scoped>
</style>
