<script setup lang="ts">
const route = useRoute();

const { data } = await useFetch(`/api/users/${route.params.id}`);

useHead({ title: data.value?.fetchedUser.name });

const { user } = useUserSession();
const isOpen = ref(false);
</script>

<template>
  <NuxtLayout>
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ data?.fetchedUser.name }}
      </h1>

      <!-- <Can :ability="editUser" :args="[user]"> -->
      <UButton
        v-if="user?.id === Number(route.params.id)"
        @click="isOpen = true"
      >
        Edit Profile
      </UButton>
      <!-- </Can> -->
    </div>

    <p>{{ data?.fetchedUser.email }} | {{ data?.fetchedUser.contactNo }}</p>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NuxtImg :src="`https://placehold.co/400?text=User`" />

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

    <!-- <Can :ability="showUserGrants" :args="[user]"> -->
    <div
      v-if="
        user?.id === Number(route.params.id) &&
        data?.grants &&
        data?.grants.length > 0
      "
    >
      <UDivider class="mb-4" />
      <GrantsTable :grants="data?.grants" />
    </div>
    <!-- </Can> -->

    <UModal v-if="data?.fetchedUser" v-model="isOpen">
      <div class="p-4">
        <LazyEditProfileForm
          @close-modal="isOpen = false"
          :user="data?.fetchedUser"
        />
      </div>
    </UModal>
  </NuxtLayout>
</template>
