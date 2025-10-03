<script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'


  // import { useHead } from '@vueuse/head'

  // useHead({
  //   title: '線上圖片轉檔',
  //   meta: [
  //     { name: 'description', content: '免費線上圖片轉檔 zyrastory tools' },
  //     { property: 'og:title', content: '線上圖片轉檔' },
  //     { property: 'og:description', content: '免費線上圖片轉檔 zyrastory tools' }
  //   ]
  // })

  const quality = ref(80)
  const imageRes = ref(null)
  const fileInput = ref(null)
  const loading = ref(false)
  const format = ref("webp")

  async function uploadFiles(){
    const formData = new FormData()

    const files = fileInput.value.files

    if(files.length === 0){
      alert('請選擇圖片上傳');
      return;
    }
    else if (files.length > 5) {
      alert('最多只能上傳 5 張圖片');
      return;
    }


    for (let file of files) {
      if(!file.type.startsWith('image/')){
        alert('禁止傳入非圖片類型檔案');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('圖片 ${file.name} 太大，必須小於 5 MB');
        return; 
      }
       formData.append('upload_files', file) 
    }

    formData.append('format_type', format.value)
    formData.append('quality_value', quality.value)

    imageRes.value = null
    loading.value = true;
    try {
      const response = await axios.post('http://localhost:8000/api/tools/image_tool/upload', formData)
      loading.value = false;
      imageRes.value = response.data;

    } catch (error) {
      console.error(error)
    }


  }

  function downloadAll(url){
    window.open('http://localhost:8000/api/tools/image_tool/'+url, '_blank')
  }
</script>

<template>
  <!-- <main> -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-11 card-light">
          <h1>線上圖片轉檔</h1>
          <br/>

          <div class="format-row">
            <label>轉換類型 : </label>
            <div class="format-buttons">
              <label class="options-label" :class="{ active: format==='webp' }">
                <input type="radio" value="webp" v-model="format" /> WebP
              </label>
              <label class="options-label" :class="{ active: format==='jpeg' }">
                <input type="radio" value="jpeg" v-model="format" /> JPEG
              </label>
              <label class="options-label" :class="{ active: format==='png' }">
                <input type="radio" value="png" v-model="format" /> PNG
              </label>
            </div>
          </div>

          <div class="quality-row">
            <label>轉換品質 : </label>
            <datalist id="tickmarks">
              <option value="60"></option>
              <option value="70"></option>
              <option value="80"></option>
              <option value="90"></option>
              <option value="100"></option>
            </datalist>
            <input type="range" v-model="quality" min="60" max="100" step="5"  list="tickmarks" />
            <span class="quality-label">{{ quality }}%</span>
          </div>
          <br />
          <div class="alert alert-info mt-3">
            <div>
              <font-awesome-icon icon="fa-solid fa-circle-info" class="alert-icon"/> 
              注意事項
              <br />一般來說圖片大小 PNG>JPEG>WEBP
              <br />LINE不支援WEBP類型，推薦轉為JPEG
              <br />
              <br />此功能最多一次上傳五張圖片，單張大小不大於5MB
            </div>
          </div>

          
          <br />        
          <input type="file" name="upload_files" id="upload_files" ref="fileInput" accept=".webp.png,.jpg" multiple>
          <button @click="uploadFiles" class="btn btn-primary" value="上傳圖片">上傳圖片</button>


          <hr>
          <br/>
          <font-awesome-icon v-if="loading" icon="fa-solid fa-spinner" 
              spin-pulse  size="4x"/>

          <div v-if="imageRes!=null" style="overflow-x: auto;">
            <h2>轉換後的圖片</h2>
            <br/>
            <table>
              <colgroup>
                <col style="width: 35%;">
                <col style="width: 20%;">
                <col style="width: 20%;">
                <col style="width: 15%;">
                <col style="width: 10%;">
              </colgroup>

              <thead>
                <tr>
                  <th>檔名</th>
                  <th>轉檔前大小</th>
                  <th>轉檔後大小</th>
                  <th>壓縮比(%)</th>
                  <th>下載</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in imageRes.ratios">
                  <td >{{item.filename}}</td>  
                  <td >{{item.org_size_str }}</td>
                  <td >{{item.new_size_str }}</td>
                  <td >{{item.ratio }}</td>
                  <td> 
                    <a :href="`http://localhost:8000/api/tools/image_tool/${imageRes.download_url}/${item.filename}`" target="_blank">
                      <font-awesome-icon icon="fa-solid fa-circle-down" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style=" display: flex;justify-content: center;">
              <button id="downloadAllBtn" class="btn btn-success" @click="downloadAll(imageRes.download_all_url)">
                全部下載  <font-awesome-icon icon="fa-solid fa-download" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  <!-- </main> -->
</template>


<style scoped>

h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #4A3F35; /* 深咖啡，莫蘭迪感 */
}

.format-row {
  display: flex;
  align-items: center;   /* 垂直置中 */
  margin: 0 auto 1rem auto; 
  width: 60%;

  gap: 12px;
}
/* 防止radio出現 */
.format-row input {
  display: none;
}

.format-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
}


.options-label {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.options-label.active {
  background: #A366FF;
  color: white;
  border-color: #A366FF;
}

.quality-row {
  display: flex;
  align-items: center;   /* 垂直置中 */
  /* justify-content: center; */
  /* gap: 1rem; */
  margin: 0 auto 1rem auto; 
  width: 60%;
}

.quality-row label {
  flex-shrink: 0;        /* 不壓縮 */
  width: 100px;          /* 固定寬度，方便對齊 */
  font-weight: 500;
  /* color: #555; */
}

.format-row > label:first-child,
.quality-row label {
  display: inline-block;  /* 讓 width 生效 */
  width: 100px;           /* 左側統一寬度 */
  text-align: right;      /* 文字靠右對齊 */
  margin-right: 8px;      /* 與後面內容保持間距 */
  font-weight: 500;
}


.quality-row input[type="range"] {
  flex: 1;               /* 自動撐滿剩餘空間 */
  margin: 0;             /* 移除原本 margin */
}

.quality-row .quality-label {
  flex-shrink: 0;        /* 不壓縮 */
  color: #5e4b56;
  font-weight: 500;
  min-width: 40px;       /* 避免太窄 */
  text-align: right;     /* 對齊百分比 */
}

@media (max-width: 768px) {
  /* 手機板強制換行 */
  .format-row, .quality-row {
    flex-direction: column;
    width: 90%;
  }
}


input[type="file"] {
  margin: 1rem 0;
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


button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
}

table {
  width: 90%;     
  margin: 0 auto;     /* 左右置中 */
}

td {
  border: 1px solid #ccc; /* 欄位邊框 */
  padding: 0.5rem 1rem;
  text-align: center;
}



</style>