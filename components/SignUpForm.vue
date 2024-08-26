<script setup lang="ts">
import { userSignUpFormSchema } from "#imports";
import type { FormSubmitEvent } from "#ui/types";

const emit = defineEmits<{ (e: "closeModal"): void }>();

const state = reactive({
  name: undefined,
  email: undefined,
  password: undefined,
  contactNo: undefined,
  role: "Academician",
  organization: undefined,
  position: undefined,
  qualification: "Bac Degree",
  otherQualification: undefined,
  expertiseArea: undefined,
  interestArea: undefined,
});

watch(state, () => {
  if (state.otherQualification === "") {
    state.otherQualification = undefined;
  }
});

const qualifications = [
  { label: "Bac Degree", value: "Bac Degree" },
  { label: "Master", value: "Master" },
  { label: "PhD", value: "PhD" },
  { label: "Others", value: "Others" },
];

const form = ref();

async function onSubmit(event: FormSubmitEvent<UserSignUpFormSchema>) {
  form.value.clear();

  try {
    await $fetch("/api/auth/signup", {
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
    }
  }
}
</script>

<template>
  <UForm
    ref="form"
    :schema="userSignUpFormSchema"
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

    <UFormGroup label="Password" name="password" required>
      <UInput v-model="state.password" type="password" />
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
