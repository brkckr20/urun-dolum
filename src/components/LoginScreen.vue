<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4" style="width: 20rem;">
        <div class="card-body">
          <h5 class="card-title text-center mb-3">Giriş Yap</h5>
          <select class="form-select mb-3" v-model="username">
            <option value="" disabled selected>Seçiniz</option>
            <option value="aynur">Aynur</option>
            <option value="seda">Seda</option>
          </select>
          <input class="form-control mb-3" v-model="password" type="password" placeholder="Şifre" />
          <button class="btn btn-primary w-100" @click="login">Giriş Yap</button>
        </div>
      </div>
    </div>
  </template>
  

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useRouter } from 'vue-router'

// Reaktif veriler
const username = ref('')
const password = ref('')

// Vue Router için hook
const router = useRouter()

// Giriş yapma fonksiyonu
const login = async () => {
  const email = username.value + '@example.com'
  const userPassword = password.value
  try {
    await signInWithEmailAndPassword(auth, email, userPassword) 
    sessionStorage.setItem('user', username.value);
    router.push('/materials')
  } catch (error) {
    console.error('Giriş hatası:', error.message)
  }
}
</script>


