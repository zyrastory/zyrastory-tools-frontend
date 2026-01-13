<template>
  <el-header height="60px" class="admin-header">
    <div class="header-left">
      <!-- <span class="logo">Admin Panel</span> -->
    </div>

    <div class="header-center">
      <span class="dashboard-link" @click="goDashboard">
        回 Dashboard
      </span>
    </div>

    <div class="header-right">
      <!-- 預留右上角使用者資訊 -->
      <!-- <span class="username">{{ userStore.displayName }}</span> -->
    </div>
  </el-header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElHeader } from 'element-plus'

const router = useRouter()
const goDashboard = () => router.push('/admin/dashboard')
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.header-left .logo {
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.dashboard-link {
  cursor: pointer;
  color: var(--el-color-primary);
  font-weight: 500;
}

.header-right .username {
  font-size: 14px;
  color: #333;
}
</style>
