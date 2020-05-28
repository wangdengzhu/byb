<template>
  <div class="wrap">
    <div class="file-con">
      <div>
        <img v-if="!avatar.length" src="../assets/images/camera.png">
        <img v-else :src="avatar">
        <i></i>
      </div>
      <input class="file" type="file" id="file" accept="image/*" @change="upload">
    </div>
    <div class="tips">头像请用本人照片</div>
    <div>
      <div class="input-box"></div>
      <mt-field class="my-input font-3 required" label="昵称" type="text" v-model="nickname" :attr="{ maxlength: 16 }" placeholder="请输入昵称"></mt-field>
      <div class="input-box"></div>
      <mt-field class="my-input font-3 required" label="手机号" type="tel" v-model="phone" :attr="{ maxlength: 11 }" placeholder="请输入手机号"></mt-field>
      <div class="input-box"></div>
      <!--<mt-field class="my-input font-3 required" label="性别" v-model="gender" placeholder="请选择" :attr="{disabled: true}"></mt-field>-->
      <div @click="showSexDlg">
        <mt-field class="my-input font-3 required" label="性别" v-model="gender" placeholder="请选择"></mt-field>
      </div>
      <div class="input-box"></div>
      <mt-field class="my-input font-3 required" label="验证码" type="tel" v-model="code" :attr="{ maxlength: 6 }" placeholder="请输入短信验证码">
        <span class="send-code" :class="codeState == 3 ? 'disabled':''" @click="sendCode">{{codeTxt}}</span>
      </mt-field>
      <div class="input-box"></div>
      <mt-field class="my-input" label="兴趣爱好" v-model="interest" placeholder="请输入兴趣爱好"></mt-field>
      <div class="input-box"></div>
      <div @click="showCityDlg">
        <mt-field class="my-input" label="地区" v-model="city" placeholder="请选择" :attr="{disabled: true}"></mt-field>
      </div>

      <div class="input-box"></div>
      <div class="input-box"></div>
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

      <div class="picker-wrap" v-show="showSex">
        <transition name="slide-down">
          <div class="picker-cnt">
            <div class="txt-btn-wrap">
              <span class="txt-btn cancel" @click="hideSexDlg">取消</span>
              <span class="txt-btn ok" @click="cnfrmSex">确认</span>
            </div>
            <mt-picker :slots="sexSlots" @change="onSexChange" :visible-item-count="5"></mt-picker>
          </div>
        </transition>
      </div>

    </div>
    <div class="page-button-group">
      <mt-button size="large" type="primary" :class="{ 'disabled-btn': !btnGo }" @click="submit">完成</mt-button>
    </div>
    <div class="cropper-wrap" v-show="showCropper">
      <vueCropper
          ref="cropper"
          :img="imgOption.img"
          :autoCrop="imgOption.autoCrop"
          :autoCropWidth="imgOption.autoCropWidth"
          :autoCropHeight="imgOption.autoCropHeight"
          :fixedBox="imgOption.fixedBox"
          :canMoveBox="imgOption.canMoveBox"
          :full="imgOption.full"
          :canScale="imgOption.canScale"
      ></vueCropper>
      <div class="btn cancel-btn" @click="cancel">取消</div>
      <div class="btn ok-btn" @click="saveAvatar">使用</div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import EXIF from 'exif-js'
import { compressImg, dataURLtoBlob } from '@/utils/imageManage'
import { Indicator, Toast, MessageBox, Radio} from 'mint-ui'
import address from '@/utils/city'
import { mapMutations } from 'vuex'
const MAX_NUM = 5
const MAX_IMG_SIZE = MAX_NUM * 1024 * 1024
export default {
  components: {VueCropper},
  data () {
    return {
      wxUser: null, // 微信用户信息
      nickname: '',
      avatar: '', // 用户信息
      openId: '', // 微信ID
      gender: 0, // 性别
      genderValue: '', // 性别
      phone: '',
      code: '',
      codeState: 1,
      countNum: 60,
      timer: null,
      interest: '',
      city: '',
      showCity: !1,
      showSex: !1,
      sexSlots: [
        {
          flex: 1,
          values: ['男', '女'],
          className: 'slot1',
          textAlign: 'right'
        }
      ],
      addressSlots: [
        {
          flex: 1,
          values: Object.keys(address),
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: ['北京'],
          className: 'slot3',
          textAlign: 'center'
        }
      ],
      sexSlots: [
        {
          flex: 1,
          values: ['男','女'],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      addressProvince: '北京',
      addressCity: '北京',
      btnGo: !1,
      showCropper: !1,
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
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    upload (e) {
      Indicator.open('加载中...')
      // 上传图片
      let file = e.target.files[0]
      this.upImgName = file.name
      let self = this
      if (file.size > MAX_IMG_SIZE) {
        Indicator.close()
        Toast('图片不能大于' + MAX_NUM + 'M')
        return
      }

      let orientation = 0
      EXIF.getData(file, function () {
        EXIF.getAllTags(this)
        orientation = EXIF.getTag(this, 'Orientation')
      })
      let quality = 0.1
      let reader = new FileReader()
      reader.onload = (e) => {
        let img = new Image()
        let result = e.target.result
        img.addEventListener('load', callback, false)
        img.src = result
        function callback (e) {
          let newData = compressImg(img, {orientation, quality}) // 压图
          self.showCropper = !0
          self.imgOption.img = newData
          setTimeout(() => {
            Indicator.close()
          }, 0)
        }
      }
      reader.readAsDataURL(file)
    },
    onValuesChange(picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
    },
    saveAvatar () {
      Indicator.open('保存中...')
      this.cancel()
      let self = this
      let imageData = new FormData()
      this.$refs.cropper.getCropData((data) => {
        // 获取图片的 Orientation
        let orientation = 0
        EXIF.getData(data, function () {
          EXIF.getAllTags(this)
          orientation = EXIF.getTag(this, 'Orientation')
        })
        let quality = 0.1
        // do something
        let img = new Image()
        img.addEventListener('load', callback, false)
        img.src = data
        function callback (e) {
          let newData = compressImg(img, {orientation, quality}) // 压图
          let blob = dataURLtoBlob(newData) // 转为Blob对象
          imageData.append('imagefile', blob, self.upImgName)

          self.$post('/file/uploadImage', imageData).then(res => {
            Indicator.close()
            img = null
            if (res.ret === 0) {
              self.avatar = res.data[0].url
            } else {
              Toast('上传失败！')
            }
          })
        }
      })
    },
    /**
     * 性别改变事件
     */
    sexCheck () {
      console.log("变更了性别：" + this.gender)
    },
    cancel () {
      document.querySelector('.file').value = ''
      this.showCropper = !1
    },
    startUploadImage (image) {
      const formData = new FormData()
      formData.append('file', image)
      console.log(image)
      // 上传图片
      Indicator.open('上传中')
      this.$post('/file/uploadImage', formData).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          this.avatar = res.data[0].url
        } else {
          Toast('上传失败！')
        }
      })
    },

    getImageOrientation (image) {
      return new Promise((resolve, reject) => {
        EXIF.getData(image, function () {
          const orientation = EXIF.getTag(this, 'Orientation')
          resolve(orientation)
        })
      })
    },

    sendCode () {
      if (this.codeState === 3) {
        return
      }
      if (!this.checkPhone()) {
        return
      }
      Indicator.open('正在发送')
      let token = localStorage.getItem('token')
      this.$get('/sms/smsOfAli', {mobile: this.phone, 'APP-Token': token}).then(res => {
        Indicator.close()
        Toast(res.msg)
        if (res.ret === 0) {
          this.startCounting()
        }
      })
    },
    // 获取验证码倒计时
    startCounting () {
      const start = () => {
        this.countNum--
        if (this.countNum > 0) {
          this.timer = setTimeout(() => {
            start()
          }, 1000)
        } else {
          this.countNum = 60
          this.codeState = 2
          clearTimeout(this.timer)
        }
      }
      this.codeState = 3
      start()
    },
    // 校验手机号
    checkPhone () {
      let bool = !0
      if (this.phone.length == 0) {
        bool = !1
        Toast('请输入手机号码')
      } else if (!/^1\d{10}$/.test(this.phone)) {
        bool = !1
        Toast('请输入正确的手机号码')
      }
      return bool
    },
    // 校验验证码
    checkCode () {
      let bool = !0
      if (this.code.length == 0) {
        bool = !1
        Toast('请输入验证码')
      } else if (!/^\d{6}$/.test(this.code)) {
        bool = !1
        Toast('请输入6位验证码')
      }
      return bool
    },
    showCityDlg () {
      this.showCity = !0
    },
    onAddressChange (picker, values) {
      picker.setSlotValues(1, address[values[0]])
      this.addressProvince = values[0]
      this.addressCity = values[1]
    },
    onSexChange (picker, values) {
      picker.setSlotValues(1, address[values[0]])
      let selectSex = values[0]
      this.gender = values[0]
      console.info("选择性别："+selectSex)
    },
    hideCityDlg () {
      this.showCity = !1
    },
    showSexDlg () {
      this.showSex = !0
    },
    hideSexDlg () {
      this.showSex = !1
    },
    cnfrmAddrArea () {
      this.showCity = !1
      this.city = this.addressCity
    },
    cnfrmSex () {
      this.showSex = !1
      // this.gender = this.addressCity
    },
    submit () {
      let genderValue = 0
      if (!this.checkPhone() || !this.checkCode()) {
        return false
      }
      if (!this.avatar) {
        Toast('请设置个人头像')
        return false
      }
      if (!this.nickname) {
        Toast('请设置昵称')
        return false
      }

      if (this.gender === '' || this.gender == null) {
        Toast('请选择性别')
        return false
      }

      if (this.gender === '男') {
        this.genderValue = 1
      } else if (this.gender === '女') {
        this.genderValue = 2
      }
      const data = `avatar=${this.avatar}&nickName=${this.nickname}
      &mobile=${this.phone}&code=${this.code}&interest=${this.interest}&city=${this.city}
      &openId=${this.openId}&gender=${this.genderValue}`
      Indicator.open()
      let token = localStorage.getItem('token')
      this.$post('/regist/saveUser?APP-Token=' + token, data).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          MessageBox('注册成功，请退出重新扫码入座！')
          // this.$store.commit('SAVE_USERINFO', res.data.userInfo)
          // localStorage.setItem('token', res.data.token)
          // localStorage.setItem('openId', res.data.openId)
          // setTimeout(() => {
          //   this.$router.push({
          //     path: './index'
          //   })
          // }, 3000)
        }
      })
    },
    init () {
      this.openId = localStorage.getItem('openId')
      this.wxUser = localStorage.getItem('wxUser')
      if (this.wxUser != null ){
        // this.gender = this.wxUser.sex// 性别
      }
    }
  },
  computed: {
    codeTxt () {
      let txt = ''
      let state = this.codeState
      if (state === 1) {
        txt = '立即发送'
      } else if (state === 2) {
        txt = '重新发送'
      } else {
        txt = '重新发送(' + this.countNum + ')'
      }
      return txt
    }
  },
  watch: {
    code: {
      handler () {
        if (this.code.length == 6 && this.phone != '') {
          this.btnGo = !0
        }
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.vue-cropper {
  background: #000;
}
.cropper-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  font-size: .32rem;
  .btn {
    position: absolute;
    bottom: .32rem;
    color: #fff;
  }
  .cancel-btn {
    left: .32rem
  }
  .ok-btn {
    right: .32rem
  }
}
.crop-info {
  display: none;
}

.wrap {
  padding-bottom: 1.2rem;
  .file-con {
    position: relative;
    width: 2rem;
    height: 2rem;
    margin: 0.5rem auto;
    & > div {
      width: 2rem;
      height: 2rem;
      img {
        width: 2rem;
        height: 2rem;
      }
    }
    .file {
      width: 2rem;
      height: 2rem;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
  .nick {
    text-align: center;
    font-size: 0.32rem;
  }
  .tips {
    margin: .4rem 0;
    text-align: center;
    color: #f60;
    font-size: 0.26rem;
  }
  .input-box {
    width: 7.5rem;
    height: 0.2rem;
    background: #f0f0f0;
  }
  .text-left {
    margin: 0.8rem 0 0.2rem 0.3rem;
    font-size: 0.32rem;
  }
  .required:before{
    content: '*';
    position: absolute;
    left: 12px;
    top: 20px;
    font-size: 16px;
    color: #f00;
  }
  .my-input {
    margin-left: .1rem;
    position: relative;
  }
  .font-3{
    padding-left: 14px;
  }
  .page-button-group{
    width: 7.5rem;
  }
  .send-code{
    font-size: .28rem;
    color: #f60;
  }
  .disabled{
    color: #999
  }
  .disabled-btn{
    background: #DBDBDB;
  }
  .btnGo{
    background: #26a2ff;
  }
}
// .mint-button{
//   border-radius: 0;
// }
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
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s linear;
}
.slide-down-enter,
.slide-down-leave-to {
  transform: translate3d(0, 100%, 0);
}

</style>
