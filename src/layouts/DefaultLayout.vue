<template>
  <div class="whole">
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
main {
  /* footer 不會貼頭 */
  /* min-height: 100vh;   */
  padding: 1rem;
  flex: 1;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  min-height: 78vh; 
  min-height: 78dvh; 

}
.whole{
  display: flex;
  flex-direction: column;
  height: 100%;
} 
</style>