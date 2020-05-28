<template>
  <div></div>
</template>
<script>
import { Indicator } from 'mint-ui'
import {getQueryParam} from '@/utils/common'
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  beforeCreate () {
    Indicator.open('加载中')
  },
  destroyed () {
    Indicator.close()
  },
  mounted () {
    let qs = getQueryParam(location.href)
    const code = qs('code')
    const state = qs('state')
    if (!code) {
      window.location.href = 'https://webapi.hnjmnet.com/api/wechat/user/authorize'
      // window.location.href = 'http://vin.free.idcfengye.com/api/wechat/user/authorize'
    } else {
      this.$get('/wechat/user/callback', {
        code,
        state
      }).then(res => {
        if (res.ret === 0) {
          localStorage.setItem('openId', res.data.openId)
          localStorage.setItem('wxUser', res.data)
          if (res.data.newUser) {
            this.$store.commit('SAVE_USERINFO', Object.assign({}, {nickname: res.data.nickName}))
            this.$router.push({
              path: './user'
            })
          } else {
            if (res.data.userInfo) {
              this.$store.commit('SAVE_USERINFO', res.data.userInfo)
            }
            localStorage.setItem('token', res.data.token)
            this.$router.push({
              path: './index'
            })
          }
          // {ret:0,data:{newUser:true,openId:ss,nickName:ee,headImgUrl:sss}}
          // {ret:0,data:{newUser:false,openId:ss,token:ee,userInfo:{id:eee,...}}}
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>

</style>
