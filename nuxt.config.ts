// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image", "nuxt-auth-utils", "nuxt-authorization"],
  compatibilityDate: "2024-08-15",
  runtimeConfig: {
    turso: { databaseUrl: "", authToken: "" },
  },
  nitro: { experimental: { tasks: true } },
  colorMode: { preference: "light" },
  routeRules: {
    "/": { prerender: true },
  },
});
