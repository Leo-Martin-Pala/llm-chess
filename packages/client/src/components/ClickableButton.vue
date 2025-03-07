<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  onClickCallback: {
    type: Function,
    default: null
  },
  buttonText: {
    type: String,
    default: 'Click Me'
  }
});

function handleClick() {
  if (props.onClickCallback) {
    props.onClickCallback();
  } else {
    alert(`Button clicked!`);
  }
}
</script>

<template>
  <button @click="handleClick" class="synthwave-button">{{ buttonText }}</button>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');

.synthwave-button {
  background: rgba(30, 30, 60, 0.4);
  color: white;
  border-radius: 6px;
  font-family: 'Orbitron', sans-serif;
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 18px;
  margin: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(255, 0, 204, 0.2);
  transition: all 0.3s ease;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.synthwave-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff00cc, #3333ff);
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.4s ease;
}

.synthwave-button:hover {
  background: rgba(40, 40, 80, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 0, 204, 0.3);
  border-color: rgba(255, 255, 255, 0.25);
  cursor: pointer;
}

.synthwave-button:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.synthwave-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 0 4px rgba(255, 0, 204, 0.2);
}
</style>