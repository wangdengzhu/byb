<template>
  <div class="page-wrap" v-cloak>
    <div class="top">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="(item,i) in banner" :key="i">
          <img :src="item.image_url" alt="">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="bar">社保用处</div>
    <div class="main">
      <div class="list" v-for="(item,i) in policy" :key="i" @click="navDetail(item.id)">
        <img :src="item.image_url" alt="">
        <p>{{item.title}}</p>
      </div>
    </div>
    <div class="middle-banner">
      <div class="item">
        <div>以质取胜</div>
      </div>
      <div class="item">
        <div>用心服务</div>
      </div>
    </div>
    <div class="bar">易社保服务</div>
    <div class="middle-list">
      <div class="item" @click="navDetail()">
        <span>代缴社保</span>
        <img src="../assets/images/last-icon1.png" alt="">
      </div>
      <div class="item">
        <span>变更社保医院</span>
        <img src="../assets/images/last-icon2.png" alt="">
      </div>
      <div class="item">
        <span>社保卡领取</span>
        <img src="../assets/images/last-icon3.png" alt="">
      </div>
      <div class="item">
        <span>社保申请</span>
        <img src="../assets/images/last-icon4.png" alt="">
      </div>
      <div class="item">
        <span>基数变更</span>
        <img src="../assets/images/last-icon5.png" alt="">
      </div>
      <div class="item">
        <span>领公积金卡</span>
        <img src="../assets/images/last-icon6.png" alt="">
      </div>
    </div>
    <div class="middle-banner">
      <div class="item item3">
        <div>专业诚信</div>
      </div>
      <div class="item item4">
        <div>服务至周</div>
      </div>
    </div>
    <div class="middle-list">
      <div class="item">
        <span>买社保流程</span>
        <img src="../assets/images/process.png" alt="">
      </div>
      <div class="item">
        <span>常见问题</span>
        <img src="../assets/images/question-i.png" alt="">
      </div>
    </div>
    <div class="bt">
      <p>Copyright 2020 {{company.company_name}}</p>
      <p>地址：{{company.company_address}}</p>
      <p>电话：{{company.company_telephone}}</p>
    </div>
    <bottom></bottom>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import bottom from '@/components/bottom'
import store from '@/store/'
import {mapState, mapMutations} from 'vuex'
import {Indicator, Toast, MessageBox, Swipe, SwipeItem} from 'mint-ui'
import { User } from '@/apis/'
export default {
  components: {bottom},
  data () {
    return {
      banner: [],
      policy: [],
      company: {}
    }
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO', 'SAVE_BARINFO']),
    navDetail (id) {
      this.$router.push({
        path: `/article?id=${id}`
      })
    }
  },
  // created(){
  //   User.login().then(res => {
  //     if(res.code == 1){
  //       // location.href = res.data
  //     }
  //   })
  // },
  mounted () {
    Indicator.open()
    User.getIndexInfo().then(res => {
      Indicator.close()
      if (res.code == 1) {
        this.banner = res.data.bananer
        this.policy = res.data.policy
        this.company = res.data.company
      }
    })
  }
}
</script>
<style scoped lang="scss">
  [v-cloak] {
    display: none !important;
  }
  $main-color: #ef4f4f;
  .page-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
    background-color: #f5f5f5;
    color: #333;
    font-size: 0.32rem;
    overflow-x: hidden;
    padding-bottom: 1.3rem;
  }
  .top{
    height: 3rem;
    img{
      width: 100%;
    }
  }
  .bar{
    position: relative;
    margin: .3rem 0 0;
    padding: 0 .4rem;
    font-size: .34rem;
    background: #fff;
    padding-bottom: .3rem;
    padding-top: .4rem;
    &::before{
      content: '';
      display: block;
      position: absolute;
      left: .2rem;
      top: .34rem;
      width: 4px;
      height: .5rem;
      background: $main-color;
    }
  }
  .main{
    margin-bottom: .3rem;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    .list{
      width: 25%;
      margin: .3rem 0;
      text-align: center;
      font-size: .28rem;
      img{
        width: .8rem;
        margin-bottom: .16rem
      }
    }
  }
  .middle-banner{
    margin: .3rem 0;
    padding: .3rem;
    display: flex;
    justify-content: space-between;
    background: #fff;
    .item{
      width: 3.3rem;
      height: 1.38rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url(../assets/images/middle-banner1.jpg) no-repeat;
      background-size: contain;
      border-radius: .12rem;
      &:last-child{
        background-image: url(../assets/images/middle-banner2.jpg);
      }
      &.item3{
        background-image: url(../assets/images/middle-banner3.jpg);
      }
      &.item4{
        background-image: url(../assets/images/middle-banner4.jpg);
      }
      div{
        width: 1.8rem;
        height: .6rem;
        text-align: center;
        background: #fff;
        border-radius: .4rem;
        border: 1px solid #ddd;
        font-size: .26rem;
        line-height: .6rem;
      }
    }
  }
  .middle-list{
    margin-bottom: .3rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item{
      display: flex;
      align-items: center;
      width: 3.14rem;
      justify-content: flex-end;
      background: #fff;
      margin: .1rem;
      padding: .2rem;
      font-size: .26rem;
      img{
        width: .8rem;
        margin-left: .3rem;
      }
    }
  }
  .bt{
    font-size: .24rem;
    text-align: center;
    p{
      margin: .08rem 0;
      &:first-child{
        color: #19bcf1;
        font-size: .26rem;
      }
    }
  }
</style>
