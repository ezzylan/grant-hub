<script setup lang="ts">
const route = useRoute();

const { data } = await useFetch(`/api/users/${route.params.id}`, {
  transform: (input) => {
    return { ...input, fetchedAt: new Date() };
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

useHead({ title: data.value?.fetchedUser.name });

const { user, clear } = useUserSession();
const isEditOpen = ref(false);
const isDeleteOpen = ref(false);
const loading = ref(false);
const toast = useToast();

async function deleteUser() {
  loading.value = true;

  try {
    await $fetch(`/api/users/${user.value?.id}`, {
      method: "DELETE",
    });

    clear();
    await navigateTo("/grants");

    toast.add({
      title: "Account deleted successfully!",
      icon: "i-heroicons-check-circle",
      color: "green",
    });
  } catch (err) {
    loading.value = false;

    toast.add({
      title: "Account deletion failed!",
      description: "Please contact support for assistance.",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ data?.fetchedUser.name }}
      </h1>

      <div class="space-x-2" v-if="user?.id === Number(route.params.id)">
        <UButton
          icon="i-heroicons-pencil-square"
          label="Edit"
          @click="isEditOpen = true"
        />
        <UButton
          icon="i-heroicons-trash"
          color="red"
          label="Delete"
          @click="isDeleteOpen = true"
        />
      </div>
    </div>

    <p>{{ data?.fetchedUser.email }} | {{ data?.fetchedUser.contactNo }}</p>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NuxtImg
        :src="data?.fetchedUser.imageUrl ?? undefined"
        width="300"
        height="300"
      />

      <div class="space-y-4">
        <UCard>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Role
            </h4>
            <p>{{ data?.fetchedUser.role }}</p>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Organization
            </h4>
            <p>{{ data?.fetchedUser.organization }}</p>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Position
            </h4>
            <p>{{ data?.fetchedUser.position }}</p>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Qualification
            </h4>
            <p>{{ data?.fetchedUser.qualification }}</p>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Expertise Area
            </h4>
            <p>{{ data?.fetchedUser.expertiseArea }}</p>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Interest Area
            </h4>
            <p>{{ data?.fetchedUser.interestArea }}</p>
          </div>
        </UCard>
      </div>
    </div>

    <template
      v-if="
        user?.id === Number(route.params.id) && data && data.grants.length > 0
      "
    >
      <UDivider class="mb-4" />
      <GrantsTable :grants="data.grants" />
    </template>

    <UModal v-if="data" v-model="isEditOpen">
      <div class="p-4">
        <LazyEditProfileForm
          @close-modal="isEditOpen = false"
          :user="data.fetchedUser"
        />
      </div>
    </UModal>

    <UModal v-model="isDeleteOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
          Are you absolutely sure?
        </h4>
        <p>
          This action cannot be undone. This will permanently delete your
          account and remove it from our database.
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" @click="isDeleteOpen = false">
              Cancel
            </UButton>
            <UButton :loading color="red" @click="deleteUser">{{
              loading ? "Deleting..." : "Continue"
            }}</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </NuxtLayout>
</template>
