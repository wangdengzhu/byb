<template>
  <div class="feedback-wrap">
    <section class="fb-user-con">
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>参保人姓名：</span>
          <span>小王</span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>身份证号码：</span>
          <span>432323155221112333</span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>出身日期：</span>
          <span>19910101</span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>性别：</span>
          <span>男</span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>手机号码：</span>
          <span>
            <input placeholder="请输入手机号码" type="tel" v-model="phone">
          </span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>推荐人：</span>
          <span>
            <input placeholder="请输入推荐人姓名" type="text" v-model="phone">
          </span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>推荐人手机：</span>
          <span>
            <input placeholder="请输入推荐人手机" type="tel" v-model="phone">
          </span>
        </div>
      </div>
      <div class="user-box2 flex" @click="showOpinionDlg">
        <div class="choose-box">
          <span>户籍：</span>
          <span class="text-right">{{city}}</span>
        </div>
      </div>
      <div class="user-box2 flex" @click="showOpinionDlg2">
         <div class="choose-box">
          <span>个人身份：</span>
          <span class="text-right">{{type}}</span>
        </div>
      </div>
      <div class="user-box2 flex" @click="showOpinionDlg3">
         <div class="choose-box">
          <span>学历</span>
          <span class="text-right">{{grade}}</span>
        </div>
      </div>
      <div class="btn-box">
        <mt-button class="btn-submit" type="primary" size="large" @click="submit">保存</mt-button>
      </div>
      <div class="picker-wrap" v-show="showCity">
        <transition name="slide-down">
          <div class="picker-cnt">
            <div class="txt-btn-wrap">
            <span class="txt-btn cancel" @click="hideOpinion">取消</span>
            <span class="txt-btn ok" @click="cnfrmOpinion">确认</span>
          </div>
            <mt-picker :slots="options" @change="onOpinionChange" :visible-item-count="5"></mt-picker>
          </div>
        </transition>
      </div>
      <div class="picker-wrap" v-show="showType">
        <transition name="slide-down">
          <div class="picker-cnt">
            <div class="txt-btn-wrap">
            <span class="txt-btn cancel" @click="hideOpinion2">取消</span>
            <span class="txt-btn ok" @click="cnfrmOpinion2">确认</span>
          </div>
            <mt-picker :slots="options2" @change="onOpinionChange2" :visible-item-count="5"></mt-picker>
          </div>
        </transition>
      </div>
      <div class="picker-wrap" v-show="showGrade">
        <transition name="slide-down">
          <div class="picker-cnt">
            <div class="txt-btn-wrap">
            <span class="txt-btn cancel" @click="hideOpinion3">取消</span>
            <span class="txt-btn ok" @click="cnfrmOpinion3">确认</span>
          </div>
            <mt-picker :slots="options3" @change="onOpinionChange3" :visible-item-count="5"></mt-picker>
          </div>
        </transition>
      </div>
    </section>
    <bottom></bottom>
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
      city: '',
      type: '',
      grade: '',
      options: [
        {
          flex: 1,
          values: ['请选择户籍', '深圳市', '武汉市', '广州市', '上海市']
        }
      ],
      options2: [
        {
          flex: 1,
          values: ['请选择个人身份', '工人', '干部']
        }
      ],
      options3: [
        {
          flex: 1,
          values: ['请选择学历', '博士研究生', '硕士研究生', '大学本科', '大学专科','中等专科','职业高中','技工学校','普通中学','初级中学','其他']
        }
      ],
      showCity: !1,
      showType: !1,
      showGrade: !1
    }
  },
  methods: {
    submit () {
      this.$router.push({
        path: '/submitorder'
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
    showOpinionDlg () {
      this.showCity = !0
    },
    onOpinionChange (picker, values) {
      this.city = values[0]
    },
    hideOpinion () {
      this.showCity = !1
    },
    cnfrmOpinion () {
      this.showCity = !1
    },
    showOpinionDlg2 () {
      this.showType = !0
    },
    onOpinionChange2 (picker, values) {
      this.type = values[0]
    },
    hideOpinion2 () {
      this.showType = !1
    },
    cnfrmOpinion2 () {
      this.showType = !1
    },
    showOpinionDlg3 () {
      this.showGrade = !0
    },
    onOpinionChange3 (picker, values) {
      this.grade = values[0]
    },
    hideOpinion3 () {
      this.showGrade = !1
    },
    cnfrmOpinion3 () {
      this.showGrade = !1
    },
    toMyGift () {
      this.$router.push({
        path: '/mygift'
      })
    }
  },
  created () {

  }
}
</script>
<style lang="scss">
$main-color: #ef4f4f;
.feedback-wrap{
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
.fb-user-con{
  margin-bottom: 1.2rem;
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
    width: 6.9rem;
    margin: auto;
    padding: .3rem;
    .choose-box{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text-right{
        padding-right: .6rem;
        background: url(../assets/images/arrow-right.png) center right no-repeat;
        background-size: .4rem;
      }
    }
  }
  .start{
    .choose-box{
      justify-content: start;
      span:first-child{
        width: 2rem;
      }
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
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s linear;
}
.slide-down-enter, .slide-down-leave-to {
  transform: translate3d(0, 100%, 0);
}
</style>