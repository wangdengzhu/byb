<template>
  <div class="con">
    <div class="empty" v-if="insuranceList.length <= 0">
      <img class="img" src="../assets/images/icon-empty.png" alt="">
      <br>
      <!-- <mt-button type="primary">添加新参保人员</mt-button> -->
      <mt-button class="add-btn">
        <img src="../assets/images/add-icon.png" height="20" width="20" slot="icon">
        添加新参保人员
      </mt-button>
    </div>
    <div class="wrap" v-else>
      <div class="ul">
        <p class="tit">请从下方选择或添加参保人</p>
        <div class="list" v-for="(item,key) in list" :key="key">
          <div class="list-l">
            <input type="radio" v-model="checkItems" :value="item.id" :id="'cb'+key" class="cb" name="radio" >
					  <label :for="'cb'+key"  class="iconfont icon-round"></label>
          </div>
          <div class="list-c">
            <div>王老板： 42123323131232132</div>
            <p>城市：深圳</p>
            <p>参保类型：非深户三挡</p>
            <p>基数：2200</p>
            <p>当前可交月份：2020-05</p>
            <p>操作截至日期：2020-05-12 12:00:12</p>
            <p>状态：未参保</p>
          </div>
          <div class="list-r">
            <mt-button class="btn" type="danger">编辑</mt-button>
            <br>
            <mt-button class="btn" type="danger">删除</mt-button>
          </div>
        </div>
        <mt-button class="add-btn" @click="navToAdd">
          <img src="../assets/images/add-icon.png" height="20" width="20" slot="icon">
          添加新参保人员
        </mt-button>
      </div>
      <div class="bt">
        <span @click="navToJoin">点击参保</span>
      </div>
    </div>
    <bottom></bottom>
  </div>
</template>
<script>
import bottom from '@/components/bottom'
import {Indicator, Toast, MessageBox} from 'mint-ui'
export default {
  components: {bottom},
  data () {
    return {
      insuranceList: [1],
      list: [
        {id:1},{id:2},{id:3}
      ],
      checkItems: ''
    }
  },
  methods: {
    linkTo (to) {
      if (to == 'user') {
        this.$router.push({
          path: './user'
        })
      } else {
        this.$router.push({
          path: './index'
        })
      }
    },
    navToAdd () {
      this.$router.push({
        path: './addinsurance'
      })
    },
    navToJoin(){
      console.log(this.checkItems)
      if(this.checkItems == ''){
        Toast('请选择参保人员')
        return
      }
      this.$router.push({
        path: './submitorder'
      })
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scope>
$main-color: #ef4f4f;
input[type=checkbox],input[type=radio]{
  display: none;
}
.iconfont{
  font-size: 0.4rem;
  color:#c9c9c9;
}
.con{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1;
  background-color: #f5f5f5;
  color: #333;
  overflow-x: hidden;
  padding-bottom: 2rem;
  font-size: .26rem;
  .empty{
    padding-top: 1rem;
    text-align: center;
    .img{
      width: 2rem;
      margin-bottom: .2rem;
    }
  }
}
.add-btn{
  margin: .2rem auto;
  display: block;
  background: #f5f5f5;
  font-size: .3rem;
}
.wrap{
  .ul{
    .tit{
      padding: .3rem .3rem .3rem .9rem;
      font-size: .32rem;
      color: $main-color;
      background: url(../assets/images/handdle-icon.png) left center no-repeat;
      background-position-x: .3rem;
      background-size: .4rem;
      border-bottom: 1px solid $main-color;
    }
    .list{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .3rem;
      border-bottom: 1px solid #ddd;
      .list-l{
        width: .8rem;
        label{
          position: relative;
          &:after{
            content:'';
            position:absolute;
            top:-0.4rem;
            right:-0.4rem;
            bottom:-0.4rem;
            left:-0.4rem;
          }
        }
        .cb:checked + label.icon-round{
          color:$main-color;
        }
        .cb:checked + label.icon-round:before{
          content:'\e656';
        }
      }
      .list-c{
        flex: 1;
        font-size: .3rem;
        color: #333;
        p{
          margin-top: .2rem;
          font-size: .26rem;
          color: #666;
        }
      }
      .list-r{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .btn{
          font-size: .26rem;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
        }
      }
    }
  }
  .bt{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 1.14rem;
    height: .8rem;
    display: flex;
    justify-content: flex-end;
    background: #fff;
    border-top: 1px solid #ddd;
    span{
      width: 2.4rem;
      height: .8rem;
      background: $main-color;
      color: #fff;
      text-align: center;
      line-height: .8rem;
      font-size: .3rem;
    }
  }
}
</style>
