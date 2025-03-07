<script setup>
import {defineExpose, ref, watch} from 'vue';
import {TheChessboard} from 'vue3-chessboard';
import {LlmEngine} from '../LLM-Engine';
import {FallbackEngine} from '../Engine';
import GameNotification from './GameNotification.vue';
import GameSounds from './GameSounds.vue';
import ConfettiEffect from './ConfettiEffect.vue';
import 'vue3-chessboard/style.css';
import '../assets/css/chessboard-custom.css';  // Your custom styles

const props = defineProps({
  modelName: {
    type: String,
    default: 'gemini/gemini-2.0-flash'
  }
});

const boardConfig = {
  coordinates:  false,
};

const boardAPI = ref(null);
const gameSoundsRef = ref(null);
let llmEngine;
let fallbackEngine;

// Game state
const gameNotification = ref({
  visible: false,
  type: null,
  color: null
});

// Confetti state
const showConfetti = ref(false);

function handleBoardCreated(boardApi) {
  boardAPI.value = boardApi;
  fallbackEngine = new FallbackEngine(boardApi);
  llmEngine = new LlmEngine(boardApi);
}

function playMoveSound(isCapture) {
  const soundType = isCapture ? 'capture' : 'move';
  gameSoundsRef.value?.playSound(soundType);
}

async function handleMove(move) {
  const isCapture = move.captured || move.flags.includes('c');
  playMoveSound(isCapture);

  if (boardAPI.value.getTurnColor() === 'black'  && !boardAPI.value.getIsGameOver()) {
    try {
      await llmEngine?.sendPosition(boardAPI?.value.getFen(), props.modelName);
    } catch (error) {
      console.error('Error getting move from backend:', error);
      console.log('Fallback to Stockfish');
      fallbackToStockfish();
    }
  } else {
  }
}

function fallbackToStockfish() {
  const history = boardAPI?.value.getHistory(true);

  const moves = history?.map((move) => {
    if (typeof move === 'object') {
      return move.lan;
    } else {
      return move;
    }
  });

  if (moves) {
    fallbackEngine?.sendPosition(moves.join(' '));
  }
}

function handleCheck(colorInCheck) {
  gameSoundsRef.value?.playSound('check');
}

function handleCheckmate(isMated) {
  gameSoundsRef.value?.playSound('checkmate');
  
  // Show confetti for checkmate (only when white wins for now)
  if (isMated === 'black') {
    showConfetti.value = true;
  }
  
  gameNotification.value = {
    visible: true,
    type: 'checkmate',
    color: isMated
  };
}

function handleStalemate() {
  gameSoundsRef.value?.playSound('stalemate');
  gameNotification.value = {
    visible: true,
    type: 'stalemate',
    color: boardAPI.value?.getTurnColor()
  };
}

function handleDraw() {
  gameSoundsRef.value?.playSound('draw');
  gameNotification.value = {
    visible: true,
    type: 'draw',
    color: null
  };
}

function closeNotification() {
  gameNotification.value.visible = false;
}

function handleConfettiComplete() {
  showConfetti.value = false;
}

defineExpose({
  boardAPI,
  fallbackToStockfish,
  handleMove
});
</script>

<template>
  <div class="chessboard-container">
    <TheChessboard
        :board-config=boardConfig
        @board-created="handleBoardCreated"
        @move="handleMove"
        @check="handleCheck"
        @checkmate="handleCheckmate"
        @stalemate="handleStalemate"
        @draw="handleDraw"
        :player-color="'white'"
    />
    
    <GameNotification
        v-if="gameNotification.visible"
        :type="gameNotification.type"
        :color="gameNotification.color"
        :visible="gameNotification.visible"
        @close="closeNotification"
    />
    
    <ConfettiEffect 
        :active="showConfetti" 
        :duration="6000"
        @complete="handleConfettiComplete"
    />
    
    <GameSounds ref="gameSoundsRef" />
  </div>
</template>

<style scoped>
.chessboard-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>