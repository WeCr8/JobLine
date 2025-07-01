<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">AI Assistant</h1>
        <p class="text-gray-600">Ask questions about jobs, machines, schedules, and more</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="showIntegrations = !showIntegrations"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          {{ showIntegrations ? 'Hide' : 'Show' }} Integrations
        </button>
        <button
          v-if="chatStore.voiceEnabled"
          @click="toggleVoiceMode"
          :class="voiceMode ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
          class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-80 transition-colors duration-200"
        >
          {{ voiceMode ? 'Stop Voice Mode' : 'Start Voice Mode' }}
        </button>
      </div>
    </div>

    <!-- Voice Mode Indicator -->
    <div v-if="voiceMode" class="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div>
            <h3 class="font-semibold">Voice Mode Active</h3>
            <p class="text-sm opacity-90">Speak naturally - I'm listening for your questions</p>
          </div>
        </div>
        <button
          @click="toggleVoiceMode"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors duration-200"
        >
          Stop
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chat Interface -->
      <div class="lg:col-span-2">
        <div class="h-[calc(100vh-250px)]">
          <ChatInterface />
        </div>
      </div>

      <!-- Integrations Panel -->
      <div v-if="showIntegrations">
        <IntegrationManager />
      </div>

      <!-- Quick Actions Panel -->
      <div v-else class="space-y-6">
        <!-- Voice Commands Help -->
        <div v-if="chatStore.voiceEnabled" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Voice Commands</h3>
          <div class="space-y-2">
            <div
              v-for="command in voiceCommands"
              :key="command.phrase"
              class="p-2 bg-gray-50 rounded text-sm"
            >
              <div class="font-medium text-gray-900">"{{ command.phrase }}"</div>
              <div class="text-gray-600">{{ command.description }}</div>
            </div>
          </div>
        </div>

        <!-- Image Recognition Help -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Part Recognition</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <CameraIcon class="w-5 h-5 text-blue-600" />
              <span class="text-sm text-gray-700">Upload photos to identify similar parts</span>
            </div>
            <div class="flex items-center space-x-2">
              <MagnifyingGlassIcon class="w-5 h-5 text-green-600" />
              <span class="text-sm text-gray-700">AI analyzes dimensions, material, and features</span>
            </div>
            <div class="flex items-center space-x-2">
              <DocumentTextIcon class="w-5 h-5 text-purple-600" />
              <span class="text-sm text-gray-700">Get part numbers and current job status</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-3">
            <div
              v-for="message in recentMessages"
              :key="message.id"
              class="p-2 bg-gray-50 rounded text-sm"
            >
              <div class="flex items-center space-x-2 mb-1">
                <component :is="getMessageIcon(message.type)" class="w-4 h-4 text-gray-500" />
                <span class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div class="text-gray-700 truncate">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import { useChatStore } from '../stores/chat.ts';
import ChatInterface from '../components/ChatInterface.vue';
import IntegrationManager from '../components/IntegrationManager.vue';
import {
  CameraIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline';

const chatStore = useChatStore();
const showIntegrations = ref(false);
const voiceMode = ref(false);

const voiceCommands = [
  { phrase: "What's the status of job 2024-001?", description: "Get specific job information" },
  { phrase: "Show me all urgent jobs", description: "Filter jobs by priority" },
  { phrase: "Which machines are running?", description: "Check machine status" },
  { phrase: "Any quality issues today?", description: "Review quality alerts" },
  { phrase: "When is the next delivery due?", description: "Check upcoming deadlines" }
];

const recentMessages = computed(() => 
  chatStore.messages.slice(-5).reverse()
);

const toggleVoiceMode = () => {
  voiceMode.value = !voiceMode.value;
  if (voiceMode.value) {
    chatStore.startVoiceListening();
  } else {
    chatStore.stopVoiceListening();
  }
};

const getMessageIcon = (type: string) => {
  const icons = {
    'text': ChatBubbleLeftRightIcon,
    'voice': MicrophoneIcon,
    'image': PhotoIcon,
    'part-lookup': CameraIcon
  };
  return icons[type as keyof typeof icons] || ChatBubbleLeftRightIcon;
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, HH:mm');
};
</script>