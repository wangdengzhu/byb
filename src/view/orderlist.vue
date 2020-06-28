<template>
  <div class="orderlist-wrap">
    <div class="top">
      <div :class="{active: dataType == 'all'}" @click="changeStatus('all')">全部</div>
      <div :class="{active: dataType == 'unpaid'}" @click="changeStatus('unpaid')">待付款</div>
      <div :class="{active: dataType == 'paid'}" @click="changeStatus('paid')">已付款</div>
      <div :class="{active: dataType == 'cancel'}" @click="changeStatus('cancel')">已取消</div>
      <div :class="{active: dataType == 'pass'}" @click="changeStatus('pass')">已过期</div>
    </div>
    <div v-loadmore="getList" is-enable-scroll="isLoading">
      <div class="list">
        <div class="item" v-for="(item, i) in orderlist" :key="i">
          <div class="tit">
            <span>单号：{{item.order_no}}</span>
            <span>{{item.status}}</span>
          </div>
          <div class="main" @click="navDetail(item)">
            <p>订单类型：常规订单</p>
            <p>订单状态：{{item.status}}</p>
            <p>有效时间：{{item.expire_time}}天</p>
            <p>参保月份：{{~~item.insured_month}}月份</p>
            <p>创建时间：{{item.create_time}}</p>
          </div>
          <div class="total">总金额：￥{{item.total_price}}</div>
          <div class="btn" v-if="item.order_status.value == 10 && item.pay_status.value == 10">
            <div @click.stop="cancel(item.order_id)">取消订单</div>
            <div class="pay" @click="payNow(item.order_id)">立即付款</div>
          </div>
        </div>
        <div class="loading-container" v-if="isShowMore" >
          <template v-if="!isLoadOver">
            <span class="loading-icon"></span>
            <span class="loading-txt">加载中...</span>
          </template>
          <template v-else>
            <span class="loading-txt">没有更多了</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loadmore from '@/components/loadmore';
import { Indicator, Toast, MessageBox } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
import store from '@/store/'
import { User } from '@/apis/'
export default {
  data () {
    return {
      status: 0,
      dataType: 'all',
      orderlist: [],
      isShowMore: !1,
      isLoadOver: !1,
      isLoading: !1,
      perPage: 20,
      page: 1
    }
  },
  directives: {
    loadmore
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    navTo (type = '', text = '') {
      this.$router.push({
        path: `/profile/${type}?text=${encodeURIComponent(text)}`
      })
    },
    navDetail (data) {
      this.$router.push({
        path: `/orderdetail?orderId=${data.order_id}&id=${data.insured_id}`
      })
    },
    changeStatus (status) {
      this.dataType = status
      this.orderlist = []
      this.isShowMore = !1
      this.isLoadOver = !1
      this.isLoading = !1
      this.page = 1
      this.getList()
    },
    cancel (id) {
      MessageBox.confirm('确定取消订单吗?').then(action => {
        Indicator.open()
        User.cancelOrder(id).then(res => {
          Indicator.close()
          if (res.code == 1) {
            Toast('取消成功')
            this.getList()
          } else {
            Toast(res.msg)
          }
        })
      })
    },
    payNow (id) {
      Indicator.open()
      User.orderPay(id).then(res => {
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
              self.$router.go(0);
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
    getList () {
      if (this.isLoadOver) {
        return;
      }
      this.isLoading = !0;
      Indicator.open()
      User.orderlist({dataType: this.dataType, page: this.page}).then(res => {
        Indicator.close()
        this.isLoading = !1;
        if (res.code == 1 && res.data.list) {
          if (res.data.list.length < this.perPage) {
            this.isLoadOver = !0;
          }
          this.orderlist = this.orderlist.concat(res.data.list)
          this.page++
        }
      })
    }
  },
  mounted () {
    this.dataType = this.$route.query.status;
    this.getList()
  }
}
</script>
<style lang="scss">
$main-color: #ef4f4f;
.orderlist-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  overflow-x: hidden;
  background: #f5f5f5;
  font-size: .28rem;
  .top{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    background: #fff;
    div{
      height: .8rem;
      line-height: .8rem;
      margin: 0 .35rem;
    }
    .active{
      color: $main-color;
      border-bottom: .04rem solid $main-color;
    }
  }
  .list{
    margin-top: 1rem;
    .item{
      margin-bottom: .3rem;
      background: #fff;
      .tit{
        display: flex;
        justify-content: space-between;
        padding: .2rem 0;
        margin: 0 .3rem;
        border-bottom: 1px solid #ddd;
        span:last-child{
          color: $main-color;
        }
      }
      .main{
        padding: .1rem 0;
        margin: 0 .3rem;
        border-bottom: 1px solid #ddd;
        p{
          margin: .15rem 0;
        }
      }
      .total{
        padding: .2rem .3rem;
        text-align: right;
        color: $main-color;
        border-bottom: 1px solid #ddd;
        font-size: .32rem;
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
}

</style>
