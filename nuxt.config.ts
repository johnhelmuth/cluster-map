// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},

    components: [
        {
            path: '~/components/',
            pathPrefix: false,
        }
    ],

    css: ['~/assets/main.css', 'vue-final-modal/style.css'],

    modules: ['@nuxt/icon', '@vue-final-modal/nuxt', '@vueuse/nuxt'],

})