import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true //允許攜帶或傳輸cookie
})


let isRedirecting = false;  //以防有多個API同時觸發 導致重複轉址

//20260103 新增api攔截器 主要用以優化登入後台過期相關，router index.js 管理的是換頁相關
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';

      if (requestUrl.includes('/admin/')) {
        if (!isRedirecting) {
          isRedirecting = true;
          ElMessage.error('權限已過期，請重新登入');
          router.push('/admin/login').then(() => {
            isRedirecting = false; 
          }).catch(() => {
            isRedirecting = false;
          });
        }
      } else {
        console.warn('非管理後台的 401 錯誤：', requestUrl);
      }
    }

    return Promise.reject(error);
  }
);

export default api