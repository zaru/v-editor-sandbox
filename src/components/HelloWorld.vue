<template>
  <div class="hello">
    <div contenteditable="true" v-text="innerContent" @input="sync"></div>
    <div v-html="content"></div>

    <editor content="content" @update="componentSync"></editor>
    <div v-html="componentContent"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import Editor from './Editor'

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    Editor
  },
  data () {
    return {
      innerContent: '',
      content: 'sample text',
      componentContent: ''
    }
  },
  methods: {
    sync (e) {
      this.content = e.target.innerHTML
    },
    componentSync (content) {
      this.componentContent = content
    }
  },
  mounted() {
    this.innerContent = this.content
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
