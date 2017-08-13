import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
try
{
  var settings = require('@/store/settings.js').default;
}
catch(ex)
{
  var settings = {
  host     : '192.168.10.34 : 8020',
  user     : '',
  password : '',
  api_sec  : '',
  };
}
const store = new Vuex.Store({
    state: {
          tasks: [],
          config: {
            "users"    : [],
            "projects" : [],
            "priority" : [],
            "severity" : [],
            "status"   : [],
            ...settings,
            },
        },
    mutations: {
          /* set_modal_manager (state, payload) { */
                  /* state.modalManager = payload; */
                      /* }, */
          /* show_modal (state, payload) { */
                  /* state.modalManager.show_modal(payload); */
                      /* } */
            },
        /* actions: { */
          /* show_modal ({commit}) { */
            /* commit('show_modal'); */
          /* } */
        /* }, */
});

export default store

