<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  initialState: {
    type: Boolean,
    default: false
  },
  labelOn: {
    type: String,
    default: 'ON'
  },
  labelOff: {
    type: String,
    default: 'OFF'
  }
});

const emit = defineEmits(['toggle']);
const isActive = ref(props.initialState);

function toggle() {
  isActive.value = !isActive.value;
  emit('toggle', isActive.value);
}
</script>

<template>
  <div class="synthwave-toggle-container" @click="toggle">
    <div class="synthwave-toggle" :class="{ 'active': isActive }">
      <div class="toggle-slider"></div>
    </div>
    <div class="toggle-label">{{ isActive ? labelOn : labelOff }}</div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');

.synthwave-toggle-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 10px;
}

.synthwave-toggle {
  position: relative;
  width: 60px;
  height: 30px;
  background: linear-gradient(45deg, #1a0033, #330033);
  border-radius: 15px;
  padding: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px rgba(255, 0, 204, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-slider {
  position: absolute;
  left: 3px;
  top: 3px;
  width: 24px;
  height: 24px;
  background: linear-gradient(45deg, #ff00cc, #3333ff);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 0, 204, 0.7);
}

.synthwave-toggle.active {
  background: linear-gradient(45deg, #330033, #1a0033);
}

.synthwave-toggle.active .toggle-slider {
  left: calc(100% - 27px);
  background: linear-gradient(45deg, #3333ff, #ff00cc);
  box-shadow: 0 0 10px rgba(51, 51, 255, 0.7);
}

.toggle-label {
  margin-left: 10px;
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(255, 0, 204, 0.7), 0 0 10px rgba(51, 51, 255, 0.5);
}
</style>