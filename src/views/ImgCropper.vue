<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-11 card-light">
        <h1>線上證照裁切</h1>
        <br/>
        <div class="cropper-div">
          <el-radio-group v-model="selectedSize" class="size-selector">
            <el-card
              v-for="item in options"
              :key="item.value"
              shadow="hover"
              class="size-card"
              :class="{ active: selectedSize === item.value }"
              @click="cardClick(item)"
            >
              <div class="card-content">
                <div class="title">{{ item.label }}</div>
                <div class="desc">{{ item.size }}</div>
                <div class="memo">{{ item.memo }}</div> 
              </div>
            </el-card>
          </el-radio-group>
        </div>
        <br/>
        <!-- 上傳圖片 -->
        <input type="file" accept="image/*" @change="onFileChange" />
        
        <br/>
        <br/>

        <div class="cropper-div">
          <div class="img-box">
            <img id="orgImg" />
          </div>
      
          <div class="preview" id="previewImg"></div>

        </div>

        <el-button size="large" type="success" @click="uploadFiles">裁切圖片</el-button>
        
        <br />
        <br />
        <br />
        <div class="alert alert-info mt-3">
          <div>
            <font-awesome-icon icon="fa-solid fa-circle-info" class="alert-icon"/> 
            注意事項
            <br /> 裁切圖檔為jpg檔
            <br /> 當前若有轉換需求請至轉換頁處理
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { faL } from "@fortawesome/free-solid-svg-icons";

const selectedSize = ref("taiwan");
const options = [
  { value: "taiwan", label: "台灣身分證\r\n台灣健保卡\r\n中國台胞證", size: "3.5cm × 4.5cm", memo: "大小不得超過 5 MB" ,width:3.5, height:4.5 },
  { value: "vietnam", label: "越南簽證", size: "4cm × 6cm", memo: "" ,width:4, height:6},
  { value: "india", label: "印度簽證", size: "5cm * 5cm", memo: "大小不得超過 1 MB" ,width:5, height:5 },
];


const currentItem = computed(() =>
  options.find(item => item.value === selectedSize.value)
)


let cropper = null;
// 初始化 cropper
onMounted(() => {
  const orgImg = document.getElementById('orgImg');
  cropper = new Cropper(orgImg, {
    aspectRatio: 7 / 9,
    dragMode: 'move',
    zoomable: false,
  });
  });

function cardClick(item) {
  selectedSize.value = item.value;
  cropper.setAspectRatio(item.width / item.height);
}


function uploadFiles(){
  const canvas = cropper.getCroppedCanvas({
    width: currentItem.value.width*300/2.54,  // 可選：指定輸出寬度
    height: currentItem.value.height * 300 / 2.54
  });

console.log(currentItem.value.width*300/2.54);
canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cropped-image.jpg';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/jpg');
}

function onFileChange(e) {
  const orgImg = document.getElementById('orgImg');
  const img = document.getElementsByTagName('cropper-image')[0];
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = evt => {

    const imgSrc = evt.target.result;
    orgImg.cropper.replace(imgSrc, false);
    
  };
  reader.readAsDataURL(file);
}

</script>

<style scoped>
.size-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.size-card {
  width: 180px;
  height: 140px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.size-card.active {
  border: 2px solid var(--el-color-primary);
}
.card-content {
  text-align: center;
}
.title {
  font-weight: bold;
  font-size: 16px;

  white-space: pre-line; /* 保留換行符號 */
}
.desc {
  margin-top: 4px;
  font-size: 14px;
  color: #666;
}
.memo {
  margin-top: 2px;
  font-size: 12px;
  color: #180808;
}

h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #4A3F35; /* 深咖啡，莫蘭迪感 */
}

.cropper-container {
  width: 100%;
  height: 80%;
  max-width: 500px;
  overflow: hidden;
}

      
.img-box{
  margin: 14px 4px;
  border: solid 1px #ddd;
  width: 500px;
  height: 400px;

}

@media (max-width: 768px) {
  /* 手機版調整比例 */
  .img-box{
    margin: 14px 4px;
    border: solid 1px #ddd;
    max-width: 95%;
    max-height: 100%;
  }

  .cropper-container {
    max-width: 95%;
    max-height: 100%;
    overflow: hidden;
  }
}

.cropper-div{
  display: flex;
  align-items: center;
  justify-content: center;
}


.alert {
  padding: 10px 14px;
  margin:auto;
  border: 1px dashed #aaa;   /* 淡灰色虛線邊框 */
  border-radius: 6px;
  color: #333;
  font-size: 14px;

  width: 60%;
}

.alert-icon {
  margin-top: 5px;
}

</style>
