import './assets/main.css'
import 'vue-final-modal/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createVfm } from 'vue-final-modal'
const vfm = createVfm()

const app = createApp(App)

app.use(vfm);
app.use(router);

app.mount('#app')
