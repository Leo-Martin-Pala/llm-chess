<script setup>
import { ref } from 'vue';
import Chessboard from '../components/Chessboard.vue';
import HeroBackground from "@/components/HeroBackground.vue";
import ClickableButton from "@/components/ClickableButton.vue";
import DropdownMenu from "@/components/DropdownMenu.vue";

const chessboardRef = ref(null);
const currentModel = ref('gemini/gemini-2.0-flash');
const modelMapping = {
  'Gemini flash 2.0': 'gemini/gemini-2.0-flash',
  'Gemini flash thinking': 'gemini/gemini-2.0-flash-thinking-exp',
  'DeepSeek R1 70b': 'groq/deepseek-r1-distill-llama-70b',
  'DeepSeek R1 671b': 'deepseek r1 (openrouter)',
  'Llama 3.3 70b': 'llama 3.3 70b (together ai)',
  'Mistral large': 'mistral/mistral-large-latest',
};

function changeModel(newModel) {
  currentModel.value = newModel;
}

function resetPosition() {
  chessboardRef.value?.boardAPI?.resetBoard();
}

function undoMove() {
  if (chessboardRef.value?.boardAPI?.getTurnColor() === 'black') {
    chessboardRef.value?.boardAPI?.undoLastMove();
  } else {
    chessboardRef.value?.boardAPI?.undoLastMove();
    chessboardRef.value?.boardAPI?.undoLastMove();
  }
}

function availableMoves() {
  chessboardRef.value?.boardAPI?.toggleMoves();
}

</script>

<template>
  <div class="main-container">
    <hero-background>
      <div class="gameplay-container">
        <div class="buttons-container synthwave-container">
          <clickable-button
              :on-click-callback="resetPosition"
              button-text="restart position"
          />
          <clickable-button
              :on-click-callback="undoMove"
              button-text="undo move"
          />
          <clickable-button
              :on-click-callback="availableMoves"
              button-text="available moves"
          />
          <dropdown-menu
              :models="modelMapping"
              :selected-model="currentModel"
              @selectModel="changeModel"
          />
        </div>
        <div class="board-container synthwave-board-container">
          <Chessboard ref="chessboardRef" :model-name="currentModel"></Chessboard>
        </div>
      </div>
    </hero-background>
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  position: relative;
}

.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;
}

.synthwave-board-container {
  position: relative;
  padding: 15px;
  border-radius: 12px;
}

.synthwave-board-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, rgba(255, 0, 204, 0.2), rgba(51, 51, 255, 0.2));
  border-radius: 14px;
  z-index: -1;
  filter: blur(8px);
  opacity: 0.7;
  animation: borderGlow 4s infinite alternate;
}

@keyframes borderGlow {
  0% {
    filter: blur(8px);
    opacity: 0.5;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}

.gameplay-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.buttons-container {
  position: relative;
  z-index: 2000;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.synthwave-container {
  background: rgba(30, 30, 60, 0.3);
  border-radius: 12px;
  padding: 15px 20px;
  margin-bottom: 25px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: visible;
}

.synthwave-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff00cc, #3333ff);
}
</style>