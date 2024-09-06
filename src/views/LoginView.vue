<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'

import { checkEmailValidity } from '../utils/form-validation'

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const emailValid: Ref<null | boolean> = ref(null)
const emailFeedback = ref('')

const passwordValid: Ref<null | boolean> = ref(null)
const passwordFeedback = ref('')

function validateEmail() {
  const result = checkEmailValidity(email.value)
  emailValid.value = result.valid
  emailFeedback.value = result.message
}

function onEmailFocus() {
  onEmailInput()
}

function onEmailInput() {
  if (email.value == '') {
    emailValid.value = null
    return
  }

  if (emailValid.value != null) validateEmail()
}
function onEmailChange() {
  if (emailValid.value == null) validateEmail()
}

function validatePassword() {
  if (password.value.length > 0) {
    if (passwordValid.value != null) passwordValid.value = null
  } else {
    passwordValid.value = false
    passwordFeedback.value = 'Bitte gib ein Passwort ein.'
  }
}

function onPasswordInput() {
  if (passwordValid.value != null) validatePassword()
}

async function onSubmit() {
  validateEmail()
  validatePassword()

  if (!(emailValid.value == true && passwordValid.value != false)) return

  try {
    await authStore.login(email.value, password.value)
  } catch (error) {
    passwordValid.value = false
    if (error instanceof Error) {
      const { message } = error
      if (message.includes('invalid-email')) {
        passwordFeedback.value = 'Ungültige E-Mail-Adresse!'
        return
      } else {
        if (message.includes('invalid-credential')) {
          passwordFeedback.value = 'Ungültige Anmeldedaten!'
          return
        }
      }
    }

    passwordFeedback.value = 'Etwas ist schiefgelaufen. Versuche es später erneut.'
    console.error(error)
  }
}
</script>

<template>
  <div class="login-container">
    <BForm @submit.prevent="onSubmit">
      <BFormGroup
        label="E-Mail-Adresse"
        label-for="email-input"
        :valid-feedback="emailFeedback"
        :invalid-feedback="emailFeedback"
        :state="emailValid"
        floating
        ><BFormInput
          id="email-input"
          v-model="email"
          type="email"
          placeholder="E-Mail-Adresse"
          :state="emailValid"
          @focus="onEmailFocus"
          @input="onEmailInput"
          @change="onEmailChange"
      /></BFormGroup>
      <BFormGroup
        label="Passwort"
        label-for="password-input"
        :invalid-feedback="passwordFeedback"
        :state="passwordValid"
        floating
        ><BFormInput
          id="password-input"
          v-model="password"
          type="password"
          :state="passwordValid"
          placeholder="Passwort"
          @focus="passwordValid = null"
          @input="onPasswordInput"
      /></BFormGroup>
      <BButton type="submit" variant="primary">Anmelden</BButton>
    </BForm>
    <p>Noch kein Konto? Jetzt <RouterLink to="/register">registrieren</RouterLink>.</p>
  </div>
</template>
