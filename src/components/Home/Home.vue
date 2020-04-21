<template>
  <div class="container">
    <div class="header">
      <h1><router-link to="/">{{blogName}}</router-link></h1>
      <div class="ads-header" v-html="adsHeader">
      </div>
      <i @click="isShowSideBar = !isShowSideBar" class="el-icon-s-home"></i>
    </div>
    <div class="content">
      <div :class="[{'sidebar-hide':isShowSideBar}, 'sidebar']">
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
import { Icon } from 'element-ui'

export default {
  name: 'Home',
  components: {
    HomeSideBar,
    HomeContent,
    Icon
  },
  data () {
    return {
      menus: {},
      content: '',
      isShowSideBar: true,
      blogName: window.config.blogName || '个人博客',
      adsHeader: window.config.ads.header || ''
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100px;
  padding: 0px 30px;
  border-bottom: solid 1px #eee;
}
.el-icon-s-home {
  display: none;
}
.content {
  display: flex;
  flex: 1;
  flex-direction: row;
  padding: 0 10px;
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
}
.footer {
  height: 100px;
  background-color: black;
}

@media screen and (max-width: 1024px) {
  .content {
    flex-direction: column;
  }
  .header {
    align-items: center;
    height: 50px;
  }
  .ads-header {
    display: none;
  }
  .el-icon-s-home {
    display: flex;
  }
  .header >h1 {
    font-size: 18px;
  }
  .sidebar {
    display: block;
    width: 100%;
  }
  .sidebar-hide {
    display: none;
  }

  .footer {
    display: none;
  }
}
</style>
