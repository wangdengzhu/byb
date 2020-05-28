<template>
  <div class="feedback-wrap">
    <section class="fb-user-con">
      <div class="user-box2 flex" @click="showOpinionDlg">
        <div class="choose-box">
          <span>参保城市：</span>
          <span class="text-right">{{city}}</span>
        </div>
      </div>
      <div class="tips tips-icon" v-if="city =='请选择参保城市'">注意：遇周末或节假日提前</div>
      <div class="tips" v-else>当前可缴{{dataInfo.time.able_time}}(截止日{{dataInfo.time.end_time}})</div>
      <div class="user-box2 flex" @click="showOpinionDlg2">
         <div class="choose-box">
          <span>参保类型：</span>
          <span class="text-right">{{gear}}</span>
        </div>
      </div>
      <div class="user-box2 flex" v-if="gear != '请选择参保类型'">
         <div class="choose-box">
          <span>社保基数：</span>
          <span>2200</span>
        </div>
      </div>
      <div class="ht20"></div>
      <div class="fund">
        <span>缴纳公积金</span>
        <!-- <mt-switch v-model="fund" diabled @click.native="showHouse"></mt-switch> -->
        <van-switch v-model="fund" :disabled="isDisabled" active-color="#56D674" @click="showHouse"/>
      </div>
      <div v-if="!isDisabled && fund">
        <div class="fund">
          <span>公积金基数</span>
          <span>{{houseInfo.house_base}}</span>
        </div>
        <div class="fund">
          <span>公积金比例</span>
          <span>个人比例：{{houseInfo.personal_cate}}% 企业比例：{{houseInfo.company_cate}}%</span>
        </div>
      </div>
      <div class="tips">
        <p>温馨提示：</p>
        <p>1.如曾在单位参保，参保人需要在缴费截止日期确认前单位已经减员，若因该原因导致参保失败的，服务费用不予退还。</p>
        <p>2.保易办仅提供地代理服务，无法办理生育津贴申领服务，无法提供任何加盖公章的合同，证明，材料。</p>
        <p>3.由于政府调整基数导致扣费金额不准确的，我们将多退少补，感谢配合。</p>
      </div>
      <div class="btn-box">
        <mt-button class="btn-submit" type="primary" size="large" @click="submit">下一步</mt-button>
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
      <div class="picker-wrap" v-show="showGear">
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
    </section>
    <bottom></bottom>
  </div>
</template>

<script>
import Vue from 'vue'
import bottom from '@/components/bottom'
import uploader from '@/components/Upload'
import { getParams } from '@/utils/common'
import { Indicator, Toast } from 'mint-ui'
import { User } from '@/apis/'
import { mapState, mapMutations } from 'vuex'
import store from '@/store/'
import { Switch } from 'vant'
Vue.use(Switch)
export default {
  components: {bottom, uploader},
  data () {
    return {
      phone: '',
      content: '',
      imgList: [], // 已上传的图片集合
      isSubmit: false,
      city: '',
      gear: '',
      fund: false,
      options: [
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
      showCity: !1,
      showGear: !1,
      dataInfo: {
        time:{}
      },
      cityInfo: [],
      cityId: 0,
      gearInfo:[],
      gearId: 0,
      houseInfo: {
        company_cate: "5",
        personal_cate: "5",
        house_base: "2200",
        service_fee: "30"
      },
      isDisabled: true
    }
  },
  computed: {
    showHouseInfo() {
      if (this.city == '' || this.city == '请选择参保城市') {
        this.isDisabled = true
        return false
      }
      this.isDisabled = false
      return true
    }
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    submit () {
      if (this.city == '' || this.city == '请选择参保城市') {
        Toast('请选择参保城市！')
        return
      }
      if (this.gear == '' || this.gear == '请选择参保类型') {
        Toast('请选择参保类型！')
        return
      }
      
      this.baseInfo = {
        city_id: this.cityId,
        gear_id: this.gearId,
        is_house: ~~this.fund
      }
      store.commit('SAVE_USERINFO', this.baseInfo)
      this.$router.push({
        path: '/addcard'
      })
    },
    showOpinionDlg () {
      this.showCity = !0
    },
    onOpinionChange (picker, values) {
      this.city = values[0]
      this.cityInfo.map(item => {
        if(item.city_name == this.city){
          this.gearInfo = item.gear
          this.houseInfo = item.house
          this.cityId = item.id
        }
      })

      let arr = this.gearInfo.map(item => {
        return item.gear_title
      })
      this.options2[0].values = ['请选择参保类型', ...arr]
    },
    hideOpinion () {
      this.showCity = !1
    },
    cnfrmOpinion () {
      this.showCity = !1
    },
    showOpinionDlg2 () {
      if (this.city == '' || this.city == '请选择参保城市') {
        Toast('请先选择参保城市！')
        return
      }
      this.showGear = !0
    },
    onOpinionChange2 (picker, values) {
      this.gear = values[0]
      if (!this.showHouseInfo) {
        return
      }
      this.gearInfo.map(item => {
        if(item.gear_title == this.gear){
          this.gearId =  item.id
        }
      })
    },
    hideOpinion2 () {
      this.showGear = !1
    },
    cnfrmOpinion2 () {
      this.showGear = !1
    },
    showHouse(){
      if (!this.showHouseInfo) {
        Toast('请先选择参保城市！')
        return
      }
    }
  },
  mounted() {
    Indicator.open()
    User.getComCat().then(res => {
      Indicator.close()
      if(res.code == 1){
        this.dataInfo = res.data
        this.cityInfo = res.data.city
        let arr = this.cityInfo.map(item => {
          return item.city_name
        })
        this.options[0].values = ['请选择参保城市', ...arr]
      }
    })
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
}
.tips{
  padding: .2rem .3rem;
  font-size: .28rem;
  color: $main-color;
  line-height: .4rem;
}
.tips-icon{
  padding-left: .5rem;
  margin-left: .2rem;
  background: url(../assets/images/tips.png) left center no-repeat;
  background-size: .4rem;
}
.fund{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .3rem;
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
  z-index: 999;
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