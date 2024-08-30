<template>
  <main class="flex min-h-screen items-center justify-center bg-gray-100">
    <UContainer :ui="{ padding: 'py-4' }" class="space-y-4 text-center">
      <h1 class="scroll-m-20 text-7xl font-extrabold tracking-tight">
        GrantHub
      </h1>
      <p class="scroll-m-20 text-xl tracking-tight">
        The nexus of funding and talent. Connect with like-minded innovators,
        secure grants, and bring your vision to life. Start your journey here!
      </p>
      <UButton to="/grants">Get Started</UButton>
    </UContainer>
  </main>
</template>
