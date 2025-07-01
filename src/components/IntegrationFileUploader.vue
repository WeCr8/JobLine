<template>
  <div class="integration-uploader">
    <div 
      class="uploader-dropzone"
      :class="{ 
        'uploader-dropzone-active': isDragging,
        'uploader-dropzone-disabled': disabled
      }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="uploader-content">
        <div class="uploader-icon">
          <DocumentArrowUpIcon v-if="!uploading" class="w-12 h-12 text-gray-400" />
          <svg v-else class="animate-spin w-12 h-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <h3 class="uploader-title">{{ uploading ? 'Uploading...' : 'Upload File' }}</h3>
        
        <p class="uploader-description">
          {{ description || 'Drag and drop your file here, or click to browse' }}
        </p>
        
        <div v-if="!uploading" class="uploader-formats">
          <span v-for="format in acceptedFormats" :key="format" class="uploader-format">
            {{ format.toUpperCase() }}
          </span>
        </div>
        
        <div v-if="uploading" class="uploader-progress">
          <div class="uploader-progress-bar">
            <div 
              class="uploader-progress-fill"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>
          <div class="uploader-progress-text">
            {{ uploadProgress }}% complete
          </div>
        </div>
        
        <input
          ref="fileInput"
          type="file"
          class="uploader-input"
          :accept="acceptedFileTypes"
          @change="handleFileChange"
          :disabled="disabled || uploading"
        />
        
        <button
          v-if="!uploading"
          type="button"
          class="uploader-button"
          @click="triggerFileInput"
          :disabled="disabled"
        >
          Browse Files
        </button>
        
        <button
          v-else
          type="button"
          class="uploader-button uploader-button-cancel"
          @click="cancelUpload"
        >
          Cancel
        </button>
      </div>
    </div>
    
    <div v-if="error" class="uploader-error" role="alert">
      <ExclamationCircleIcon class="w-5 h-5" />
      <span>{{ error }}</span>
    </div>
    
    <div v-if="selectedFile && !uploading" class="uploader-file">
      <div class="uploader-file-info">
        <DocumentIcon class="w-5 h-5 text-primary-600" />
        <div class="uploader-file-details">
          <div class="uploader-file-name">{{ selectedFile.name }}</div>
          <div class="uploader-file-size">{{ formatFileSize(selectedFile.size) }}</div>
        </div>
      </div>
      
      <div class="uploader-file-actions">
        <button
          type="button"
          class="uploader-file-action"
          @click="clearFile"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <div v-if="selectedFile && !uploading" class="uploader-actions">
      <div class="uploader-form">
        <div class="uploader-form-group">
          <label class="uploader-label">Import Type</label>
          <select
            v-model="importType"
            class="uploader-select"
            :disabled="disabled"
          >
            <option value="job-data">Job Data</option>
            <option value="operator-workcenter">Operator/Workcenter Mapping</option>
            <option value="routing-operations">Routing & Operations</option>
            <option value="cost-tracking">Cost Tracking</option>
            <option value="customer-association">Customer Association</option>
          </select>
        </div>
        
        <div class="uploader-form-group">
          <label class="uploader-label">Connection</label>
          <select
            v-model="selectedConnectionId"
            class="uploader-select"
            :disabled="disabled"
          >
            <option v-for="conn in connections" :key="conn.id" :value="conn.id">
              {{ conn.name }}
            </option>
          </select>
        </div>
      </div>
      
      <button
        type="button"
        class="uploader-submit"
        @click="startUpload"
        :disabled="!canUpload || disabled"
      >
        Start Import
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { integrationService } from '../services/integration.service.ts';
import type { ConnectionConfig, ImportType } from '../types/integration';
import {
  DocumentArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline';

interface Props {
  acceptedFormats?: string[];
  maxFileSize?: number; // in bytes
  description?: string;
  disabled?: boolean;
  defaultConnectionId?: string;
  defaultImportType?: ImportType;
}

const props = withDefaults(defineProps<Props>(), {
  acceptedFormats: () => ['csv', 'xlsx', 'xls'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  description: '',
  disabled: false,
  defaultConnectionId: '',
  defaultImportType: 'job-data'
});

const emit = defineEmits<{
  'upload-start': [file: File];
  'upload-progress': [progress: number];
  'upload-complete': [result: any];
  'upload-error': [error: string];
  'upload-cancel': [];
}>();

// State
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const error = ref<string | null>(null);
const connections = ref<ConnectionConfig[]>([]);
const selectedConnectionId = ref(props.defaultConnectionId);
const importType = ref<ImportType>(props.defaultImportType);

// Computed
const acceptedFileTypes = computed(() => {
  return props.acceptedFormats.map(format => {
    if (format === 'csv') return '.csv';
    if (format === 'xlsx' || format === 'xls') return '.xlsx, .xls';
    return `.${format}`;
  }).join(', ');
});

const canUpload = computed(() => {
  return selectedFile.value && selectedConnectionId.value;
});

// Methods
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  
  if (!event.dataTransfer?.files.length) {
    return;
  }
  
  const file = event.dataTransfer.files[0];
  validateAndSetFile(file);
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  
  if (!input.files?.length) {
    return;
  }
  
  const file = input.files[0];
  validateAndSetFile(file);
};

const validateAndSetFile = (file: File) => {
  error.value = null;
  
  // Check file size
  if (file.size > props.maxFileSize) {
    error.value = `File size exceeds the maximum limit of ${formatFileSize(props.maxFileSize)}`;
    return;
  }
  
  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  if (!props.acceptedFormats.includes(fileExtension)) {
    error.value = `File type not supported. Accepted formats: ${props.acceptedFormats.join(', ')}`;
    return;
  }
  
  selectedFile.value = file;
};

const clearFile = () => {
  selectedFile.value = null;
  error.value = null;
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const startUpload = async () => {
  if (!selectedFile.value || !selectedConnectionId.value) {
    return;
  }
  
  uploading.value = true;
  uploadProgress.value = 0;
  error.value = null;
  
  emit('upload-start', selectedFile.value);
  
  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
        emit('upload-progress', uploadProgress.value);
      }
    }, 500);
    
    // Process the file
    const result = await integrationService.processFileUpload(
      selectedFile.value,
      selectedConnectionId.value,
      importType.value
    );
    
    clearInterval(progressInterval);
    uploadProgress.value = 100;
    emit('upload-progress', 100);
    
    // Complete
    emit('upload-complete', result);
    
    // Reset
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (err) {
    error.value = (err as Error).message;
    emit('upload-error', error.value);
  } finally {
    uploading.value = false;
  }
};

const cancelUpload = () => {
  uploading.value = false;
  uploadProgress.value = 0;
  emit('upload-cancel');
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const loadConnections = async () => {
  try {
    connections.value = await integrationService.fetchConnections();
    
    // Set default connection if not already set
    if (!selectedConnectionId.value && connections.value.length > 0) {
      selectedConnectionId.value = connections.value[0].id;
    }
  } catch (err) {
    console.error('Error loading connections:', err);
  }
};

onMounted(() => {
  loadConnections();
});
</script>

<style scoped>
.integration-uploader {
  width: 100%;
}

.uploader-dropzone {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  transition: all 0.2s ease;
  background-color: #f9fafb;
  cursor: pointer;
}

.uploader-dropzone:hover {
  border-color: #9ca3af;
  background-color: #f3f4f6;
}

.uploader-dropzone-active {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.uploader-dropzone-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.uploader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.uploader-icon {
  margin-bottom: 1rem;
}

.uploader-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem;
}

.uploader-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem;
  max-width: 24rem;
}

.uploader-formats {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.uploader-format {
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  background-color: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.uploader-input {
  display: none;
}

.uploader-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.uploader-button:hover {
  background-color: #2563eb;
}

.uploader-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.uploader-button-cancel {
  background-color: #ef4444;
}

.uploader-button-cancel:hover {
  background-color: #dc2626;
}

.uploader-progress {
  width: 100%;
  max-width: 24rem;
  margin-bottom: 1rem;
}

.uploader-progress-bar {
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.uploader-progress-fill {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.uploader-progress-text {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.uploader-error {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #b91c1c;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.uploader-file {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.uploader-file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.uploader-file-details {
  display: flex;
  flex-direction: column;
}

.uploader-file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.uploader-file-size {
  font-size: 0.75rem;
  color: #6b7280;
}

.uploader-file-actions {
  display: flex;
  align-items: center;
}

.uploader-file-action {
  padding: 0.25rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.uploader-file-action:hover {
  background-color: #e5e7eb;
  color: #4b5563;
}

.uploader-actions {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.uploader-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.uploader-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.uploader-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.uploader-select {
  padding: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
}

.uploader-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.uploader-submit {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;
}

.uploader-submit:hover {
  background-color: #2563eb;
}

.uploader-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .uploader-form {
    grid-template-columns: 1fr;
  }
}

/* iOS optimizations */
:global(.ios-device) .uploader-select,
:global(.ios-device) .uploader-button,
:global(.ios-device) .uploader-submit {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

/* Android optimizations */
:global(.android-device) .uploader-dropzone {
  border-width: 1px;
}
</style>