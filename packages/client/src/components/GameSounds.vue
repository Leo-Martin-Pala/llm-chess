<script setup>
import { ref, onMounted } from 'vue';

// Define the available sounds
const sounds = {
  capture: new Audio('/sounds/capture.mp3'),
  castle: new Audio('/sounds/castle.mp3'),
  gameEnd: new Audio('/sounds/game-end.mp3'),
  gameStart: new Audio('/sounds/game-start.mp3'),
  illegal: new Audio('/sounds/illegal.mp3'),
  move: new Audio('/sounds/move.mp3'),
  moveCheck: new Audio('/sounds/move-check.mp3'),
  premove: new Audio('/sounds/premove.mp3'),
  promote: new Audio('/sounds/promote.mp3')
};

// Preload sounds
onMounted(() => {
  Object.values(sounds).forEach(sound => {
    sound.load();
  });
});


function playSound(soundName) {
  if (sounds[soundName]) {
    sounds[soundName].currentTime = 0;
    sounds[soundName].play().catch(e => console.error(`Error playing ${soundName} sound:`, e));
  }
}


defineExpose({
  playSound
});
</script>

<template>
</template>