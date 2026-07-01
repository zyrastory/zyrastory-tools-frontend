<template>
<el-form
  :inline="true"
  :model="query"
  class="query-bar"
>
  <el-form-item label="關鍵字">
    <el-input
      v-model="query.content"
      placeholder="搜尋內容"
      clearable
      @keyup.enter="handleSearch"
    />
  </el-form-item>

  <el-form-item label="標籤">
    <el-input
      v-model="query.tags"
      placeholder="tag"
      clearable
    />
  </el-form-item>

  <el-form-item label="狀態" style="width: 120px;">
    <el-select v-model="query.is_active" placeholder="全部" clearable style="width: 100%;">
      <el-option label="啟用" :value="1" />
      <el-option label="停用" :value="0" />
    </el-select>
  </el-form-item>


  <el-form-item>
    <el-button type="primary" @click="handleSearch">
      搜尋
    </el-button>
    <el-button @click="resetQuery">
      重置
    </el-button>
  </el-form-item>
</el-form>


  <el-table :data="tableData" style="width: 100%">
    <!-- 圖片 -->
    <el-table-column label="圖片" width="120">
      <template #default="{ row }">
        <el-popover
          v-if="row.image_url"
          placement="right"
          :width="450"
          trigger="hover"
        >
          <template #reference>
            <el-image
              style="width: 80px; height: 80px"
              :src="row.image_url"
              fit="cover"
            />
          </template>
          <el-image
            :src="row.image_url"
            style="width: 100%"
            fit="contain"
          />
        </el-popover>
        <span v-else>無圖片</span>
      </template>
    </el-table-column>
    <!-- Content 欄位 -->
    <el-table-column label="Content" min-width="220">
      <template #default="{ row }">
        <!-- 顯示模式 -->
        <div
          v-if="editingId !== row.id"
          class="editable-cell"
          @click="startEdit(row)"
        >
          <span>{{ row.content }}</span>
          <el-icon :size="20" class="edit-icon"><Edit /></el-icon>
        </div>

        <!-- 編輯模式 -->
        <div v-else class="editing-cell">
          <el-input
            ref="editInputRef"
            v-model="editForm.content"
            type="textarea"
            :rows="2"
            @keyup.esc="cancelEdit"
            @keydown.enter.ctrl="saveEdit(row)"
          />
          <div class="edit-actions">
            <el-button size="small" type="primary" @click="saveEdit(row)">
              儲存
            </el-button>
            <el-button size="small" @click="cancelEdit">取消</el-button>
          </div>
        </div>
      </template>
    </el-table-column>
    <!-- Tags 欄位 -->
    <el-table-column label="Tags" min-width="220">
      <template #default="{ row }">
        <!-- 顯示模式 -->
        <div
          v-if="editingTagsId !== row.id"
          class="editable-cell"
          @click="startTagEdit(row)"
        >
          <template v-if="row.tags && row.tags.length">
            <el-tag
              v-for="tag in row.tags"
              :key="tag"
              size="small"
              style="margin: 2px;"
            >{{ tag }}</el-tag>
          </template>
          <span v-else class="no-tags">無標籤</span>
          <el-icon :size="16" class="edit-icon"><Edit /></el-icon>
        </div>

        <!-- 編輯模式 -->
        <div v-else class="editing-cell">
          <el-select
            v-model="editTagsForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="輸入後按 Enter 新增"
            style="width: 100%"
          >
            <el-option
              v-for="tag in allTagOptions"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
          <div class="edit-actions">
            <el-button size="small" type="primary" @click="saveTags(row)">儲存</el-button>
            <el-button size="small" @click="cancelTagEdit">取消</el-button>
          </div>
        </div>
      </template>
    </el-table-column>
    <!-- 啟用狀態 -->
    <el-table-column label="啟用" width="80">
      <template #default="{ row }">
        <el-switch
          v-model="row.is_active"
          :loading="row._statusLoading"
          @change="updateStatus(row)"
        />
      </template>
    </el-table-column>
  </el-table>

  <div class="pagination-wrapper">
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="fetchMemes"
    />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useTagStore } from '@/stores/tag'

import api from '@/api'

const tagStore = useTagStore()

/* ===== 分頁 ===== */
const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

/* ===== Content 編輯 ===== */
const editingId = ref(null)
const editInputRef = ref(null)
const editForm = ref({ content: '' })

/* ===== Tags 編輯 ===== */
const editingTagsId = ref(null)
const editTagsForm = ref({ tags: [] })
// 全域 tag 選項（從 Pinia store 取得）
const allTagOptions = computed(() => tagStore.allTags)

/*===== 查詢相關 start =====*/
const query = reactive({
  content: '',
  tags: [''],
  is_active: null,
})

// 主要撈資料的JS
const fetchMemes = async () => {
  try {
    /*
    const response = await api.get(
      `/admin/memes?page=${page.value}&page_size=${pageSize.value}`,
    )
    */

    const params = {
      page: page.value,
      page_size: pageSize.value,
    }

    if (query.content?.trim()) {
      params.content = query.content.trim()
    }

    if (query.tags?.length) {
      params.tags = query.tags
    }

    if (query.is_active !== '') {
      params.is_active = query.is_active //這邊會傳 0 1
    }


    const response = await api.get('/admin/memes', { params })


    tableData.value = response.data.data
    total.value = response.data.total
  } catch {
    //ElMessage.error('載入資料失敗')
    console.error('載入資料失敗')
  }
}

const handleSearch = () => {
  page.value = 1
  fetchMemes()
}

const resetQuery = () =>{
  query.content = ''
  query.tags =['']
  query.is_active = null
}
/*===== 查詢相關  end  =====*/

const route = useRoute()

onMounted(() => {
  if (route.query.tag) {
    query.tags = route.query.tag
  }
  // 如果沒經過 Dashboard，全域 tag store 可能是空的，fallback 呼叫 API
  tagStore.fetchTagsIfEmpty()
  fetchMemes()
})

const startEdit = (row) => {
  editingId.value = row.id
  editForm.value.content = row.content
  nextTick(() => editInputRef.value?.focus())
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value.content = ''
}

const startTagEdit = (row) => {
  editingTagsId.value = row.id
  editTagsForm.value.tags = row.tags ? [...row.tags] : []
}

const cancelTagEdit = () => {
  editingTagsId.value = null
  editTagsForm.value.tags = []
}

const saveTags = async (row) => {
  try {
    // 空陣列代表清空標籤，傳 null 讓後端存 null
    const newTags = editTagsForm.value.tags.length > 0 ? editTagsForm.value.tags : null
    await api.patch(`/admin/memes/${row.id}`, { tags: newTags })
    row.tags = newTags ?? []
    editingTagsId.value = null
    ElMessage.success('標籤已更新')
  } catch {
    ElMessage.error('標籤更新失敗')
  }
}

const saveEdit = async (row) => {
  try {
    const response = await api.patch(`/admin/memes/${row.id}`, {
      content: editForm.value.content
    })
    //console.log(response)
    
    //if (!res.ok) throw new Error()

    row.content = editForm.value.content
    editingId.value = null
    ElMessage.success('更新成功')
  } catch {
    ElMessage.error('更新失敗')
  }
}

const updateStatus = async (row) => {
  row._statusLoading = true
  try {
    const response = await api.patch(`/admin/memes/${row.id}`, {
      is_active: row.is_active
    })

    ElMessage.success('狀態已更新')
  } catch (e) {
    console.dir(e)
    row.is_active = !row.is_active
    ElMessage.error('更新失敗')
  } finally {
    row._statusLoading = false
  }
}
</script>

<style scoped>

/* 給關鍵字查詢框 clear icon 空間  TODO 測試失敗*/
.fixed-clear-input .el-input__wrapper {
  padding-right: 32px;
}

.no-tags {
  color: #c0c4cc;
  font-size: 12px;
}


.editable-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}

.editable-cell:hover {
  background: #f5f7fa;
}

/*
.edit-icon {
  opacity: 0;
}

.editable-cell:hover .edit-icon {
  opacity: 0.5;
}
*/
.editing-cell {
  padding: 4px 0;
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
