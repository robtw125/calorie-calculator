<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { BButton, BForm, BFormGroup, BFormInput } from 'bootstrap-vue-next'

import { checkEmailValidity, checkPasswordValidity } from '@/utils/form-validation'

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const cnfPassword = ref('')

const emailState: Ref<null | boolean> = ref(null)
const emailFeedback = ref('')

const passwordState: Ref<null | boolean> = ref(null)
const passwordFeedback = ref('')

const cnfPasswordState: Ref<null | boolean> = ref(null)
const cnfPasswordFeedback = ref('')

const registerError = ref('')

async function validateEmail() {
  const result = await checkEmailValidity(email.value)
  emailState.value = result.valid
  emailFeedback.value = result.message
}

async function validatePassword() {
  const result = await checkPasswordValidity(password.value)
  passwordState.value = result.valid
  passwordFeedback.value = result.message
}

function validateCnfPassword() {
  if (password.value.length > 0) {
    if (password.value == cnfPassword.value) {
      cnfPasswordState.value = true
      cnfPasswordFeedback.value = 'Beide Passwörter stimmen überein.'
    } else {
      cnfPasswordState.value = false
      cnfPasswordFeedback.value = 'Die beiden Passwörter müssen übereinstimmen.'
    }
  }
}

async function onSubmit() {
  validateEmail()
  await validatePassword()
  validateCnfPassword()

  if (!(emailState.value && passwordState.value && cnfPasswordState.value)) return

  try {
    await authStore.register(email.value, password.value)
    registerError.value = ''
  } catch (error) {
    if (error instanceof Error) {
      const { message } = error
      if (message.includes('email-already-in-use')) {
        registerError.value = 'Es existiert bereits ein Konto mit dieser E-Mail-Adresse.'
      }
    }
  }
}
</script>
<template>
  <div class="register-container">
    <BForm @submit.prevent="onSubmit">
      <BFormGroup
        label="E-Mail-Adresse"
        label-for="email-input"
        :state="emailState"
        :valid-feedback="emailFeedback"
        :invalid-feedback="emailFeedback"
        floating
      >
        <BFormInput
          id="email-input"
          :state="emailState"
          v-model="email"
          placeholder="E-Mail-Adresse"
          type="email"
          @change="validateEmail"
        />
      </BFormGroup>
      <BFormGroup
        label="Passwort"
        label-for="password-input"
        :state="passwordState"
        :valid-feedback="passwordFeedback"
        :invalid-feedback="passwordFeedback"
        floating
      >
        <BFormInput
          id="password-input"
          :state="passwordState"
          v-model="password"
          placeholder="Passwort"
          type="password"
          @change="validatePassword"
        />
      </BFormGroup>
      <BFormGroup
        label="Passwort bestätigen"
        label-for="cnf-password-input"
        :state="cnfPasswordState"
        :valid-feedback="cnfPasswordFeedback"
        :invalid-feedback="cnfPasswordFeedback"
        floating
      >
        <BFormInput
          id="cnf-password-input"
          :state="cnfPasswordState"
          v-model="cnfPassword"
          placeholder="Passwort bestätigen"
          type="password"
          @change="validateCnfPassword"
        />
      </BFormGroup>
      <p>{{ registerError }}</p>
      <BButton type="submit">Registrieren</BButton>
    </BForm>
    <p>Bereits ein Konto? Jetzt <RouterLink to="/login">anmelden</RouterLink>.</p>
  </div>
</template>
