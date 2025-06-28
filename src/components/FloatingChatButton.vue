<template>
  <div 
    class="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50"
    :class="{ 'chat-open': isOpen }"
  >
    <!-- Chat Button -->
    <button
      @click="toggleChat"
      class="w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      :class="{ 'rotate-45 transform': isOpen }"
    >
      <ChatBubbleLeftRightIcon v-if="!isOpen" class="w-6 h-6" />
      <XMarkIcon v-else class="w-6 h-6" />
    </button>

    <!-- Chat Panel -->
    <div 
      v-if="isOpen"
      class="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform origin-bottom-right"
    >
      <!-- Chat Header -->
      <div class="bg-primary-600 text-white p-4">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <ChatBubbleLeftRightIcon class="w-4 h-4" />
          </div>
          <div>
            <h3 class="font-semibold">JobLine Assistant</h3>
            <p class="text-xs text-primary-100">How can I help you?</p>
          </div>
        </div>
      </div>

      <!-- Chat Messages -->
      <div 
        ref="messagesContainer"
        class="h-80 overflow-y-auto p-4 space-y-3"
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
        >
          <div
            class="max-w-xs px-3 py-2 rounded-lg"
            :class="message.isUser 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-900'"
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
        <div v-if="isTyping" class="flex justify-start">
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
          />
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isTyping"
            class="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <PaperAirplaneIcon class="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { format } from 'date-fns';
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
}

const isOpen = ref(false);
const messages = ref<ChatMessage[]>([]);
const inputMessage = ref('');
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement>();

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
    });
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
    timestamp: new Date().toISOString()
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
    timestamp: new Date().toISOString()
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

// Auto-scroll when new messages arrive
watch(() => messages.value.length, scrollToBottom);
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
</style>