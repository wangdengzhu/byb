<template>
  <div class="orderdetail-wrap" v-if="pageLoad">
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
          <p>参保类型：</p>
          <p>{{dataInfo.gear_title}}</p>
        </div>
        <div class="list">
          <p>基数：</p>
          <p>{{dataInfo.pension_base}}</p>
        </div>
        <div class="list">
          <p>公积金基数：</p>
          <p>{{dataInfo.house_base}}</p>
        </div>
        <div class="list">
          <p>缴费套餐：</p>
          <p>{{dataInfo.able_time}} <span class="red" @click="showpop">查看</span></p>
        </div>
        <div class="list">
          <p>小计：</p>
          <p>￥{{dataInfo.total_price}}元</p>
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
      <div class="btn" v-if="dataInfo.order_status == 10 && dataInfo.pay_status == 10">
        <div @click.stop="cancel">取消订单</div>
        <div class="pay" @click="payNow">立即付款</div>
      </div>
    </div>
    <fund ref="fund" :dataInfo="dataInfo"></fund>
  </div>
</template>

<script>
import { User } from '@/apis/'
import { Indicator, Toast, MessageBox } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
import fund from '@/components/fund.vue'
import store from '@/store/'
export default {
  components: { fund },
  data () {
    return {
      pageLoad: false,
      orderId: 0,
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
    navTo (type = '', text = '') {
      this.$router.push({
        path: `/profile/${type}?text=${encodeURIComponent(text)}`
      })
    },
    cancel () {
      MessageBox.confirm('确定取消订单吗?').then(action => {
        Indicator.open()
        User.cancelOrder(this.orderId).then(res => {
          Indicator.close()
          if (res.code == 1) {
            Toast('取消成功')
            this.init()
          } else {
            Toast(res.msg)
          }
        })
      })
    },
    payNow () {
      Indicator.open()
      User.orderPay(this.orderId).then(res => {
        Indicator.close()
        if (res.code == 1) {
          this.wxpay(res)
        } else {
          Toast(res.msg)
        }
      })
    },
    // 微信支付
    wxpay (res) {
      let self = this
      const {appId, timeStamp, nonceStr, signType, paySign} = res.data
      function onBridgeReady () {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': appId,
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': res.data.package,
            'signType': signType,
            'paySign': paySign
          },
          function (res) {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              window.location.reload()
            }
          })
      }
      if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
      } else {
        onBridgeReady()
      }
    },
    showpop () {
      this.$refs.fund.isShowPop = true
    },
    init () {
      this.orderId = ~~this.$route.query.orderId
      this.id = ~~this.$route.query.id
      Indicator.open()
      User.orderDetail(this.orderId).then(res => {
        this.pageLoad = true
        Indicator.close()
        if (res.code == 1 && res.data) {
          this.dataInfo = res.data.detail
        }
      })
    }
  },
  mounted () {
    this.init()
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
          text-align: center;
          color: #333;
          font-size: .34rem;
          &:first-child{
            border-right: 2px solid #aaa;
          }
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
}

</style>
