<script setup>
import {defineExpose, ref} from 'vue';
import {TheChessboard} from 'vue3-chessboard';
import {LlmEngine} from '../LLM-Engine';
import {FallbackEngine} from '../Engine';
import 'vue3-chessboard/style.css';
import '../assets/css/chessboard-custom.css';  // Your custom styles

const moveSound = new Audio('/sounds/move.mp3');
const captureSound = new Audio('/sounds/capture.mp3');

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
let llmEngine;
let fallbackEngine;

function handleBoardCreated(boardApi) {
  boardAPI.value = boardApi;
  fallbackEngine = new FallbackEngine(boardApi);
  llmEngine = new LlmEngine(boardApi);
}

function playMoveSound(isCapture) {
  if (isCapture) {
    captureSound.currentTime = 0;
    captureSound.play().catch(e => console.error('Error playing capture sound:', e));
  } else {
    moveSound.currentTime = 0;
    moveSound.play().catch(e => console.error('Error playing move sound:', e));
  }
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

function handleCheckmate(isMated) {
  alert(`${isMated} is mated`);
}

function handleStalemate() {
  alert('Stalemate');
}

function handleDraw() {
  alert('Draw');
}

defineExpose({
  boardAPI,
  fallbackToStockfish,
  handleMove
});
</script>

<template>
  <TheChessboard
      :board-config=boardConfig
      @board-created="handleBoardCreated"
      @move="handleMove"
      @checkmate="handleCheckmate"
      @stalemate="handleStalemate"
      @draw="handleDraw"
      :player-color="'white'"
  />
</template>

<style scoped>

</style>