<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const { loggedIn, user, clear } = useUserSession();

const navLinks = [
  {
    label: "Grants",
    labelClass: `sm:hidden ${loggedIn.value ? "xl:block" : "lg:block"}`,
    icon: "i-heroicons-document-currency-dollar",
    to: "/grants",
  },
  {
    label: "Academicians",
    labelClass: `sm:hidden ${loggedIn.value ? "xl:block" : "lg:block"}`,
    icon: "i-heroicons-academic-cap",
    to: "/academicians",
  },
  {
    label: "Professionals",
    labelClass: `sm:hidden ${loggedIn.value ? "xl:block" : "lg:block"}`,
    icon: "i-heroicons-briefcase",
    to: "/professionals",
  },
  {
    label: "Community Members",
    labelClass: `sm:hidden ${loggedIn.value ? "xl:block" : "lg:block"}`,
    icon: "i-heroicons-globe-alt",
    to: "/community-members",
  },
  {
    label: "NPO Members",
    labelClass: `sm:hidden ${loggedIn.value ? "xl:block" : "lg:block"}`,
    icon: "i-heroicons-heart",
    to: "/npo-members",
  },
  {
    label: "Other",
    labelClass: `sm:hidden ${loggedIn.value ? "xl:block" : "lg:block"}`,
    icon: "i-heroicons-question-mark-circle",
    to: "/others",
  },
];

const logInModalItems = [
  {
    label: "Log In",
    icon: "i-heroicons-arrow-right-end-on-rectangle",
  },
  {
    label: "Sign Up",
    icon: "i-heroicons-clipboard-document-list",
  },
];

const isAddGrantOpen = ref(false);

const userDropdownItems = [
  [
    {
      label: "Add Grant",
      icon: "i-heroicons-plus-20-solid",
      iconClass: "text-white",
      class: "bg-red-500 text-white",
      click: () => {
        isAddGrantOpen.value = true;
      },
    },
  ],
  [
    {
      label: "View Profile",
      icon: "i-heroicons-eye-20-solid",
      click: async () => {
        await navigateTo(`/users/${user.value?.id}`);
      },
    },
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-on-rectangle-20-solid",
      click: clear,
    },
  ],
];

const { width } = useWindowSize();
const isLogInOpen = ref(false);
</script>

<template>
  <header
    class="flex items-center justify-between gap-2 border-b-2 px-4 py-3 lg:container lg:mx-auto"
  >
    <UDropdown :items="[navLinks]" class="sm:hidden">
      <UButton
        icon="i-solar-hamburger-menu-linear"
        size="xl"
        color="primary"
        square
        variant="ghost"
      />
    </UDropdown>

    <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">GrantHub</h4>

    <UHorizontalNavigation
      :ui="{ wrapper: 'w-fit' }"
      v-if="width >= 640"
      :links="navLinks"
    >
      <template #icon="{ link }">
        <UTooltip :text="link.label">
          <UIcon :name="link.icon" class="h-5 w-5" />
        </UTooltip>
      </template>
    </UHorizontalNavigation>

    <UDropdown
      v-if="loggedIn"
      :items="userDropdownItems"
      :popper="{ placement: 'bottom-end' }"
    >
      <UButton
        color="white"
        trailing-icon="i-heroicons-chevron-down-20-solid"
        class="space-x-2 shadow-sm hover:shadow-md"
      >
        <UAvatar
          :src="user?.imageUrl ?? undefined"
          :alt="user?.name"
          size="sm"
        />
        <div class="hidden text-left md:block">
          <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {{ user?.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ user?.email }}
          </p>
        </div>
      </UButton>
    </UDropdown>

    <UButton v-else @click="isLogInOpen = true">Log In</UButton>
  </header>

  <main class="min-h-screen bg-gray-100">
    <UContainer :ui="{ padding: 'py-4' }" class="space-y-4">
      <slot />
    </UContainer>
  </main>

  <UModal v-model="isLogInOpen">
    <div class="space-y-2 p-4">
      <UTabs :items="logInModalItems">
        <template #item="{ item }">
          <LazyLogInForm v-if="item.label === 'Log In'" />
          <LazySignUpForm v-if="item.label === 'Sign Up'" />
        </template>
      </UTabs>
    </div>
  </UModal>

  <UModal v-model="isAddGrantOpen">
    <div class="p-4">
      <LazyAddGrantForm @close-modal="isAddGrantOpen = false" />
    </div>
  </UModal>
</template>
