<template>
  <div class="hero-background">
    <video
        class="video-bg"
        autoplay
        loop
        muted
        playsinline
    >
      <source src="../assets/videos/synthwave-background.mp4" type="video/mp4" />
      <!-- Fallback text -->
      Your browser does not support the video tag.
    </video>
    <slot></slot>
  </div>
</template>

<script setup>
// No special scripting needed for a looping background video
</script>

<style scoped>
.hero-background {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.video-bg {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>