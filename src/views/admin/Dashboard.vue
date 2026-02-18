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
              <el-statistic :value="0">
                <template #title>今日人數(TODO)</template>
              </el-statistic>
            </el-card>
          </el-col>
        </el-row>
        
        <!-- 第二排：今日數據(比例) + 累計 -->
        <el-row :gutter="16" class="mb-4">
          <el-col :xs="24" :sm="12" class="dashboard-col">
            <el-card class="today-data-card">
              <div class="card-header">
                <span>今日數據</span>
                 <el-tooltip
                    effect="dark"
                    content="今日提供圖片 / 今日呼叫次數"
                    placement="top"
                  >
                    <font-awesome-icon icon="fa-solid fa-circle-info" class="alert-icon"/> 
                  </el-tooltip>
              </div>
              <div class="stat-ratio-container">
                 <div class="stat-ratio">
                    <span class="stat-numerator">{{ stats.todayImages }}</span>
                    <span class="stat-divider">/</span>
                    <span class="stat-denominator">{{ stats.todayCalls }}</span>
                  </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :xs="24" :sm="12" class="dashboard-col">
            <el-card>
              <el-statistic :value="stats.totalImagesServed">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    <span>累計提供圖片數</span>
                    <el-tooltip
                      effect="dark"
                      content="不包含預設圖片（找不到時的隨機圖）"
                      placement="top"
                    >
                      <font-awesome-icon icon="fa-solid fa-circle-info" class="alert-icon"/> 
                    </el-tooltip>
                  </div>
                </template>
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
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <span>Redis Tag 對應數量</span>
                  <el-button
                    :icon="Refresh"
                    :loading="refreshing"
                    size="small"
                    @click="refreshRedisCache"
                  >
                    重新整理快取
                  </el-button>
                </div>
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
                        :class="{ 'inconsistent': !detail.is_consistent }"
                        @click="handleTagClick(detail.tag_name)"
                      >
                        <div class="seq">{{ detail.seq }}</div>
                        <div class="tag-name">{{ detail.tag_name }}</div>
                        <div class="tag-count-wrapper">
                          <div class="tag-count">{{ detail.set_count }} 張</div>
                          <div v-if="!detail.is_consistent" class="inconsistent-badge">
                            ⚠️ {{ detail.difference > 0 ? '+' : '' }}{{ detail.difference }}
                          </div>
                          <div v-else class="consistent-badge">✅</div>
                        </div>
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
            </el-card>
          </el-col>

          <!-- DB Tag 對應數量 -->
          <el-col :xs="24" :md="12" class="dashboard-col">
            <el-card>
              <template #header>
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <span>DB Tag 對應數量</span>
                  <el-text type="info" size="small">來自資料庫</el-text>
                </div>
              </template>

              <el-carousel
                height="500px"
                indicator-position="outside"
                :autoplay="false"
                trigger="click"
              >
                <el-carousel-item
                  v-for="(page, index) in paginatedDbTags"
                  :key="index"
                >
                  <div class="tag-count-cards">
                    <div
                      v-for="tag in page"
                      class="tag-count-card"
                      @click="handleTagClick(tag.tag_name)"
                    >
                      <div class="seq">{{ tag.seq }}</div>
                      <div class="tag-name">{{ tag.tag_name }}</div>
                      <div class="tag-count">{{ tag.count }} 張</div>
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
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <span>熱門關鍵字（累計至今）</span>
                  <el-text type="info" size="small">Top 20</el-text>
                </div>
              </template>

              <el-carousel
                height="500px"
                indicator-position="outside"
                :autoplay="false"
                trigger="click"
              >
                <el-carousel-item
                  v-for="(page, index) in paginatedHotKeywords"
                  :key="index"
                >
                  <div class="tag-count-cards">
                    <div
                      v-for="keyword in page"
                      class="tag-count-card"
                      @click="handleTagClick(keyword.keyword)"
                    >
                      <div class="seq">{{ keyword.seq }}</div>
                      <div class="tag-name">{{ keyword.keyword }}</div>
                      <div class="tag-count">{{ keyword.count }} 次</div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
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
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const userStore = useUserStore()

const stats = reactive({
  totalMemes: 0,
  totalTags: 0,
  todayCalls: 0,
  todayImages: 0,
  totalImagesServed: 0,
})

const rankings = ref([])
const redisInspections = ref([])
const dbTags = ref([])
const itemsPerPage = 10
const refreshing = ref(false)

const fetchRankings = async () => {
  try {
    const response = await api.get('/admin/dashboard')
    rankings.value = response.data.tag_counts
    stats.totalMemes = response.data.meme_total_count
    stats.totalTags = response.data.tags_total_count
    // 新增：統計數據
    stats.todayCalls = response.data.today_calls
    stats.todayImages = response.data.today_images
    stats.totalImagesServed = response.data.total_images_served
    hotKeywords.value = response.data.hot_keywords
    // 新增：從 dashboard 一併取得 DB Tag 統計
    dbTags.value = response.data.db_tag_counts || []
    console.log(response.data)
    
    // 新增：取得 Redis 一致性檢查資料
    await fetchRedisInspection()
  } catch (error) {
    console.error("無法取得tag_counts資料:", error)
  }
}

const fetchRedisInspection = async () => {
  try {
    const response = await api.get('/admin/redis/inspect')
    redisInspections.value = response.data.inspections
  } catch (error) {
    console.error("無法取得 Redis 檢查資料:", error)
  }
}

// 一進來先呼叫這個
onMounted(() => {
  fetchRankings()  // 合併後只需要一次 API 呼叫
  ElMessage.success(`歡迎回到山洞，${userStore.displayName}`)
})

const tagCountsWithSeq = computed(() => {
  return rankings.value.map((item, index) => {
    // 找到對應的 Redis 檢查結果
    const inspection = redisInspections.value.find(i => i.tag_name === item.tag_name)
    
    return {
      ...item,
      seq: index + 1,
      is_consistent: inspection?.is_consistent ?? true,
      difference: inspection?.difference ?? 0,
      set_count: inspection?.set_count ?? item.count
    }
  })
})


const paginatedTagCounts = computed(() => {
  const result = []
  for (let i = 0; i < tagCountsWithSeq.value.length; i += itemsPerPage) {
    result.push(tagCountsWithSeq.value.slice(i, i + itemsPerPage))
  }
  return result
})

const hotKeywords = ref([])

const hotKeywordsWithSeq = computed(() => {
  return hotKeywords.value.map((item, index) => ({
    ...item,
    seq: index + 1
  }))
})

const paginatedHotKeywords = computed(() => {
  const result = []
  for (let i = 0; i < hotKeywordsWithSeq.value.length; i += itemsPerPage) {
    result.push(hotKeywordsWithSeq.value.slice(i, i + itemsPerPage))
  }
  return result
})

const dbTagsWithSeq = computed(() => {
  return dbTags.value.map((item, index) => ({
    ...item,
    seq: index + 1
  }))
})

const paginatedDbTags = computed(() => {
  const result = []
  for (let i = 0; i < dbTagsWithSeq.value.length; i += itemsPerPage) {
    result.push(dbTagsWithSeq.value.slice(i, i + itemsPerPage))
  }
  return result
})

import { useRouter } from 'vue-router'
const router = useRouter()

const refreshRedisCache = async () => {
  refreshing.value = true
  try {
    const response = await api.post('/admin/refresh-cache')
    if (response.data.status === 'success') {
      ElMessage.success(response.data.message || 'Redis 快取已更新')
      // 重新載入 dashboard 資料
      await fetchRankings()
    } else {
      ElMessage.error(response.data.message || '更新失敗')
    }
  } catch (error) {
    console.error('Failed to refresh cache:', error)
    ElMessage.error('更新失敗，請稍後再試')
  } finally {
    refreshing.value = false
  }
}

const handleTagClick = (tagName) => {
  router.push({ 
    name: 'admin-memes', 
    query: { tag: tagName } 
  })
}
</script>

<style scoped>
.statistic-card {
  /* Remove height: 100% here as it might cause issues, control card heights via detailed classes */
  border-radius: 4px;
}
.middle-card {
  height: 100%;
  border-radius: 4px;
}
/* Force equal height for all stat cards in the grid */
.dashboard-col .el-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Ensure el-statistic content is centered vertically if needed, or consistent padding */
.el-statistic {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

/* Custom card style override to match el-statistic default */
.today-data-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically */
}

/* Unify font size: Element Plus default is around 20-24px depending on theme, force 28px for all */
:deep(.el-statistic__content) {
  font-size: 28px !important;
  font-weight: 500;
}

.stat-ratio {
  display: flex;
  align-items: baseline;
  justify-content: flex-start; /* Align left to match standard stats */
  font-size: 28px; /* Match the forced size */
  font-weight: 500;
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

.today-data-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* Removed duplicate definitions, controlled by .dashboard-col .el-card above but specific padding adjustments */
}

.card-header {
  display: flex;
  align-items: center;
  color: var(--el-text-color-regular);
  font-size: 12px;
  line-height: 20px;
  margin-bottom: 4px;
}

.stat-ratio-container {
  flex: 1;
  display: flex;
  align-items: center;
  /* justify-content: center;  Let it align left or center? element numeric usually left but ratio looks better centered or left? 
     User said "Today Data" card. 
     Element statistic numbers are usually left aligned. 
     I'll keep it left aligned or consistent with others. 
     Actually, "stat-ratio" has justify-content: center in existing CSS.
  */
}

.stat-ratio {
  display: flex;
  align-items: baseline;
  /* justify-content: center; Changed to match standard left alignment or kept if user liked it? 
     User said "I like the font size". 
     Standard el-statistic aligns left. 
     I will try to align content consistently.
  */
  font-size: 28px;
  font-weight: 500;
}

.stat-numerator {
  color: var(--el-color-primary);
}

.stat-divider {
  margin: 0 8px;
  color: var(--el-text-color-secondary);
  font-size: 24px;
}

.stat-denominator {
  color: var(--el-text-color-regular);
}

.seq {
  font-weight: bold;
  color: var(--el-color-primary);
  margin-right: 12px;
  min-width: 24px;
}

.tag-name {
  flex: 1;
  font-weight: 500;
}

.tag-count-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-count {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.consistent-badge {
  font-size: 16px;
  opacity: 0.7;
}

.inconsistent-badge {
  color: var(--el-color-danger);
  font-size: 12px;
  font-weight: 600;
  background-color: rgba(245, 108, 108, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.tag-count-card.inconsistent {
  background-color: rgba(245, 108, 108, 0.05);
  border-left: 3px solid var(--el-color-warning);
}
</style>
