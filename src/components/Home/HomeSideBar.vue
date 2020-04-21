<template>
  <div>
    <el-menu
      default-active="Nodejs"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu v-for="(value,key) in this.menus" :key="key" :index="key">
        <template slot="title">
          <span>{{key}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="handleClickPost(key,item)" v-for="(item,index) in value" :key="index" :index="key-index">{{item}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <div class="ads-sidebar" v-html="adsSidebar">

    </div>
  </div>
</template>

<script>
import { Col, Menu, MenuItem, MenuItemGroup } from 'element-ui'
export default {
  name: 'HomeSideBar',
  props: {
    menus: Object
  },
  data () {
    return {
      adsSidebar: window.config.ads.sidebar || ''
    }
  },
  components: {
    Col,
    Menu,
    MenuItem,
    MenuItemGroup
  },
  mounted () {
    console.log({menus: this.menus})
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    async handleClickPost (key, item) {
      this.$emit('handleClickPost', { key, item })
    }
  }
}
</script>

<style scoped>

</style>
