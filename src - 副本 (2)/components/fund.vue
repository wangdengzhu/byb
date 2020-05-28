<template>
  <div class="container" v-show="isShowPop">
    <div class="mask" @click="close"></div>
    <div class="wrap">
      <div class="tit">资费详情</div>
      <div class="tr">
        <div class="list">
          <p>参保人</p>
          <p>王老板</p>
        </div>
        <div class="list">
          <p>城市</p>
          <p>深圳</p>
        </div>
        <div class="list">
          <p>基数</p>
          <p>2200</p>
        </div>
        <div class="list">
          <p>公积金基数</p>
          <p>0</p>
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
          <p>2200</p>
          <p>9.3</p>
          <p>32.3</p>
        </div>
        <div class="list">
          <p>生育保险</p>
          <p>2200</p>
          <p>9.3</p>
          <p>32.3</p>
        </div>
        <div class="list">
          <p>养老保险</p>
          <p>2200</p>
          <p>9.3</p>
          <p>32.3</p>
        </div>
        <div class="list">
          <p>重大疾病险</p>
          <p>2200</p>
          <p>9.3</p>
          <p>32.3</p>
        </div>
        <div class="list">
          <p>工伤保险</p>
          <p>2200</p>
          <p>9.3</p>
          <p>32.3</p>
        </div>
        <div class="list">
          <p>残障金</p>
          <p>2200</p>
          <p>9.3</p>
          <p>32.3</p>
        </div>
        <div class="list">
          <p>合计</p>
          <p></p>
          <p></p>
          <p>322.33/月</p>
        </div>
      </div>
      <div class="close" @click="close">关闭</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // list: {
      //   type: Array,
      //   required: true
      // },
      // isShowPop: {
      //   required: true
      // }
    },
    data () {
      return {
        isShowPop: false
      }
    },
    methods: {
      close(){
        this.isShowPop = false
      }
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
