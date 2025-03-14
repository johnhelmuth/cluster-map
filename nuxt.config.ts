// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    compatibilityDate: '2024-11-01',
    devtools: {enabled: false},

    components: [
        {
            path: '~/components/',
            pathPrefix: false,
        }
    ],

    app: {
        head: {
            htmlAttrs: {
                lang: 'en',
            },
        }
    },

    content: {
        build: {
            markdown: {
                toc: {
                    depth: 2,
                    searchDepth: 2,
                },
            }
        },
        renderer: {
            anchorLinks: true,
        }   
    },

    mongoose: {
        modelsDir: 'server/models',
    },

    css: ['~/assets/main.css', 'vue-final-modal/style.css'],

    modules: [
      '@nuxt/icon',
      '@vue-final-modal/nuxt',
      '@vueuse/nuxt',
      '@nuxt/content',
      '@pinia/nuxt',
      'nuxt-mongoose',
    ],

})