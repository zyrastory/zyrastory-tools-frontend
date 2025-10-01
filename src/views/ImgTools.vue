<script lang="ts" setup>
import { ref, watch } from 'vue'

import type { TabsPaneContext } from 'element-plus'

import ImgConvert from './ImgConvert.vue'
import ImgCompress from './ImgCompress.vue'
import ImgCropper from './ImgCropper.vue'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
import { useHead } from "@vueuse/head";
watch(activeName, (val) => {
  let title = "工具箱";
  let meta = [];
  if (val === "first"){
    title = '線上圖片轉檔'
    meta = [
      { name: 'description', content: '免費線上圖片轉檔 zyrastory tools' },
      { property: 'og:title', content: '線上圖片轉檔' },
      { property: 'og:description', content: '免費線上圖片轉檔 zyrastory tools' }
    ]
  }
  if (val === "second"){
    title = '線上圖片壓縮'
    meta = [
      { name: 'description', content: '免費線上圖片壓縮 zyrastory tools' },
      { property: 'og:title', content: '線上圖片壓縮' },
      { property: 'og:description', content: '免費線上圖片壓縮 zyrastory tools' }
    ]
  }
  if (val === "third"){
    title = '線上圖片裁切(指定證照大小)'
    meta = [
      { name: 'description', content: '免費線上圖片裁切(指定證照大小) zyrastory tools' },
      { property: 'og:title', content: '線上圖片裁切儲存' },
      { property: 'og:description', content: '免費線上圖片裁切(指定證照大小) zyrastory tools' }
    ]

  }
  useHead({ title:title,meta:meta });
}, { immediate: true });

</script>


<template>
  <!-- <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick" type="border-card"> -->
  <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
    <el-tab-pane label="圖片轉檔" name="first">
      <div class="custom-tab-content">
        <ImgConvert />
      </div>
    </el-tab-pane>
    <el-tab-pane label="圖片壓縮" name="second">
      <div class="custom-tab-content">
       <ImgCompress />
      </div>
    </el-tab-pane>
    <el-tab-pane label="證照裁切" name="third">
      <div class="custom-tab-content">
       <ImgCropper />
      </div>
    </el-tab-pane>
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