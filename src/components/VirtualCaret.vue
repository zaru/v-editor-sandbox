<template>
  <div class="caret" :style="style">
    <svg><rect x="0" y="0" width="1" height="100%"></rect></svg>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    name: 'VirtualCaret',
    props: {
      size: {
        type: Number
      },
      verticalMode: {
        type: Boolean,
        default: false
      },
      x: {
        type: Number,
        default: 0
      },
      y: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
      }
    },
    computed: {
      style () {
        return {
          top: this.y + 'px',
          left: this.x + 'px',
          height: this.size + 'px',
          transform: this.verticalMode ? 'rotate(90deg)' : ''
        }
      }
    },
    methods: {
    }
  })
</script>

<style scoped>
  .caret {
    position: absolute;
    width: 2px;
  }
  .caret svg {
    width: inherit;
    height: inherit;
    display: block;
    animation: blinkAnimation 500ms;
    animation-duration: 2500ms;
    animation-iteration-count: infinite;
  }
  .caret svg rect {
    fill: #555;
  }
  @keyframes blinkAnimation {
    0% { opacity: 0 }
    100% { opacity: 1 }
  }
</style>
