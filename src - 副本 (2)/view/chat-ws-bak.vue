<template>
<div class="chat-wrap">
  <mt-header :title="title">
    <div @click="$router.go(-1)" slot="left">
      <mt-button icon="back"></mt-button>
    </div>
  </mt-header>
  <div class="chat-container"  @click="hideFooter">
    <div class="chat-list " ref="chatList" :class="{ history: historyMessage.length > 0 }">
      <div v-if="!isLoadOver" @click="loadMoreMessage" class="message-loadmore">
        <i v-if="isLoadingMore" class="icon-msg-loading"></i>
        <span v-else>加载{{ historyMessage.length > 0 ? '更多' : '历史' }}消息</span>
      </div>
      <div class="message-list " v-if="historyMessage.length">
        <ul class="ml__box">
          <li v-for="(message, idx) in historyMessage" :class="[ message.from == from ? 'self' : 'another']"  class="ml__item" :key="idx">
            <div class="ml__time" v-if="isShowMsgTime(message, idx, historyMessage)">
              <span class="ml__time-txt">{{formatMsgTime(message)}}</span>
            </div>
            <div class="ml__cnt">
              <img @click="navToInfo(message)"  :src="[ message.from == from ? myAvatar : typeof message.extras == 'string' ? JSON.parse(message.extras).avatar : message.extras.avatar]" class="ml__avatar">
              <span v-if="message.msgType==msgType.TEXT" class="ml__txt" v-html="emotionParse(message.msgContent)"></span>
              <div v-else-if="message.msgType==msgType.IMG" class="ml__pic" @click="showPreview(message)">
                <img :src="message.content">
              </div>
              <div class="ml__pic pic_order" v-else-if="message.msgType==msgType.ORDER">
                <span v-if="(typeof message.content == 'string' ? JSON.parse(message.content).giftPrice>0 : message.content.giftPrice>0) && message.from == from && message.purpose != 'face'">送出</span>
                <img :src="typeof message.content == 'string' ? JSON.parse(message.content).image : message.content.image">
                <span v-if="(typeof message.content == 'string' ? JSON.parse(message.content).giftPrice>0 : message.content.giftPrice>0) && message.from != from" @click="toMyGift">进入“我的礼物”查看</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="message-list">
        <ul class="ml__box">
          <li v-for="(message, idx) in messageList" :class="[ message.from == from ? 'self' : 'another']"  class="ml__item" :key="idx">
            <template>
              <div class="ml__time" v-if="isShowMsgTime(message, idx, messageList)">
                <span class="ml__time-txt">{{formatMsgTime(message)}}</span>
              </div>
              <div class="ml__cnt">
                <div class="ml__cnt-box">
                  <img @click="navToInfo(message)" :src="[message.from == from ? myAvatar : typeof message.extras == 'string' ? JSON.parse(message.extras).avatar : message.extras.avatar]" class="ml__avatar">
                  <span v-if="message.msgType==msgType.TEXT" class="ml__txt" v-html="emotionParse(message.content)"></span>
                  <div v-else-if="message.msgType==msgType.IMG" class="ml__pic" @click="showPreview(message)">
                    <img :src="message.content">
                    <!-- <i v-if="message.isLoading && !message.isFail" class="icon-msg-loading"></i> -->
                  </div>
                  <div class="ml__pic pic_order" v-else-if="message.msgType==msgType.ORDER">
                    <span v-if="(typeof message.content == 'string' ? JSON.parse(message.content).giftPrice>0 : message.content.giftPrice>0) && message.from == from && message.purpose != 'face'">送出</span>
                    <img :src="typeof message.content == 'string' ? JSON.parse(message.content).image : message.content.image">
                    <span v-if="(typeof message.content == 'string' ? JSON.parse(message.content).giftPrice>0 : message.content.giftPrice>0) && message.from != from" @click="toMyGift">进入“我的礼物”查看</span>
                  </div>
                </div>
              </div>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="chat-middle">
    <div @click="showGift(1)">
      <img src="../assets/images/gift-icon-color.png">
      <span>表示一下</span>
    </div>
    <div @click="showGift(2)">
      <img src="../assets/images/beer-icon.png">
      <span>请TA喝酒</span>
    </div>
  </div>
  <div class="chat-footer" style="background: #535bce;">
    <div class="cf__main" style="padding-bottom: 0px;margin-bottom: 0px">
      <div class="cf__inp">
        <input ref="messageInp" type="text" maxlength="500" v-model="messageTxt" @focus="focusHandler" @blur="blurHandler">
      </div>
      <div class="cf__btns">
        <i @click="showFooter(1)" class="btn btn-smile" :class="{active: showType == 1}"></i>
        <span @click="sendTextMsg" v-if="messageTxt.length>0" class="send-btn">发送</span>
        <i v-else @click="showFooter(2)" class="btn btn-plus" :class="{active: showType == 2}"></i>
      </div>
    </div>
    <div class="cf__bd tb1px" v-show="showType > 0" style="padding-top: 0px;">
      <div class="cf__emotion" v-show="showType == 1">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="i in emotionPageNum">
              <ul class="emotion__box">
                <li @click="emotionHandler(item)" v-for="item in emotion.slice((i-1)*29, (i-1)*29 + 29)" class="emotion__item">
                  <img :src="emotionBaseURL+item.icon" alt="">
                </li>
                <li @touchstart="emotionStart" @touchend="emotionEnd" @click="emotionDel" class="emotion__item del">
                  <span class="img"></span>
                </li>
              </ul>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="cf__menu" v-show="showType == 2" style="background: #535bce;">
        <ul class="menu__box">
          <li class="menu__item album">
            <i class="icon"></i>
            <span class="txt">相册</span>
            <input @change="imgChangeHandler" class="img-file" type="file" accept="image/*">
          </li>
          <li @click="sendDrink(7, item)" v-for="(item, i) in faceList" :key="i" class="menu__item">
            <img :src="item.image">
            <span class="txt">
              <div>{{item.name}}</div>
              <div>￥{{item.price}}</div>
            </span>
          </li>
        </ul>
      </div>
      <!-- 表示一下 -->
      <!-- <div class="cf__menu" v-show="showType == 3">
        <ul class="menu__box gift-box">
          <li @click="sendDrink(2, item)" class="menu__item" v-for="(item, n) in giftList" :key="n">
            <img :src="item.image">
            <span class="txt">{{item.name}}￥{{item.price}}</span>
          </li>
        </ul>
      </div> -->
      <!-- 请TA喝酒 -->
      <!-- <div class="cf__menu" v-show="showType == 4">
        <ul class="menu__box gift-box">
          <li @click="sendDrink(3, item)" class="menu__item" v-for="(item, n) in beerList" :key="n">
            <img :src="item.image">
            <span class="txt">{{item.name}}￥{{item.price}}</span>
          </li>
        </ul>
      </div> -->
    </div>
  </div>
  <div class="preview" v-show="isShow" @click="hidePreview">
    <div class="preview__bg" style="color:white"></div>
    <div class="preview__pic" >
      <img ref="preview" src="" alt="">
      <!-- <div v-show="preImgIsLoading" class="preview__loading"></div> -->
    </div>
  </div>
  <div class="gift-pop" v-if="isShowGiftPop">
    <div class="pop-top">
      <div class="sl">送礼</div>
      <div class="close" @click="closeGiftPop">×</div>
    </div>
    <p class="choose">选择{{giftType==2? '礼物': '酒水'}}</p>
    <ul class="list">
      <li @click="chooseGift(item, n)" :class="{active: chooseIndex == n}" class="item" v-for="(item, n) in giftList" :key="n">
        <img :src="item.image" alt="">
        <!--<div>{{giftType==2?item.name:item.name+item.stock+''+item.standard}}</div>-->
        <div>{{item.name}}</div>
        <div>￥{{item.price.toFixed(2)}}</div>
        <div>{{giftType==3?item.stock+''+item.standard:''}}</div>
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
    <div class="buy-btn" @click="buyGift(giftType)">购买{{giftType==2? '礼物': '酒水'}}(￥{{giftQty*choosePrice.toFixed(2)}})</div>
  </div>
</div>
</template>

<script>

import IM from '@/utils/im'
import bottom from '@/components/bottom'
import Swiper from 'swiper/dist/js/swiper.min'
import { emotion } from '@/utils/face'
import { Indicator, Toast, MessageBox } from 'mint-ui'
import 'swiper/dist/css/swiper.min.css'
import EXIF from 'exif-js'
import { compressImg, dataURLtoBlob } from '@/utils/imageManage'
import { mapState, mapMutations } from 'vuex'

const MAX_IMG_SIZE = 10 * 1024 * 1024 // 10MB
const NO_COMPRESS_SIZE = 0.2 * 1024 * 1024 // 200KB， 如果小于200KB，直接上传不压缩
export default {
  components: {bottom},
  data () {
    return {
      token: null, // 用户登录令牌
      loop: null,
      myNickName: '', // 我的昵称
      myAvatar: '', // 我的头像
      title: '', // 对方昵称
      im: null,
      serviceType: -1,
      messageTxt: '',
      messageList: [],
      messageIdArr: [],
      from: '',
      toId: '',
      toUserIsInTab: false, // 是否入座：true 是，false 否

      emotion: emotion,
      emotionPageNum: Math.ceil(emotion.length / 29),
      emotionBaseURL: 'https://webapi.hnjmnet.com/',
      emotionSiper: null,
      emotionMap: {},

      giftList: [], // 礼物列表
      beerList: [], // 啤酒列表
      faceList: [], // 戳一戳

      isShow: !1,
      preImgIsLoading: !0,
      isShowOrder: !1,

      showType: -1,
      historyMessage: [],
      lastMessageTime: null,
      isLoadingMore: !1,
      isLoadOver: !1,
      count: 20,
      pageNum: 1,

      msgType: {
        TEXT: 0,
        IMG: 1,
        GOODS: 'goods',
        ORDER: 6,
        CUSTOM: 'custom',
        RETRACT: 'retract'
      },

      isIMlogined: !1,
      isIMCreatedChat: !1,

      checkLoginTimer: null,

      // 礼物后面添加
      isShowGiftPop: !1,
      giftQty: 1,
      chooseIndex: 0,
      choosePrice: 0,
      chooseItem: {},
      giftType: 2, // 2:表示，3: 酒水
    }
  },
  computed: {
    ...mapState({
      isonline: state => state.user.isonline,
      userInfo: state => state.user.userInfo,
      barInfo: state => state.user.barInfo
    })
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    deleteRecord (e, message) {
      debugger
    },
    touchEnd () {
      // 手指离开
      console.log(1)
      clearTimeout(this.Loop)
    },
    touchStart (e) {
      e.preventDefault()
      let cur = e.currentTarget
      let delEle = cur.nextElementSibling
      // 手指触摸
      clearTimeout(this.Loop) //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(function () {
        console.log(1222)
        delEle.style.opacity = 1
      }, 1000)
    },
    toMyGift () {
      this.$router.push({
        path: '/mygift'
      })
    },
    navToInfo (message) {
      if (message.from == this.from) {
        return
      }
      this.$router.push({
        path: '/userinfo',
        query: {
          id: message.sendUser
        }
      })
    },
    showPreview (imgInfo) {
      this.isShow = !0
      let { content, id } = imgInfo
      this.$refs.preview.src = content
      this.preImgIsLoading = !0
      const image = new Image()
      image.onload = () => {
        this.preImgIsLoading = !1
        this.$refs.preview.src = id
      }
      image.src = id
    },

    hidePreview () {
      this.$refs.preview.style.transform = 'scale3d(1, 1, 1)'
      this.isShow = !1
    },
    initIMListener () {
      this.im.on('open', this.openHandler.bind(this))
      this.im.on('message', this.messageHandler.bind(this))
      this.im.on('close', this.closeHandler.bind(this))
      this.im.on('error', this.errorHandler.bind(this))
    },
    openHandler () {
      console.log('opened...' + new Date())
      // this.im.login()
    },
    /**
     * 接收消息
     * @param data
     */
    messageHandler (data) {
      const obj = data.data
      // this.from = 1002
      // this.startCheckLogin() // 心跳机制
      if (data.command == 6) {
        console.log('登录成功')
      }
      if (data.command == 21) { // 敏感词
        MessageBox('消息包含敏感词汇，请慎言!')
      }
      if (data.command == 11 && obj.chatType == 2) {
        console.log('私聊信息:chatType=' + obj.chatType)
        if (obj.from == this.from) {
          return
        }
        if (obj.from != this.toId) { // 私聊只能显示聊天窗口用户消息
          return
        }
        this.receivedTrueMessage(obj)
      }
    },
    async receivedTrueMessage (data) {
      if (this.messageIdArr.includes(data.id)) {
        return
      }
      // if (data && data.senderInfo && !data.senderInfo.photo) {
      //   data.senderInfo.photo = im_service_avatar
      // }

      if (data && data.msgType == 1) { // 图片
        await this.dealIMGMessage(data)
      }
      console.info('msg - data:' + data)
      console.info('msg - data:' + JSON.stringify(data))
      console.info('msg - data content:' + JSON.stringify(data.content))
      this.messageIdArr.push(data.id)
      this.messageList.push(data)
      this.adjustChatUIScroll()
    },
    dealIMGMessage (imgData) {
      return new Promise((resolve, reject) => {
        let imgURL = imgData.content
        let image = new Image()
        image.onload = () => {
          resolve('good')
          // this.adjustChatUIScroll();
        }
        image.onerror = (err) => {
          reject(err)
        }
        image.src = imgURL
      })
    },
    closeHandler () {
      console.log('websocket had closed' + new Date())
    },
    errorHandler () {
      console.log('an eroor occured')
    },
    startCheckLogin () {
      if (this.checkLoginTimer) {
        clearInterval(this.checkLoginTimer)
      }
      this.checkLoginTimer = setInterval(() => {
        this.im.heartbeat()
      }, 10000)
    },
    // 展示礼物
    showGift(t){
      this.isShowGiftPop = !0;
      // t=1 表示一下；t=2 请他喝酒
      if (t == 1) {
        this.giftType = 2
        this.giftList = []
        let purpose = 'denote'
        Indicator.open()
        // 礼物列表
        this.$get(`/mch/gift/${purpose}`).then(res => {
          Indicator.close()
          if (res.ret === 0) {
            this.giftList = res.data.records;
            if(this.giftList.length > 0){
              this.choosePrice = this.giftList[0].price;
              this.chooseItem = this.giftList[0];
            }
          }
        })
      }
      if (t == 2) {
        this.giftType = 3
        this.giftList = []
        Indicator.open()
        // 酒水列表
        this.$get(`/mch/goods/list`, {userId: this.toId}).then(res => {
          Indicator.close()
          if (res.ret === 0) {
            this.giftList = res.data.records;
            if(this.giftList.length > 0){
              this.choosePrice = this.giftList[0].price;
              this.chooseItem = this.giftList[0];
            }
          }
        })
      }
    },
    chooseGift(item, n){
      this.giftQty = 1;
      this.chooseIndex = n;
      this.choosePrice = item.price;
      this.chooseItem = item;
    },
    buyGift(type) {
      this.sendDrink(type, this.chooseItem);
    },
    closeGiftPop() {
      this.isShowGiftPop = !1;
      this.giftQty = 1;
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
    showFooter (t) {
      if (t == this.showType) {
        this.hideFooter()
        return
      }
      let token = localStorage.getItem('token')
      // t=2 相册，戳一戳表情
      if (t == 2) {
        if (this.faceList && this.faceList.lenght > 0) {
          return
        }
        Indicator.open()
        this.$get(`/mch/gift/face`, {'APP-Token': token}).then(res => {
          Indicator.close()
          if (res.ret === 0) {
            this.faceList = res.data.records
          }
        })
      }
      this.showType = t
      this.adjustChatUIScroll()
      if (t == 1 && !this.emotionSiper) {
        this.initEmotion()
      }
    },
    hideFooter () {
      this.showType = -1
    },
    /**
     * 获取历史聊天记录
     * @returns {g.a}
     */
    fetchHistoryData () {
      let token = localStorage.getItem('token')
      return this.$get('/userMessage/records', {
        'APP-Token': token,
        pageNum: this.pageNum,
        pageSize: this.count,
        reveiver: this.toId
      })
    },
    /**
     * 加载更多消息
     * */
    loadMoreMessage () {
      if (this.isLoadingMore || this.isLoadOver) {
        return
      }
      this.isLoadingMore = !0
      const scrollHeight = this.$refs.chatList.scrollHeight
      this.fetchHistoryData().then(res => {
        this.isLoadingMore = !1
        if (res.ret !== 0) {
          return
        }
        this.pageNum++
        const items = res.data.chatRecords.records
        // const reveiver = res.data.chatRecords.reveiver
        if (items.length < this.count) {
          this.isLoadOver = !0
        }
        items.reverse()
        this.historyMessage = items.concat(this.historyMessage)
        this.lastMessageTime = items[0].createTime
        setTimeout(() => {
          this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight - scrollHeight - 50
        }, 0)
      }).catch(err => {
        this.isLoadingMore = !1
        console.log(err)
      })
    },
    /**
     * 加载历史消息
     */
    loadHistoryMessage () {
      this.fetchHistoryData().then(res => {
        Indicator.close()
        if (res.ret !== 0) {
          return
        }
        this.pageNum++
        const items = res.data.chatRecords.records
        if (!items || items.length <= 0) {
          this.isLoadOver = !0
          return
        }
        if (items.length < this.count) {
          this.isLoadOver = !0
        }
        items.reverse()
        this.lastMessageTime = items[0].createTime
        this.historyMessage = items
        this.adjustChatUIScroll()
      }).catch(err => {
        Indicator.close()
        console.log(err)
      })
    },
    isShowMsgTime (message, idx, messageList) {
      if (idx == 0) {
        return !0
      }
      const theTime = this.getMsgTimestamp(message.createTime)
      const lastTime = this.getMsgTimestamp(messageList[idx - 1].createTime)
      const gap = 5 * 60 * 1000
      if (theTime - lastTime >= gap) {
        return !0
      }
      return !1
    },
    getMsgTimestamp (time) {
      if (typeof time === 'number') {
        return time
      }
      return new Date(time.replace(/-/g, '/')).getTime()
    },
    paddingZero (num) {
      return num > 9 ? num : '0' + num
    },
    formatMsgTime (message) {
      let time = this.getMsgTimestamp(message.createTime)
      let today = new Date().getDate()
      let msgTime = new Date(time)
      let msgday = msgTime.getDate()

      let msgYear = msgTime.getFullYear()
      let thisYear = new Date().getFullYear()

      let msgMonth = msgTime.getMonth()
      let thisMonth = new Date().getMonth()

      let timeStr = ''

      let hh = this.paddingZero(msgTime.getHours())
      let mm = this.paddingZero(msgTime.getMinutes())

      let m = this.paddingZero(msgTime.getMonth() + 1)
      let d = this.paddingZero(msgTime.getDate())

      if (msgYear != thisYear) {
        timeStr = `${msgYear}-${m}-${d} ${hh}:${mm}`
      } else {
        if (msgday < today || msgMonth < thisMonth) {
          timeStr = `${m}-${d} ${hh}:${mm}`
        } else {
          timeStr = `${hh}:${mm}`
        }
      }
      return timeStr
    },

    adjustChatUIScroll () {
      const scrollContainer = this.$refs.chatList
      setTimeout(() => {
        if (scrollContainer.scrollHeight > scrollContainer.clientHeight) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight + 100
        }
      }, 100)
    },

    /**
     * 聊天窗口获取焦点
     * */
    focusHandler (event) {
      let $this = event.target
      this.showType = -1
      this.adjustChatUIScroll()
      setTimeout(() => {
        this.scrollToView($this)
        this.interval = setInterval(() => {
          this.scrollToView($this)
        }, 200)
      }, 100)
    },
    blurHandler (event) {
      this.showType = -1
      this.interval && clearInterval(this.interval)
      setTimeout(function() {
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 300)
    },
    scrollToView (inp) {
      inp.scrollIntoView(true)
      inp.scrollIntoViewIfNeeded()
    },
    sendTextMsg () {
      if (!this.messageTxt) {
        return
      }
      this.sendMsg(this.msgType.TEXT, this.messageTxt)
      this.messageTxt = ''
      this.hideFooter()
    },
    sendImgMsg (imgUrl) {
      this.sendMsg(this.msgType.IMG, imgUrl)
    },
    sendMsg (type, data, isRealSend = !0) {
      let isFail = !1
      if (this.isIMCreatedChat) {
        isRealSend = !1
        isFail = !0
      }
      let extras = {'avatar': '' + this.userInfo.avatar + ''}
      const message = this.im.send(type, data, isRealSend, extras)

      if (type == this.msgType.IMG) {
        message.isLoading = !0
      }
      message.isFail = isFail
      this.saveMsg(message)
      return message
    },
    // 微信支付
    wxpay (res, item,type) {
      let self = this
      let orderId = res.extend.orderId
      let resData = res.data
      const {appId, timeStamp, nonceStr, signType, paySign} = resData.payParams
      function onBridgeReady () {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': appId,
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': resData.payParams.package,
            'signType': signType,
            'paySign': paySign
          },
          function (res1) {
            self.closeGiftPop();
            if (res1.err_msg == 'get_brand_wcpay_request:ok') {
              Toast('送出成功！')
              const option = {
                image: item.image,
                giftName: item.name,
                id: item.id,
                giftPrice: item.price
              }
              self.hideFooter()
              if (item.purpose != 'face' && type !== 3) { // 戳一戳|酒水不需要霸屏幕
                MessageBox.confirm('是否出现霸屏展示?').then(action => {
                  // 确认霸屏
                  self.sendShowGift(orderId)
                })
                self.sendMsg(self.msgType.ORDER, option)
              } else { // 戳一戳显示图片
                self.sendMsg(self.msgType.IMG, item.image)
              }
            } else {
              MessageBox('支付失败')
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
    // 送礼物
    sendDrink (type, item) {
      if (type == 7) { // type == 7 戳他会消息不需要在座位上
        this.payDrink(type, item)
      } else {
        // 查询对手是否在在线（是否在座位上）
        this.$get(`/mch/tab/isInTab`, {
          'APP-Token': this.token,
          'reciverUserId': this.toId
        }).then(res => {
          Indicator.close()
          if (res.ret === 0) {
            // 在座位上
            this.toUserIsInTab = true
            this.payDrink(type, item)
          } else {
            // 没有入座
            this.toUserIsInTab = false
            MessageBox('对方已离开酒吧，暂不能操作')
          }
        })
      }
    },
    /**
     * 支付礼物
     * */
    payDrink (type, item) {
      if (item.price > 0) {
        // 需要先微信支付
        // source：1-打招呼，2-表示，3-请TA喝酒, 5-查看打出招呼，6-查看被打的招呼, 7-独立表情礼物
        this.$post(`/pay/create_order/${type}?num=${this.giftQty}&amount=${item.price}&deliveryUserId=${this.toId}&goodName=${item.name}&description=${item.name}&goodsId=${item.id}`, {
          'APP-Token': localStorage.getItem('token')
        }).then(res => {
          if (res.ret === 0) {
            this.wxpay(res, item,type)
          } else {
            MessageBox('' + res.msg)
          }
        })
      } else {
        const data = {
          image: item.image,
          giftName: item.name,
          id: item.id,
          giftPrice: item.price
        }
        this.sendMsg(this.msgType.ORDER, data)
        this.hideFooter()
      }
    },
    /**
     * 查询对方是否入座
     * */
    userIsInTab () {
      this.$get(`/mch/tab/isInTab`, {
        'APP-Token': this.token,
        'reciverUserId': this.toId
      }).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          // 在座位上
          this.toUserIsInTab = true
        } else {
          // 没有入座
          this.toUserIsInTab = false
        }
      })
    },
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
    saveMsg (message) {
      this.messageList.push(Object.assign({
        createTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, -1),
        api: 'message'
      }, message))
      this.adjustChatUIScroll()
    },
    imgChangeHandler (event) {
      const file = event.target.files[0]
      if (!file) {
        return
      }

      const type = file.type.toLowerCase()
      if (!/gif|jpg|jpeg|png/.test(type)) {
        Toast('请选择图片或不支持该格式图片')
        return
      }

      if (file.size > MAX_IMG_SIZE) {
        Toast('上传图片不能大于10M')
        return
      }

      this.uploadImage(file)
    },

    async uploadImage (image) {
      let self = this
      let { width, height } = await this.getImageDimension(image)

      if (image.size <= NO_COMPRESS_SIZE) { // 如果图片小于规定的大小，直接提交file文件流
        this.startUploadImage(image, width, height)
        return
      }

      let orientation = await this.getImageOrientation(image)
      let reader = new FileReader()
      let quality = 0.1
      reader.onload = function (e) {
        let img = new Image()
        let result = e.target.result
        img.addEventListener('load', callback, false)
        img.src = result
        function callback (e) {
          let newData = compressImg(img, {orientation, quality}) // 压图
          // let blob = dataURLtoBlob(newData) // 转为Blob对象
          img = null
          self.startUploadImageBase64(newData, width, height, image.name)
        }
      }
      reader.readAsDataURL(image)
    },

    startUploadImage (image) {
      const formData = new FormData()
      formData.append('file', image)
      let imageURL = window.URL.createObjectURL(image)
      const message = this.sendMsg(1, imageURL, !1)
      let token = localStorage.getItem('token')
      this.$post('/file/uploadImage?APP-Token=' + token, formData).then(res => {
        message.isLoading = !1
        if (res.ret !== 0) {
          Toast('发送图片失败')
          return
        }
        let extras = {'avatar': '' + this.userInfo.avatar + ''}
        this.im.send(1, res.data[0].url, !0, extras)
      }).catch(err => {
        console.log(err)
      })

      this.hideFooter()
    },

    /**
     *
     * @param image
     */
    startUploadImageBase64 (image, width, height, name) {
      const formData = new FormData()
      formData.append('file', image)
      formData.append('fileName', name)
      console.info('->>>>>>>>>>>>>>>>>>file:' + image)
      console.info('->>>>>>>>>>>>>>>>>>filename:' + name)
      let blob = dataURLtoBlob(image) // 转为Blob对象
      let imageURL = window.URL.createObjectURL(blob)
      const message = this.sendMsg(1, imageURL, !1)
      let token = localStorage.getItem('token')
      this.$post('/file/sendImage?APP-Token=' + token, formData).then(res => {
        message.isLoading = !1
        if (res.ret !== 0) {
          Toast('发送图片失败')
          return
        }
        let extras = {'avatar': '' + this.userInfo.avatar + ''}
        this.im.send(1, res.data.url, !0, extras)
      }).catch(err => {
        console.log(err)
      })

      this.hideFooter()
    },

    getImageOrientation (image) {
      return new Promise((resolve, reject) => {
        EXIF.getData(image, function () {
          const orientation = EXIF.getTag(this, 'Orientation')
          resolve(orientation)
        })
      })
    },

    getImageDimension (imageFile) {
      return new Promise((resolve, reject) => {
        let image = new Image()
        image.src = window.URL.createObjectURL(imageFile)
        const success = () => {
          resolve({
            width: image.naturalWidth,
            height: image.naturalHeight
          })
        }
        if (image.complete) {
          success()
        } else {
          image.onload = () => {
            success()
          }
          image.onerror = (error) => {
            reject(error)
          }
        }
      })
    },
    emotionParse (txt) {
      return txt.replace(/\/[^/\s]{1,3}/g, (s) => {
        s = s.trim()
        let e = ''
        let str = ''
        for (let i = 2, len = s.length; i <= len; i++) {
          let eimg = this.emotionMap[s.slice(0, i)]
          if (eimg) {
            e = `<img src=${eimg}>`
            str = s.slice(i, len)
            break
          }
        }
        return e ? e + str : s
      })
    },

    emotionHandler (emotion) {
      this.messageTxt = this.messageTxt + emotion.value + ' '
    },

    emotionDel () {
      if (!this.messageTxt) {
        return
      }
      const text = this.messageTxt
      const re = /\/[^/]{1,3}$/
      const matches = text.match(re)
      if (matches && this.emotionMap[matches[0].trim()]) {
        this.messageTxt = this.messageTxt.replace(matches[0], '')
        return
      }
      this.messageTxt = this.messageTxt.slice(0, -1)
    },

    emotionStart () {
      if (this.startTimer) {
        clearTimeout(this.startTimer)
      }
      this.isEmotionDelStart = !0
      this.startTimer = setTimeout(() => {
        if (!this.isEmotionDelStart) {
          return
        }
        this.emotionDel()
        this.intervalTimer = setInterval(() => {
          this.emotionDel()
        }, 200)
      }, 900)
    },

    emotionEnd () {
      this.isEmotionDelStart = !1
      if (this.startTimer) {
        clearTimeout(this.startTimer)
      }
      if (this.intervalTimer) {
        clearInterval(this.intervalTimer)
      }
    },

    initEmotion () {
      this.emotionSiper = new Swiper('.swiper-container', {
        pagination: {
          el: '.swiper-pagination'
        },
        observer: !0,
        observeParents: !0
      })
    },

    createEmotionMap () {
      this.emotion.forEach(e => {
        this.emotionMap[e.value] = this.emotionBaseURL + e.url
      })
    }
  },
  mounted () {
    this.token = localStorage.getItem('token')
    this.title = this.$route.query.nickname // 对方的昵称：标题显示
    this.toId = this.$route.query.id
    this.from = this.userInfo.id
    this.myAvatar = this.userInfo.avatar // 我的头像
    this.myNickName = this.userInfo.nickname // 我的昵称
    let chatType = 2 // 私聊
    this.createEmotionMap()
    this.loadHistoryMessage()
    this.im = new IM()
    this.im.chatType = chatType
    this.im.to = this.toId
    this.im.from = this.userInfo.id // 用户ID
    // let groupId = 'a91ed8049a6043f4b5e5992446f84b44' // 酒吧ID
    let groupId = this.barInfo.bar.id // 酒吧ID
    this.im.getSevicer(chatType, this.userInfo.id, groupId).then(() => {
      this.initIMListener()
    })
    // 点击聊天窗口设置消息为已读
    this.$get('/userMessage/readMyMsg', {reveiver: this.toId}).then(res => {
      if (res.ret === 0) {
        console.log('点击聊天窗口设置消息为已读')
      }
    })
  },
  destroyed () {
    this.im.destory(!1)
  }
}
</script>
<style scoped lang="scss">
@import '../assets/css/mixins';

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

body{
  user-select:none;
}
*{
  -webkit-touch-callout: none;
}
@define-extend center{
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-wrap {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  font-size: .3rem;
  overflow: auto;
  overflow-x: hidden;
}
.chat-container{
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.4rem 0.32rem 0;
  padding-top:0;
  // background-image: radial-gradient(circle at center top,#f38aee,#00b8ff);
  // background: #cc6172;
  background: url(../assets/images/chatbg.png) no-repeat;
  background-size: cover;
}
.chat-list{
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &.history{
    padding-top: 0;
    .ml__item{
      margin-top: .3rem;
    }
  }
  .message-loadmore{
    position: relative;
    padding-top: .2rem;
    padding-bottom: 0.1rem;
    color: #49A0FF;
    font-size: 0.26rem;
    text-align: center;
    line-height: 0.37rem;
    .icon-msg-loading{
      position: static;
      display: inline-block;
    }
  }
}
.icon-msg-loading{
  position: absolute;
  top: 50%;
  left: -0.52rem;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  background: url(../assets/images/icon-loading.png) 0 0/ 16px 16px no-repeat;
  animation: spin1 1s steps(9, end) infinite;
}
.message-list{
  border-bottom: 1px solid transparent;
  .ml__item{
    margin: 0.5rem 0;
    .ml__time{
      text-align: center;
      margin-bottom: 0.4rem;
      .ml__time-txt{
        display: inline-block;
        height: 0.4rem;
        line-height: 0.4rem;
        border-radius: 0.22rem;
        padding: 0 0.15rem;
        font-size: 0.22rem;
        color: #fff;
      }
    }
    .ml__cnt{
      display: flex;
      .ml__cnt-box{
        position: relative;
        display: flex;
      }
      .icon-msg-fail{
        position: absolute;
        top: 50%;
        left: -26px;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        background: url(../assets/images/chat/icon-fail.png) 0 0/contain no-repeat;
        &:after{
          content: '';
          position: absolute;
          top: -8px;
          right: -8px;
          bottom: -8px;
          left: -8px;
        }
      }
      .ml__avatar{
        width: 0.78rem;
        height: 0.78rem;
        border-radius: 50%;
      }
      .ml__txt{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        position: relative;
        max-width: 4.5rem;
        margin-left: 0.2rem;
        line-height: 0.4rem;
        padding: 0.2rem 0.24rem;
        border: 1px solid #e5e5e5;
        border-radius: 0.2rem;
        color: #333;
        font-size: 0.3rem;
        background-color: #fff;
        box-sizing: border-box;
        word-break: break-all;
        white-space: pre-wrap;
        &>>>img{
          display: inline-block;
          width: 0.46rem;
          height: 0.46rem;
          vertical-align: middle;
        }
      }
      .ml__sessionend{
        display: block;
        width: 100%;
        line-height: 0.37rem;
        color: #666;
        font-size: 0.26rem;
        text-align: center;
      }
      .ml__txt:before{
        content: '';
        position: absolute;
        top: 0.21rem;
        width: 0.13rem;
        height: 0.14rem;
      }
      .ml__pic{
        position: relative;
        max-width: 2.2rem;
        margin-left: 0.2rem;
        order: 1;
        img{
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          border-radius: 0.1rem;
        }
      }
      .pic_order{
        max-width: 5rem;
        font-size: .24rem;
        color: #fff;
        img{
          max-width: 1.2rem;
          max-height: 2rem;
          display: inline-block;
          vertical-align: middle;
        }
        img + span{
          color: blue;
        }
      }
    }
    &.self .ml__pic{
      margin-right: 0.2rem;
      margin-left: 0;
    }
    &.another .ml__txt:before{
      left: -0.13rem;
      background: url(../assets/images/chat/icon-small-arrow-left.png) 0 0/contain no-repeat;
    }
    &.self .ml__cnt{
      justify-content: flex-end;
      .ml__avatar{
        order: 2;
      }
      .ml__txt{
        order: 1;
        margin-left: 0;
        margin-right: 0.2rem;
        color: #333;
        background-color: #fff;
        border-color: #fff;
      }
      .ml__txt:before{
        right: -0.13rem;
        background: url(../assets/images/chat/icon-small-arrow-left1.png) 0 0/contain no-repeat;
      }
      .delete_text{
        opacity: 0;
        height: .6rem;
        margin: 0 0.2rem;
        line-height: 0.4rem;
        padding: 0.2rem 0.24rem;
        border-radius: 0.2rem;
        font-size: 0.24rem;
        box-sizing: border-box;
        word-break: break-all;
        white-space: pre-wrap;
        background: #000;
        border: 0;
        color: #fff;
        padding: .1rem .2rem;
      }
    }
    .ml__cb.box{
      width: 100%;
      padding-top: 0.28rem;
      border-radius: 0.1rem;
      background-color: #fff;
    }
    .ml__comment{
      display: flex;
      margin-top: 0.4rem;
      padding: 0.24rem;
      border-radius: 0.1rem;
      background-color: #fff;
      width: 100%;
      .mlc__item{
        flex: 1;
        text-align: center;
      }
      .comment-icon{
        display: block;
        width: 0.48rem;
        height: 0.48rem;
        margin: 0 auto;
        background-position: 0 0;
        background-size: contain;
        background-repeat: no-repeat;
      }
      @each $icon in laugh, smile, normal, cry {
        .comment-icon.#{$icon}{
          background-image:url('../assets/images/chat/icon-mark-#{$icon}.png');
        }
        .comment-icon.#{$icon}.active{
          background-image: url('../assets/images/chat/icon-mark-#{$icon}-active.png');
        }
      }
      .comment-txt{
        margin-top: 0.08rem;
        color: #666;
        font-size: 0.22rem;
      }
      .comment-icon.active + .comment-txt{
        color: $main-color;
      }
    }
    .ml__cb.box, .ml__comment{
      width: calc(100vw - .62rem);
    }
    .ml__cb.box.fail{
      width: calc(100vw - .62rem - 28px);
    }
  }
}

.chat-footer{
  position: relative;
  z-index: 20;
  background-color: #fff;
  .cf__main{
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 1.2rem;
    padding: 0 0.32rem;
    background: #535bce;
  }
  .cf__bd{
    height: 3.6rem;
    border-top: 1px solid #e5e5e5;
  }
}
.cf__inp{
  width: 5.1rem;
  padding: 0 0.24rem;
  border-radius: 0.38rem;
  background-color: #293074;
  box-sizing: border-box;
  input{
    width: 100%;
    height: 0.4rem;
    line-height: 0.4rem;
    padding: 0.19rem 0;
    color: #fff;
    font-size: 0.28rem;
    vertical-align: top;
  }
}
.cf__btns{
  display: flex;
  margin-left: 0.22rem;
  .btn{
    display: block;
    width: 28px;
    height: 28px;
    background-size: contain;
    background-repeat: no-repeat;
    &.btn-smile{
      background-image: url(../assets/images/chat/icon-smile.png);
      &.active{
        background-image: url(../assets/images/chat/icon-smile-active.png);
      }
    }
    &.btn-plus{
      margin-left: 20px;
      background-image: url(../assets/images/chat/icon-plus.png);
      &.active{
        background-image: url(../assets/images/chat/icon-plus-active.png);
      }
    }
  }
  .send-btn{
    width: 40px;
    height: 28px;
    line-height: 29px;
    background-color: #293074;
    border-radius: 4px;
    color: #fff;
    font-size: 0.26rem;
    text-align: center;
    margin-left: 14px;
    margin-right: -6px;
  }
}
.cf__menu{
  .menu__box{
    display: flex;
    padding: 0.4rem 0.4rem 0.32rem;
  }
  .gift-box{
    flex-wrap: wrap;
  }
  .menu__item a .txt {
    color: #333;
  }
  .menu__item{
    position: relative;
    // width: 1rem;
    margin: 0 .15rem;
    text-align: center;
    font-size: 0.24rem;
    .icon{
      display: block;
      width: 0.82rem;
      height: 0.82rem;
      margin: 0 auto 0.08rem;
      background-repeat: no-repeat;
      background-size: contain;
    }
    &.album .img-file{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.01;
    }
    &.album .icon{
      background-image: url(../assets/images/chat/icon-album.png);
    }
    &.camera .icon{
      background-image: url(../assets/images/chat/icon-camera.png);
    }
    &.order .icon{
      background-image: url(../assets/images/chat/icon-order.png);
    }
    &.call .icon {
      background-image: url(../assets/images/chat/icon-call.png);
    }
    // &:first-of-type{
    //   margin-left: 0;
    // }
    img{
      display: block;
      height: 0.82rem;
      margin: 0 auto 0.08rem;
    }
  }
}
.chat-box{
  padding-top: 0.28rem;
  border: 1px solid #e5e5e5;
  margin-top: 0.4rem;
  border-radius: 0.1rem;
  background-color: #fff;
}
.cb__hd{
  display: flex;
  justify-content: space-between;
  padding: 0 0.24rem 0.2rem;
  margin-top: -0.04rem;
  font-size: 0.22rem;
  .time{
    color: #999;
  }
}
.cb__cnt{
  display: flex;
  padding: 0  0.24rem 0.28rem;
  .cb__pic{
    width: 1.4rem;
    height: 1.4rem;
    background-color: #fff;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .cb__info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    width: 1%;
    line-height: 0.34rem;
    margin-left: 0.24rem;
    font-size: 0.24rem;
    .cb__tit{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      overflow : hidden;
    }
  }
}
.cb__btn{
  height: 0.7rem;
  line-height: 0.7rem;
  border-top: 1px solid #e5e5e5;

  font-size: 0.24rem;
  color: #ccc;
  text-align: center;

  &.active{
    color: #49A0FF;
  }
}

@keyframes spin{
  100%{
    transform: rotate(360deg);
  }
}
@keyframes spin1{
  100%{
    transform: rotate(360deg);
  }
}

.cf__emotion{
  height: 100%;
  .emotion__box{
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    align-content: space-between;
    overflow: hidden;
    padding: 0.28rem 0.32rem 0.5rem;
    box-sizing: border-box;
  }
  .emotion__item{
    width: 10%;
    margin: .2rem 0;
    overflow: hidden;
    img,.img{
      display: block;
      width: 0.5rem;
      height: 0.5rem;
      margin: 0 auto;
      pointer-events: none;
    }
    &.del{
      user-select: none;
      .img{
        background: url(../assets/images/chat/icon-emotion-del.png) 0 0/contain no-repeat;
      }
    }
  }
}

.chat-middle{
  position: absolute;
  right: -1px;
  top: .8rem;
  div{
    margin: .1rem 0;
    padding: .1rem;
    border: 1px solid #ddd;
    border-radius: .3rem 0 0 .3rem;
    background-image: radial-gradient(circle at center top,#e063da,#621bd4);
    color: #fff;
    img{
      width: .4rem;
      height: .4rem;
      vertical-align: middle;
    }
    span{
      font-size: .3rem;
      vertical-align: middle;
    }
  }
}
.preview{
  .preview__bg{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 1);
    z-index: 30;
  }
  .preview__pic{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 31;
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
.mint-header{
  background: #5e1d98;
  color: #fff;
}
</style>
