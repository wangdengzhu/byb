import { fetch, post } from '@/utils/fetch'

// 首页信息
const getIndexInfo = () => fetch('/api/index/index')

// 参保人列表信息
const getInsuredList = () => fetch('/api/insured/index')

// 参保人列表信息
const getEditInsured = id => fetch(`/api/insured/editInsured/id/${id}`)

// 编辑参保信息
const editInsured = data => post(`/api/insured/editInsured`, data)

// 公共分类
const getComCat = () => post('/api/insured/comCat')

// 删除参保人
const delInsured = id => post('/api/insured/delInsured', {id})

// 添加参保人
const addInsured = data => post('/api/insured/addInsured', data)
// 缺少返回参保id

// 提交订单
const submitOrder = id => post('/api/order/buy', {insured_id: id})
// 提交不了

// 缴纳套餐
const insuredOrder = id => post('/api/insured/order', {id})
// 缺少返回参保月份

// 个人中心
const userIndex = () => post('/api/user.index/detail')
// 缺少头像

// 订单列表
const orderlist = data => post('/api/user.order/lists', data)

// 取消订单
const cancelOrder = order_id => post('/api/order/cancelOrder', {order_id})

// 支付订单
const orderPay = order_id => post('/api/user.order/pay', {order_id})

// 查看套餐具体收费情况
const checkInsuredGear = order_id => post('/api/insured/checkInsuredGear', {order_id})

// 获取文章列表
const articleDetail = id => post('/api/index/articleDetail', {id})

// 获取文章内容
const articleList = id => post('/api/index/articleList', {id})

// 登录
const login = id => post('/api/user/login')

// 获取用户信息
const getUserInfo = code => post('/api/user/getUserInfo', {code})

// 上传身份证图片
const uploadImg = iFile => post('/api/upload/image', iFile)

// 身份证图片验证
const checkIdcard = data => post('/api/insured/checkIdcard', data)

// 订单详情
const orderDetail = order_id => post('/api/user.order/detail', {order_id})

export default {
  getIndexInfo,
  getInsuredList,
  getEditInsured,
  editInsured,
  getComCat,
  delInsured,
  addInsured,
  submitOrder,
  insuredOrder,
  userIndex,
  orderlist,
  cancelOrder,
  orderPay,
  checkInsuredGear,
  articleList,
  articleDetail,
  login,
  getUserInfo,
  checkIdcard,
  uploadImg,
  orderDetail
}
