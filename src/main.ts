import './assets/main.css'
import 'vue-final-modal/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';

import App from './App.vue'
import router from './router'

import { createVfm } from 'vue-final-modal'
const vfm = createVfm()

const app = createApp(App)
const pinia = createPinia();

app.use(vfm);
app.use(pinia);
app.use(router);

app.mount('#app')
