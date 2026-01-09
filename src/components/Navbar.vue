<template>
  <nav class="navbar">
    <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <!-- <RouterLink to="/img_convert">圖片工具</RouterLink>
    <RouterLink to="/img_compress">圖片壓縮</RouterLink>
    <RouterLink to="/img_cropper">圖片裁切</RouterLink> -->
    <RouterLink to="/img_tools"  :class="{ 'router-link-exact-active': $route.path.startsWith('/img_tools') }" >圖片工具集</RouterLink>
    
  </nav>
</template>

<script setup></script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5rem;
  padding: 0.8rem 2rem;
  
  /* Modern Glass Effect */
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  position: sticky;
  top: 0;
  z-index: 100;
}

@media(max-width: 768px){
	.navbar {
    gap: 2rem;
    padding: 0.8rem 1rem;
  }
}

.navbar .logo {
  width: 50px; /* Resize logo to be more subtle/modern */
  height: 50px;
  border-radius: 8px; /* Slight rounding */
}

.navbar a {
  text-decoration: none;

  color: var(--vt-c-text-dark-2);
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.navbar a:hover {
  color: var(--color-primary);
}

.navbar a.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 600;
}
</style>

