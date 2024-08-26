<template>
  <main class="flex min-h-screen items-center justify-center bg-gray-100">
    <UContainer :ui="{ padding: 'py-4' }" class="space-y-4 text-center">
      <h1
        class="scroll-m-20 text-7xl font-extrabold tracking-tight md:text-8xl lg:text-9xl"
      >
        GrantHub
      </h1>
      <UButton to="/grants">Get Started</UButton>
    </UContainer>
  </main>
</template>
