import { createStore } from "vuex";
import _ from "lodash";

const USER_KEY = 'authenticated_user'

// for testing
if (navigator.webdriver) {
  window.localStorage.clear()
}

export default createStore({
  state: {
    // Auth/session
    user: JSON.parse(JSON.stringify(window.localStorage.getItem(USER_KEY)) || {}),
    isAuthenticated: !_.isEmpty(JSON.parse(window.localStorage.getItem(USER_KEY))),
    
    // Levels
    levels: [],

    // Stages
    stages: [],

    // Lectures
    lectures: [],

    // exercises
    exercises: [],
  },
  mutations: {
    // Auth/session
    login (state, user) {
      state.user = window.localStorage.setItem(USER_KEY, JSON.stringify(user))
      state.isAuthenticated = true
    },
    logoff (state) {
      state.user = window.localStorage.setItem(USER_KEY, JSON.stringify({}))
      state.isAuthenticated = false
    },

    // Levels
    setlevels (state, levels) {
      state.levels = [ ...levels ]
    },

    // Stages
    setstages (state, stages) {
      state.stages = [ ...stages ]
    },

    // Lectures
    setlectures (state, lectures) {
      state.lectures = [ ...lectures ]
    },

    // Exercises
    setexercises (state, exercises) {
      state.exercises = [ ...exercises ]
    },
  },
  actions: {
    // Auth/session
    login ({ commit }, user) {
      commit('login', user)
    },
    logoff ({ commit }) {
      commit('logoff')
    },

    // Levels
    setLevels ({ commit }, levels) {
      commit('setlevels', levels)
    },

    // Stages
    setStages ({ commit }, stages) {
      commit('setstages', stages)
    },

    // Letures
    setLectures ({ commit }, lectures) {
      commit('setlectures', lectures)
    },

    // Exercises
    setExercises ({ commit }, exercises) {
      commit('setexercises', exercises)
    },
  },
  modules: {},
});
