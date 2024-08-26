<script setup lang="ts">
const route = useRoute();

const { data: grant } = await useFetch(`/api/grants/${route.params.id}`);

useHead({ title: grant.value?.name });

const greenBadge = [
  "Open for Application",
  "Rolling Application",
  "Awarded",
  "Reopened",
];
const orangeBadge = ["Deadline Approaching"];
const redBadge = ["Closed for Application", "Grant Closed"];
const yellowBadge = [
  "Pre-Announcement",
  "Under Review",
  "Award Decision Pending",
];

function getBadgeColor(availability: string) {
  if (greenBadge.includes(availability)) {
    return "green";
  } else if (orangeBadge.includes(availability)) {
    return "orange";
  } else if (redBadge.includes(availability)) {
    return "red";
  } else if (yellowBadge.includes(availability)) {
    return "yellow";
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="flex justify-between">
      <div class="flex gap-2">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ grant?.name }}
        </h1>
        <UButton
          icon="i-heroicons-arrow-top-right-on-square-20-solid"
          size="sm"
          square
          color="gray"
          variant="ghost"
          :to="`${grant?.websiteLink}`"
          target="_blank"
        />
      </div>

      <UBadge :color="getBadgeColor(grant?.availability!)">
        {{ grant?.availability }}
      </UBadge>
    </div>

    <p>By {{ grant?.funder }}</p>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NuxtImg :src="`https://placehold.co/1000?text=Grant`" />

      <div class="space-y-4">
        <UCard>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Category
            </h4>
            <p>{{ grant?.category }}</p>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Ceiling
            </h4>
            <p>RM {{ grant?.ceiling }}</p>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Expected Grant Call
            </h4>
            <p>{{ grant?.expectedGrantCall }}</p>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
              Deadline
            </h4>
            <p>{{ grant?.deadline }}</p>
          </div>
        </UCard>

        <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
          Description
        </h4>
        <p>{{ grant?.description }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>
