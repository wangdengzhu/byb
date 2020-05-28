<template>
  <div class="feedback-wrap">
    <section class="fb-user-con">
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>参保人姓名：</span>
          <span>{{dataInfo.insured_name}}</span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>身份证号码：</span>
          <span>{{dataInfo.idcard}}</span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>出身日期：</span>
          <span>{{dataInfo.referee_mobile}}</span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>性别：</span>
          <span>{{dataInfo.sex}}</span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>手机号码：</span>
          <span>
            <input placeholder="请输入手机号码" type="tel" v-model="dataInfo.mobile">
          </span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>推荐人：</span>
          <span>
            <input placeholder="请输入推荐人姓名" type="text" v-model="dataInfo.referee_name">
          </span>
        </div>
      </div>
      <div class="user-box2 flex start">
         <div class="choose-box">
          <span>推荐人手机：</span>
          <span>
            <input placeholder="请输入推荐人手机" type="tel" v-model="dataInfo.referee_mobile">
          </span>
        </div>
      </div>
      <div class="user-box2 flex" @click="showOpinionDlg">
        <div class="choose-box">
          <span>户籍：</span>
          <span class="text-right">{{dataInfo.belong_name}}</span>
        </div>
      </div>
      <div class="user-box2 flex" @click="showOpinionDlg2">
         <div class="choose-box">
          <span>个人身份：</span>
          <span class="text-right">{{dataInfo.identity_name}}</span>
        </div>
      </div>
      <div class="user-box2 flex" @click="showOpinionDlg3">
         <div class="choose-box">
          <span>学历</span>
          <span class="text-right">{{dataInfo.education_name}}</span>
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
            <mt-picker :slots="options1" @change="onOpinionChange" :visible-item-count="5"></mt-picker>
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
import { User } from '@/apis/'
export default {
  components: {bottom, uploader},
  data () {
    return {
      phone: '',
      content: '',
      imgList: [], // 已上传的图片集合
      isSubmit: false,
      options1: [
        {
          flex: 1,
          values: []
        }
      ],
      options2: [
        {
          flex: 1,
          values: []
        }
      ],
      options3: [
        {
          flex: 1,
          values: []
        }
      ],
      showCity: !1,
      showType: !1,
      showGrade: !1,
      dataInfo: {
        insured_name: '',
        idcard: '',
        city_name: '',
        identity_name: '',
        belong_name: '',
        education_name: '',
        mobile: '',
        referee_mobile: '',
        referee_name: '',
        insured_base: 2200,
        house_base: 2200,
        house_scale: '企业比例：5%，个人比例：5%'
      },
      belong: [],
      identity: [],
      education: []
    }
  },
  methods: {
    submit () {
      this.$router.push({
        path: '/insurance'
      })
    },
    showOpinionDlg () {
      this.showCity = !0
    },
    onOpinionChange (picker, values) {
      this.dataInfo.belong_name = values[0]
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
      this.dataInfo.identity_name = values[0]
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
      this.dataInfo.education_name = values[0]
    },
    hideOpinion3 () {
      this.showGrade = !1
    },
    cnfrmOpinion3 () {
      this.showGrade = !1
    },
    renderData(data) {

    }
  },
  mounted () {
    User.getComCat().then(res => {
      Indicator.close()
      if(res.code == 1){
        this.belong = res.data.belong
        let arr = this.belong.map(item => item.belong_name)
        this.options1[0].values = ['请选择户籍', ...arr]

        this.identity = res.data.identity
        let arr1 = this.identity.map(item => item.identity_name)
        this.options2[0].values = ['请选择个人身份', ...arr1]

        this.education = res.data.education
        let arr2 = this.education.map(item => item.ed_name)
        this.options3[0].values = ['请选择学历', ...arr2]
      }
    })
    let id = this.$route.query.id
    if(id > 0){
      Indicator.open()
      User.getEditInsured(id).then(res => {
        Indicator.close()
        if(res.code == 1){
          this.dataInfo = res.data
          this.renderData(res.data)
        }
      })
    }
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