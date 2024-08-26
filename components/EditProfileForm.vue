<script setup lang="ts">
import { editUserFormSchema } from "#imports";
import type { FormSubmitEvent } from "#ui/types";

const emit = defineEmits<{ (e: "closeModal"): void }>();
const { user } = defineProps<{ user: SelectUser }>();

const qualifications = [
  { label: "Bac Degree", value: "Bac Degree" },
  { label: "Master", value: "Master" },
  { label: "PhD", value: "PhD" },
  { label: "Others", value: "Others" },
];

const qualificationsArray = qualifications
  .filter((q) => q.label !== "Others")
  .map((q) => q.label);

const state = reactive({
  name: user.name,
  email: user.email,
  contactNo: user.contactNo,
  role: user.role,
  organization: user.organization,
  position: user.position,
  qualification: !qualificationsArray.includes(user.qualification)
    ? "Others"
    : user.qualification,
  otherQualification: !qualificationsArray.includes(user.qualification)
    ? user.qualification
    : undefined,
  expertiseArea: user.expertiseArea,
  interestArea: user.interestArea,
});

watch(state, () => {
  if (state.otherQualification === "") {
    state.otherQualification = undefined;
  }
});

const form = ref();
const route = useRoute();
const toast = useToast();

async function onSubmit(event: FormSubmitEvent<EditUserFormSchema>) {
  form.value.clear();

  try {
    await $fetch(`/api/users/${route.params.id}`, {
      method: "PATCH",
      body: event.data,
    });

    refreshNuxtData();
    emit("closeModal");

    toast.add({
      title: "Profile updated successfully!",
      icon: "i-heroicons-check-circle",
      color: "green",
    });
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
    :schema="editUserFormSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="Name" name="name" required>
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup label="Email" name="email" required>
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password">
      <UInput
        type="password"
        disabled
        placeholder="Contact admin to change password"
      />
    </UFormGroup>

    <UFormGroup label="Contact Number" name="contactNo" required>
      <UInput v-model="state.contactNo" />
    </UFormGroup>

    <UFormGroup label="Role" required>
      <USelect
        v-model="state.role"
        placeholder="Select role..."
        :options="[
          'Academician',
          'Professionals/Industry Expert',
          'Community Member',
          'Non-Profit Organization Member',
          'Other',
        ]"
      />
    </UFormGroup>

    <UFormGroup label="Organization" name="organization" required>
      <UInput v-model="state.organization" />
    </UFormGroup>

    <UFormGroup label="Position" name="position" required>
      <UInput v-model="state.position" />
    </UFormGroup>

    <UFormGroup label="Qualification" name="qualification" required>
      <div class="space-y-2">
        <URadioGroup v-model="state.qualification" :options="qualifications" />
        <UInput
          v-if="state.qualification === 'Others'"
          v-model="state.otherQualification"
        />
      </div>
    </UFormGroup>

    <UFormGroup label="Expertise Area" name="expertiseArea" required>
      <UInput v-model="state.expertiseArea" />
    </UFormGroup>

    <UFormGroup label="Interest Area" name="interestArea" required>
      <UInput v-model="state.interestArea" />
    </UFormGroup>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
