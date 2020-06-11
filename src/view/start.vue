<template>
  <div></div>
</template>
<script>
import { Indicator } from 'mint-ui'
import {getQueryParam} from '@/utils/common'
import { User } from '@/apis/'
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
    if (!code) {
      User.login().then(res => {
        if (res.code == 1) {
          location.href = res.data
        }
      })
    } else {
      User.getUserInfo(code).then(res => {
        if (res.code == 1) {
          localStorage.setItem('token', res.data.token)
          this.$router.push({
            path: './index'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>

</style>
