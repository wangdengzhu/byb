<template>
  <div class="container" v-show="isShowPop">
    <div class="mask" @click="close"></div>
    <div class="wrap">
      <div class="tit">资费详情</div>
      <div class="tr">
        <div class="list">
          <p>参保人</p>
          <p>{{dataInfo.insured_name}}</p>
        </div>
        <div class="list">
          <p>城市</p>
          <p>{{dataInfo.city_name}}</p>
        </div>
        <div class="list">
          <p>基数</p>
          <p>{{dataInfo.pension_base}}</p>
        </div>
        <div class="list">
          <p>公积金基数</p>
          <p>{{dataInfo.house_base}}</p>
        </div>
      </div>
      <div class="td">
        <div class="list">
          <p></p>
          <p>基数</p>
          <p>个人部分</p>
          <p>公司部分</p>
        </div>
        <div class="list">
          <p>基本医疗保险</p>
          <p>{{dataInfo.medical_money}}</p>
          <p>{{dataInfo.lose_personal_cate}}</p>
          <p>{{dataInfo.lose_company_cate}}</p>
        </div>
        <div class="list">
          <p>生育保险</p>
          <p>{{dataInfo.birth_money}}</p>
          <p>{{dataInfo.birth_personal_cate}}</p>
          <p>{{dataInfo.birth_company_cate}}</p>
        </div>
        <div class="list">
          <p>养老保险</p>
          <p>{{dataInfo.pension_money}}</p>
          <p>{{dataInfo.pension_personal_cate}}</p>
          <p>{{dataInfo.pension_company_cate}}</p>
        </div>
        <div class="list">
          <p>失业保险</p>
          <p>{{dataInfo.lose_money}}</p>
          <p>{{dataInfo.lose_personal_cate}}</p>
          <p>{{dataInfo.lose_company_cate}}</p>
        </div>
        <div class="list">
          <p>工伤保险</p>
          <p>{{dataInfo.injury_money}}</p>
          <p>{{dataInfo.injury_personal_cate}}</p>
          <p>{{dataInfo.injury_company_cate}}</p>
        </div>
        <div class="list">
          <p>残障金</p>
          <p>{{dataInfo.disable_money}}</p>
          <p>{{dataInfo.disable_personal_cate}}</p>
          <p>{{dataInfo.disable_company_cate}}</p>
        </div>
        <div class="list">
          <p>合计</p>
          <p></p>
          <p></p>
          <p>{{dataInfo.total_price}}/月</p>
        </div>
      </div>
      <div class="close" @click="close">关闭</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataInfo: {
      required: true
    }
  },
  data () {
    return {
      isShowPop: false
    }
  },
  methods: {
    close () {
      this.isShowPop = false
    }
  },
  mounted () {

  }
}
</script>
<style scoped lang="scss">
$main-color: #ef4f4f;
.mask{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0,0,0, .6);
}
.wrap{
  position: absolute;
  left: 0;
  right: 0;
  top: 15%;
  background: #fff;
  .tit{
    padding: .2rem;
    text-align: center;
    font-size: .32rem;
  }
  .tr{
    display: flex;
    background: $main-color;
    color: #fff;
    .list{
      width: 25%;
      padding: .1rem;
      text-align: center;
      line-height: .45rem;
    }
  }
  .td{
    font-size: .24rem;
    .list{
      display: flex;
      padding: .1rem;
      text-align: center;
      line-height: .45rem;
      border-bottom: 1px solid #ddd;
      p{
        width: 25%;
      }
      &:first-child{
        margin-top: .4rem;
      }
      &:last-child{
        color: $main-color;
      }
    }
  }
  .close{
    margin-top: 1rem;
    background: $main-color;
    color: #fff;
    text-align: center;
    line-height: .8rem;
  }
}
</style>
