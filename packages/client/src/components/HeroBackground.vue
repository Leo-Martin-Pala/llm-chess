<template>
  <div class="hero-background" :class="{ 'fallback-active': videoFailed }">
    <div class="fallback-bg"></div>
    <video
        ref="videoEl"
        class="video-bg"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
        @error="handleVideoError"
        @canplay="videoLoaded = true"
    >
      <source src="../assets/videos/synthwave-background.webm" type="video/webm" />
      <source src="../assets/videos/synthwave-background.mp4" type="video/mp4" />
    </video>
    <div class="content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const videoEl = ref(null);
const videoFailed = ref(false);
const videoLoaded = ref(false);

function handleVideoError(e) {
  console.warn('Video failed to load:', e);
  videoFailed.value = true;
}

onMounted(() => {
  // Force reload the video element
  if (videoEl.value) {
    videoEl.value.load();
    
    // Ensure video plays by explicitly calling play()
    setTimeout(() => {
      videoEl.value.play().catch(err => {
        console.warn('Autoplay failed:', err);
        videoFailed.value = true;
      });
    }, 100);

    // Check if video is actually playing after a short delay
    setTimeout(() => {
      if (videoEl.value &&
          (videoEl.value.paused || videoEl.value.currentTime === 0) &&
          !videoLoaded.value) {
        console.warn('Video not playing after timeout');
        videoFailed.value = true;
      }
    }, 3000);
  }
});
</script>

<style scoped>
.hero-background {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.content-wrapper {
  position: relative;
  z-index: 10; /* Ensure content is above the video but below dropdowns */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible; /* Allow dropdowns to be visible */
}

.fallback-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #800080, #4B0082, #9400D3, #8A2BE2);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  z-index: 1;
}

.video-bg {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.fallback-active .video-bg {
  display: none;
}

.fallback-active .fallback-bg {
  z-index: 2;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>