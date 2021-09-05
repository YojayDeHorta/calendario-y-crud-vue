import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import VueTextareaAutosize from "vue-textarea-autosize";
Vue.use(VueTextareaAutosize);
import InputColorPicker from "vue-native-color-picker";
Vue.use(InputColorPicker);
// Import the functions you need from the SDKs you need
// import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebase = require('firebase/app').default

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMJGEAAdcw_NU82Vkzepewy1Kid-zQ4sk",
  authDomain: "calendario-vue-4d4bd.firebaseapp.com",
  projectId: "calendario-vue-4d4bd",
  storageBucket: "calendario-vue-4d4bd.appspot.com",
  messagingSenderId: "131480075149",
  appId: "1:131480075149:web:522658bc5c730377621bc4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const storage = firebase.storage();



Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
