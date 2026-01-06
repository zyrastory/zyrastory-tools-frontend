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
    <el-table-column label="tags" width="200">
      <template #default="{ row }">
        <span>{{ row.tags }}</span>
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
import { ref, reactive, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import api from '@/api'

/* ===== 分頁 ===== */
const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

/* ===== 編輯 ===== */
const editingId = ref(null)
const editInputRef = ref(null)
const editForm = ref({ content: '' })

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
