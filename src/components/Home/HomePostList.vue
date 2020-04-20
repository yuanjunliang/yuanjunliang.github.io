<template>
  <div class="home-post-list">
    <ul>
      <li v-for="(item,index) in data" :key="index">
        <div>
          <a href="#">{{item}}</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import config from './config'
const { data } = config
export default {
  name: 'HomePostList',
  data () {
    return {
      data: data
    }
  }
}
</script>

<style scoped>
.home-post-list {
  display: block;
  width: 100%;
}

ul {
  list-style: none;
  margin: 0px;
  padding: 30px;
}

ul >li {
  border-bottom: solid 1px #eee;
}

ul >li a {
  text-decoration: none;
  line-height: 50px;
  font-size: 18px;
  font-weight: bold;
  color: #666;
}
</style>
