<template>
  <nav class="navbar">
    <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <!-- <RouterLink to="/img_convert">圖片工具</RouterLink>
    <RouterLink to="/img_compress">圖片壓縮</RouterLink>
    <RouterLink to="/img_cropper">圖片裁切</RouterLink> -->
    <RouterLink to="/img_tools">圖片工具集</RouterLink>
    
  </nav>
</template>

<script setup></script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5rem;
  padding: 5px 1rem;

  background: var(--color-navbar-bg, #6d5e5e);
}

@media(max-width: 768px){
	.navbar {
    gap: 2rem;
  }
}

.navbar .logo {
  width: 80px;
  height: 80px;
}

.navbar a {
  text-decoration: none;

  color: var(--color-navbar-text, #e9e6e4);
  font-weight: 500;
  transition: color 0.2s ease;
}

.navbar a:hover {
  color: var(--color-navbar-hover, #b1857b);
}

.navbar a.router-link-exact-active {
  color: var(--color-navbar-hover, #b1857b);
  font-weight: 600;
}
</style>

