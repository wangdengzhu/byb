
// initial state
const state = {
  userInfo: {},
  barInfo: {},
  isonline: false,
  unReadMsgNum: 0
}

// getters
const getters = {
  userInfo: state => state.user.userInfo
}

// mutations
const mutations = {
  SAVE_USERINFO (state, userInfo) {
    state.userInfo = userInfo
  },
  SAVE_COUNTINFO (state, countInfo) {
    state.countInfo = countInfo
  },
  SAVE_BARINFO (state, barInfo) {
    state.barInfo = barInfo
  },
  SAVE_ISONLINE  (state, isonline) {
    state.isonline = isonline
  },
  SAVE_UNREADMSGNUM  (state, unReadMsgNum) {
    state.unReadMsgNum = unReadMsgNum
  }
}

// actions
const actions = {
  // 获取用户相关信息
  getUserInfo ({ state, commit }) {
    return new Promise((resolve, reject) => {
      try {
        let token = localStorage.getItem('token')
        this.$get('/user/myInfo', {'APP-Token': token}).then(res => {
          if (res.ret === 0) {
            commit('SAVE_USERINFO', res.data.baseInfo)
          }
          resolve(res.data.baseInfo)
        }).catch(err => {
          reject(err)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
