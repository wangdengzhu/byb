<template>
  <div class="profile-wrap">
    <section class="user-con">
      <div class="top">
        <img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" alt="">
        <img v-else src="../assets/images/touxiang.png" alt="">
        <span>{{userInfo.nickName}}</span>
      </div>
      <div class="list-box" @click="toOrder('all')">
        <div class="left-label order-i">全部订单</div>
      </div>
      <div class="ht21"></div>
      <div class="order">
        <div class="list" @click="toOrder('unpaid')">
          <img src="../assets/images/order1.png" alt="">
          <p>未付款</p>
          <span class="number" >{{orderCount.unpaid}}</span>
        </div>
        <div class="list" @click="toOrder('paid')">
          <img src="../assets/images/order2.png" alt="">
          <span class="number" >{{orderCount.paid}}</span>
          <p>已付款</p>
        </div>
        <div class="list" @click="toOrder('cancel')">
          <img src="../assets/images/order3.png" alt="">
          <span class="number" >{{orderCount.cancel}}</span>
          <p>已取消</p>
        </div>
        <div class="list" @click="toOrder('pass')">
          <img src="../assets/images/order4.png" alt="">
          <span class="number" >{{orderCount.pass}}</span>
          <p>已过期</p>
        </div>
      </div>
      <!-- <div class="list-box" @click="showCityDlg">
        <div class="left-label">地区<span class="text-right">{{city}}</span></div>
      </div> -->
      <div class="ht20"></div>
      <div class="list-box" @click="contact">
        <div class="left-label contact-i">联系我们</div>
      </div>
      <div class="ht21"></div>
      <div class="list-box" @click="toQuestion">
        <div class="left-label question-i">常见问题</div>
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import bottom from '@/components/bottom'
import { mapState, mapMutations } from 'vuex'
import { Dialog } from 'vant';
import { User } from '@/apis/'
import {getQueryParam} from '@/utils/common'
const phone = localStorage.getItem('phone')
export default {
  components: {bottom},
  data () {
    return {
      userInfo: {},
      orderCount: {},
      phone: phone
    }
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    toOrder (status) {
      this.$router.push({
        path: `/orderlist?status=${status}`
      })
    },
    contact () {
      Dialog.alert({
        title: '呼叫',
        message: `<a href='tel:${this.phone}'>${this.phone}</a>`
      }).then(() => {
        // on close
      });
    },
    toQuestion () {
      this.$router.push({
        path: '/articlelist?id=4'
      })
    },
    // 获取个人信息
    init () {
      User.userIndex().then(res => {
        if (res.code == 1) {
          this.userInfo = res.data.userInfo
          this.orderCount = res.data.orderCount
        }
      })
    }
  },
  beforeCreate () {
    let qs = getQueryParam(location.href)
    const code = qs('code')
    if (!code) {
      User.login().then(res => {
        if (res.code == 1) {
          location.href = res.data
        }
      })
    } else {
      let token = localStorage.getItem('token')
      if (!token) {
        User.getUserInfo(code).then(res => {
          if (res.code == 1) {
            localStorage.setItem('token', res.data.token)
            this.$router.push({
              path: '/'
            })
          }
        })
      }
    }
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
      let token = localStorage.getItem('token')
      if (!token) {
        User.getUserInfo(code).then(res => {
          if (res.code == 1) {
            localStorage.setItem('token', res.data.token)
            this.$router.push({
              path: '/'
            })
          }
        })
      }
    }
    this.init()
  }
}
</script>
<style lang="scss">
$main-color: #ef4f4f;
.profile-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  overflow-x: hidden;
  background: #f5f5f5;
}
.user-con{
  padding: 0;
  margin-bottom: 1.2rem;
  font-size: .3rem;
  background: #fff;
  .top{
    display: flex;
    padding: .3rem;
    align-items: center;
    color: #fff;
    background: url(../assets/images/user-bg.jpg) no-repeat;
    background-size: cover;
    img{
      width: 1.2rem;
      height: 1.2rem;
      margin-right: .2rem;
      border-radius: 50%;
    }
  }
  .order{
    display: flex;
    padding: .2rem 0;
    .list{
      position: relative;
      width: 25%;
      text-align: center;
      font-size: .26rem;
      img{
        width: .5rem;
        height: .5rem;
        margin-bottom: .1rem;
      }
      .number{
        position: absolute;
        top: .02rem;
        left: 1.1rem;
        right: auto;
        min-width: .2rem;
        padding: .04rem .06rem;
        font-size: .24rem;
        color: #fff;
        text-align: center;
        border-radius: .2rem;
        background: #fd5050;
      }
    }
  }
  .user-box1{
    width: 7.3rem;
    padding: .4rem 0 .6rem;
    text-align: center;
    img{
      width: 2rem;
      height: 2rem;
      margin-bottom: .2rem;
    }
  }
  .list-box{
    margin-right: .2rem;
    padding: .4rem .2rem;
    background: url(../assets/images/list-icon.png) right center no-repeat;
    background-size: .16rem .26rem;
    div{
      overflow: hidden;
      padding: 0 .2rem;
      .text-right{
        float: right;
        display: block;
        width: 3rem;
        height: .4rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        text-align: right;
      }
      .text-right-img{
        float: right;
        height: .8rem;
      }
    }
    .flex{
      justify-content: space-between;
      span{
        line-height: .8rem;
      }
    }
    .left-label{
      padding-left: .6rem;
      background: url(../assets/images/list-icon.png) left center no-repeat;
      background-size: .4rem;
      &.order-i{
        background-image: url(../assets/images/order-i.png);
      }
      &.contact-i{
        background-image: url(../assets/images/contact-i.png);
      }
      &.question-i{
        background-image: url(../assets/images/question-i.png);
      }
    }
  }
  .ht21{
    width: 7.5rem;
    height: 1px;
    background: #ddd;
  }
  .ht20{
    width: 7.5rem;
    height: .2rem;
    background: #f5f5f5;
  }
  .avatar-item {
    position: relative;
    height: 1.28rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .2rem .2rem .2rem .2rem;
    box-sizing: border-box;
    div {
      display: flex;
      align-items: center;
    }
    i {
      display: block;
      width: 0.16rem;
      height: 0.26rem;
      margin-left: 0.2rem;
      background: url(../assets/images/list-icon.png) right center no-repeat;
      background-size: .16rem .26rem;
    }
    span {
      flex: 1;
      font-size: 0.3rem;
      line-height: .8rem;
    }
    p {
      color: #666;
      font-size: 0.28rem;
      line-height: 1;
    }
    img {
      height: .8rem;
      vertical-align: middle;
    }
    .file-inp {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}

.picker-wrap {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
  .picker-cnt {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 1000;
    .txt-btn-wrap {
      display: flex;
      height: 100%;
      padding: .2rem 0.3rem;
      border-bottom: 1px solid #eaeaea;
    }
    .txt-btn {
      display: flex;
      flex: 1;
      align-items: center;
      font-size: 0.28rem;
      &.ok {
        color: #f60;
        justify-content: flex-end;
      }
      &.tit {
        justify-content: center;
      }
    }
  }
  .picker-bg {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}
</style>
