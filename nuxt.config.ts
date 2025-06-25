// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    compatibilityDate: '2024-11-01',
    devtools: {enabled: false},

    app: {
        head: {
            htmlAttrs: {
                lang: 'en',
            },
        },
    },

    routeRules: {
      "/map": {
        redirect: {
          to: "/maps",
          statusCode: 308
        },
      },
    },

    components: [
        {
            path: '~/components/',
            pathPrefix: false,
        }
    ],

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

    css: ['~/assets/main.css', 'vue-final-modal/style.css'],

    modules: [
      '@nuxt/icon',
      '@vue-final-modal/nuxt',
      '@vueuse/nuxt',
      '@nuxt/content',
      'nuxt-mongodb',
    ],

    hooks: {
        close: (nuxt) => {
            if (!nuxt.options._prepare) {
                process.exit()
            }
        }
    }

})