<template>
  <div 
    class="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 safe-area-right safe-area-bottom"
    :class="{ 'chat-open': isOpen }"
  >
    <!-- Chat Button -->
    <button
      @click="toggleChat"
      class="w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      :class="{ 'rotate-45 transform': isOpen }"
      aria-label="Chat with AI Assistant"
      ref="chatButton"
    >
      <ChatBubbleLeftRightIcon v-if="!isOpen" class="w-6 h-6" />
      <XMarkIcon v-else class="w-6 h-6" />
    </button>

    <!-- Chat Panel -->
    <div 
      v-if="isOpen"
      class="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform origin-bottom-right"
      ref="chatPanel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      <!-- Chat Header -->
      <div class="bg-primary-600 text-white p-4">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <ChatBubbleLeftRightIcon class="w-4 h-4" />
          </div>
          <div>
            <h3 id="chat-title" class="font-semibold">JobLine Assistant</h3>
            <p class="text-xs text-primary-100">How can I help you?</p>
          </div>
        </div>
      </div>

      <!-- Chat Messages -->
      <div 
        ref="messagesContainer"
        class="h-80 overflow-y-auto p-4 space-y-3"
        aria-live="polite"
      >
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="text-center py-4">
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <ChatBubbleLeftRightIcon class="w-6 h-6 text-primary-600" />
          </div>
          <p class="text-sm text-gray-600">Ask me about jobs, machines, or schedules</p>
          <div class="flex flex-wrap gap-2 justify-center mt-3">
            <button
              v-for="suggestion in quickSuggestions"
              :key="suggestion"
              @click="sendMessage(suggestion)"
              class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div
          v-for="message in messages"
          :key="message.id"
          :class="message.isUser ? 'flex justify-end' : 'flex justify-start'"
          class="animate-fade-in"
        >
          <div
            class="max-w-xs px-3 py-2 rounded-lg"
            :class="message.isUser 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-900'"
            :aria-label="message.isUser ? 'Your message' : 'Assistant message'"
          >
            <div v-html="formatMessage(message.content)"></div>
            <div 
              class="text-xs mt-1 opacity-75"
              :class="message.isUser ? 'text-primary-100' : 'text-gray-500'"
            >
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex justify-start animate-fade-in">
          <div class="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="p-3 border-t border-gray-200">
        <form @submit.prevent="handleSubmit" class="flex space-x-2">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :disabled="isTyping"
            aria-label="Type your message"
            ref="chatInput"
          />
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isTyping"
            class="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Send message"
          >
            <PaperAirplaneIcon class="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue';
import { format } from 'date-fns';
import { addSwipeGesture, addTapGesture } from '../utils/gesture.ts';
import { createAccessibleFocusTrap, lockBodyScroll } from '../utils/accessibility.ts';
import { isIOS, isMobile } from '../utils/platform.ts';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  type: 'text' | 'voice' | 'image' | 'part-lookup';
}

const isOpen = ref(false);
const messages = ref<ChatMessage[]>([]);
const inputMessage = ref('');
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement>();
const chatButton = ref<HTMLElement>();
const chatPanel = ref<HTMLElement>();
const chatInput = ref<HTMLElement>();

// Focus trap for accessibility
let focusTrap: { activate: () => void; deactivate: () => void } | null = null;
// Body scroll lock for mobile
let unlockBodyScroll: (() => void) | null = null;
// Gesture cleanup
let cleanupSwipeGesture: (() => void) | null = null;

const quickSuggestions = [
  'Show job status',
  'Machine status',
  'Due dates',
  'Urgent jobs'
];

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom();
      
      // Set up focus trap for accessibility
      if (chatPanel.value) {
        focusTrap = createAccessibleFocusTrap(chatPanel.value);
        focusTrap.activate();
        
        // Focus the input field
        if (chatInput.value) {
          (chatInput.value as HTMLInputElement).focus();
        }
        
        // Lock body scroll on mobile
        if (isMobile() && chatPanel.value) {
          unlockBodyScroll = lockBodyScroll(chatPanel.value);
        }
        
        // Add swipe gesture to close on mobile
        if (isMobile() && chatPanel.value) {
          cleanupSwipeGesture = addSwipeGesture(chatPanel.value, (direction) => {
            if (direction === 'down') {
              toggleChat();
            }
          });
        }
      }
    });
  } else {
    // Clean up when closing
    if (focusTrap) {
      focusTrap.deactivate();
      focusTrap = null;
    }
    
    if (unlockBodyScroll) {
      unlockBodyScroll();
      unlockBodyScroll = null;
    }
    
    if (cleanupSwipeGesture) {
      cleanupSwipeGesture();
      cleanupSwipeGesture = null;
    }
    
    // Return focus to chat button
    if (chatButton.value) {
      chatButton.value.focus();
    }
  }
};

const handleSubmit = async () => {
  if (!inputMessage.value.trim()) return;
  
  const message = inputMessage.value.trim();
  inputMessage.value = '';
  
  await sendMessage(message);
};

const sendMessage = async (message: string) => {
  // Add user message
  messages.value.push({
    id: Date.now().toString(),
    content: message,
    isUser: true,
    timestamp: new Date().toISOString(),
    type: 'text'
  });
  
  scrollToBottom();
  
  // Simulate AI thinking
  isTyping.value = true;
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate response based on query
  const response = generateResponse(message);
  
  // Add AI response
  messages.value.push({
    id: Date.now().toString(),
    content: response,
    isUser: false,
    timestamp: new Date().toISOString(),
    type: 'text'
  });
  
  isTyping.value = false;
  scrollToBottom();
};

const generateResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('job status') || lowerQuery.includes('show job')) {
    return "We have 5 jobs running, 2 in setup, and 1 on hold. The most urgent job is J2024-004 for Acme Corp, due tomorrow.";
  }
  
  if (lowerQuery.includes('machine') || lowerQuery.includes('equipment')) {
    return "Currently, 7 machines are running, 3 are idle, and 1 is in maintenance. CNC-001 is running job J2024-001 with John Smith as operator.";
  }
  
  if (lowerQuery.includes('due date') || lowerQuery.includes('deadline')) {
    return "This week we have 3 jobs due: J2024-001 (Wednesday), J2024-003 (Thursday), and J2024-004 (Friday). All are currently on schedule.";
  }
  
  if (lowerQuery.includes('urgent') || lowerQuery.includes('priority')) {
    return "There is 1 urgent job: J2024-004 (Valve Body) for Fluid Dynamics Company. It's currently on hold due to material issues.";
  }
  
  // Default response
  return "I can help with job status, machine assignments, schedules, and more. What specific information are you looking for?";
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/•/g, '&bull;');
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'HH:mm');
};

// Handle keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  // Alt+C to toggle chat
  if (event.altKey && event.key === 'c') {
    toggleChat();
  }
  
  // Escape to close chat
  if (event.key === 'Escape' && isOpen.value) {
    toggleChat();
  }
};

// Handle clicks outside to close
const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value && chatPanel.value && chatButton.value) {
    if (!chatPanel.value.contains(event.target as Node) && 
        !chatButton.value.contains(event.target as Node)) {
      toggleChat();
    }
  }
};

// Auto-scroll when new messages arrive
watch(() => messages.value.length, scrollToBottom);

// Add iOS specific styles
const applyIOSStyles = () => {
  if (isIOS()) {
    // Add iOS-specific styles
    document.documentElement.classList.add('ios-device');
    
    // Fix for iOS input zoom
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', handleClickOutside);
  
  // Apply platform-specific styles
  applyIOSStyles();
  
  // Add tap gesture for mobile
  if (chatButton.value) {
    addTapGesture(chatButton.value, () => {
      toggleChat();
    });
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('click', handleClickOutside);
  
  // Clean up any remaining handlers
  if (focusTrap) {
    focusTrap.deactivate();
  }
  
  if (unlockBodyScroll) {
    unlockBodyScroll();
  }
  
  if (cleanupSwipeGesture) {
    cleanupSwipeGesture();
  }
});
</script>

<style scoped>
.chat-open {
  z-index: 1000;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* iOS specific styles */
:global(.ios-device) .chat-open {
  /* Ensure it's above the iOS bottom bar */
  padding-bottom: env(safe-area-inset-bottom);
}

/* Android specific styles */
:global(.android-device) .chat-open {
  /* Android-specific adjustments if needed */
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .chat-open {
    bottom: 5rem; /* Adjust for mobile navigation */
  }
}
</style>