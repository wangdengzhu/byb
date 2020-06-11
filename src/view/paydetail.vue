<template>
  <div class="orderdetail-wrap">
    <div class="item">
      <div class="tit">
        <span>订单编号：{{dataInfo.order_no}}</span>
        <span>{{statusDesc[dataInfo.order_status]}}</span>
      </div>
      <div class="ht20"></div>
      <div class="main">
        <div class="main-t">
          <div>参保人：<span>{{dataInfo.insured_name}}</span></div>
          <div>城市：<span>{{dataInfo.city_name}}</span></div>
        </div>
        <div class="list">
          <p>缴费套餐：</p>
          <p>{{dataInfo.able_time}} <span class="red" @click="showpop">查看</span></p>
        </div>
      </div>
      <div class="total">
        <div class="t-list">
          <p>订单金额：</p>
          <p>￥{{dataInfo.total_price}}元</p>
        </div>
        <div class="t-list">
          <p>实付金额：</p>
          <p>￥{{dataInfo.total_price}}元</p>
        </div>
      </div>
      <div class="btn">
        <div>取消订单</div>
        <div class="pay">立即付款</div>
      </div>
    </div>
    <div class="bt">
      <div class="pay">
        <img src="../assets/images/wechat-pay.png" alt="">
        <span>微信支付</span>
      </div>
      <span class="btn" @click="toPay">去支付</span>
    </div>
    <fund ref="fund" :dataInfo="dataInfo"></fund>
  </div>
</template>

<script>
import { User } from '@/apis/'
import { Indicator, Toast } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
import fund from '@/components/fund.vue'

export default {
  components: { fund },
  data () {
    return {
      status: 0,
      dataInfo: {},
      statusDesc: {
        '10': '进行中',
        '20': '取消',
        '21': '待取消',
        '30': '已完成'
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    toPay () {

    },
    showpop () {
      this.$refs.fund.isShowPop = true
    }
  },
  mounted () {
    // this.init()
    this.orderId = ~~this.$route.query.orderId
    this.id = ~~this.$route.query.id
    Indicator.open()
    User.orderDetail(this.orderId).then(res => {
      Indicator.close()
      if (res.code == 1 && res.data) {
        this.dataInfo = res.data.detail
      }
    })
  }
}
</script>
<style lang="scss">
$main-color: #ef4f4f;
.ht20{
  width: 100%;
  height: .3rem;
  background: #f5f5f5;
}
.orderdetail-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  overflow-x: hidden;
  background: #f5f5f5;
  font-size: .28rem;
  .item{
    margin-bottom: .3rem;
    background: #fff;
    .tit{
      display: flex;
      justify-content: space-between;
      padding: .3rem 0;
      margin: 0 .3rem;
      font-size: .32rem;
      span:last-child{
        color: $main-color;
      }
    }
    .main{
      padding: .1rem 0;
      margin: 0 .3rem;
      .main-t{
        display: flex;
        div{
          width: 50%;
          padding: .06rem 0;
          margin: .2rem 0;
          color: #333;
          font-size: .3rem;
          span{
            color: #666;
          }
        }
      }
      .list{
        display: flex;
        color: #666;
        p:first-child{
          width: 2rem;
          color: #333;
        }
        .red{
          color: $main-color;
        }
      }
      p{
        margin: .2rem 0;
      }
    }
    .total{
      padding: .2rem .3rem;
      color: $main-color;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      font-size: .32rem;
      .t-list{
        display: flex;
        margin: .2rem 0;
        color: $main-color;
        p:first-child{
          width: 2rem;
        }
      }
    }
    .btn{
      display: flex;
      justify-items: center;
      justify-content: flex-end;
      padding: .2rem 0;
      div{
        padding: .12rem .2rem;
        margin-right: .3rem;
        border: 1px solid #ddd;
        border-radius: .12rem;
      }
      .pay{
        color: $main-color;
        border-color: $main-color;
      }
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
