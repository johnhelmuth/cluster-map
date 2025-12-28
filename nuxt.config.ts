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

    runtimeConfig: {
        oauth: {
            github: {
                clientId: "", // defaults to empty string
                clientSecret: "", // defaults to empty string
            },
        },
    },

    css: ['~/assets/main.css', 'vue-final-modal/style.css'],

    modules: [
      '@nuxt/icon',
      '@vue-final-modal/nuxt',
      '@vueuse/nuxt',
      '@nuxt/content',
      'nuxt-mongodb',
      'nuxt-auth-utils'
    ],

    hooks: {
        close: (nuxt) => {
            if (!nuxt.options._prepare) {
                process.exit()
            }
        }
    }

})