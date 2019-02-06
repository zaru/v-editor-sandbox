<template>
    <div contenteditable="true" v-text="innerContent" @input="sync"></div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Editor',
    props: ['content'],
    data () {
      return {
        innerContent: ''
      }
    },
    methods: {
      sync (e) {
        this.$emit('update', e.target.innerHTML)
      }
    },
    mounted() {
      this.innerContent = this.content
    }
  })
</script>

<style scoped>
</style>
