<script setup lang="ts">
import { grantFormSchema } from "#imports";
import type { FormSubmitEvent } from "#ui/types";

const state = reactive({
  name: undefined,
  funder: undefined,
  category: undefined,
  description: undefined,
  websiteLink: undefined,
  ceiling: undefined,
  expectedGrantCall: undefined,
  deadline: undefined,
  availability: undefined,
});

const availabilities = [
  "Pre-Announcement",
  "Open for Application",
  "Rolling Application",
  "Deadline Approaching",
  "Closed for Application",
  "Under Review",
  "Award Decision Pending",
  "Awarded",
  "Reopened",
  "Grant Closed",
];

const form = ref();
const toast = useToast();

const emit = defineEmits<{ (e: "closeModal"): void }>();

async function onSubmit(event: FormSubmitEvent<GrantFormSchema>) {
  form.value.clear();

  try {
    await $fetch("/api/grants", {
      method: "POST",
      body: event.data,
    });

    toast.add({
      title: "Grant added successfully!",
      description: "You can now view your grant on the dashboard.",
      icon: "i-heroicons-check-circle",
      color: "green",
    });

    refreshNuxtData();
    emit("closeModal");
  } catch (err) {
    if (err.statusCode === 422) {
      form.value.setErrors(
        err.data.errors.map((err) => ({
          // Map validation errors to { path: string, message: string }
          message: err.message,
          path: err.path,
        })),
      );
    }
  }
}
</script>

<template>
  <UForm
    ref="form"
    :schema="grantFormSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup required label="Grant Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup required label="Grant Funder" name="funder">
      <UInput v-model="state.funder" />
    </UFormGroup>

    <UFormGroup required label="Grant Category" name="category">
      <USelect
        v-model="state.category"
        placeholder="Select category..."
        :options="['Industry', 'Government', 'University']"
      />
    </UFormGroup>

    <UFormGroup required label="Grant Brief Description" name="description">
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <UFormGroup
      required
      label="Grant Website Link"
      name="websiteLink"
      help="Make sure the link contains 'https://'."
    >
      <UInput v-model="state.websiteLink" />
    </UFormGroup>

    <UFormGroup required label="Grant Ceiling (RM)" name="ceiling">
      <UInput v-model="state.ceiling" type="number" step="10000" />
    </UFormGroup>

    <UFormGroup required label="Expected Grant Call" name="expectedGrantCall">
      <UInput v-model="state.expectedGrantCall" />
    </UFormGroup>

    <UFormGroup required label="Grant Deadline" name="deadline">
      <UInput v-model="state.deadline" />
    </UFormGroup>

    <UFormGroup required label="Grant Availability" name="availability">
      <USelect
        v-model="state.availability"
        placeholder="Select availability..."
        :options="availabilities"
      />
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
