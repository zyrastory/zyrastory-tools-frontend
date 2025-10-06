<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { TabsPaneContext } from 'element-plus'


const activeName = ref('first')
const route = useRoute()
const router = useRouter()

function onTabChange(tabPane) {
  router.push({ name: tabPane.paneName })
}
</script>


<template>
  <!-- <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick" type="border-card"> -->
  <el-tabs v-model="activeName" class="tabs" @tab-click="onTabChange">
    <el-tab-pane label="圖片轉檔" name="convert" />
    <el-tab-pane label="圖片壓縮" name="compress" />
    <el-tab-pane label="圖片裁切" name="cropper" />

    <div class="custom-tab-content">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  </el-tabs>
</template>



<style>
.tabs > .el-tabs__content {
  /* padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600; */  
  flex: 1;             /* 自動撐滿剩餘空間 */
  /* 內容多時滾動 */
  /* overflow-y: auto;     */
}

.custom-tab-content{
  display: flex;
  justify-content: center; /* 水平置中 */
}

.el-tab-pane>.main{
  justify-content: center; /* 水平置中內容 */
}

.tabs {
  display: flex;
  flex-direction: column;
  min-height: 600px;       /* 整個 Tabs 高度 */

  width: 60%;
}

/*下面這個是tab標籤的 */
.el-tabs__item{
  font-size: 24px;
  padding: 24px 48px;  /* 前上下 後左右 */


  color: aliceblue;
}

.el-tabs__nav{
  justify-content: center; /* 水平置中標籤 */
  float: none;
}


/* 手機tabs 相關 */
@media (max-width: 768px) {
  .tabs {
    width: 90%;
  }

  .el-tabs__item{
    font-size: 16px;
    padding: 12px 24px;  /* 前上下 後左右 */

  }
}

</style>