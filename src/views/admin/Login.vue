<script setup>
import router from '@/router'
import api from '@/api'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const form = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const error = ref(null)

const userStore = useUserStore()

const doLogin = async () => {
  loading.value = true
  try {
    const response = await api.post('/admin/login', form.value)
    userStore.setUser(response.data.user)
    router.push('/admin')

  } catch (e) {
    console.dir(e)
    //console.log(e)
    const status = e.response?.status

    if (status === 401) {
      error.value = '帳號或密碼錯誤'
    } else {
      error.value = '系統錯誤，請稍後再試'
    }
  } finally {
    loading.value = false
  }

}
</script>

<template>
  <main class="login-page">
    <el-card class="login-card" shadow="always">
      <h2 class="title">後台登入</h2>

      <el-form :model="form" label-position="top">
        <el-form-item label="帳號">
          <el-input
            v-model="form.username"
            placeholder="請輸入帳號"
            autocomplete="username"
          />
        </el-form-item>

        <el-form-item label="密碼">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="請輸入密碼"
            show-password
            autocomplete="current-password"
          />
        </el-form-item>

        <el-button type="primary" class="login-btn" :loading="loading" @click="doLogin">
          登入
        </el-button>

        <p v-if="error" class="error-text">
          {{ error }}
        </p>


      </el-form>
    </el-card>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /*background: #f5f7fa;*/
}

.login-card {
  width: 360px;
}

.title {
  text-align: center;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
}

.error-text {
  color: red;
  margin-top: 8px;
  text-align: center;
}

</style>
