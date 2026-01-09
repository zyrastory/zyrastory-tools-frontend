<template>
  <div class="landing-layout">
    <Navbar />
    <main>
       <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.landing-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  width: 100%;
  padding: 0; /* Critical: No padding for full-width sections */
  display: flex;
  flex-direction: column;
}
</style>
