<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  models: {
    // Example: { 'Gemini': 'gemini/gemini-2.0-flash', 'DeepSeek': 'deepseek r1 distill llama 70b (scaleway)' }
    type: Object,
    required: true,
  },
  selectedModel: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['selectModel']);
const isOpen = ref(false);
const dropdownRef = ref(null);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function selectModel(modelKey) {
  emit('selectModel', props.models[modelKey]);
  isOpen.value = false;
}

function getSelectedModelName() {
  return Object.keys(props.models).find(key => props.models[key] === props.selectedModel) || 'Select Model';
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="dropdown-container" ref="dropdownRef">
    <button @click.stop="toggleMenu" class="synthwave-button">
      {{ getSelectedModelName() }}
      <span class="dropdown-icon">▼</span>
    </button>
    <transition name="dropdown-fade">
      <div v-if="isOpen" class="dropdown-menu">
        <button
            v-for="(apiName, displayName) in models"
            :key="apiName"
            @click="selectModel(displayName)"
            class="menu-item"
            :class="{ 'selected': selectedModel === apiName }"
        >
          {{ displayName }}
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');

.dropdown-container {
  position: relative;
  display: inline-block;
  z-index: 2000; /* Increased z-index */
}

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 180px;
}

.dropdown-icon {
  font-size: 10px;
  margin-left: 8px;
  transition: transform 0.3s ease;
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

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 2500;
  min-width: 220px;
  margin-top: 8px;
  background: rgba(20, 20, 40, 0.95);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 8px rgba(255, 0, 204, 0.2);
  overflow: hidden;
  transform-origin: top center;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff00cc, #3333ff);
}

.menu-item {
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  margin: 2px 0;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.menu-item.selected {
  background: rgba(255, 0, 204, 0.15);
  box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.2);
  position: relative;
}

.menu-item.selected::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(to bottom, #ff00cc, #3333ff);
}
</style>