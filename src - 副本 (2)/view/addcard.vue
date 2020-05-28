<template>
  <div class="idcard-wrap">
    <section class="idcard-con">
      <div class="tips tips-icon">参保人必须上传身份证照片进行实名认证</div>
      <p class="center" style="font-size: .32rem;margin-top: .2rem">请上传二代身份证</p>
      <div class="user-box2">
        <uploader @getFiles='getImageList' @removeFiles='removeImage'></uploader>
        <p class="center">上传身份证正面(人像面)</p>
      </div>
      <div class="user-box2">
        <uploader @getFiles='getImageList' @removeFiles='removeImage' cardType=2></uploader>
        <p class="center">上传身份证反面(国徽面)</p>
      </div>
      <div class="tips" style="padding-left: .42rem">拍摄时注意光线和教具，务必保持照片清晰</div>
      <div class="btn-box">
        <mt-button class="btn-submit" type="primary" size="large" @click="submit">提交验证</mt-button>
      </div>
    </section>
  </div>
</template>

<script>
import bottom from '@/components/bottom'
import uploader from '@/components/Upload'
import { getParams } from '@/utils/common'
import { Indicator, Toast } from 'mint-ui'
export default {
  components: {bottom, uploader},
  data () {
    return {
      phone: '',
      content: '',
      imgList: [], // 已上传的图片集合
      isSubmit: false,
      imageUrlList: []
    }
  },
  methods: {
    submit () {
      this.$router.push({
        path: '/saveinfo'
      })
      return
      Indicator.open()
      let token = localStorage.getItem('token')
      let obj = {
        'APP-Token': token,
        type: type,
        content: this.content,
        image: this.imageUrlList,
        contact: this.phone
      }
      let data = getParams(obj)
      this.$get('/feed/apply?' + data).then(res => {
        Indicator.close()
        if (res.ret === 0) {
          Toast('反馈成功！')
          setTimeout(() => {
            this.$router.push({
              path: '/profile/profile'
            })
          }, 3000)
        }
      })
    },
    
    getImageList (files) {
      this.$nextTick(() => {
        let imageData = new FormData()
        for (let i = 0, len = files.length; i < len; i++) {
          this.imgList.push(files[i].src.split('base64,')[1])
          imageData.append('file', files[i].file)
        }
        // 上传图片
        let token = localStorage.getItem('token')
        this.$post('/file/uploadImage?APP-Token=' + token, imageData).then(res => {
          if (res.ret === 0) {
            this.imageUrlList = res.data.map(item => {
              return item.url
            })
          }
        })
      })
    },
    // 删除图片
    removeImage (index) {
      this.imgList.splice(index, 1)
      this.imageUrlList.splice(index, 1)
    }
  },
  created () {

  }
}
</script>
<style lang="scss">
$main-color: #ef4f4f;
.idcard-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #f0f0f0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
}
.tips{
  padding: .2rem .3rem;
  color: $main-color;
}
.tips-icon{
  padding-left: .5rem;
  margin-left: .3rem;
  background: url(../assets/images/tips.png) left center no-repeat;
  background-size: .4rem;
}
.center{
  text-align: center;
}
.idcard-con{
  font-size: .3rem;
  background-color: #fff;
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
  .user-box2{
    width: 7.1rem;
    margin: auto;
    padding: .2rem;
    p.center{
      text-align: center;
    }
  }
}
.btn-box{
  padding: .2rem 0;
}
.btn-submit{
  width: 6.8rem;
  margin: auto;
}

</style>
