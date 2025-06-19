<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Photo & Video</h3>
      <span class="text-sm text-gray-500">{{ mediaUploads.length }} files</span>
    </div>

    <!-- Upload Area -->
    <div
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200"
      :class="{ 'border-primary-500 bg-primary-50': isDragging }"
    >
      <div class="space-y-2">
        <CameraIcon class="w-12 h-12 text-gray-400 mx-auto" />
        <div>
          <p class="text-sm text-gray-600">Drop files here or</p>
          <label class="cursor-pointer">
            <span class="text-primary-600 hover:text-primary-700 font-medium">browse files</span>
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*,video/*"
              @change="handleFileSelect"
              class="hidden"
            />
          </label>
        </div>
        <p class="text-xs text-gray-500">Supports JPG, PNG, MP4, MOV up to 50MB</p>
      </div>
    </div>

    <!-- Quick Camera Actions -->
    <div class="grid grid-cols-2 gap-2 mt-4">
      <button
        @click="capturePhoto"
        class="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200"
      >
        <CameraIcon class="w-4 h-4" />
        <span class="text-sm font-medium">Take Photo</span>
      </button>
      <button
        @click="captureVideo"
        class="flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200"
      >
        <VideoCameraIcon class="w-4 h-4" />
        <span class="text-sm font-medium">Record Video</span>
      </button>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="mt-4">
      <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Uploading {{ uploadQueue.length }} file(s)...</span>
        <span>{{ Math.round(uploadProgress) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- Recent Uploads -->
    <div v-if="mediaUploads.length > 0" class="mt-6">
      <h4 class="text-sm font-medium text-gray-900 mb-3">Recent Uploads</h4>
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="upload in mediaUploads.slice(0, 6)"
          :key="upload.id"
          class="relative group cursor-pointer"
          @click="viewMedia(upload)"
        >
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              v-if="upload.type === 'photo'"
              :src="upload.thumbnail || upload.url"
              :alt="upload.description"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-200"
            >
              <PlayIcon class="w-8 h-8 text-gray-500" />
            </div>
          </div>
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
            <EyeIcon class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          <!-- Type indicator -->
          <div class="absolute top-1 right-1">
            <span 
              class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
              :class="upload.type === 'photo' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'"
            >
              {{ upload.type === 'photo' ? 'IMG' : 'VID' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Camera Modal -->
    <div v-if="showCamera" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ cameraMode === 'photo' ? 'Take Photo' : 'Record Video' }}
          </h3>
          <button
            @click="closeCamera"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="relative">
          <video
            ref="videoElement"
            autoplay
            muted
            class="w-full rounded-lg bg-black"
          ></video>
          
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              @click="cameraMode === 'photo' ? takePhoto() : toggleVideoRecording()"
              :class="cameraMode === 'photo' ? 'bg-white' : (isRecordingVideo ? 'bg-red-500' : 'bg-white')"
              class="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center hover:scale-105 transition-transform duration-200"
            >
              <div
                v-if="cameraMode === 'photo'"
                class="w-12 h-12 bg-gray-800 rounded-full"
              ></div>
              <div
                v-else
                :class="isRecordingVideo ? 'w-6 h-6 bg-white rounded' : 'w-12 h-12 bg-red-500 rounded-full'"
              ></div>
            </button>
          </div>

          <div v-if="isRecordingVideo" class="absolute top-4 left-4 flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-white font-medium">{{ formatDuration(recordingDuration) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Viewer Modal -->
    <div v-if="viewingMedia" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div class="relative max-w-4xl max-h-full p-4">
        <button
          @click="closeViewer"
          class="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
        >
          <XMarkIcon class="w-8 h-8" />
        </button>

        <img
          v-if="viewingMedia.type === 'photo'"
          :src="viewingMedia.url"
          :alt="viewingMedia.description"
          class="max-w-full max-h-full object-contain"
        />
        
        <video
          v-else
          :src="viewingMedia.url"
          controls
          class="max-w-full max-h-full"
        ></video>

        <div class="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded">
          <p class="font-medium">{{ viewingMedia.description || 'No description' }}</p>
          <div class="flex items-center space-x-4 mt-2 text-sm">
            <span>{{ formatTime(viewingMedia.createdAt) }}</span>
            <span>{{ formatFileSize(viewingMedia.metadata.size) }}</span>
            <div class="flex space-x-1">
              <span
                v-for="tag in viewingMedia.tags"
                :key="tag"
                class="px-2 py-1 bg-blue-600 rounded text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { format } from 'date-fns';
import { useOptimizationStore } from '../stores/optimization';
import type { MediaUpload } from '../types/optimization';
import {
  CameraIcon,
  VideoCameraIcon,
  PlayIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

interface Props {
  jobId?: string;
}

const props = defineProps<Props>();
const optimizationStore = useOptimizationStore();

const isDragging = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadQueue = ref<File[]>([]);
const showCamera = ref(false);
const cameraMode = ref<'photo' | 'video'>('photo');
const isRecordingVideo = ref(false);
const recordingDuration = ref(0);
const viewingMedia = ref<MediaUpload | null>(null);

const fileInput = ref<HTMLInputElement>();
const videoElement = ref<HTMLVideoElement>();
const mediaUploads = ref<MediaUpload[]>([]);

let mediaStream: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;
let recordingTimer: number | null = null;

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  
  const files = Array.from(event.dataTransfer?.files || []);
  processFiles(files);
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  processFiles(files);
};

const processFiles = async (files: File[]) => {
  const validFiles = files.filter(file => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
    
    return (isImage || isVideo) && isValidSize;
  });

  if (validFiles.length === 0) return;

  uploadQueue.value = validFiles;
  uploading.value = true;
  uploadProgress.value = 0;

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    await uploadFile(file);
    uploadProgress.value = ((i + 1) / validFiles.length) * 100;
  }

  uploading.value = false;
  uploadQueue.value = [];
};

const uploadFile = async (file: File): Promise<void> => {
  // Simulate file upload
  await new Promise(resolve => setTimeout(resolve, 1000));

  const isPhoto = file.type.startsWith('image/');
  const url = URL.createObjectURL(file);

  const upload: Omit<MediaUpload, 'id' | 'createdAt'> = {
    jobId: props.jobId,
    userId: 'current-user',
    type: isPhoto ? 'photo' : 'video',
    url,
    thumbnail: isPhoto ? url : undefined,
    description: `${isPhoto ? 'Photo' : 'Video'} from ${file.name}`,
    tags: extractTagsFromFilename(file.name),
    metadata: {
      size: file.size,
      dimensions: isPhoto ? { width: 1920, height: 1080 } : undefined,
      duration: !isPhoto ? 30 : undefined
    }
  };

  await optimizationStore.addMediaUpload(upload);
  mediaUploads.value = optimizationStore.mediaUploads;
};

const extractTagsFromFilename = (filename: string): string[] => {
  const tags: string[] = [];
  const lowerName = filename.toLowerCase();
  
  if (lowerName.includes('quality') || lowerName.includes('defect')) tags.push('quality');
  if (lowerName.includes('setup') || lowerName.includes('changeover')) tags.push('setup');
  if (lowerName.includes('tool') || lowerName.includes('tooling')) tags.push('tooling');
  if (lowerName.includes('machine') || lowerName.includes('equipment')) tags.push('machine');
  if (lowerName.includes('part') || lowerName.includes('component')) tags.push('part');
  
  return tags;
};

const capturePhoto = async () => {
  cameraMode.value = 'photo';
  showCamera.value = true;
  await startCamera();
};

const captureVideo = async () => {
  cameraMode.value = 'video';
  showCamera.value = true;
  await startCamera();
};

const startCamera = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: cameraMode.value === 'video' 
    });
    
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream;
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
    closeCamera();
  }
};

const takePhoto = () => {
  if (!videoElement.value) return;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = videoElement.value.videoWidth;
  canvas.height = videoElement.value.videoHeight;
  
  context?.drawImage(videoElement.value, 0, 0);
  
  canvas.toBlob(async (blob) => {
    if (blob) {
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      await processFiles([file]);
    }
  }, 'image/jpeg', 0.9);

  closeCamera();
};

const toggleVideoRecording = () => {
  if (isRecordingVideo.value) {
    stopVideoRecording();
  } else {
    startVideoRecording();
  }
};

const startVideoRecording = () => {
  if (!mediaStream) return;

  mediaRecorder = new MediaRecorder(mediaStream);
  const chunks: Blob[] = [];

  mediaRecorder.ondataavailable = (event) => {
    chunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'video/mp4' });
    const file = new File([blob], `video-${Date.now()}.mp4`, { type: 'video/mp4' });
    await processFiles([file]);
    closeCamera();
  };

  mediaRecorder.start();
  isRecordingVideo.value = true;
  recordingDuration.value = 0;

  recordingTimer = setInterval(() => {
    recordingDuration.value += 1;
  }, 1000);
};

const stopVideoRecording = () => {
  if (mediaRecorder && isRecordingVideo.value) {
    mediaRecorder.stop();
    isRecordingVideo.value = false;
    
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }
  }
};

const closeCamera = () => {
  showCamera.value = false;
  isRecordingVideo.value = false;
  recordingDuration.value = 0;

  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
};

const viewMedia = (upload: MediaUpload) => {
  viewingMedia.value = upload;
};

const closeViewer = () => {
  viewingMedia.value = null;
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), 'MMM dd, HH:mm');
};

const formatFileSize = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

onMounted(() => {
  mediaUploads.value = optimizationStore.mediaUploads;
});

onUnmounted(() => {
  closeCamera();
});
</script>