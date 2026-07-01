import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useTagStore = defineStore('tag', () => {
    const allTags = ref([])

    function setTags(tags) {
        allTags.value = tags
    }

    // 從 Dashboard 的 db_tag_counts 提取 tag 名稱
    function setTagsFromDbCounts(dbTagCounts) {
        allTags.value = (dbTagCounts || [])
            .map(item => item.tag_name)
            .filter(Boolean)
            .sort()
    }

    // Fallback：直接呼叫 /admin/tags（僅在沒經過 Dashboard 時使用）
    async function fetchTagsIfEmpty() {
        if (allTags.value.length > 0) return
        try {
            const response = await api.get('/admin/tags')
            allTags.value = response.data.tags || []
        } catch {
            console.error('無法取得 tag 清單')
        }
    }

    return {
        allTags,
        setTags,
        setTagsFromDbCounts,
        fetchTagsIfEmpty
    }
})
