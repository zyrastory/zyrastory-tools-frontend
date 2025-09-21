import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createHead } from '@vueuse/head'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Solid icons
import { faSpinner, faCircleDown, faDownload, faCircleInfo } from '@fortawesome/free-solid-svg-icons'


// 加進 library
library.add(faSpinner, faCircleDown, faDownload, faCircleInfo)


const app = createApp(App)
const head = createHead()

// 全域註冊元件
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(head)

app.mount('#app')
