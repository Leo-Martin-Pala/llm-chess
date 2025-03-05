<script setup>
import { ref } from 'vue';

const props = defineProps({
  models: {
    type: Object,
    required: true,
    // Example: { 'Gemini': 'gemini/gemini-2.0-flash', 'DeepSeek': 'deepseek r1 distill llama 70b (scaleway)' }
  },
  selectedModel: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['selectModel']);
const isOpen = ref(false);

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
</script>

<template>
  <div class="dropdown-container">
    <button @click="toggleMenu" class="styled-button">
      {{ getSelectedModelName() }}
    </button>
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
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

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

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 200px;
  margin-top: 5px;
  background-color: rgba(30, 30, 30, 0.95);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px;
}

.menu-item {
  width: 100%;
  padding: 10px;
  text-align: left;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.selected {
  background-color: rebeccapurple;
}
</style>