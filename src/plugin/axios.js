// import Axios from 'axios'
// const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/static/mock' : 'http://yuanjunliang.cn/docs'
// const baseURL = window.location.host === 'yuanjunliang.cn' ? 'http://yuanjunliang.cn/docs' : 'http://localhost:8080/static/mock'

const baseURL = window.config.baseURL || 'http://localhost:8080/static/mock'
console.log({baseURL})
export default axios.create({
  baseURL: baseURL
})
