<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { mapState } from 'vuex'
import Vue from 'vue'
import VueJsonp from 'vue-jsonp'
import { Indicator, Toast, MessageBox } from 'mint-ui'
import store from '@/store/'
import storage from '@/utils/store'

Vue.use(VueJsonp)
export default {
  name: 'App',
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style>
  @import './assets/css/common';
  @import './assets/font/iconfont';
</style>
