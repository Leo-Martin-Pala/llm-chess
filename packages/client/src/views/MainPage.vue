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
        <div class="buttons-container">
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
        <div class="board-container">
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
  height: 100vh; /* Ensure the container takes the full height of the viewport */
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  overflow-x: hidden;
}

.board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.gameplay-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
</style>