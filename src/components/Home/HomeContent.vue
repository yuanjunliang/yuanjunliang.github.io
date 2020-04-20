<template>
  <div class="home-main-content">
    <div v-html="htmlMarked" v-highlight/>
  </div>
</template>

<script>
export default {
  name: 'HomeContent',
  props: ['content'],
  data () {
    return {
      htmlMarked: ''
    }
  },
  methods: {
    markedContent () {
      let html = window.marked(this.content, {
        sanitize: false,
        ...this.markedOptions
      }).replace(/href="/gi, 'target="_blank" href="')
      if (html !== '') {
        this.htmlMarked = html.replace(/<pre>/g, '<div class="code-block"><span class="copy-code">' + this.copyBtnText + '</span><pre>').replace(/<\/pre>/g, '</pre></div>')
      }
    }
  },
  watch: {
    content () {
      this.markedContent()
    }
  },
  mounted () {
    this.markedContent()
  }
}
</script>

<style scoped>
.home-main-content {
  padding: 30px;
  width: 1200px;
}

@media screen and (max-width: 1024px) {
  .home-main-content {
    width: 96%;
    padding: 0px;
    margin: 0 auto;
  }
}
</style>

<style>
a {
  color: #409eff;
  text-decoration: none;
}
</style>
