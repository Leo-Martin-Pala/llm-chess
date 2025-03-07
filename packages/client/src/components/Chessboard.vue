<script setup>
import {defineExpose, ref} from 'vue';
import {TheChessboard} from 'vue3-chessboard';
import {LlmEngine} from '../LLM-Engine';
import {FallbackEngine} from '../Engine';
import GameNotification from './GameNotification.vue';
import GameSounds from './GameSounds.vue';
import 'vue3-chessboard/style.css';
import '../assets/css/chessboard-custom.css';  // Your custom styles

const props = defineProps({
  modelName: {
    type: String,
    default: 'gemini/gemini-2.0-flash'
  }
});

const boardConfig = {
  coordinates: false,
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

function handleBoardCreated(boardApi) {
  boardAPI.value = boardApi;
  fallbackEngine = new FallbackEngine(boardApi);
  llmEngine = new LlmEngine(boardApi);
  
  // Play game start sound
  gameSoundsRef.value?.playSound('gameStart');
}

function playMoveSound(move) {
  // Check if the move puts the opponent in check
  if (boardAPI.value?.getIsCheck()) {
    gameSoundsRef.value?.playSound('moveCheck');
  } else if (move.flags?.includes('c')) {
    gameSoundsRef.value?.playSound('capture');
  } else if (move.flags?.includes('k') || move.flags?.includes('q')) {
    gameSoundsRef.value?.playSound('castle');
  } else if (move.flags?.includes('p')) {
    gameSoundsRef.value?.playSound('promote');
  } else {
    gameSoundsRef.value?.playSound('move');
  }
}

async function handleMove(move) {
  playMoveSound(move);

  if (boardAPI.value.getTurnColor() === 'black' && !boardAPI.value.getIsGameOver()) {
    try {
      await llmEngine?.sendPosition(boardAPI?.value.getFen(), props.modelName);
    } catch (error) {
      console.error('Error getting move from backend:', error);
      console.log('Fallback to Stockfish');
      fallbackToStockfish();
    }
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
  gameSoundsRef.value?.playSound('gameEnd');
  
  gameNotification.value = {
    visible: true,
    type: 'checkmate',
    color: isMated
  };
}

function handleStalemate() {
  gameSoundsRef.value?.playSound('gameEnd');
  gameNotification.value = {
    visible: true,
    type: 'stalemate',
    color: boardAPI.value?.getTurnColor()
  };
}

function handleDraw() {
  gameSoundsRef.value?.playSound('gameEnd');
  gameNotification.value = {
    visible: true,
    type: 'draw',
    color: null
  };
}

function closeNotification() {
  gameNotification.value.visible = false;
}

function startNewGame() {
  boardAPI.value?.resetBoard();
  gameSoundsRef.value?.playSound('gameStart');
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
        @newGame="startNewGame"
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