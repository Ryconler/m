interface stateType {
  titleBarHeight: number
  mainHeight: number
  tabHeight: number
}

export default {
  namespaced: true,
  state: () => ({
    titleBarHeight: 0,
    mainHeight: 0
  }),
  mutations: {
    setTitleBarHeight(state: stateType, height: number) {
      state.titleBarHeight = height
    },
    setMainHeight(state: stateType, height: number) {
      state.mainHeight = height
    }
  },
  actions: {},
  getters: {}
}
