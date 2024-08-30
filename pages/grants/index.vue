<script setup lang="ts">
useHead({ title: "Grants" });

const category = ref("All Grants");
const categories = ["All Grants", "Industry", "University", "Government"];

const { status, data: grants } = await useLazyFetch("/api/grants", {
  query: { category },
  watch: [category],
  transform: (grants) => {
    const fetchedGrants = grants.map((grant) => ({
      id: grant.id,
      name: grant.name,
      funder: grant.funder,
      availability: grant.availability,
    }));

    return { ...fetchedGrants, fetchedAt: new Date() };
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

const page = ref(1);
</script>

<template>
  <NuxtLayout>
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Grants</h1>
      <USelect
        v-model="category"
        :options="categories"
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
            <USkeleton v-for="i in 3" class="h-4" />
          </div>
        </template>
      </UCard>
    </div>

    <template v-else>
      <div class="space-y-4" v-if="grants && grants.length > 0">
        <div
          class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          <NuxtLink
            v-for="grant in grants"
            :key="grant.id"
            :to="{ name: 'grants-id', params: { id: grant.id } }"
          >
            <UCard>
              <NuxtImg :src="`https://placehold.co/400?text=Grant`" />
              <template #footer>
                <div class="space-y-2">
                  <h3
                    class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                  >
                    {{ grant.name }}
                  </h3>
                  <p class="text-sm">{{ grant.funder }}</p>
                  <UBadge
                    :color="
                      grant.availability === 'Available' ? 'green' : 'red'
                    "
                  >
                    {{ grant.availability }}
                  </UBadge>
                </div>
              </template>
            </UCard>
          </NuxtLink>
        </div>

        <div class="flex justify-end">
          <UPagination v-model="page" :total="grants.length" />
        </div>
      </div>

      <p v-else>No grants found.</p>
    </template>
  </NuxtLayout>
</template>
