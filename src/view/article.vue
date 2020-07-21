<template>
  <div class="article-wrap">
    <div class="bar">
      保易办： <span class="time">{{addtime}}</span>
    </div>
    <div class="content" v-html="content">

    </div>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
import store from '@/store/'
import { User } from '@/apis/'
export default {
  data () {
    return {
      title: '',
      addtime: '',
      content: '',
      id: 0
    }
  },
  methods: {
    ...mapMutations(['SAVE_USERINFO']),
    getData () {
      Indicator.open()
      User.articleDetail(this.id).then(res => {
        Indicator.close()
        if (res.code == 1 && res.data) {
          document.title = res.data.title
          this.content = res.data.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          this.addtime = new Date(~~res.data.addtime * 1000).toLocaleDateString().replace(/\//g, '-')
        }
      })
    }
  },
  mounted () {
    this.id = this.$route.query.id
    this.getData()
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
}

</style>
