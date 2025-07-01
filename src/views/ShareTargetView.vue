<template>
  <div class="share-target">
    <div class="share-target-container">
      <div v-if="loading" class="share-target-loading">
        <svg class="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Processing shared content...</p>
      </div>
      
      <div v-else-if="error" class="share-target-error">
        <ExclamationCircleIcon class="w-12 h-12 text-red-500" />
        <h2>Error Processing Share</h2>
        <p>{{ error }}</p>
        <button
          @click="goBack"
          class="share-target-button"
        >
          Go Back
        </button>
      </div>
      
      <div v-else-if="success" class="share-target-success">
        <CheckCircleIcon class="w-12 h-12 text-green-500" />
        <h2>Content Shared Successfully</h2>
        <p>{{ successMessage }}</p>
        <div class="share-target-actions">
          <button
            @click="goToDestination"
            class="share-target-button share-target-button-primary"
          >
            View Content
          </button>
          <button
            @click="goBack"
            class="share-target-button"
          >
            Go Back
          </button>
        </div>
      </div>
      
      <div v-else class="share-target-content">
        <h2>Shared Content</h2>
        
        <div v-if="sharedText" class="share-target-text">
          <h3>Text</h3>
          <p>{{ sharedText }}</p>
        </div>
        
        <div v-if="sharedUrl" class="share-target-url">
          <h3>URL</h3>
          <p>{{ sharedUrl }}</p>
        </div>
        
        <div v-if="sharedTitle" class="share-target-title">
          <h3>Title</h3>
          <p>{{ sharedTitle }}</p>
        </div>
        
        <div v-if="sharedFiles.length > 0" class="share-target-files">
          <h3>Files</h3>
          <ul>
            <li v-for="(file, index) in sharedFiles" :key="index">
              <div class="share-target-file">
                <DocumentIcon class="w-5 h-5 text-primary-600" />
                <div class="share-target-file-info">
                  <p class="share-target-file-name">{{ file.name }}</p>
                  <p class="share-target-file-size">{{ formatFileSize(file.size) }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <div class="share-target-destination">
          <h3>Share to</h3>
          <select
            v-model="destination"
            class="share-target-select"
          >
            <option value="chat">AI Assistant</option>
            <option value="integration">Data Integration</option>
            <option value="job">Attach to Job</option>
          </select>
          
          <div v-if="destination === 'job'" class="share-target-job-select">
            <label class="share-target-label">Select Job</label>
            <select
              v-model="selectedJobId"
              class="share-target-select"
            >
              <option value="">Select a job</option>
              <option v-for="job in jobs" :key="job.id" :value="job.id">
                {{ job.jobNumber }} - {{ job.partName }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="share-target-actions">
          <button
            @click="processShare"
            class="share-target-button share-target-button-primary"
            :disabled="!canProcess"
          >
            Process
          </button>
          <button
            @click="goBack"
            class="share-target-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useJobsStore } from '../stores/jobs';
import { useChatStore } from '../stores/chat';
import { integrationService } from '../services/integration.service';
import {
  DocumentIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const jobsStore = useJobsStore();
const chatStore = useChatStore();

// State
const loading = ref(true);
const error = ref<string | null>(null);
const success = ref(false);
const successMessage = ref('');
const sharedText = ref('');
const sharedUrl = ref('');
const sharedTitle = ref('');
const sharedFiles = ref<File[]>([]);
const destination = ref('chat');
const selectedJobId = ref('');

// Computed
const jobs = computed(() => jobsStore.jobs);

const canProcess = computed(() => {
  if (destination.value === 'job') {
    return !!selectedJobId.value;
  }
  
  return true;
});

// Methods
const processShare = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    switch (destination.value) {
      case 'chat':
        await processForChat();
        break;
      case 'integration':
        await processForIntegration();
        break;
      case 'job':
        await processForJob();
        break;
    }
    
    success.value = true;
  } catch (err) {
    error.value = (err as Error).message;
    console.error('Error processing share:', err);
  } finally {
    loading.value = false;
  }
};

const processForChat = async () => {
  // Process text for chat
  if (sharedText.value) {
    await chatStore.processUserQuery(sharedText.value);
    successMessage.value = 'Content shared to AI Assistant';
  }
  
  // Process URL for chat
  if (sharedUrl.value) {
    await chatStore.processUserQuery(`Check this URL: ${sharedUrl.value}`);
    successMessage.value = 'URL shared to AI Assistant';
  }
  
  // Process files for chat
  if (sharedFiles.value.length > 0) {
    const file = sharedFiles.value[0];
    
    if (file.type.startsWith('image/')) {
      await chatStore.processImageForPartLookup(file);
      successMessage.value = 'Image shared to AI Assistant for analysis';
    } else {
      throw new Error('Only images can be shared to the AI Assistant');
    }
  }
};

const processForIntegration = async () => {
  // Process files for integration
  if (sharedFiles.value.length > 0) {
    const file = sharedFiles.value[0];
    
    if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Get the first CSV upload connection
      const connections = await integrationService.fetchConnections();
      const csvConnection = connections.find(c => c.type === 'csv-upload');
      
      if (!csvConnection) {
        throw new Error('No CSV upload connection found');
      }
      
      await integrationService.processFileUpload(file, csvConnection.id, 'job-data');
      successMessage.value = 'File shared to Data Integration';
    } else {
      throw new Error('Only CSV or Excel files can be shared to Data Integration');
    }
  } else {
    throw new Error('No file shared');
  }
};

const processForJob = async () => {
  if (!selectedJobId.value) {
    throw new Error('No job selected');
  }
  
  // In a real implementation, this would attach the shared content to the job
  // For now, we'll just simulate success
  
  if (sharedFiles.value.length > 0) {
    successMessage.value = `File attached to job ${selectedJobId.value}`;
  } else if (sharedText.value || sharedUrl.value) {
    successMessage.value = `Note added to job ${selectedJobId.value}`;
  } else {
    throw new Error('No content to attach to job');
  }
};

const goToDestination = () => {
  switch (destination.value) {
    case 'chat':
      router.push('/chat');
      break;
    case 'integration':
      router.push('/integration');
      break;
    case 'job':
      router.push(`/jobs?id=${selectedJobId.value}`);
      break;
    default:
      router.push('/dashboard');
  }
};

const goBack = () => {
  router.push('/dashboard');
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const parseShareTarget = async () => {
  try {
    // Check if this is a share target request
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    // Get shared text, URL, and title from query parameters
    sharedText.value = params.get('text') || '';
    sharedUrl.value = params.get('url') || '';
    sharedTitle.value = params.get('title') || '';
    
    // Check if this is a form submission with files
    if (window.location.pathname === '/share-target') {
      try {
        const formData = await new Promise<FormData>((resolve) => {
          // Wait for the form data to be available
          const interval = setInterval(() => {
            const form = document.querySelector('form');
            if (form) {
              clearInterval(interval);
              resolve(new FormData(form));
            }
          }, 100);
        });
        
        // Get shared files
        const files = formData.getAll('file');
        sharedFiles.value = files.filter(file => file instanceof File) as File[];
      } catch (err) {
        console.error('Error parsing form data:', err);
      }
    }
    
    // Fetch jobs for job selection
    await jobsStore.fetchJobs();
  } catch (err) {
    console.error('Error parsing share target:', err);
    error.value = 'Failed to process shared content';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  parseShareTarget();
});
</script>

<style scoped>
.share-target {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f9fafb;
}

.share-target-container {
  width: 100%;
  max-width: 32rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.share-target-loading,
.share-target-error,
.share-target-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.share-target-loading p,
.share-target-error p,
.share-target-success p {
  margin-top: 1rem;
  color: #6b7280;
}

.share-target-error h2,
.share-target-success h2 {
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.share-target-content {
  padding: 2rem;
}

.share-target-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem;
}

.share-target-text,
.share-target-url,
.share-target-title,
.share-target-files,
.share-target-destination {
  margin-bottom: 1.5rem;
}

.share-target-text h3,
.share-target-url h3,
.share-target-title h3,
.share-target-files h3,
.share-target-destination h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem;
}

.share-target-text p,
.share-target-url p,
.share-target-title p {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
  word-break: break-word;
}

.share-target-files ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.share-target-file {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

.share-target-file-info {
  margin-left: 0.75rem;
}

.share-target-file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
}

.share-target-file-size {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.share-target-select {
  width: 100%;
  padding: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  margin-top: 0.5rem;
}

.share-target-job-select {
  margin-top: 1rem;
}

.share-target-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.share-target-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.share-target-button {
  flex: 1;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.share-target-button-primary {
  color: white;
  background-color: #3b82f6;
  border: 1px solid #3b82f6;
}

.share-target-button-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.share-target-button:not(.share-target-button-primary) {
  color: #4b5563;
  background-color: white;
  border: 1px solid #d1d5db;
}

.share-target-button:not(.share-target-button-primary):hover {
  background-color: #f9fafb;
}

.share-target-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* iOS optimizations */
:global(.ios-device) .share-target-select,
:global(.ios-device) .share-target-button {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* Android optimizations */
:global(.android-device) .share-target-button {
  font-weight: 400;
}
</style>