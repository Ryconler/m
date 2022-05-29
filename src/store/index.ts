import { auth } from '@/utils'
import { createStore } from 'vuex'
interface stateType {
  userInfo: any
}
export default createStore({
  state: {
    userInfo: null
  },
  mutations: {
    setUserInfo(state: stateType, userInfo: any) {
      state.userInfo = userInfo
    }
  },
  actions: {
    async queryUserInfo({ commit }) {
      const user = await auth.getCurrenUser()
      commit('setUserInfo', user)
      return user
    }
  },
  modules: {}
})
