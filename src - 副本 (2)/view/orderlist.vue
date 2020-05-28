<template>
  <div class="orderlist-wrap">
    <div class="top">
      <div :class="{active: status == 0}" @click="changeStatus(0)">全部</div>
      <div :class="{active: status == 1}" @click="changeStatus(1)">待付款</div>
      <div :class="{active: status == 2}" @click="changeStatus(2)">已付款</div>
      <div :class="{active: status == 3}" @click="changeStatus(3)">已取消</div>
      <div :class="{active: status == 4}" @click="changeStatus(4)">已过期</div>
    </div>
    <div class="list">
      <div class="item" v-for="i in 4" :key="i" @click="navDetail">
        <div class="tit">
          <span>单号：438i92483920483</span>
          <span>待付款</span>
        </div>
        <div class="main">
          <p>订单类型：常规订单</p>
          <p>订单状态：待付款</p>
          <p>有效时间：7天</p>
          <p>参保月份：1月份</p>
          <p>创建时间：20120-11-11 12:21:21</p>
        </div>
        <div class="total">总金额：￥323.32</div>
        <div class="btn">
          <div>取消订单</div>
          <div class="pay">立即付款</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
import store from '@/store/'
export default {
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
    navDetail(){
      this.$router.push({
        path: `/orderdetail?no=${111}`
      })
    },
    changeStatus(status){
      this.status = status
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
