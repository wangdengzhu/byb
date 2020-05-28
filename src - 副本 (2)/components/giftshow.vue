<template>
<transition name='fade' enter-active-class='animated zoomInDown' leave-active-class='animated zoomOut'>
  <div v-show="show" class="content">
    <img :src="gift.image" alt="">
    <div class="text">{{showMsg}}</div>
  </div>
</transition>

</template>

<script>
import { mapState } from 'vuex'
import 'animate.css'
export default {
  data () {
    return {
      token: '',
      show: !1,
      countDown: 0, // 倒计时：5表示五秒
      count: 5, // 礼物霸屏时间
      count1: 5, // 接口请求频率
      timer: null,
      timer1: null,
      gift: {},
      showMsg: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      barInfo: state => state.user.barInfo
    })
  },
  methods: {
    showGift () {
      // this.show = !0 // this.show = !1
      // if (this.timer) {
      //   clearTimeout(this.timer)
      //   this.timer = null
      // } else {
      //   this.timer = setTimeout(() => {
      //     this.show = !1
      //     clearTimeout(this.timer)
      //     this.timer = null
      //     this.count1 = 2
      //     this.init()
      //   }, this.count * 1000)
      // }
      if (this.countDown <= 0) { // 倒计时计数器是0得时候从后台获取
        this.getData()
      } else {
        this.show = !0 // 显示
      }
      if (this.countDown > 0) { // 倒计时必须大于0才递减
        this.countDown = this.countDown - 1
      } else {
        this.show = !1 // 隐藏
      }
    },
    getData () {
      if (!this.barInfo.bar) {
        return
      }
      this.token = localStorage.getItem('token')
      let groupId = this.barInfo.bar.id
      this.$get(`/userMessage/showGift`, {'groupId': groupId, 'APP-Token': this.token}).then(res => {
        if (res.ret === 0) {
          this.showMsg = res.data.showMsg || ''
          this.gift = res.data.showGift || {}
          this.count = res.data.showGift.effectsTime
          this.count1 = res.data.showGift.effectsTime
          // this.showGift()
          this.countDown = res.data.showGift.effectsTime
          this.show = !0 // 显示
        } else {
          // this.count1 = 5
          // this.init()
          this.show = !1 // 隐藏
        }
      })
    },
    init () {
      // if (this.timer1) {
      //   clearTimeout(this.timer1)
      //   this.timer1 = null
      // } else {
      //   this.timer1 = setTimeout(() => {
      //     this.getData()
      //     clearTimeout(this.timer1)
      //     this.timer1 = null
      //   }, this.count1 * 1000)
      // }
      this.timer = setInterval(this.showGift, 1000)
    }
  },
  mounted () {
    this.init()
    // this.timer1 = setInterval(() => {
    //   this.getData()
    // }, this.count1 * 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
// {
//   "ret": 0,
//   "msg": "查询成功",
//   "data": {
//       "showGift": {
//           "id": "19001d74a4c34f55bb7fc133273f7683",
//           "recUpdateTime": "2019-06-24 22:33:44",
//           "name": "一朵玫瑰",
//           "price": 0.01,
//           "image": "https://jc-cdn.oss-cn-hangzhou.aliyuncs.com/pass-iot/20190606225752066_rose_flower.png",
//           "effectsTime": 20,
//           "description": "收到一朵玫瑰",
//           "status": true,
//           "purpose": "greet",
//           "new": false
//       },
//       "userGift": {
//           "id": "94b5f94b8e79479d8f34e84785b55f80",
//           "recCreateTime": "2019-06-10 16:51:15",
//           "recUpdateTime": "2019-06-24 22:38:57",
//           "giftId": "19001d74a4c34f55bb7fc133273f7683",
//           "giverId": "b46f51175be84b69bd95079524d03f73",
//           "giveTime": "2019-06-10 16:51:15",
//           "mchId": "4028ea815a3d2a8c015a3d2f8d2a0002",
//           "giveWay": "1",
//           "receiverId": "1001",
//           "giftPrice": 1,
//           "orderId": "1074f6187afd4f58a185f5cbe8e95de9",
//           "new": false
//       },
//       "showMsg": "哇,尊贵的用户【b46f51175be84b69bd95079524d03f73】给【null】送了一朵玫瑰"
//   }
// }
</script>
<style scoped lang="scss">
.content{
  position: absolute;
  top: 2rem;
  left: 2.25rem;
  z-index: 999999999;
  width: 3rem;
  padding-top: .2rem;
  font-size: .3rem;
  text-align: center;
  border-radius: .1rem;
  background: #fae0e1;
  opacity: .7;
  img{
    width: 1.5rem;
  }
  .text{
    padding: .2rem;
    word-break: break-all;
    font-size: .24rem;
  }
}
</style>
