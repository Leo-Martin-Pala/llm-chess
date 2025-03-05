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
  <button @click="handleClick" class="styled-button">{{ buttonText }}</button>
</template>

<style scoped>
.styled-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  padding: 10px 20px;
  margin: 10px;
  border-style: none;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.styled-button:hover {
  background-color: rebeccapurple;
}
</style>