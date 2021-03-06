import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: '首页',
    component: () => import('@/view/index'),
    meta: {
      title: '保易办',
      keepAlive: !0
    }
  }, {
    path: '/insurance',
    name: '交保',
    component: () => import('@/view/insurance'),
    meta: {
      title: '交保'
    }
  }, {
    path: '/addinsurance',
    name: 'addinsurance',
    component: () => import('@/view/addinsurance'),
    meta: {
      title: '添加参保人信息'
    }
  },{
    path: '/addcard',
    name: 'addcard',
    component: () => import('@/view/addcard'),
    meta: {
      title: '上传身份证'
    }
  },{
    path: '/saveinfo',
    name: 'saveinfo',
    component: () => import('@/view/saveinfo'),
    meta: {
      title: '保存参保人信息'
    }
  },{
    path: '/submitorder',
    name: 'submitorder',
    component: () => import('@/view/submitorder'),
    meta: {
      title: '缴费套餐'
    }
  },{
    path: '/profile',
    name: '我的',
    component: () => import('@/view/profile'),
    meta: {
      title: '我的'
    }
  },{
    path: '/orderlist',
    name: '订单列表',
    component: () => import('@/view/orderlist'),
    meta: {
      title: '订单列表'
    }
  },{
    path: '/orderdetail',
    name: '订单详情',
    component: () => import('@/view/orderdetail'),
    meta: {
      title: '订单详情'
    }
  },,{
    path: '/paydetail',
    name: '支付详情',
    component: () => import('@/view/paydetail'),
    meta: {
      title: '支付详情'
    }
  },
  ],
  mode: 'history'
  // base: '/'
})

router.afterEach((to, from) => {
  if (to.meta) {
    document.title = to.meta.title
  }
})
export default router
