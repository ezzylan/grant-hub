<script setup lang="ts">
import { capitalCase, noCase } from "change-case";

const route = useRoute();
const role = route.params.role as string;
const title = role === "npo-members" ? "NPO Members" : capitalCase(role);

useHead({ title });

const expertiseArea = ref(`All ${title}`);
const expertiseAreas = [expertiseArea.value];

const { data: fetchedExpertiseAreas } = await useFetch("/api/expertise-areas");

if (fetchedExpertiseAreas.value) {
  expertiseAreas.push(...fetchedExpertiseAreas.value);
}

const { data: users } = await useFetch(`/api/${role}`, {
  query: { expertiseArea },
  watch: [expertiseArea],
  transform: (users: SelectUser[]) => {
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      expertiseArea: user.expertiseArea,
    }));
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
            <NuxtImg :src="`https://placehold.co/400?text=User`" />
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
  </NuxtLayout>
</template>
