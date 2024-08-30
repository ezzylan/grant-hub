<script setup lang="ts">
import { userLogInFormSchema } from "#imports";
import type { FormSubmitEvent } from "#ui/types";

const state = reactive({
  email: undefined,
  password: undefined,
});

const loading = ref(false);
const form = ref();
const toast = useToast();

async function onSubmit(event: FormSubmitEvent<UserLogInFormSchema>) {
  loading.value = true;
  form.value.clear();

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: event.data,
    });

    reloadNuxtApp();
  } catch (err) {
    if (err.statusCode === 422) {
      form.value.setErrors(
        err.data.errors.map((err) => ({
          // Map validation errors to { path: string, message: string }
          message: err.message,
          path: err.path,
        })),
      );
    } else {
      toast.add({
        title: "Login failed!",
        description: "Please check your email and password.",
        icon: "i-heroicons-exclamation-circle",
        color: "red",
      });
    }
  }
}
</script>

<template>
  <UForm
    ref="form"
    :schema="userLogInFormSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="Email" name="email" required>
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password" required>
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton :loading type="submit">{{
      loading ? "Submitting..." : "Submit"
    }}</UButton>
  </UForm>
</template>
