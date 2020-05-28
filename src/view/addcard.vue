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
        <uploader @getFiles='getImageList1' @removeFiles='removeImage' cardType=2></uploader>
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
import { mapState, mapMutations } from 'vuex'
import store from '@/store/'
import { User } from '@/apis/'
export default {
  components: {bottom, uploader},
  data () {
    return {
      phone: '',
      content: '',
      imgList: [], // 已上传的图片集合
      isSubmit: false,
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    submit () {
      if(this.imgList.length <= 0){
        Toast('请先上传身份证照片')
        return
      }
      Indicator.open('正在提交...')
      setTimeout(() => {
        this.$router.push({
          path: '/saveinfo'
        })
      }, 1500);
    },
    getImageList (files) {
      this.$nextTick(() => {
        let imageData = new FormData()
        for (let i = 0, len = files.length; i < len; i++) {
          this.imgList.push(files[i].src.split('base64,')[1])
          imageData.append('file', files[i].file)
        }
        // 上传图片
        User.checkIdcard(imageData).then(res => {
          if (res.code === 1) {
            const data = res.data
            let obj = {
              name: data.name,
              sex: data.sex,
              nation: data.nation,
              birth: data.birth,
              address: data.address,
              idcard: data.idcard,
            }
            store.commit('SAVE_USERINFO', Object.assign({}, this.userInfo, obj))
          } else {
            let obj = {
              name: '王老板1',
              sex: '男',
              nation: '汉族',
              birth: '1900-2-1',
              address: '北极',
              idcard: 21233213243212121,
            }
            store.commit('SAVE_USERINFO', Object.assign({}, this.userInfo, obj))
            Toast('验证失败，请重新上传正确身份证照片')
          }
        })
      })
    },
    getImageList1 (files) {
      
    },
    // 删除图片
    removeImage (index) {
      this.imgList.splice(index, 1)
    }
  },
  mounted () {
    console.log(this.userInfo)
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
