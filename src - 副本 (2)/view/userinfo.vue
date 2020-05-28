<template>
  <div class="counter-wrap" v-cloak>
    <section class="user-wrap1">
      <mt-header :title="title">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>
      <div class="user-box1">
        <img @click="preImage($event)" :src="userInfoData.avatar" >
      </div>
      <div class="user-box1-1">
        <p>
        <img v-if="userInfoData.gender===1" src="../assets/images/male.png" style="width: 15px;height: 15px;text-align:center;">&nbsp;&nbsp;
        <img v-if="userInfoData.gender===2" src="../assets/images/female.png" style="width: 15px;height: 15px;text-align:center;">&nbsp;&nbsp;
        {{userInfoData.nickname}}&nbsp;&nbsp;
        {{userInfoData.location==null ? "未知":userInfoData.location}}
        </p>
      </div>
      <div class="user-box2">
        <p>个性签名：</p>
         {{userInfoData.introduction}}
      </div>
      <!--<div class="user-box3">-->
        <!--<mt-button size="large" type="primary" @click.native.stop="receive(1)" v-if="id != userInfo.id">查看收到的礼物</mt-button>-->
        <!--<mt-button size="large" type="primary" @click.native.stop="receive(2)" v-if="id != userInfo.id">查看送出的礼物</mt-button>-->
      <!--</div>-->
      <div class="user-box4">
        <p>标签：</p>
        <div class="biaoqian">
          {{userInfoData.interest}}
        </div>
      </div>
    </section>
    <div>
      <!-- <transition name="slideup">
       <div class="greet" v-show="showGreet" ref="greet"  @click.stop="showGreet = !0">
          <div class="send-list" @click="sendGift(item)" v-for="(item, i) in giftList" :key="i">
            <img :src="item.image" >
            <p>{{item.name}}￥{{item.price}}</p>
          </div>
        </div>
      </transition> -->
     <div class="gift-pop" v-if="showGreet">
       <div class="pop-top">
         <div class="sl">送礼</div>
         <div class="close" @click="closeGiftPop">×</div>
       </div>
       <p class="choose">选择礼物</p>
       <ul class="list">
         <li @click="chooseGift(item, n)" :class="{active: chooseIndex == n}" class="item" v-for="(item, n) in giftList" :key="n">
           <img :src="item.image" alt="">
           <!--<div>{{giftType==2?item.name:item.name+item.stock+''+item.standard}}</div>-->
           <div>{{item.name}}</div>
           <div>￥{{item.price.toFixed(2)}}</div>
         </li>
       </ul>
       <div class="qty-box">
         <div style="color: #ebe9f0">送出数量</div>
         <div class="qty">
           <i class="icon" @click="subGift">-</i>
           <span>{{giftQty}}</span>
           <i class="icon" @click="addGift">+</i>
         </div>
       </div>
       <div class="buy-btn" @click="sendGift()">购买礼物(￥{{giftQty*choosePrice.toFixed(2)}})</div>
     </div>
      <div v-if="isMy == 'other'" class="bottom">
        <mt-button size="large" type="primary" @click.native.stop="greet">{{isGreeted==1?"发消息":"打招呼"}}</mt-button>
      </div>
    </div>
    <div class="preview" v-show="isShow" @click="hidePreview">
      <div class="preview__bg"></div>
      <div class="preview__pic" >
        <img ref="preview" src="" alt="">
        <div v-show="preImgIsLoading" class="preview__loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { MessageBox, Indicator, Toast } from 'mint-ui'
import store from '@/store/'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isShow: !1,
      isMy: '', // my,other 是否是自己:用来控制部分信息显示
      preImgIsLoading: !0,
      title: '',
      showGreet: !1,
      giftQty: 1,
      chooseIndex: 0,
      choosePrice: 0,
      chooseItem: {},
      userInfoData: {},
      giftList: [],
      id: 0,// 用户ID
      type: 1,
      token: localStorage.getItem('token'),
      websocket: null,
      isGreeted: 0, // 是否打过招呼
      isInTab:1, //是否在当前酒吧 0：否  1：是
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      barInfo: state => state.user.barInfo
    })
  },
  methods: {
    /**
     * 发送霸屏礼物效果
     * @param orderId
     * @param groupId
     */
    sendShowGift (orderId) {
      let groupId = this.barInfo.bar.id
      if (orderId == null || orderId == '') {
        MessageBox('订单ID为空！')
        return
      }
      this.$get('/mch/order/addShowGift', {
        orderId,
        groupId,
        'APP-Token': localStorage.getItem('token')
      }).then(res => {

      })
    },
    /**
     * 查询是否打过招呼
     * @param deliveryUser
     */
    isGreet (deliveryUser) {
      // let groupId = this.barInfo.bar.id
      if (deliveryUser == null || deliveryUser == '') {
        MessageBox('朋友ID不能为空！')
        return
      }
      this.$get('/mch/order/isGreet', {
        deliveryUser,
        'APP-Token': localStorage.getItem('token')
      }).then(res => {
        if (res.ret === 0) {
          this.isGreeted = 1 // 打过招呼
        } else {
          this.isGreeted = 0 // 没有打过招呼
        }
      })
    },
    linkTo (path, item, orderId) {
      if (path == 'greet') {
        this.$router.push({
          path: `/greet?type=${this.type}&id=${this.id}`
        })
      } else {
        MessageBox.confirm('是否出现霸屏展示?').then(action => {
          // 确认霸屏
          this.sendShowGift(orderId)
        })
        this.send(item)
        Toast(`送出${item.name}成功！`)
        this.toChat()
      }
    },
    // 微信支付
    wxpay (res, path, item) {
      let self = this
      let orderId = res.extend.orderId
      const {appId, timeStamp, nonceStr, signType, paySign} = res.data.payParams
      function onBridgeReady () {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': appId,
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': res.data.payParams.package,
            'signType': signType,
            'paySign': paySign
          },
          function (res) {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              self.linkTo(path, item, orderId)
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
    receive (type) { // 1:收到，2：打出的招呼
      this.type = type
      const source = type == 2 ? 5 : 6
      const text = type == 2 ? '查看打出的礼物' : '查看收到的礼物'
      const data = {
        'APP-Token': this.token,
        type: 'other',
        viewUserId: this.id,
        direction: this.type == 1 ? 'from' : 'to'
      }
      Indicator.open()
      this.$get('/user/greeting', data).then(res => {
        Indicator.close()
        if (res.ret === -2) {
          // 未支付
          MessageBox.confirm('查看礼物需要支付10元，确定支付?').then(action => {
            // source：1-打招呼，2-表示，3-请TA喝酒, 5-查看打出招呼，6-查看被打的招呼
            this.$post(`/pay/create_order/${source}?amount=0.01&deliveryUserId=${this.id}&goodName=${text}&description="查看礼物"`, {
              'APP-Token': this.token
            }).then(res => {
              // this.wechatpay(res)
              this.wxpay(res, 'greet')
            })
          })
        } else {
          this.$router.push({
            path: `/greet?type=${this.type}&id=${this.id}&isMy=${this.isMy}`
          })
        }
      })
    },
    greet (item) {
      //如果对方不在当前酒吧提示
      if(this.isInTab == 0){
        MessageBox('对方不在当前酒吧，暂不能操作!')
        return
      }

      if ( this.isGreeted==1 ) { // 发消息：直接跳转私聊界面
        this.toChat() // 跳转至聊天界面
      } else { // 打招呼
        if (this.giftList && this.giftList.length > 0) {
          this.showGreet = !0
          return
        }
        Indicator.open()
        this.$get(`/mch/gift/greet`, {'APP-Token': this.token}).then(res => {
          Indicator.close()
          if (res.ret === 0) {
            this.showGreet = !0
            this.giftList = res.data.records
          }
        })
      }
    },
    preImage (event) {
      this.isShow = !0
      let imgUrl = event.target.src
      this.$refs.preview.src = imgUrl
      this.preImgIsLoading = !0
      const image = new Image()
      image.onload = () => {
        this.preImgIsLoading = !1
        this.$refs.preview.src = imgUrl
      }
      image.src = imgUrl
    },
    hidePreview () {
      this.$refs.preview.style.transform = 'scale3d(1, 1, 1)'
      this.isShow = !1
    },
    closeGiftPop() {
      this.showGreet = !1;
      this.giftQty = 1;
    },
    chooseGift(item, n){
      this.giftQty = 1;
      this.chooseIndex = n;
      this.choosePrice = item.price;
      this.chooseItem = item;
    },
    subGift() {
      if(this.giftQty <= 1){
        return;
      }
      this.giftQty--;
    },
    addGift() {
      this.giftQty++;
    },
    sendGift () {
      if (this.chooseItem.price == 0) {
        this.$get(`/user/freeGreeting?deliveryUserId=${this.id}&goodsId=${this.chooseItem.id}`, {
          'APP-Token': this.token
        }).then(res => {
          // 调用IM 传入到聊天消息里
          this.send(this.chooseItem)
          this.toChat()
        })
      } else {
        // source：1-打招呼，2-表示，3-请TA喝酒, 5-查看打出招呼，6-查看被打的招呼
        this.$post(`/pay/create_order/1?num=${this.giftQty}&amount=${this.giftQty}&deliveryUserId=${this.id}&goodName=${this.chooseItem.name}&description=${this.chooseItem.description}&goodsId=${this.chooseItem.id}`, {
          'APP-Token': this.token
        }).then(res => {
          this.wxpay(res, 'chat', this.chooseItem)
        })
      }
    },
    toChat () {
      this.$router.push({
        path: '/chat',
        query: {
          id: this.id,
          nickname: this.userInfoData.nickname
        }
      })
    },
    initWebSocket () {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage
      // //连接成功
      this.websocket.onopen = this.setOnopenMessage
      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage
      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage () {
      console.log('WebSocket连接发生错误' + '   状态码：' + this.websocket.readyState)
    },
    setOnopenMessage () {
      console.log('WebSocket连接成功' + '   状态码：' + this.websocket.readyState)
    },
    setOnmessageMessage (event) {
      console.log('服务端返回：' + event.data)
    },
    setOncloseMessage () {
      console.log('WebSocket连接关闭' + '   状态码：' + this.websocket.readyState)
    },
    onbeforeunload () {
      this.closeWebSocket()
    },

    // websocket发送消息
    send (data) {
      let extras = {'avatar': '' + this.userInfo.avatar + ''}
      let obj = {}
      obj.chatType = 2 // 0=未知 1=公聊 2=私聊
      obj.msgType = 6 // 0=文本 1=图片 2=语音 3=视频 4=音乐 5=图文 6=订单（礼物、打招呼等） 7=表情
      obj.createTime = +new Date()
      obj.avatar = this.userInfo.avatar
      obj.extras = extras
      obj.nickname = this.userInfo.nickname
      let content = {}
      Object.assign(content, {
        image: '',
        giftName: data.name,
        id: '',
        giftPrice: data.price
      }, data)
      let message = {
        type: 'message',
        token: this.token,
        from: this.userInfo.id,
        to: this.id,
        cmd: 11,
        content,
        ...obj
      }
      this.websocket.send(JSON.stringify(message))
    },
    closeWebSocket () {
      this.websocket.close()
    }
  },
  mounted () {
    this.token = localStorage.getItem('token')
    // this.token = '7679ee4d-d459-48ff-a099-3b03c2af68ea'
    this.id = this.$route.query.id // 用户ID
    this.title = this.$route.query.tabNum ? this.$route.query.tabNum + '台' : ''

    let groupId = this.barInfo.bar.id
    let wsURL = 'ws:47.111.41.121:28888?token=' + this.token + '&groupId=' + groupId
    this.websocket = new WebSocket(wsURL)
    this.initWebSocket()

    Indicator.open()
    if (this.id == this.userInfo.id ) {
      this.isMy = 'my'
    } else {
      this.isMy = 'other'
    }

    this.$get(`/user/userInfo`, {userId: this.id, 'APP-Token': this.token}).then(res => {
      Indicator.close()
      if (res.ret === 0) {
        this.userInfoData = res.data || {}
        this.isGreet(this.id) // 查询是否已经打过招呼
      }
    })

    // 查询对手是否在在线（是否在座位上）
    this.$get(`/mch/tab/isInTab`, {
      'APP-Token': this.token,
      'reciverUserId': this.id
    }).then(res => {
      Indicator.close()
      if (res.ret === 0) {
        // 在座位上
        if(res.data.userTab.mchName != barInfo.bar.name){
          this.isInTab = 0;
        }
      } else {
        this.isInTab = 0;
      }
    })
  }
}
</script>
<style lang="scss">
.gift-pop{
  position: fixed;
  bottom: 0;
  z-index: 999;
  width: 7.5rem;
  /*background: #fff;*/
  background: #535bce;
  font-size: .3rem;
  border-radius: .2rem .2rem 0 0;
  .pop-top{
    display: flex;
    justify-content: space-between;
    padding: .1rem .2rem;
    color: #fff;
    .sl{
      margin-top: .1rem;
    }
    .close{
      width: .5rem;
      text-align: center;
      font-size: .5rem;
      color: #967AF1;
    }
  }
  .choose{
    color: #fff;
    padding: .2rem;
  }
  .list{
    padding: .2rem;
    text-align: center;
    display: flex;
    overflow-x: auto;
    color: #fff;
    .item{
      width: 1.6rem;
      flex: none;
      img{
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border: 2px solid transparent;
      }
      div,p{
        padding: .05rem;
        font-size: .24rem;
      }
    }
    .active{
      img{
        border-color: #967AF1;
      }
      div{
        color: #967AF1;
      }
    }
  }
  .qty-box{
    display: flex;
    justify-content: space-between;
    padding: .2rem;
    &>div{
      line-height: .6rem;
    }
    .qty{
      width: 2rem;
      height: .6rem;
      background: #967AF1;
      border-radius: .3rem;
      line-height: .6rem;
      display: flex;
      justify-content: space-around;
      text-align: center;
      span{
        width: .8rem;
        background: #EAE4FC;
      }
      .icon{
        width: .6rem;
        color: #fff;
      }
    }
  }
  .buy-btn{
    margin: .2rem auto;
    width: 6rem;
    height: 1rem;
    line-height: 1rem;
    background: #967AF1;
    border-radius: .5rem;
    text-align: center;
    color: #fff;
  }
}
.counter-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  background: url(../assets/images/chatbg.png) no-repeat;
  background-size: cover;
}
.user-wrap1{
  margin-bottom: 1.2rem;
  font-size: .3rem;
  color: #fff;
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
  .user-box1-1{
    text-align: center;
    width: 7.1rem;
    margin: auto;
    p{
      text-align: center;
      margin: 0 0 0;
    }
  }
  .user-box2{
    box-sizing: border-box;
    width: 7.1rem;
    margin: auto;
    padding: .2rem;
    p{
      margin: 0 0 .5rem;
    }
  }
  .user-box3{
    margin: .3rem auto;
    width: 7.1rem;
    display: flex;
    justify-content: space-between;
    button{
      width: 3.4rem;
      height: .8rem;
      text-align: center;
      line-height: .8rem;
      border-radius: .08rem;
    }
  }
  .user-box4{
    margin: auto;
    padding: .2rem;
    width: 7.1rem;
    box-sizing: border-box;
    p{
      margin: 0 0 .3rem;
      // background: url(../assets/images/love-icon.png) left center no-repeat;
      background-size: contain;
    }
    .biaoqian{
      display: flex;
      flex-wrap: wrap;
      span{
        padding: .13rem .2rem;
        margin: .2rem;
        border-radius: .08rem;
        font-size: .26rem;
      }
    }
  }
}
.greet{
  position: fixed;
  left: 0;
  bottom: 1.2rem;
  width: 6.3rem;
  padding: .2rem .6rem;
  border-top: 1px solid #ddd;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: #0D111F;
  color: #fff;
  .send-list{
    margin: .2rem;
    text-align: center;
    font-size: .22rem;
    img{
      width: .8rem;
      height: .8rem;
    }
  }
  .large{
    margin-right: .4rem;
    margin-left: .4rem;
  }
}
.bottom{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9;
  padding: .2rem;
  width: 7.1rem;
  button{
    height: .8rem;
  }
}
.slideup-enter-active,.slideup-leave-active{
    transition: all .3s ease-in-out;
}
.slideup-enter,.slideup-leave-to{
    transform: translate3d(0,100%,0);
}

.preview{
  .preview__bg{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 1);
    color: #fff;
    z-index: 99;
  }
  .preview__pic{
    position: fixed;
    top: 50%;
    left: 50%;

    width: 100%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 100;

    img{
      display: block;
      width: 100%;
      transform: scale(1);
      transition: transform .2s linear;
    }

    .preview__loading{
      position: absolute;
      top: 50%;
      left: 50%;

      width: 0.4rem;
      height: 0.4rem;

      margin-left: -0.2rem;
      margin-top: -0.2rem;

      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");

      background-position: 0 0;
      background-size: contain;
      background-repeat: no-repeat;

      animation: spin 1s steps(12, end) infinite;
    }
  }
}
</style>
