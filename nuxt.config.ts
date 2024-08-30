// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "nuxt-auth-utils",
    "nuxt-authorization",
    "@nuxtjs/seo",
    "@uploadthing/nuxt",
  ],
  compatibilityDate: "2024-08-15",
  runtimeConfig: {
    turso: { databaseUrl: "", authToken: "" },
    uploadthing: { secret: "" },
  },
  nitro: {
    experimental: { tasks: true },
  },
  colorMode: { preference: "light" },
  routeRules: {
    "/": { prerender: true },
  },
  uploadthing: {
    routerPath: "~/server/utils/uploadthing.ts",
  },
  site: {
    url: "https://grant-hub.vercel.app",
    name: "GrantHub",
    description:
      "The nexus of funding and talent. Connect with like-minded innovators, secure grants, and bring your vision to life. Start your journey here!",
    defaultLocale: "en",
  },
  image: { domains: ["utfs.io", "avatar.iran.liara.run"] },
});
