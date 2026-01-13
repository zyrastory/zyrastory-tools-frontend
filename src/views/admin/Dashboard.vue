<template>
  <div class="dashboard-page">
    <div class="dashboard">
      <div class="statistic-card">
        <el-row :gutter="16" class="mb-4">
          <el-col :xs="24" :sm="8"  class="dashboard-col">
            <el-card>
              <el-statistic :value="stats.totalMemes">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    <span>梗圖總數</span>
                    <el-link 
                      type="primary" 
                      :underline="false" 
                      style="margin-left: 8px; font-size: 12px;" 
                      @click="$router.push({ name: 'admin-memes' })"
                    >
                      管理
                    </el-link>
                  </div>
                </template>
              </el-statistic>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="8"  class="dashboard-col">
            <el-card>
              <el-statistic :value="stats.totalTags">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    Tag 總數
                    <el-tooltip
                      effect="dark"
                      content="Tag僅統計超過10筆之資料"
                      placement="top"
                    >
                    <font-awesome-icon icon="fa-solid fa-circle-info" class="alert-icon"/> 
                  </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="8"  class="dashboard-col">
            <el-card>
              <el-statistic :value="stats.todayCalls">
                <template #title>今日呼叫次數(TODO)</template>
              </el-statistic>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="middle-block">
        <el-row :gutter="48">
          <!-- Tag 對應梗圖數量 -->
          <el-col :xs="24" :md="12" class="dashboard-col">
            <el-card>
              <template #header>
                <span> Redis Tag 對應數量</span>
              </template>

              <!-- <el-table :data="tagCounts" size="small">
                <el-table-column prop="tag" label="Tag" />
                <el-table-column prop="count" label="梗圖數量" width="120" />
              </el-table> -->

                <el-carousel
                  height="500px"
                  indicator-position="outside"
                  :autoplay="false"
                  trigger="click"
                >
                  <el-carousel-item
                    v-for="(page, index) in paginatedTagCounts"
                    :key="index"
                  >
                    <div class="tag-count-cards">
                      <div
                        v-for="detail in page"
                        class="tag-count-card"
                        @click="handleTagClick(detail.tag_name)"
                      >
                        <div class="seq">{{ detail.seq }}</div>
                        <div class="tag-name">{{ detail.tag_name }}</div>
                        <div class="tag-count">{{ detail.count }} 張</div>
                        
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
            </el-card>
          </el-col>

          <!-- 熱門關鍵字 -->
          <el-col :xs="24" :md="12" class="dashboard-col">
            <el-card>
              <template #header>
                <span>熱門關鍵字(TODO)</span>
              </template>

              <el-table :data="hotKeywords" size="small">
                <el-table-column prop="keyword" label="關鍵字" />
                <el-table-column prop="count" label="呼叫次數" width="120" />
              </el-table>
            </el-card>
          </el-col>
      </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { reactive, ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const stats = reactive({
  totalMemes: 1280,
  totalTags: 100,
  todayCalls: '15,000', // 之後接 Redis
})

const rankings = ref([])
const itemsPerPage = 10

const fetchRankings = async () => {
  try {
    const response = await api.get('/admin/dashboard')
    rankings.value = response.data.tag_counts
    stats.totalMemes = response.data.meme_total_count
    stats.totalTags = response.data.tags_total_count
    console.log(response.data)
  } catch (error) {
    console.error("無法取得tag_counts資料:", error)
  }
}

// 一進來先呼叫這個
onMounted(() => {
  fetchRankings()
})

const tagCountsWithSeq = computed(() => {
  return rankings.value.map((item, index) => ({
    ...item,
    seq: index + 1
  }))
})


const paginatedTagCounts = computed(() => {
  const result = []
  for (let i = 0; i < tagCountsWithSeq.value.length; i += itemsPerPage) {
    result.push(tagCountsWithSeq.value.slice(i, i + itemsPerPage))
  }
  return result
})


const hotKeywords = [
  { keyword: '貓', count: 231 },
  { keyword: '崩潰', count: 198 },
  { keyword: '海綿寶寶', count: 165 },
]

import { useRouter } from 'vue-router'
const router = useRouter()

const handleTagClick = (tagName) => {
  router.push({ 
    name: 'admin-memes', 
    query: { tag: tagName } 
  })
}
</script>

<style scoped>
.statistic-card {
  height: 100%;
  border-radius: 4px;
}
.middle-card {
  height: 100%;
  border-radius: 4px;
}

.dashboard-page {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;   
}

.dashboard {
  width: 80%;
  margin-top: 5%;
}

.dashboard-col {
  margin-bottom: 16px;
}

.tag-count-cards {
  display: flex;
  flex-direction: column;
}

.tag-count-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tag-count-card:hover {
  background-color: #f5f7fa;
}


.mb-4 {
  margin-bottom: 16px;
}


.alert-icon {
  margin-left: 4px;
}
</style>
