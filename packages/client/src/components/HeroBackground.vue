<template>
  <div class="hero-background">
    <video
        class="video-bg"
        autoplay
        loop
        muted
        playsinline
        @error="handleVideoError"
    >
      <source src="../assets/videos/synthwave-background.mp4" type="video/mp4" />
    </video>
    <slot></slot>
  </div>
</template>

<script setup>
function handleVideoError(e) {
  // Hide the video element when it fails to load
  e.target.style.display = 'none';
}
</script>

<style scoped>
.hero-background {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #800080, #4B0082, #9400D3, #8A2BE2);
}

.video-bg {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>