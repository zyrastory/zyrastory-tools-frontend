<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useHead } from '@vueuse/head';

useHead({
  title: '梗圖傳送門 - 你的對話不再冷場',
  meta: [
    { name: 'description', content: '優雅、快速、免費。收錄 5,000+ 張精選梗圖，一秒搜尋直接分享。' },
    { property: 'og:title', content: '梗圖傳送門' },
    { property: 'og:description', content: '優雅、快速、免費。收錄 5,000+ 張精選梗圖，一秒搜尋直接分享。' },
    // Google Search Console veficiation or other tags can go here
  ]
});


// Feature Stats (Hardcoded for instant load)
const stats = ref([
  { label: '收錄梗圖', value: '5,000+', icon: '🖼️' },
  { label: '累積使用', value: '10w+', icon: '🔥' },
  { label: '分類總數', value: '150+', icon: '🏷️' },
]);

// 幻燈片圖片 (R2 + 版本號控制快取)
const VERSION = 'v1'; // 更新圖片時改這個值即可
const marqueeItems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  src: `https://img.zyrastory.com/home-slider/${i + 1}.jpeg?v=${VERSION}`
}));

const handleLineJoin = () => {
  const url = 'https://lin.ee/t2mKAPz';

  window.open(url, '_blank', 'noopener,noreferrer');
};

</script>

<template>
  <div class="landing-page">
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <!-- Left: Text Content -->
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="text-gradient">梗圖傳送門</span><br>
            你的對話不再冷場
          </h1>
          <p class="hero-subtitle">
            優雅、快速、免費。<br>
            收錄 5,000+ 張精選梗圖，一秒搜尋直接分享。
          </p>
          <div class="hero-cta">
            <button class="btn-primary" style="padding: 1rem 2rem; font-size: 1.2rem;" @click="handleLineJoin"> 
               前往 LINE 加入好友
            </button>
            <p class="cta-hint">或 掃描右下角 QR Code</p>
          </div>
        </div>
        
        <!-- Right: Stats Visual Hero -->
        <div class="hero-visual-stats">
            <div class="stat-card-hero card-1 glass-panel">
                 <span class="hero-stat-icon">🖼️</span>
                 <div class="hero-stat-info">
                    <span class="hero-stat-val text-gradient">5,000+</span>
                    <span class="hero-stat-label">收錄梗圖</span>
                 </div>
            </div>
            <div class="stat-card-hero card-2 glass-panel">
                 <span class="hero-stat-icon">🔥</span>
                 <div class="hero-stat-info">
                    <span class="hero-stat-val text-gradient">10w+</span>
                    <span class="hero-stat-label">累積使用</span>
                 </div>
            </div>
             <div class="stat-card-hero card-3 glass-panel">
                 <span class="hero-stat-icon">🏷️</span>
                 <div class="hero-stat-info">
                    <span class="hero-stat-val text-gradient">150+</span>
                    <span class="hero-stat-label">分類總數</span>
                 </div>
            </div>

            <!-- Corner QR Code -->
            <div class="hero-corner-qr glass-panel">
               <img src="@/assets/line_gainfriends.png" alt="QR Code" class="corner-qr-img" />
               <p class="corner-qr-label">Scan Me</p>
            </div>

            <!-- Decorative Glow -->
            <div class="glow-bg"></div>
        </div>

      </div>
    </section>

    <!-- Marquee Section -->
    <section class="marquee-section">
      <div class="marquee-wrapper">
         <div class="marquee-track">
            <div v-for="item in marqueeItems" :key="item.id" class="marquee-item">
               <img :src="item.src" alt="Meme" loading="lazy" />
            </div>
            <!-- Duplicate for seamless loop -->
            <div v-for="item in marqueeItems" :key="`dup-${item.id}`" class="marquee-item">
               <img :src="item.src" alt="Meme" loading="lazy" />
            </div>
         </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
       <div class="section-header">
          <h2>為什麼選擇 <span class="text-gradient">梗圖傳送門</span> ?</h2>
       </div>
       <div class="features-grid">
          <div class="feature-card glass-panel">
             <h3>⚡ 零切換體驗</h3>
             <p>直接在 LINE 聊天室完成搜尋與發送。告別跳出視窗去瀏覽器下載，或是翻遍相簿找不到圖的窘境。</p>
          </div>
          <div class="feature-card glass-panel">
             <h3>🔓 開放且免費</h3>
             <p>無需付費訂閱，無須加入好友即可使用。我們致力於降低所有門檻，讓每一次的對話都能輕鬆有趣。</p>
          </div>
          <div class="feature-card glass-panel">
             <h3>📚 海量圖庫支援</h3>
             <p>收錄超過 5,000+ 張精選梗圖，涵蓋經典迷因到最新時事流行，任何情境都能找到最適合的那張圖。</p>
          </div>
       </div>
       
       <div class="footer-cta">
           <RouterLink to="/img_tools" class="link-tools">
              試試我們的網頁圖片工具 &rarr;
           </RouterLink>
       </div>
    </section>

  </div>
</template>

<style scoped>
.landing-page {
  width: 100%;
  overflow-x: hidden;
  background-color: var(--vt-c-black);
}

/* --- Hero Section --- */
.hero-section {
  min-height: 85vh; /* Almost full screen */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  position: relative;
  background: radial-gradient(circle at 70% 40%, #1a1a1a 0%, #000 70%);
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  z-index: 10;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--vt-c-text-dark-2);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

/* --- CTA Buttons --- */
.hero-cta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* --- Right: Stats Visual Hero --- */
.hero-visual-stats {
  flex: 1;
  height: 400px; /* Define height area */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stat-card-hero {
  position: absolute;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 260px;
  background: rgba(20, 20, 20, 0.6); /* Slightly more opaque */
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
  transition: transform 0.4s ease;
}

.stat-card-hero:hover {
  transform: scale(1.05) translateY(-5px) !important;
  border-color: var(--color-primary);
  z-index: 10 !important;
}

/* Staggered Layout - Restored Dynamic Flow */
.card-1 {
  top: 10%;
  left: 10%;
  z-index: 3;
}

.card-2 {
  top: 35%;
  right: 5%;
  z-index: 2;
}

.card-3 {
  bottom: 10%;
  left: 15%;
  z-index: 1;
}

/* Corner QR - Extreme Corner Placement */
.hero-corner-qr {
  position: absolute;
  bottom: -80px; /* Pushed even further down */
  right: -80px;  /* Pushed even further right */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(10, 10, 10, 0.95); /* Deep black background */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  z-index: 5;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

/* Removed hover effect for calm feel */

.corner-qr-img {
  width: 140px; /* Increased from 80px */
  height: 140px;
  border-radius: 8px;
}

.corner-qr-label {
  font-size: 0.7rem;
  margin-top: 0.5rem;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-stat-icon {
  font-size: 2.5rem;
}

.hero-stat-info {
  display: flex;
  flex-direction: column;
}

.hero-stat-val {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 0 15px rgba(200, 161, 101, 0.5);
}

.hero-stat-label {
  font-size: 0.9rem;
  color: var(--vt-c-text-dark-2);
  margin-top: 0.3rem;
}

.glow-bg {
  position: absolute;
  width: 450px;
  height: 450px;
  background: var(--color-primary);
  filter: blur(180px);
  opacity: 0.2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}


/* --- Marquee Section --- */
.marquee-section {
  padding: 4rem 0;
  background: #000;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
  overflow: hidden;
}

.marquee-wrapper {
  width: 100%;
  overflow: hidden;
}

.marquee-track {
  display: flex;
  gap: 2rem;
  width: max-content;
  animation: scroll 40s linear infinite;
}

.marquee-item img {
  height: 200px;
  width: auto;
  object-fit: cover; /* 確保不同比例的圖片都能正常顯示 */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  transition: transform 0.3s;
}

.marquee-item img:hover {
  transform: scale(1.05);
  border: 2px solid var(--color-primary);
}


/* --- Overlapping Stats Strip --- */
.stats-strip {
  position: absolute;
  bottom: -40px; /* Overlap the boundary */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4rem;
  padding: 1.5rem 4rem;
  z-index: 20;
  border: 1px solid rgba(200, 161, 101, 0.3); /* Gold border hint */
  background: rgba(10, 10, 10, 0.85); /* Darker glass */
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.strip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.strip-val {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 1px;
}

.strip-label {
  font-size: 0.9rem;
  color: var(--vt-c-text-dark-2);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 5px;
}

/* Old Stats Section Removed */


/* --- Features Section --- */
.features-section {
  padding: 6rem 2rem;
  background: radial-gradient(circle at 50% 100%, #1a1a1a 0%, #000 60%);
  text-align: center;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 4rem;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 3rem 2rem;
  text-align: left;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--vt-c-white);
}

.feature-card p {
   color: var(--vt-c-text-dark-2);
   line-height: 1.6;
}

.footer-cta {
  margin-top: 5rem;
}

.link-tools {
  color: var(--color-primary);
  font-size: 1.1rem;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s;
}

.link-tools:hover {
  border-bottom-color: var(--color-primary);
  margin-left: 10px;
}


/* --- Animations --- */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } /* Assumes items are duplicated */
}

/* --- Mobile / RWD --- */
@media (max-width: 1200px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-visual-stats {
    width: 100%;
    margin-top: 4rem;
    height: auto; /* Allow content to stack */
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }

  .stat-card-hero {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    width: 100%;
    max-width: 300px;
    transform: none !important;
  }

  .hero-corner-qr {
    position: relative !important;
    bottom: auto !important;
    right: auto !important;
    left: auto !important;
    transform: none !important;
    margin-top: 3rem;
    width: 100%;
    max-width: 200px;
    background: rgba(15, 15, 15, 0.9);
  }
}
</style>
