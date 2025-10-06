<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth<768;
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>


<template>
  <div class="container">
    <el-row justify="center" class="mt-4">
      <el-col :span="20">
        <el-card class="mb-4">
          <h2>基本介紹</h2>
          <p>工程師撰寫的小工具，練練手順便解決平常的問題</p>
          <p>前端採用Vue.JS框架，後端則是Python進行串接</p>
          <br/>
          <p>技術類文章請前往主網域 ➡ <a href="https://zyrastory.com" style="font-size: 20px;">zyrastory.com</a></p>
          <p>裡面與朋友一起紀錄了一些程式教學、弱點掃描、美食(?)的文章</p>
        </el-card>

        <el-card class="mb-4">
          <h2>網站版本資訊</h2>
          <el-descriptions border :column="isMobile ? 1 : 3">
            <el-descriptions-item label="版本">v1.0</el-descriptions-item>
            <el-descriptions-item label="功能">線上圖片轉換、壓縮、裁切功能</el-descriptions-item>
            <el-descriptions-item label="備註">子網域誕生囉!!</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="mb-4">
          <h2>聯絡方式</h2>
          <p>如有任何意見或想要甚麼功能，都歡迎透過以下幾種方式聯絡</p>
          <ul>
            <li>Email: <a href="mailto:zyrastory@gmail.com"  target="_blank">  zyrastory@gmail.com</a></li>
            <li>GitHub: <a href="https://github.com/zyrastory" target="_blank"> zyrastory</a></li>
            <li>FaceBook : <a href="https://www.facebook.com/zyrastory" target="_blank" rel="noopener noreferrer">Zyrastory 程式美食研究中心 | Facebook</a></li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1.5rem;
}

.el-card h2{
  margin-bottom: 1rem;
}


</style>
