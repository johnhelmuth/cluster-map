import './assets/main.css'
import 'vue-final-modal/style.css'

import { createApp, watch } from 'vue'
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

// TODO : Figure out how to do this in ClustersStore.ts... possibly have to do a pinia plugin or a composable?
watch(
  pinia.state,
  (state) => {
    localStorage.setItem("pinia.cluster-map.clusters", JSON.stringify(state.clusters));
  },
  { deep: true }
);

// TODO : Figure out how to do this in useMapStyles.ts, too... possibly have to do a pinia plugin or a composable?
watch(
  pinia.state,
  (state) => {
    const mapStyles = state.mapStyles
    const debug = mapStyles.debug;
    const mapStyle = mapStyles.mapStyle;
    const straightStraits = mapStyles.straightStraits;
    localStorage.setItem("pinia.cluster-map.mapStyles", JSON.stringify({ debug, mapStyle, straightStraits }));
  },
  { deep: true }
);


app.mount('#app')
