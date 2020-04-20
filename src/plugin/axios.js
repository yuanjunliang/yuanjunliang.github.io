// import Axios from 'axios'
// const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/static/mock' : 'http://yuanjunliang.cn/docs'
const baseURL = window.location.host === 'yuanjunliang.cn' ? 'http://yuanjunliang.cn/docs' : 'http://localhost:8080/static/mock'

export default axios.create({
  baseURL: baseURL
})
