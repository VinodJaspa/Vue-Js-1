import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import Store from "./store/Store";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import "font-awesome/css/font-awesome.min.css";
import "../node_modules/nprogress/nprogress.css";
const options = {
  position: "center",
  timer: 1000,
};

const app = createApp(App);
app.use(VueSweetalert2, options);

app.use(router);
app.use(Store);
app.config.devtools = true;
app.mount("#app");

// Before you create app
// app.config.devtools = process.env.NODE_ENV === 'development';
