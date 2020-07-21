/**
 * 基于axios封装网络请求接口,支持GET,POST请求
 */

import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'
import md5 from 'js-md5'

// API基础URL
// axios.defaults.baseURL = 'http://ybb.nmroom.cn/index.php?s='
axios.defaults.baseURL = 'http://api.baoyiban.com/index.php?s='
// 请求超时时间
axios.defaults.timeout = 30000
// axios.defaults.withCredentials = true

// 设置HTTP请求的拦截器
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || ''
  // const openId = localStorage.getItem('openId')
  config.headers['Content-Type'] = 'application/json'
  if (token) {
    config.headers.token = token
    let len = config.url.split('/')
    let url = len[len.length - 1].toLowerCase()
    if(config.url.indexOf('editInsured') > -1) {
      url = 'editinsured'
    }
    console.log(url)
    config.headers.sign = md5(token + url).toUpperCase()
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 设置HTTP响应的拦截器
axios.interceptors.response.use((response) => {
  const code = response.data.code
  if (code === 401) {
    // 对特定返回码进行预处理，比如需要登录等.
    localStorage.removeItem('token')
    router.push({
      path: '/'
    })
  }
  return response
}, (error) => {
  Indicator.close()
  // Toast('网络不给力，请稍后重试!')
  return Promise.reject(error)
})

// GET请求使用方法
export function fetch (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params})
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// POST请求使用方法
export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
