import Vue from "vue";
import App from "./App.vue";
import { enUS, zhTW } from "./locale";
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";
import routes from "./router";
import { Button, Table, Icon, Rate } from "ant-design-vue";
import Antd from "ant-design-vue";
import firebase from "firebase";
import "../ant-design-vue/dist/antd.less";
Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Table);
Vue.use(Icon);
Vue.use(Rate);
Vue.use(Antd);
Vue.use(VueRouter);
Vue.use(VueI18n);
console.log(enUS);
console.log(zhTW);
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnsyC1n_9pDRlvXly674fHYbbO2_bKJxE",
  authDomain: "bill-s-gates.firebaseapp.com",
  projectId: "bill-s-gates",
  storageBucket: "bill-s-gates.appspot.com",
  messagingSenderId: "356061737970",
  appId: "1:356061737970:web:931a358f23c87cb271f16b",
  measurementId: "G-NJZSY2SJ40",
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const locale = localStorage.getItem("lang")
  ? localStorage.getItem("lang")
  : "enUS";
localStorage.setItem("lang", locale);
const i18n = new VueI18n({
  locale: locale,
  messages: { enUS, zhTW },
});
const router = new VueRouter({
  mode: "history",
  routes,
});
new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
