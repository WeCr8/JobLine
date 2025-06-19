<template>
  <div class="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <ChatBubbleLeftRightIcon class="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">JobLine Assistant</h3>
          <p class="text-sm text-gray-500">Ask me about jobs, machines, or schedules</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <!-- Voice Status Indicator -->
        <div v-if="chatStore.isListening" class="flex items-center space-x-1">
          <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span class="text-xs text-red-600">Listening...</span>
        </div>
        <div v-else-if="chatStore.isProcessingVoice" class="flex items-center space-x-1">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span class="text-xs text-blue-600">Processing...</span>
        </div>
        
        <!-- Voice Toggle -->
        <button
          v-if="chatStore.voiceEnabled"
          @click="toggleVoiceListening"
          :class="chatStore.isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'"
          class="p-2 rounded-full hover:bg-opacity-80 transition-colors duration-200"
        >
          <MicrophoneIcon class="w-4 h-4" />
        </button>
        
        <!-- Clear Chat -->
        <button
          @click="chatStore.clearChat"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
      style="max-height: calc(100vh - 300px);"
    >
      <!-- Welcome Message -->
      <div v-if="chatStore.messages.length === 0" class="text-center py-8">
        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChatBubbleLeftRightIcon class="w-8 h-8 text-primary-600" />
        </div>
        <h4 class="text-lg font-medium text-gray-900 mb-2">Welcome to JobLine Assistant</h4>
        <p class="text-gray-600 mb-4">I can help you with job status, machine assignments, schedules, and more.</p>
        
        <!-- Voice Instructions -->
        <div v-if="chatStore.voiceEnabled" class="mb-4 p-3 bg-blue-50 rounded-lg">
          <div class="flex items-center justify-center space-x-2 mb-2">
            <MicrophoneIcon class="w-4 h-4 text-blue-600" />
            <span class="text-sm font-medium text-blue-900">Voice Commands Available</span>
          </div>
          <p class="text-xs text-blue-700">Click the microphone to start voice conversation or use the voice button in the input area</p>
        </div>
        
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="suggestion in quickSuggestions"
            :key="suggestion"
            @click="sendMessage(suggestion)"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div
        v-for="message in chatStore.messages"
        :key="message.id"
        class="animate-fade-in"
        :class="message.isUser ? 'flex justify-end' : 'flex justify-start'"
      >
        <div
          class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
          :class="message.isUser 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 text-gray-900'"
        >
          <!-- Voice Message -->
          <div v-if="message.type === 'voice' && message.audioUrl" class="mb-2">
            <div class="flex items-center space-x-2">
              <button
                @click="playAudio(message.audioUrl)"
                class="p-1 rounded-full hover:bg-opacity-20 hover:bg-white transition-colors duration-200"
              >
                <PlayIcon class="w-4 h-4" />
              </button>
              <span class="text-xs opacity-75">Voice message</span>
              <span v-if="message.confidence" class="text-xs opacity-75">
                ({{ Math.round(message.confidence * 100) }}% confidence)
              </span>
            </div>
          </div>

          <!-- Image Message -->
          <div v-if="message.type === 'image' && message.imageUrl" class="mb-2">
            <img 
              :src="message.imageUrl" 
              alt="Uploaded image"
              class="max-w-full h-32 object-cover rounded cursor-pointer"
              @click="viewImage(message.imageUrl)"
            />
          </div>

          <!-- Part Matches -->
          <div v-if="message.partMatches && message.partMatches.length > 0" class="mb-2">
            <div class="space-y-2">
              <div
                v-for="match in message.partMatches.slice(0, 3)"
                :key="match.partNumber"
                class="p-2 bg-white bg-opacity-10 rounded text-xs"
              >
                <div class="font-medium">{{ match.partNumber }}</div>
                <div class="opacity-75">{{ Math.round(match.similarity * 100) }}% match</div>
                <div class="opacity-75">{{ match.material }}</div>
              </div>
            </div>
          </div>

          <!-- Message Content -->
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
      <div v-if="chatStore.isTyping" class="flex justify-start animate-fade-in">
        <div class="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
          </div>
        </div>
      </div>

      <!-- Processing Indicators -->
      <div v-if="chatStore.isProcessingImage" class="flex justify-start animate-fade-in">
        <div class="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm">Analyzing image for part identification...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 border-t border-gray-200">
      <!-- Image Upload Area -->
      <div
        v-if="showImageUpload"
        @drop="handleImageDrop"
        @dragover.prevent
        @dragenter.prevent
        class="mb-3 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors duration-200"
      >
        <CameraIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p class="text-sm text-gray-600">Drop an image here or click to upload</p>
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          @change="handleImageSelect"
          class="hidden"
        />
        <button
          @click="$refs.imageInput?.click()"
          class="mt-2 px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors duration-200"
        >
          Choose Image
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex space-x-2">
        <div class="flex-1 relative">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Ask about job status, machines, schedules... or use voice"
            class="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :disabled="chatStore.isTyping || chatStore.isProcessingVoice"
          />
          
          <!-- Voice Recording Button -->
          <button
            v-if="chatStore.voiceEnabled"
            type="button"
            @mousedown="startVoiceRecording"
            @mouseup="stopVoiceRecording"
            @mouseleave="stopVoiceRecording"
            :class="chatStore.isProcessingVoice ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            class="absolute right-12 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors duration-200"
          >
            <MicrophoneIcon class="w-4 h-4" />
          </button>
          
          <!-- Image Upload Toggle -->
          <button
            type="button"
            @click="showImageUpload = !showImageUpload"
            :class="showImageUpload ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors duration-200"
          >
            <CameraIcon class="w-4 h-4" />
          </button>
        </div>
        
        <button
          type="submit"
          :disabled="!inputMessage.trim() || chatStore.isTyping"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </form>
      
      <!-- Voice Instructions -->
      <div v-if="chatStore.voiceEnabled" class="mt-2 text-xs text-gray-500 text-center">
        Hold the microphone button to record, or click the header mic for continuous listening
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { format } from 'date-fns';
import { useChatStore } from '../stores/chat';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  TrashIcon,
  MicrophoneIcon,
  CameraIcon,
  PlayIcon
} from '@heroicons/vue/24/outline';

const chatStore = useChatStore();
const inputMessage = ref('');
const messagesContainer = ref<HTMLElement>();
const showImageUpload = ref(false);
const imageInput = ref<HTMLInputElement>();

const quickSuggestions = [
  'Show job status',
  'What jobs are urgent?',
  'Machine status',
  'Due dates this week'
];

const handleSubmit = async () => {
  if (!inputMessage.value.trim()) return;
  
  const message = inputMessage.value.trim();
  inputMessage.value = '';
  
  await chatStore.processUserQuery(message);
  scrollToBottom();
};

const sendMessage = async (message: string) => {
  await chatStore.processUserQuery(message);
  scrollToBottom();
};

const toggleVoiceListening = () => {
  if (chatStore.isListening) {
    chatStore.stopVoiceListening();
  } else {
    chatStore.startVoiceListening();
  }
};

const startVoiceRecording = () => {
  chatStore.startVoiceRecording();
};

const stopVoiceRecording = () => {
  chatStore.stopVoiceRecording();
};

const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processImageFile(file);
  }
};

const handleImageDrop = (event: DragEvent) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    processImageFile(file);
  }
};

const processImageFile = async (file: File) => {
  showImageUpload.value = false;
  await chatStore.processImageForPartLookup(file);
  scrollToBottom();
};

const playAudio = (audioUrl: string) => {
  const audio = new Audio(audioUrl);
  audio.play();
};

const viewImage = (imageUrl: string) => {
  window.open(imageUrl, '_blank');
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
watch(() => chatStore.messages.length, scrollToBottom);
</script>