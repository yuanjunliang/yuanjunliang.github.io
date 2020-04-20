import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import HomePostList from '@/components/Home/HomePostList'
import HomeContent from '@/components/Home/HomeContent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/',
          name: 'HomePostList',
          component: HomePostList
        },
        {
          path: '/content',
          name: 'HomeContent',
          component: HomeContent
        }
      ]
    }
  ]
})
