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
  imageUrl: "",
});

const toast = useToast();

const { startUpload } = useUploadThing("signUpImageUploader", {
  onClientUploadComplete(res) {
    state.imageUrl = res[0].url;
  },
  onUploadError() {
    toast.add({
      title: "Grant image upload failed!",
      description: "Try checking the file size.",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  },
});

const loading = ref(false);
const form = ref();
const imageFile = ref<File | null>(null);
const emit = defineEmits<{ (e: "closeModal"): void }>();

async function onSubmit(event: FormSubmitEvent<GrantFormSchema>) {
  loading.value = true;
  form.value.clear();

  try {
    const result = imageFile.value && (await startUpload([imageFile.value]));

    if (result) {
      await $fetch("/api/grants", {
        method: "POST",
        body: event.data,
      });

      refreshNuxtData();
      emit("closeModal");

      toast.add({
        title: "Grant added successfully!",
        description: "You can now view your grant on the dashboard.",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    }
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
  } finally {
    loading.value = false;
  }
}

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

    <UFormGroup
      label="Grant Image"
      name="imageFile"
      hint="File size must be less than 1MB"
      required
    >
      <UInput
        type="file"
        accept="image/*"
        @input="
          (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            imageFile = file;
          }
        "
      />
    </UFormGroup>

    <UButton :loading type="submit">{{
      loading ? "Submitting..." : "Submit"
    }}</UButton>
  </UForm>
</template>
