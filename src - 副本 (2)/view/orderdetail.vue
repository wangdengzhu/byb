<template>
  <div class="orderdetail-wrap">
    <div class="item">
      <div class="tit">
        <span>订单编号：438i92483920483</span>
        <span>待付款</span>
      </div>
      <div class="ht20"></div>
      <div class="main">
        <div class="main-t">
          <div>参保人：<span>王老板</span></div>
          <div>城市：<span>深圳</span></div>
        </div>
        <div class="list">
          <p>参保类型：</p>
          <p>非深户三挡</p>
        </div>
        <div class="list">
          <p>基数：</p>
          <p>2200</p>
        </div>
        <div class="list">
          <p>公积金基数：</p>
          <p>0</p>
        </div>
        <div class="list">
          <p>缴费套餐：</p>
          <p>2020-03 - 2020-04 <span class="red" @click="showpop">查看</span></p>
        </div>
        <div class="list">
          <p>小计：</p>
          <p>￥234.00元</p>
        </div>
      </div>
      <div class="total">
        <div class="t-list">
          <p>订单金额：</p>
          <p>￥234.00元</p>
        </div>
        <div class="t-list">
          <p>实付金额：</p>
          <p>￥234.00元</p>
        </div>
      </div>
      <div class="btn">
        <div>取消订单</div>
        <div class="pay">立即付款</div>
      </div>
    </div>
    <fund ref="fund"></fund>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
import fund from '@/components/fund.vue'
import store from '@/store/'
export default {
  components: { fund },
  data () {
    return {
      status: 0,
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
    changeStatus(status){
      this.status = status
    },
    showpop(){
      this.$refs.fund.isShowPop = true
    }
  },
  mounted () {
    // this.init()
    this.status = this.$route.query.status;
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
