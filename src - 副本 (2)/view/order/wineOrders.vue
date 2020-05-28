<template>
  <div class="order-wrap">
    <section class="order-con">
      <mt-header :title="barInfo.bar && barInfo.bar.name+'-订单详情'">
        <mt-button @click="$router.go(-1)" icon="back" slot="left"></mt-button>
      </mt-header>
      <div class="order-top">{{orderStatus}}</div>
      <div class="order-main">
        <img :src="orderData.imageUrl">
        <div>{{orderData.goodsName}}</div>
      </div>
      <div class="order-list">
        <div>支付时间：{{orderData.placeOrderTime}}</div>
        <div>支付金额：￥{{orderData.price}}</div>
        <div>数量：{{orderData.num}}</div>
        <div>赠送用户：{{orderData.orderUserName}}</div>
        <div>受赠用户：{{orderData.deliveryName}}</div>
        <div style="padding-left: 1.0rem">台号：{{orderData.tabNum}}</div>
      </div>
      <div class="fr">
        <mt-button v-if="status == 1 && type == 1" @click="completeOrder" type="primary" size="small">已送达</mt-button>
        <!--<mt-button v-if="status == 0 || status == 1" @click="toRefund" type="primary" size="small">退款</mt-button>-->
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
import { Indicator, Toast } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {bottom},
  data () {
    return {
      orderId: 0,
      status: 0, // 订单状态：0-下单，1-接单，2-取消，3-完成，4-退款申请,5-拒绝退款，6-退款完成,7,已经送达
      orderStatus:"",
      // statusDesc: [
      //   '下单成功，等待商家接单',
      //   '商家已接单，正在配送中',
      //   '订单已取消',
      //   '商品已送达',
      //   '等待商家退款中',
      //   '商家拒绝退款',
      //   '退款完成',
      //   '商品已送达'
      // ],
      orderData: {}
    }
  },
  computed: {
    ...mapState({
      barInfo: state => state.user.barInfo
    })
  },
  methods: {
    toRefund () {
      this.$router.push({
        path: 'refund',
        query: {
          orderId: this.orderId,
          type: this.type
        }
      })
    },
    /**
     * 完成订单
     */
    completeOrder () {
      let orderId = this.orderId
      let token = localStorage.getItem('token')
      this.$get('/mch/order/confirm/' + orderId, {orderId: this.orderId, 'APP-Token': token}).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          Toast('确认订单操作成功')
        } else {
          Toast('确认订单操作失败,请联系管理员!')
        }
        this.init()
      })
    },
    init () {
      let t = this
      this.orderId = this.$route.query.orderId
      this.type = this.$route.query.type
      let token = localStorage.getItem('token')
      this.$get('/mch/order/detail', {orderId: this.orderId, 'APP-Token': token}).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.orderData = res.data
          t.status = res.data.status
          if(t.status === 0){
            this.orderStatus = "下单成功，等待商家接单"
          }
          if(t.status === 1){
            t.orderStatus = "商家已接单，正在配送中"
          }
          if(t.status === 2){
            this.orderStatus = "商家取消订单"
          }
          if(t.status === 3){
            this.orderStatus = "商品已送达"
          }
          if(t.status === 4){
            this.orderStatus = "商家取消订单，等待商家退款中"
          }
          if(t.status === 5){
            this.orderStatus = "商家拒绝退款"
          }
          if(t.status === 6){
            this.orderStatus = "商家取消订单，退款完成"
          }
          if(t.status === 7){
            this.orderStatus = "商品已送达"
          }
        }
      })
    }
  },
  beforeCreate () {
    Indicator.open('加载中')
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="scss">
.order-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #f0f0f0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  font-size: .3rem;
}
.order-top{
  margin-bottom: .2rem;
  padding: .3rem .4rem;
  background: #fff;
  color: #333;
  font-size: .32rem;
  font-weight: 600;
  text-align: center;
}
.order-main{
  display: flex;
  padding: .4rem;
  background: #fff;
  img{
    max-width: 2rem;
    max-height: 2rem;
    margin-right: .4rem;
  }
}
.order-list{
  div{
    padding: .2rem .4rem;
    margin: .2rem 0;
    background: #fff;
  }
}
.fr{
  padding-right: .2rem;
  text-align: right;
}
</style>
