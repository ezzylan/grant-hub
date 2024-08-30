<script setup lang="ts">
import { capitalCase, noCase } from "change-case";

const route = useRoute();
const role = route.params.role as string;
const title = role === "npo-members" ? "NPO Members" : capitalCase(role);

useHead({ title });

const expertiseArea = ref(`All ${title}`);
const expertiseAreas = [expertiseArea.value];

const { data: fetchedExpertiseAreas } = await useLazyFetch(
  "/api/expertise-areas",
  {
    transform: (input) => {
      return { input, fetchedAt: new Date() };
    },
    getCachedData(key, nuxtApp) {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      if (!data) {
        return;
      }

      const expirationDate = new Date(data.fetchedAt);
      expirationDate.setTime(expirationDate.getTime() + 30 * 1000);
      const isExpired = expirationDate.getTime() < Date.now();
      if (isExpired) {
        return;
      }

      return data;
    },
  },
);

if (fetchedExpertiseAreas.value?.input) {
  expertiseAreas.push(...fetchedExpertiseAreas.value.input);
}

const { status, data: users } = await useLazyFetch(`/api/${role}`, {
  query: { expertiseArea },
  watch: [expertiseArea],
  transform: (users: SelectUser[]) => {
    const fetchedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      expertiseArea: user.expertiseArea,
      imageUrl: user.imageUrl,
    }));

    return { ...fetchedUsers, fetchedAt: new Date() };
  },
  getCachedData(key, nuxtApp) {
    const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    if (!data) {
      return;
    }

    const expirationDate = new Date(data.fetchedAt);
    expirationDate.setTime(expirationDate.getTime() + 30 * 1000);
    const isExpired = expirationDate.getTime() < Date.now();
    if (isExpired) {
      return;
    }

    return data;
  },
});

const headingRole =
  role === "npo-members"
    ? "Non-Profit Organization Members"
    : role === "professionals"
      ? "Professional/Industry Experts"
      : capitalCase(role);

const page = ref(1);
</script>

<template>
  <NuxtLayout>
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold text-gray-900">{{ headingRole }}</h1>

      <USelect
        v-model="expertiseArea"
        :options="expertiseAreas"
        icon="i-material-symbols-filter-list"
      />
    </div>

    <div
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      v-if="status === 'pending'"
    >
      <UCard v-for="i in 6">
        <USkeleton class="h-40" />
        <template #footer>
          <div class="space-y-2">
            <USkeleton v-for="i in 2" class="h-4" />
          </div>
        </template>
      </UCard>
    </div>

    <template v-else>
      <div class="space-y-4" v-if="users && users.length > 0">
        <div
          class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          <NuxtLink
            v-for="user in users"
            :key="user.id"
            :to="{ name: 'users-id', params: { id: user.id } }"
          >
            <UCard>
              <NuxtImg :src="user.imageUrl" />
              <template #footer>
                <div class="space-y-2">
                  <h3
                    class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                  >
                    {{ user.name }}
                  </h3>
                  <p class="text-sm">{{ user.expertiseArea }}</p>
                </div>
              </template>
            </UCard>
          </NuxtLink>
        </div>
        <div class="flex justify-end">
          <UPagination v-model="page" :total="users.length" />
        </div>
      </div>
      <p v-else>
        No {{ role === "npo-members" ? "NPO members" : noCase(role) }} found.
      </p>
    </template>
  </NuxtLayout>
</template>
