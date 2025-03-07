<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['checkmate', 'stalemate', 'draw'].includes(value)
  },
  color: {
    type: String,
    default: null
  },
  visible: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'newGame']);

const notificationRef = ref(null);
const isVisible = ref(props.visible);

// function to close the notification
function closeNotification() {
  isVisible.value = false;
  emit('close');
}

function startNewGame() {
  isVisible.value = false;
  emit('newGame');
  emit('close');
}

// Auto-close after 15 seconds
let autoCloseTimer = null;
onMounted(() => {
  if (props.visible) {
    autoCloseTimer = setTimeout(() => {
      closeNotification();
    }, 15000);
  }
});

onBeforeUnmount(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
  }
});

// Determine the title and message based on the notification type
const title = (() => {
  switch (props.type) {
    case 'checkmate':
      return props.color === 'white' ? 'Black Wins!' : 'White Wins!';
    case 'stalemate':
      return 'Stalemate';
    case 'draw':
      return 'Draw';
    default:
      return 'Game Over';
  }
})();

const message = (() => {
  switch (props.type) {
    case 'checkmate':
      return props.color === 'white' 
        ? 'White king is checkmated. Black wins the game!' 
        : 'Black king is checkmated. White wins the game!';
    case 'stalemate':
      return `${props.color === 'white' ? 'White' : 'Black'} has no legal moves but is not in check. The game ends in a stalemate.`;
    case 'draw':
      return 'The game ends in a draw. Neither player can win.';
    default:
      return 'The game has ended.';
  }
})();
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="game-notification" ref="notificationRef">
      <div class="notification-content">
        <div class="notification-header">
          <h2>{{ title }}</h2>
          <button class="close-button" @click="closeNotification">×</button>
        </div>
        <div class="notification-body">
          <p>{{ message }}</p>
        </div>
        <div class="notification-footer">
          <button class="action-button new-game-button" @click="startNewGame">New Game</button>
          <button class="action-button continue-button" @click="closeNotification">Continue</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.game-notification {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.notification-content {
  background: rgba(30, 30, 60, 0.9);
  border-radius: 12px;
  padding: 25px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 30px rgba(255, 0, 204, 0.6), 0 0 60px rgba(51, 51, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  animation: glow 3s infinite alternate;
}

.notification-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff00cc, #3333ff);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notification-header h2 {
  margin: 0;
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 0, 204, 0.7), 0 0 20px rgba(51, 51, 255, 0.5);
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.close-button:hover {
  color: #fff;
}

.notification-body {
  margin-bottom: 25px;
}

.notification-body p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  line-height: 1.5;
  margin: 0;
}

.notification-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.action-button {
  background: linear-gradient(45deg, #ff00cc, #3333ff);
  border: none;
  color: white;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 15px rgba(255, 0, 204, 0.4);
}

.new-game-button {
  background: linear-gradient(45deg, #00ccff, #3333ff);
}

.continue-button {
  background: linear-gradient(45deg, #ff00cc, #3333ff);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 0, 204, 0.6);
}

.new-game-button:hover {
  box-shadow: 0 0 20px rgba(0, 204, 255, 0.6);
}

@keyframes glow {
  0% {
    box-shadow: 0 0 20px rgba(255, 0, 204, 0.4), 0 0 40px rgba(51, 51, 255, 0.3);
  }
  100% {
    box-shadow: 0 0 30px rgba(255, 0, 204, 0.6), 0 0 60px rgba(51, 51, 255, 0.5);
  }
}
</style> 