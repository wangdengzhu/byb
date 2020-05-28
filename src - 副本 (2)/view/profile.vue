<template>
  <div class="profile-wrap">
    <section class="user-con">
      <div class="top">
        <img src="../assets/images/touxiang2.jpg" alt="">
        <span>王老板</span>
      </div>
      <div class="list-box" @click="toOrder(0)">
        <div class="left-label order-i">全部订单</div>
      </div>
      <div class="ht21"></div>
      <div class="order">
        <div class="list" @click="toOrder(1)">
          <img src="../assets/images/order1.png" alt="">
          <p>未付款</p>
          <span class="number" >3</span>
        </div>
        <div class="list" @click="toOrder(2)">
          <img src="../assets/images/order2.png" alt="">
          <span class="number" >11</span>
          <p>已付款</p>
        </div>
        <div class="list" @click="toOrder(3)">
          <img src="../assets/images/order3.png" alt="">
          <p>已取消</p>
        </div>
        <div class="list" @click="toOrder(4)">
          <img src="../assets/images/order4.png" alt="">
          <p>已过期</p>
        </div>
      </div>
      <!-- <div class="list-box" @click="showCityDlg">
        <div class="left-label">地区<span class="text-right">{{city}}</span></div>
      </div> -->
      <div class="ht20"></div>
      <div class="list-box" @click="toMyGift">
        <div class="left-label contact-i">联系我们</div>
      </div>
      <div class="ht21"></div>
      <div class="list-box" @click="toFeedback">
        <div class="left-label question-i">常见问题</div>
      </div>
      <div class="picker-wrap" v-show="showCity">
        <transition name="slide-down">
          <div class="picker-cnt">
            <div class="txt-btn-wrap">
              <span class="txt-btn cancel" @click="hideCityDlg">取消</span>
              <span class="txt-btn ok" @click="cnfrmAddrArea">确认</span>
            </div>
            <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
          </div>
        </transition>
      </div>
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui'
import bottom from '@/components/bottom'
import address from '@/utils/city'
import { mapState, mapMutations } from 'vuex'
import store from '@/store/'
const MAX_NUM = 5
const MAX_IMG_SIZE = MAX_NUM * 1024 * 1024
export default {
  components: {bottom},
  data () {
    return {
      isShow: !1,
      preImgIsLoading: !0,
      city: '',
      addressSlots: [
        {
          flex: 1,
          values: Object.keys(address),
          textAlign: 'center'
        }, {
          divider: true,
          content: '-'
        }, {
          flex: 1,
          values: ['北京'],
          textAlign: 'center'
        }
      ],
      addressProvince: '北京',
      addressCity: '北京',
      showCity: !1,
      imgOption: {
        img: '',
        autoCrop: true,
        autoCropWidth: window.innerWidth,
        autoCropHeight: window.innerWidth,
        fixedBox: true,
        canMoveBox: false,
        full: true,
        canScale: true
      },
      upImgName: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    toOrder (status) {
      this.$router.push({
        path: `/orderlist?status=${status}`
      })
    },
    toMyGift () {
      this.$router.push({
        path: '/mygift'
      })
    },
    toFeedback () {
      this.$router.push({
        path: '/feedback'
      })
    },
    showCityDlg () {
      this.showCity = !0
    },
    onAddressChange (picker, values) {
      picker.setSlotValues(1, address[values[0]])
      this.addressProvince = values[0]
      this.addressCity = values[1]
    },
    hideCityDlg () {
      this.showCity = !1
    },
    cnfrmAddrArea () {
      this.showCity = !1
      this.city = this.addressCity
      Indicator.open('保存中...')
      let token = localStorage.getItem('token')
      this.$post('/user/modify?APP-Token=' + token, {location: this.city}).then(res => {
        Indicator.close()
        Toast(res.msg)
      })
    },
    // 获取个人信息
    init () {
      if (this.userInfo.id) {
        this.city = this.userInfo.location
        return
      }
      let token = localStorage.getItem('token')
      this.$get('/user/myInfo', {'APP-Token': token}).then(res => {
        if (res.ret === 0) {
          this.city = res.data.baseInfo.location
          store.commit('SAVE_USERINFO', res.data.baseInfo)
          store.commit('SAVE_COUNTINFO', res.data.account)
        }
      })
    }
  },
  mounted () {
    // this.init()
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
        border-radius: 50%;
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
