<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - GrantHub` : "GrantHub";
  },
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtPage />
  <UNotifications />
</template>
