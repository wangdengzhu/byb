<template>
  <div class="container">
    <div class="page-title">搭讪宝</div>
    <ul v-if="list.length>0" v-loadmore="loadMoreData" is-enable-scroll="isLoading">
      <li class="list-item " v-for="(item,index) in list " data-type="0" :key="index">
        <div class="list-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="skip(item.reveiverUser, item.nickname)">
          <img class="list-img" :src="item.avatar" alt="">
          <span class="badge number" v-show="item.unReadMsgNumber && item.unReadMsgNumber>0">{{item.unReadMsgNumber}}</span>
          <div class="list-content">
            <p class="title">{{item.nickname}}</p>
            <p v-if="item.msgType == 0" class="tips">{{item.msgContent}}</p>
            <p v-if="item.msgType == 1" class="tips">图片</p>
            <p v-if="item.msgType == 6" class="tips">礼物</p>
            <p class="time">{{item.sendTime}}</p>
          </div>
        </div>
        <div class="delete" @click="deleteItem" :data-index="index" :data-id="item.reveiverUser">删除</div>
      </li>
      <div class="loading-container" v-if="isShowMore" >
				<template v-if="!isLoadOver">
					<span class="loading-icon"></span>
					<span class="loading-txt">加载中...</span>
				</template>
				<template v-else>
					<span class="loading-txt">没有更多了</span>
				</template>
			</div>
    </ul>
  </div>
</template>

<script>
import loadmore from '@/components/loadmore.js';
import { Indicator, Toast } from "mint-ui";
export default {
  directives:{
    loadmore
  },
  data() {
    return {
      startX: 0,
      endX: 0,
      
      list: [],
      isShowMore: !1,
      isLoadOver: !1,
      isLoading: !1,

      page: 1,
      perPage: 10,
    };
  },
  mounted () {
    this.loadMoreData()
  },
  methods: {
    ajaxData() {
      return this.$get('/userMessage/chatList', {
        'APP-Token': token,
        pageNum: this.page,
        pageSize: this.perPage
      })
    },
    loadMoreData(){
      if(this.isLoadOver){
        return;
      }
      this.isLoading = !0;
      Indicator.open()
      let token = localStorage.getItem('token')
      this.$get('/userMessage/chatList', {
        'APP-Token': token,
        pageNum: this.page,
        pageSize: this.perPage
      }).then(res => {
        Indicator.close()
        this.isLoading = !1;
        if (res.ret === 0) {
          if(res.data.records.length<this.perPage){
            this.isLoadOver = !0;
          }
          this.list = this.list.concat(res.data.records)
          this.page++
        }
      })
    },
    // 跳转
    skip(reveiverUser, nickname) {
      if (this.checkSlide()) {
        this.restSlide();
      } else {
        this.$router.push({
          path: "/chat",
          query: {
            id: reveiverUser,
            nickname
          }
        });
      }
    },
    // 滑动开始
    touchStart(e) {
      // 记录初始位置
      this.startX = e.touches[0].clientX;
    },
    // 滑动结束
    touchEnd(e) {
      // 当前滑动的父级元素
      let parentElement = e.currentTarget.parentElement;
      // 记录结束位置
      this.endX = e.changedTouches[0].clientX;
      // 左滑
      if (parentElement.dataset.type == 0 && this.startX - this.endX > 30) {
        this.restSlide();
        parentElement.dataset.type = 1;
      }
      // 右滑
      if (parentElement.dataset.type == 1 && this.startX - this.endX < -30) {
        this.restSlide();
        parentElement.dataset.type = 0;
      }
      this.startX = 0;
      this.endX = 0;
    },
    // 判断当前是否有滑块处于滑动状态
    checkSlide() {
      let listItems = document.querySelectorAll(".list-item");
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].dataset.type == 1) {
          return true;
        }
      }
      return false;
    },
    // 复位滑动状态
    restSlide() {
      let listItems = document.querySelectorAll(".list-item");
      // 复位
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].dataset.type = 0;
      }
    },
    // 删除
    deleteItem(e) {
      let token = localStorage.getItem("token");
      // 当前索引
      let index = e.currentTarget.dataset.index;
      const data = { reveiver: e.currentTarget.dataset.id, "APP-Token": token };
      Indicator.open();
      this.$get("/userMessage/delete", data).then(res => {
        Indicator.close();
        if (res.ret === 0) {
          // 复位
          this.restSlide();
          // 删除
          this.list.splice(index, 1);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.badge{
  padding: 5px;
  background: #fd5050;
  border-radius: 50%;
  position: absolute;
  top: .12rem;
  right: .6rem;
}
.number{
  padding: .04rem .06rem;
  font-size: .24rem;
  color: #fff;
  left: 1.05rem;
  right: auto;
  border-radius: .2rem;
  text-align: center;
  min-width: .2rem;
}
.container {
  padding-bottom: 80px;
}
.page-title {
  text-align: center;
  font-size: 17px;
  padding: 10px 15px;
  position: relative;
  color: #fff;
}
.page-title:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #ccc;
  color: #ccc;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
.list-item {
  position: relative;
  height: 1.6rem;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}
.list-item[data-type="0"] {
  transform: translate3d(0, 0, 0);
}
.list-item[data-type="1"] {
  transform: translate3d(-2rem, 0, 0);
}
.list-item:after {
  content: " ";
  position: absolute;
  left: 0.2rem;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #ccc;
  color: #ccc;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
.list-box {
  padding: 0.2rem;
  display: flex;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 0;
}
.list-item .list-img {
  display: block;
  width: 1rem;
  height: 1rem;
}
.list-item .list-content {
  padding: 0.1rem 0 0.1rem 0.2rem;
  position: relative;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
}
.list-item .title {
  display: block;
  color: #fff;
  overflow: hidden;
  font-size: 15px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-item .tips {
  display: block;
  overflow: hidden;
  font-size: 12px;
  color: #fff;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-item .time {
  display: block;
  font-size: 12px;
  position: absolute;
  right: 0;
  top: 0.1rem;
  color: #666;
}
.list-item .delete {
  width: 2rem;
  height: 1.6rem;
  background: #ff4949;
  font-size: 17px;
  color: #fff;
  text-align: center;
  line-height: 1.6rem;
  position: absolute;
  top: 0;
  right: -2rem;
}
</style>
