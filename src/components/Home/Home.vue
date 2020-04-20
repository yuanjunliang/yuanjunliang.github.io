<template>
  <div class="container">
    <div class="header">
      <h1>袁俊亮技术博客</h1>
    </div>
    <div class="content">
      <div class="sidebar">
        <home-side-bar @handleClickPost="handleClickPost" :menus="menus"></home-side-bar>
      </div>
      <div class="main-content">
        <home-content :content="content"></home-content>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
import axios from '@/plugin/axios'
import HomeSideBar from './HomeSideBar'
import HomeContent from './HomeContent'

export default {
  name: 'Home',
  components: {
    HomeSideBar,
    HomeContent
  },
  data () {
    return {
      menus: {},
      content: ''
    }
  },
  methods: {
    async getMenus () {
      try {
        let url = '/menus.json'
        let result = await axios.get(url)
        let data = result.data
        this.menus = data
      } catch (error) {
      }
    },
    async getReadme () {
      try {
        let url = '/README.md'
        let result = await axios.get(url)
        this.content = result.data
      } catch (error) {
      }
    },
    async handleClickPost (params) {
      try {
        let { key, item } = params
        let url = `/${key}/${item}.md`
        let result = await axios.get(url)
        let data = result.data
        this.content = data
      } catch (error) {
        console.log('slkjdfklsjflsfjsdlfhahahha')
        this.content = 'No Data'
      }
    }
  },
  mounted () {
    this.getMenus()
    this.getReadme()
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 100px;
  padding: 0px 30px;
  border-bottom: solid 1px #eee;
}
.content {
  display: flex;
  flex: 1;
  flex-direction: row;
}

.sidebar {
  width: 300px;
  border-right: solid 2px #eee;
}
.sidebar ul {
  list-style: none;
  margin: 0px;
  padding: 20px;
}

.sidebar ul li {
  margin: 10px 0px;
}

.main-content {
  display: flex;
  flex: 1;
  max-width: 1200px;
  overflow: auto;
}
.footer {
  height: 100px;
  background-color: black;
}
</style>
