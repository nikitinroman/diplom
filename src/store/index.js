import auth from './modules/auth.ts'
import board from './modules/board.ts'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        board
    }
})