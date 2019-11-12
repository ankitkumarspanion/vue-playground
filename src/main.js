import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import "vuetify/dist/vuetify.min.css";
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  vuetify: new Vuetify({
    icons: {
      iconfont: "mdi"
    },
  })
}).$mount('#app')