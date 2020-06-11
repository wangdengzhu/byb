<template>
    <div>
      <mt-tabbar fixed>
        <mt-tab-item id="home" @click.native="linkTo('index')">
          <img v-if="active1" slot="icon" src="../assets/images/home-icon1.png">
          <img v-else slot="icon" src="../assets/images/home-icon.png">
          <span :class="{active: active1}">首页</span>
        </mt-tab-item>
        <mt-tab-item class="relative" id="message" @click.native="linkTo('insurance')">
          <img v-if="active2" slot="icon" src="../assets/images/menu-icon1.png">
          <img v-else slot="icon" src="../assets/images/menu-icon.png">
          <span :class="{active: active2}">交保</span>
        </mt-tab-item>
        <mt-tab-item id="user" @click.native="linkTo('profile')">
          <img v-if="active3" slot="icon" src="../assets/images/user-icon1.png">
          <img v-else slot="icon" src="../assets/images/user-icon.png">
          <span :class="{active: active3}">我的</span>
        </mt-tab-item>
      </mt-tabbar>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      active1: !1,
      active2: !1,
      active3: !1
    }
  },
  methods: {
    linkTo (param) {
      this.$router.push({
        path: '/' + param
      })
    }
  },
  computed: {
    ...mapState({
      unReadMsgNum: state => state.user.unReadMsgNum
    })
  },
  mounted () {
    const param = this.$route.name
    switch (param) {
      case '首页' :
        this.active1 = !0
        break
      case '交保' :
        this.active2 = !0
        break
      case '我的' :
        this.active3 = !0
        break
    }
  }
}
</script>
<style scoped lang="scss">
.relative{
  position: relative;
}
.badge{
  padding: 5px;
  background: #fd5050;
  border-radius: 50%;
  position: absolute;
  top: .12rem;
  right: .6rem;
}
.number{
  padding: .04rem .06rem;
  font-size: .24rem;
  color: #fff;
  left: 1.05rem;
  right: auto;
  border-radius: .2rem;
  text-align: center;
  min-width: .2rem;
}
.active{
  color: #56D674;
}
</style>
