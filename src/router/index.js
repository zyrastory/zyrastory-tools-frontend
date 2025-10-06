import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',             // 外層用 Layout
      component: DefaultLayout,
      children: [
        {
          path: '',          // 注意這裡是空字串，代表 "/"
          name: 'home',
          component: HomeView,
        },
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
  ],
})

export default router
