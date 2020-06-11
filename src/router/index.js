import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'start',
    component: () => import('@/view/start'),
    meta: {
      title: '保易办',
      keepAlive: !0
    }
  }, {
    path: '/index',
    name: 'index',
    component: () => import('@/view/index'),
    meta: {
      title: '保易办',
      keepAlive: !0
    }
  }, {
    path: '/insurance',
    name: 'insurance',
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
  }, {
    path: '/addcard',
    name: 'addcard',
    component: () => import('@/view/addcard'),
    meta: {
      title: '上传身份证'
    }
  }, {
    path: '/saveinfo',
    name: 'saveinfo',
    component: () => import('@/view/saveinfo'),
    meta: {
      title: '保存参保人信息'
    }
  }, {
    path: '/editinfo',
    name: 'editinfo',
    component: () => import('@/view/editinfo'),
    meta: {
      title: '修改参保人信息'
    }
  }, {
    path: '/submitorder',
    name: 'submitorder',
    component: () => import('@/view/submitorder'),
    meta: {
      title: '缴费套餐'
    }
  }, {
    path: '/profile',
    name: 'profile',
    component: () => import('@/view/profile'),
    meta: {
      title: '我的'
    }
  }, {
    path: '/orderlist',
    name: '订单列表',
    component: () => import('@/view/orderlist'),
    meta: {
      title: '订单列表'
    }
  }, {
    path: '/orderdetail',
    name: '订单详情',
    component: () => import('@/view/orderdetail'),
    meta: {
      title: '订单详情'
    }
  }, {
    path: '/paydetail',
    name: '支付详情',
    component: () => import('@/view/paydetail'),
    meta: {
      title: '支付详情'
    }
  }, {
    path: '/articlelist',
    name: '文章列表',
    component: () => import('@/view/articlelist'),
    meta: {
      title: '常见问题'
    }
  }, {
    path: '/article',
    name: '文章详情',
    component: () => import('@/view/article')

  }
  ]
  // mode: 'history'
  // base: '/'
})

router.afterEach((to, from) => {
  if (to.meta) {
    document.title = to.meta.title
  }
})
export default router
