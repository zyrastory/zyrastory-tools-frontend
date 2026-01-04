<template>
  <div class="admin-root">
    <div class="admin-page">
      <!-- 預留 Header 區 -->
      <div class="admin-header">
        <AdminHeader/>
      </div>
      <div class="admin-container">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminHeader from '@/components/AdminHeader.vue'
</script>

<style scoped>
.admin-root {
  min-height: 100vh;
  background: #36393F; 
}

.admin-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 頂部保留空間 */
.admin-header {
  width: 100%;
  height: 64px;      
  display: flex;
  align-items: center;
}

.admin-container {
  width: 90%;
  max-width: 1400px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  margin-top: 20px; /* 防止跟header貼在一起 */
}

</style>