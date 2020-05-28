/**
 * 基于axios封装网络请求接口,支持GET,POST请求
 */

import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'

// API基础URL
axios.defaults.baseURL = 'http://ybb.nmroom.cn/index.php?s='

// 请求超时时间
axios.defaults.timeout = 30000
// axios.defaults.withCredentials = true

// 设置HTTP请求的拦截器
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || '1'
  const openId = localStorage.getItem('openId')
  config.headers['Content-Type'] = 'application/json'
  // const openId = storage.get('openId')
  if (openId) {
    config.headers.openId = openId
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
    if (router.currentRoute.meta.requireAuth) {
      Vue.prototype.loginCfg.cb = () => {
        router.go(0)
      }
      Toast('登录已失效，请重新登录!')
    }
    // return Promise.reject('401')
  } else if (code === 404) {
    router.push({
      path: '404'
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
