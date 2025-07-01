<template>
  <div class="preview-container" :class="{ 'preview-loading': loading, 'preview-error': error }">
    <!-- Preview Header -->
    <div class="preview-header">
      <h3 v-if="title" class="preview-title">{{ title }}</h3>
      
      <!-- Device Selection -->
      <div class="preview-device-selector">
        <Button
          v-for="device in availableDevices"
          :key="device.id"
          :variant="currentDevice === device.id ? 'primary' : 'ghost'"
          size="sm"
          :aria-label="`Preview on ${device.name}`"
          :aria-pressed="currentDevice === device.id"
          @click="currentDevice = device.id"
        >
          <component :is="device.icon" class="w-4 h-4" />
        </Button>
      </div>
      
      <!-- View State Selection -->
      <div v-if="states.length > 0" class="preview-state-selector">
        <select 
          v-model="currentState" 
          class="preview-state-select"
          :aria-label="'Select view state'"
        >
          <option v-for="state in states" :key="state.id" :value="state.id">
            {{ state.name }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- Preview Content -->
    <div class="preview-content-wrapper">
      <div 
        class="preview-device"
        :class="[
          `preview-device-${currentDevice}`,
          { 'preview-device-dark': darkMode }
        ]"
        :style="deviceStyle"
        :aria-busy="loading"
      >
        <!-- Loading State -->
        <div v-if="loading" class="preview-loading-overlay" role="status">
          <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="sr-only">Loading preview...</span>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="preview-error-overlay" role="alert">
          <div class="preview-error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div class="preview-error-message">{{ errorMessage || 'An error occurred while loading the preview' }}</div>
          <Button 
            v-if="retryEnabled" 
            variant="primary" 
            size="sm" 
            @click="$emit('retry')"
          >
            Retry
          </Button>
        </div>
        
        <!-- Content -->
        <div v-else class="preview-content">
          <slot :state="currentStateData"></slot>
        </div>
        
        <!-- Device Chrome Elements -->
        <div v-if="currentDevice === 'iphone'" class="preview-device-notch"></div>
        <div v-if="currentDevice === 'iphone'" class="preview-device-home-indicator"></div>
        <div v-if="currentDevice === 'android'" class="preview-device-status-bar"></div>
        <div v-if="currentDevice === 'android'" class="preview-device-navigation-bar"></div>
      </div>
    </div>
    
    <!-- Preview Controls -->
    <div class="preview-controls">
      <!-- Dark Mode Toggle -->
      <Button 
        variant="ghost" 
        size="sm" 
        :aria-label="darkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        :aria-pressed="darkMode"
        @click="darkMode = !darkMode"
      >
        <template v-if="darkMode">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </template>
      </Button>
      
      <!-- Zoom Controls -->
      <div class="preview-zoom-controls">
        <Button 
          variant="ghost" 
          size="sm" 
          :disabled="zoom <= 0.5"
          aria-label="Zoom out"
          @click="zoom = Math.max(0.5, zoom - 0.1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
          </svg>
        </Button>
        <span class="preview-zoom-value">{{ Math.round(zoom * 100) }}%</span>
        <Button 
          variant="ghost" 
          size="sm" 
          :disabled="zoom >= 2"
          aria-label="Zoom in"
          @click="zoom = Math.min(2, zoom + 0.1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Button>
      </div>
      
      <!-- Reset Button -->
      <Button 
        variant="ghost" 
        size="sm" 
        aria-label="Reset preview"
        @click="resetPreview"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue';
import Button from './Button.vue';

interface State {
  id: string;
  name: string;
  data?: any;
}

interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: any;
}

interface Props {
  title?: string;
  states?: State[];
  initialState?: string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  retryEnabled?: boolean;
  devices?: Device[];
  initialDevice?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  states: () => [],
  initialState: '',
  loading: false,
  error: false,
  errorMessage: '',
  retryEnabled: true,
  initialDevice: 'desktop'
});

const emit = defineEmits<{
  'update:state': [stateId: string];
  'update:device': [deviceId: string];
  'retry': [];
}>();

// State
const currentState = ref(props.initialState || (props.states.length > 0 ? props.states[0].id : ''));
const currentDevice = ref(props.initialDevice);
const darkMode = ref(false);
const zoom = ref(1);

const defaultDevices = [
  {
    id: 'desktop',
    name: 'Desktop',
    width: 1280,
    height: 800,
    icon: DesktopIcon
  },
  {
    id: 'tablet',
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: TabletIcon
  },
  {
    id: 'iphone',
    name: 'iPhone',
    width: 375,
    height: 812,
    icon: MobileIcon
  },
  {
    id: 'android',
    name: 'Android',
    width: 360,
    height: 800,
    icon: AndroidIcon
  }
];

// Computed
const availableDevices = computed(() => (props.devices && props.devices.length > 0 ? props.devices : defaultDevices));

const currentStateData = computed(() => {
  const state = props.states.find(s => s.id === currentState.value);
  return state?.data || {};
});

const deviceStyle = computed(() => {
  const device = props.devices.find(d => d.id === currentDevice.value);
  if (!device) return {};
  
  return {
    width: `${device.width * zoom.value}px`,
    height: `${device.height * zoom.value}px`,
    transform: `scale(${zoom.value})`,
    transformOrigin: 'top left'
  };
});

// Watch for changes
watch(currentState, (newState) => {
  emit('update:state', newState);
});

watch(currentDevice, (newDevice) => {
  emit('update:device', newDevice);
});

// Methods
const resetPreview = () => {
  currentState.value = props.initialState || (props.states.length > 0 ? props.states[0].id : '');
  currentDevice.value = props.initialDevice;
  darkMode.value = false;
  zoom.value = 1;
};

// Icons
function DesktopIcon() {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25'
    })
  ]);
}

function TabletIcon() {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z'
    })
  ]);
}

function MobileIcon() {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3'
    })
  ]);
}

function AndroidIcon() {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    'stroke-width': '1.5',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3'
    })
  ]);
}
</script>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--preview-border-color, #e5e7eb);
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--preview-bg-color, #f9fafb);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--preview-border-color, #e5e7eb);
  background-color: var(--preview-header-bg, #ffffff);
}

.preview-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--preview-title-color, #111827);
  margin: 0;
}

.preview-device-selector {
  display: flex;
  gap: 0.25rem;
}

.preview-state-selector {
  margin-left: auto;
}

.preview-state-select {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  border: 1px solid var(--preview-select-border, #d1d5db);
  background-color: var(--preview-select-bg, #ffffff);
  color: var(--preview-select-text, #374151);
}

.preview-content-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: auto;
  background-color: var(--preview-content-bg, #f3f4f6);
  min-height: 300px;
}

.preview-device {
  position: relative;
  background-color: #ffffff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.preview-device-dark {
  background-color: #1f2937;
  color: #f9fafb;
}

/* Device-specific styles */
.preview-device-desktop {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
}

.preview-device-tablet {
  border-radius: 1rem;
  border: 1px solid #d1d5db;
}

.preview-device-iphone {
  border-radius: 2rem;
  border: 8px solid #000000;
  position: relative;
}

.preview-device-android {
  border-radius: 1rem;
  border: 8px solid #1f1f1f;
  position: relative;
}

.preview-device-notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 25px;
  background-color: #000000;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  z-index: 10;
}

.preview-device-home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 5px;
  background-color: #000000;
  border-radius: 2.5px;
  z-index: 10;
}

.preview-device-status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;
  background-color: #1f1f1f;
  z-index: 10;
}

.preview-device-navigation-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  background-color: #1f1f1f;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.preview-device-navigation-bar::before {
  content: '';
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 50%;
}

.preview-content {
  padding: 1rem;
  height: 100%;
  overflow: auto;
}

.preview-loading-overlay,
.preview-error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 20;
}

.preview-device-dark .preview-loading-overlay,
.preview-device-dark .preview-error-overlay {
  background-color: rgba(31, 41, 55, 0.9);
}

.preview-error-icon {
  color: var(--preview-error-color, #ef4444);
  margin-bottom: 1rem;
}

.preview-error-message {
  font-size: 0.875rem;
  color: var(--preview-error-text, #1f2937);
  margin-bottom: 1rem;
  text-align: center;
  max-width: 80%;
}

.preview-device-dark .preview-error-message {
  color: var(--preview-error-text-dark, #f9fafb);
}

.preview-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--preview-border-color, #e5e7eb);
  background-color: var(--preview-controls-bg, #ffffff);
}

.preview-zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-zoom-value {
  font-size: 0.875rem;
  color: var(--preview-zoom-text, #6b7280);
  min-width: 3rem;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .preview-content-wrapper {
    padding: 1rem;
  }
  
  .preview-device {
    max-width: 100%;
    max-height: 70vh;
  }
  
  .preview-header,
  .preview-controls {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .preview-device-selector {
    order: 2;
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  .preview-state-selector {
    margin-left: 0;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .preview-device {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: more) {
  .preview-container {
    border: 2px solid #000000;
  }
  
  .preview-header,
  .preview-controls {
    border-color: #000000;
  }
  
  .preview-device {
    border: 2px solid #000000;
    box-shadow: none;
  }
  
  .preview-state-select {
    border: 2px solid #000000;
  }
  
  .preview-error-icon {
    color: #FF0000;
  }
}
</style>