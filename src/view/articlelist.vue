<template>
  <div class="article-wrap">
    <div class="bar">
      常见问题
    </div>
    <ul class="ul">
      <li v-for="(item, i) in list" :key="i" @click="navDetail(item.id)">{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import { User } from '@/apis/'
export default {
  data () {
    return {
      pageLoad: false,
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    navDetail (id) {
      this.$router.push({
        path: `/article?id=${id}`
      })
    },
    onLoad () {
      User.articleList(this.id).then(res => {
        Indicator.close();
        this.pageLoad = true;
        if (res.code == 1 && res.data) {
          this.list = res.data;
          // 数据全部加载完成
          this.finished = true;
        }
      })
    }
  },
  beforeCreate () {
    Indicator.open('加载中')
  },
  mounted () {
    this.id = this.$route.query.id;
    this.onLoad();
  }
}
</script>
<style lang="scss">
$main-color: #ef4f4f;
.article-wrap{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  overflow-x: hidden;
  background: #f5f5f5;
  font-size: .28rem;
  .bar{
    position: relative;
    padding: 0 .4rem;
    font-size: .34rem;
    padding-bottom: .3rem;
    padding-top: .4rem;
    &::before{
      content: '';
      display: block;
      position: absolute;
      left: .2rem;
      top: .34rem;
      width: 4px;
      height: .5rem;
      background: $main-color;
    }
    .time{
      margin-left: .2rem;
      font-size: .26rem;
    }
  }
  .content{
    padding: .3rem;
  }
  .ul{
    padding: .3rem;
    li{
      padding: .2rem 0;
      border-bottom: 1px solid #ddd;
      padding-right: .6rem;
      background: url(../assets/images/arrow-right.png) center right no-repeat;
      background-size: .4rem;
    }
  }
}

</style>
