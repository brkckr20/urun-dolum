<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4" style="width: 20rem;">
      <div class="card-body">
        <h5 class="card-title text-center mb-3">Giriş Yap</h5>
        <select class="form-select mb-3" v-model="username">
          <option value="" disabled selected>Seçiniz</option>
          <option value="aynur">Aynur</option>
        </select>
        <input class="form-control mb-3" v-model="password" type="password" placeholder="Şifre" />
        <div class="d-flex justify-content-around mb-3">
          <div>
            <input class="form-check-input" v-model="paintOrEpoxy" type="radio" id="paint" value="paint" required />
            <label class="form-check-label mx-2" for="paint">Boya</label>
          </div>
          <div>
            <input class="form-check-input" v-model="paintOrEpoxy" type="radio" id="epoxy" value="epoxy" required />
            <label class="form-check-label mx-2" for="epoxy">Epoksi</label>
          </div>
        </div>
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

const username = ref('')
const password = ref('')
const paintOrEpoxy = ref('');

const router = useRouter();

const login = async () => {
  if (!paintOrEpoxy.value) {
    alert('Lütfen bir seçenek seçin.');
  }
  const email = username.value + '@example.com'
  const userPassword = password.value
  try {
    await signInWithEmailAndPassword(auth, email, userPassword)
    sessionStorage.setItem('user', username.value);
    sessionStorage.setItem('paintOrEpoxy', paintOrEpoxy.value);
    router.push('/materials')
  } catch (error) {
    console.error('Giriş hatası:', error.message)
  }
}
</script>
