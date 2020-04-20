import Axios from 'axios'
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/static/mock' : 'https://yuanjunliang.github.io'

export default Axios.create({
  baseURL: baseURL
})
