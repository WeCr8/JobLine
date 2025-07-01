<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Voice Notes</h3>
      <div class="flex items-center space-x-2">
        <span v-if="isRecording" class="text-sm text-red-600 animate-pulse">Recording...</span>
        <span v-else-if="isTranscribing" class="text-sm text-blue-600">Transcribing...</span>
      </div>
    </div>

    <!-- Recording Controls -->
    <div class="flex items-center justify-center space-x-4 mb-4">
      <button
        v-if="!isRecording"
        @click="startRecording"
        :disabled="!isSupported || isTranscribing"
        class="w-16 h-16 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
      >
        <MicrophoneIcon class="w-8 h-8 text-white" />
      </button>
      
      <button
        v-else
        @click="stopRecording"
        class="w-16 h-16 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
      >
        <StopIcon class="w-8 h-8 text-white" />
      </button>

      <div v-if="isRecording" class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-gray-600">{{ formatDuration(recordingDuration) }}</span>
      </div>
    </div>

    <!-- Recording Status -->
    <div v-if="!isSupported" class="text-center text-red-600 text-sm mb-4">
      Voice recording is not supported in your browser
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-2 mb-4">
      <button
        v-for="action in quickActions"
        :key="action.id"
        @click="setNoteType(action.type)"
        :class="selectedType === action.type ? 'bg-primary-100 text-primary-700 border-primary-200' : 'bg-gray-50 text-gray-700 border-gray-200'"
        class="px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
      >
        {{ action.label }}
      </button>
    </div>

    <!-- Transcription Preview -->
    <div v-if="currentTranscription" class="bg-gray-50 rounded-lg p-3 mb-4">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Transcription</h4>
      <p class="text-sm text-gray-700">{{ currentTranscription }}</p>
      <div class="flex items-center justify-between mt-3">
        <span class="text-xs text-gray-500">Confidence: {{ Math.round(transcriptionConfidence * 100) }}%</span>
        <div class="flex space-x-2">
          <button
            @click="saveVoiceNote"
            class="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors duration-200"
          >
            Save Note
          </button>
          <button
            @click="discardRecording"
            class="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400 transition-colors duration-200"
          >
            Discard
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Voice Notes -->
    <div v-if="optimizationStore.voiceNotes.length > 0" class="space-y-2">
      <h4 class="text-sm font-medium text-gray-900">Recent Notes</h4>
      <div
        v-for="note in optimizationStore.voiceNotes.slice(0, 3)"
        :key="note.id"
        class="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg"
      >
        <div class="flex-shrink-0">
          <component :is="getNoteIcon(note.type)" class="w-4 h-4 text-gray-500 mt-0.5" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900 truncate">{{ note.transcription }}</p>
          <div class="flex items-center space-x-2 mt-1">
            <span class="text-xs text-gray-500">{{ formatTime(note.createdAt) }}</span>
            <span class="text-xs text-gray-500">{{ formatDuration(note.duration) }}</span>
          </div>
        </div>
        <button
          @click="playNote(note)"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <PlayIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { format } from 'date-fns';
import { useOptimizationStore } from '../stores/optimization';
import type { VoiceNote } from '../types/optimization';
import {
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  CogIcon,
  ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline';

interface Props {
  jobId?: string;
}

const props = defineProps<Props>();
const optimizationStore = useOptimizationStore();

const isSupported = ref(false);
const isRecording = ref(false);
const isTranscribing = ref(false);
const recordingDuration = ref(0);
const currentTranscription = ref('');
const transcriptionConfidence = ref(0);
const selectedType = ref<'job-update' | 'quality-issue' | 'machine-problem' | 'general'>('job-update');

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let recordingTimer: number | null = null;

const quickActions = [
  { id: '1', label: 'Job Update', type: 'job-update' as const },
  { id: '2', label: 'Quality Issue', type: 'quality-issue' as const },
  { id: '3', label: 'Machine Problem', type: 'machine-problem' as const },
  { id: '4', label: 'General Note', type: 'general' as const }
];

const checkSupport = () => {
  isSupported.value = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    recordingDuration.value = 0;

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      await processRecording();
      
      // Stop all tracks to release microphone
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    isRecording.value = true;

    // Start timer
    recordingTimer = window.setInterval(() => {
      recordingDuration.value += 1;
    }, 1000);

  } catch (error) {
    console.error('Error starting recording:', error);
  }
};

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop();
    isRecording.value = false;
    
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }
  }
};

const processRecording = async () => {
  isTranscribing.value = true;
  
  try {
    const transcription = await optimizationStore.transcribeAudio();
    currentTranscription.value = transcription;
    transcriptionConfidence.value = 0.85 + Math.random() * 0.15; // Mock confidence
  } catch (error) {
    console.error('Error transcribing audio:', error);
    currentTranscription.value = 'Error transcribing audio. Please try again.';
    transcriptionConfidence.value = 0;
  } finally {
    isTranscribing.value = false;
  }
};

const saveVoiceNote = async () => {
  if (!currentTranscription.value) return;

  await optimizationStore.addVoiceNote({
    jobId: props.jobId,
    userId: 'current-user', // Would come from auth store
    audioUrl: 'mock-audio-url', // Would be actual audio URL
    transcription: currentTranscription.value,
    confidence: transcriptionConfidence.value,
    duration: recordingDuration.value,
    type: selectedType.value,
    tags: extractTags(currentTranscription.value)
  });

  // Reset
  currentTranscription.value = '';
  recordingDuration.value = 0;
};

const discardRecording = () => {
  currentTranscription.value = '';
  recordingDuration.value = 0;
};

const setNoteType = (type: typeof selectedType.value) => {
  selectedType.value = type;
};

const extractTags = (text: string): string[] => {
  const tags: string[] = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('quality') || lowerText.includes('defect')) tags.push('quality');
  if (lowerText.includes('machine') || lowerText.includes('equipment')) tags.push('machine');
  if (lowerText.includes('setup') || lowerText.includes('changeover')) tags.push('setup');
  if (lowerText.includes('tool') || lowerText.includes('tooling')) tags.push('tooling');
  if (lowerText.includes('urgent') || lowerText.includes('critical')) tags.push('urgent');
  
  return tags;
};

const getNoteIcon = (type: string) => {
  const icons = {
    'job-update': BriefcaseIcon,
    'quality-issue': ExclamationTriangleIcon,
    'machine-problem': CogIcon,
    'general': ChatBubbleLeftIcon
  };
  return icons[type as keyof typeof icons] || ChatBubbleLeftIcon;
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'HH:mm');
};

const playNote = (note: VoiceNote) => {
  // Would implement audio playback
  console.log('Playing note:', note.id);
};

onMounted(() => {
  checkSupport();
});

onUnmounted(() => {
  if (recordingTimer) {
    clearInterval(recordingTimer);
  }
  if (isRecording.value) {
    stopRecording();
  }
});
</script>