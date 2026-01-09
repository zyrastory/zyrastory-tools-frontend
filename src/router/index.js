import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import HomeView from '../views/HomeView.vue'
import api from '@/api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/LandingLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
      ],
    },
    {
      path: '/',             // 外層用 Layout
      component: DefaultLayout,
      children: [
        // HomeView moved to LandingLayout above
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
        /*
        {
          path: 'img_convert',
          name: 'img_convert',
          component: () => import('@/views/ImgConvert.vue'),
        },
        {
          path: 'img_compress',
          name: 'img_compress',
          component: () => import('@/views/ImgCompress.vue'),
        },
        {
          path: 'img_cropper',
          name: 'img_cropper',
          component: () => import('@/views/ImgCropper.vue'),
        },
        */
        {
          path: 'img_tools',
          name: 'img_tools',
          redirect: '/img_tools/convert', //預設走第一頁
          component: () => import('@/views/ImgTools.vue'),
          children: [
            {
              path: 'convert',
              name: 'convert',
              component: () => import('@/views/ImgConvert.vue'),
            },
            {
              path: 'compress',
              name: 'compress',
              component: () => import('@/views/ImgCompress.vue'),
            },
            {
              path: 'cropper',
              name: 'cropper',
              component: () => import('@/views/ImgCropper.vue'),
            },
          ]
        },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/Login.vue'),
      meta: {
        needLogin: false,
      },
    },
    // Dashboard 獨立,不走 layout
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
      meta: { needLogin: true }
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      redirect: '/admin/dashboard', // 導向獨立的 dashboard
      meta: { needLogin: true },
      children: [

        {
          path: 'memes',
          name: 'admin-memes',
          component: () => import('@/views/admin/MemeManagement.vue')
        },
        /*
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('@/views/admin/Settings.vue')
        }
        */
      ]
    }

  ],
})

//20260103 router新增判斷登入條件，api判斷則位於api.js
router.beforeEach(async (to, from, next) => {
  const needLogin = to.matched.some(
    record => record.meta.needLogin
  )

  if (!needLogin) {
    return next()
  }

  try {
    await api.get('/admin/me')
    next()
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    console.error(`[needLogin] 驗證失敗:`, {
      path: to.path,
      status: status,
      error: message,
      timestamp: new Date().toISOString()
    });
    ElMessage.error('權限已過期，請重新登入');
    next('/admin/login')
  }
})

export default router
