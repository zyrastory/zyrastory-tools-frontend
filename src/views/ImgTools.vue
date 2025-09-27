<script lang="ts" setup>
import { ref } from 'vue'

import type { TabsPaneContext } from 'element-plus'

import ImgConvert from './Img.vue'
import ImageCompress from './ImgCompress.vue'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>


<template>
  <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick" type="border-card">
    <el-tab-pane label="圖片轉檔" name="first">
      <div class="custom-tab-content">
        <ImgConvert />
      </div>
    </el-tab-pane>
    <el-tab-pane label="圖片壓縮" name="second">
      <div class="custom-tab-content">
       <ImageCompress />
      </div>
    </el-tab-pane>
    <el-tab-pane label="證照裁切" name="third">待辦</el-tab-pane>
  </el-tabs>
</template>



<style>
.tabs > .el-tabs__content {
  /* padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600; */  
  flex: 1;             /* 自動撐滿剩餘空間 */
  overflow-y: auto;    /* 內容多時滾動 */
}

.custom-tab-content{
  display: flex;
  justify-content: center; /* 水平置中 */
  text-align: center;  /* 水平置中 */
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


</style>