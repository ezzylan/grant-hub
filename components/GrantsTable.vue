<script setup lang="ts">
const columns = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "funder",
    label: "Funder",
    sortable: true,
  },
  {
    key: "availability",
    label: "Availability",
    sortable: true,
  },
  {
    key: "actions",
  },
];

const isEditOpen = ref(false);
const isDeleteOpen = ref(false);

const items = (row: { id: number }) => [
  [
    {
      label: "View Grant",
      icon: "i-heroicons-eye-20-solid",
      click: () => navigateTo(`/grants/${row.id}`),
    },
    {
      label: "Edit Grant",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => (isEditOpen.value = true),
    },
    {
      label: "Delete Grant",
      icon: "i-heroicons-trash-20-solid",
      click: () => (isDeleteOpen.value = true),
      class: "bg-red-500",
      labelClass: "text-white",
      iconClass: "text-white",
    },
  ],
];

const { grants } = defineProps<{ grants: SelectGrant[] }>();
const q = ref("");
const page = ref(1);
const pageCount = 5;

const rows = computed(() => {
  const start = (page.value - 1) * pageCount;
  const end = page.value * pageCount;

  if (!q.value) {
    return grants.slice(start, end);
  }

  return grants
    .filter((grant) => {
      return Object.values(grant).some((value) => {
        return String(value).toLowerCase().includes(q.value.toLowerCase());
      });
    })
    .slice(start, end);
});

const loading = ref(false);
const toast = useToast();

async function deleteGrant(grant: SelectGrant) {
  loading.value = true;

  try {
    await $fetch(`/api/grants/${grant.id}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Grant deleted successfully!",
      icon: "i-heroicons-check-circle",
      color: "green",
    });

    refreshNuxtData();
    isDeleteOpen.value = false;
  } catch (err) {
    toast.add({
      title: "Grant deletion failed!",
      description: "Please contact support for assistance.",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Grants</h4>

  <div class="flex border-b border-gray-200 px-3 py-3.5 dark:border-gray-700">
    <UInput v-model="q" placeholder="Filter grants..." />
  </div>

  <UTable class="rounded-md border bg-white" :rows :columns>
    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-ellipsis-horizontal-20-solid"
        />
      </UDropdown>

      <UModal v-model="isEditOpen">
        <div class="p-4">
          <LazyEditGrantForm @close-modal="isEditOpen = false" :grant="row" />
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
            This action cannot be undone. This will permanently delete the grant
            and remove it from our database.
          </p>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="gray" @click="isDeleteOpen = false">
                Cancel
              </UButton>
              <UButton :loading color="red" @click="deleteGrant(row)">{{
                loading ? "Deleting..." : "Continue"
              }}</UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </template>
  </UTable>

  <div
    class="flex justify-end border-t border-gray-200 px-3 py-3.5 dark:border-gray-700"
  >
    <UPagination
      v-model="page"
      :page-count="pageCount"
      :total="grants.length"
    />
  </div>
</template>
