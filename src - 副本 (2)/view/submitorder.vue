<template>
  <div class="sb-wrap">
    <div class="tit">缴纳套餐：</div>
    <div class="month">1个月</div>
    <div class="tit">参保人信息：</div>
    <div class="info">
      <div class="top">王老板</div>
      <div class="flex">
        <span>参保城市：深圳</span>
        <span>参保月份：2010-02~2013-02</span>
      </div>
      <div class="flex">
        <span>费用：230.22元/月</span>
        <span>公积金费用：230.22元/月</span>
      </div>
      <div class="flex">
        <span>服务费：30.22元/月</span>
      </div>
      <div class="total">合计：323.44元</div>
    </div>
    <div class="bt">
      <div class="pay">
        <img src="../assets/images/wechat-pay.png" alt="">
        <span>微信支付</span>
      </div>
      <span class="btn" @click="toPay">提交订单</span>
    </div>
  </div>
</template>
<script>
import bottom from '@/components/bottom'
import {Indicator, Toast, MessageBox} from 'mint-ui'
export default {
  components: {bottom},
  data () {
    return {
      insuranceList: [1],
      list: [
        {id:1},{id:2},{id:3}
      ],
      checkItems: ''
    }
  },
  methods: {
    linkTo (to) {
      if (to == 'user') {
        this.$router.push({
          path: './user'
        })
      } else {
        this.$router.push({
          path: './index'
        })
      }
    },
    toPay(){
      this.$router.push({
        path: './paydetail'
      })
    },
    navToAdd () {
      this.$router.push({
        path: './addinsurance'
      })
    },
    navToJoin(){
      console.log(this.checkItems)
      if(this.checkItems == ''){
        Toast('请选择参保人员')
        return
      }
      this.$router.push({
        path: './submitorder'
      })
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scope>
$main-color: #ef4f4f;
.sb-wrap{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1;
  background-color: #f5f5f5;
  color: #333;
  overflow-x: hidden;
  padding-bottom: 2rem;
  font-size: .26rem;
  .tit{
    padding: .32rem;
    padding-left: .8rem;
    background: url(../assets/images/list.png) left center no-repeat;
    background-size: .4rem;
    background-position-x: .3rem;
    border-bottom: 1px solid $main-color;
    font-size: .3rem;
    color: $main-color;
  }
  .month{
    margin: .4rem;
    width: 2.4rem;
    height: .8rem;
    font-size: .32rem;
    background: #f60;
    text-align: center;
    line-height: .8rem;
    border-radius: .12rem;
    color: #fff;
  }
  .info{
    padding: .3rem;
    background: #fff;
    border-bottom: 1px solid $main-color;
    .top{
      margin-bottom: .2rem;
      font-size: .32rem;
    }
    .flex{
      display: flex;
      margin-top: .2rem;
      color: #666;
      span:first-child{
        width: 3rem;
      }
    }
    .total{
      margin-top: .4rem;
      text-align: right;
      color: $main-color;
      font-size: .36rem;
    }
  }
  .bt{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-top: 1px solid #ddd;
    .pay{
      display: flex;
      align-items: center;
      font-size: .3rem;
      img{
        width: .6rem;
        height: .6rem;
        margin: .1rem .3rem;
        margin-right: .2rem;
      }
    }
    .btn{
      width: 2.4rem;
      height: 1rem;
      background: $main-color;
      color: #fff;
      text-align: center;
      line-height: 1rem;
      font-size: .3rem;
    }
  }
}


</style>
