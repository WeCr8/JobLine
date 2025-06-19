<template>
  <!-- Mobile Bottom Navigation -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
    <div class="grid grid-cols-5 h-16">
      <router-link
        v-for="item in mobileNavigation"
        :key="item.name"
        :to="item.href"
        class="flex flex-col items-center justify-center space-y-1 text-xs transition-colors duration-200"
        :class="$route.name === item.name 
          ? 'text-primary-600 bg-primary-50' 
          : 'text-gray-500 hover:text-gray-700'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.name }}</span>
      </router-link>
    </div>
  </div>

  <!-- Mobile Header -->
  <div class="md:hidden bg-white shadow-sm border-b border-gray-200 safe-area-top">
    <div class="flex items-center justify-between h-16 px-4">
      <!-- Logo -->
      <div class="flex items-center">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">JL</span>
        </div>
        <span class="ml-2 text-lg font-semibold text-gray-900">JobLine.ai</span>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <!-- Performance Score -->
        <div v-if="performanceStore.userMetrics" class="flex items-center space-x-1 px-2 py-1 bg-purple-50 rounded-full">
          <TrophyIcon class="w-3 h-3 text-purple-600" />
          <span class="text-xs font-medium text-purple-900">{{ performanceStore.userMetrics.totalScore }}</span>
        </div>
        
        <!-- Voice Toggle -->
        <button
          v-if="chatStore.voiceEnabled"
          @click="toggleVoiceMode"
          :class="voiceMode ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'"
          class="p-2 rounded-full transition-colors duration-200"
        >
          <MicrophoneIcon class="w-5 h-5" />
        </button>
        
        <!-- Notifications -->
        <button class="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200 relative">
          <BellIcon class="w-5 h-5" />
          <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {{ notificationCount }}
          </span>
        </button>
        
        <!-- User Menu -->
        <button 
          @click="showUserMenu = !showUserMenu"
          class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span class="text-primary-600 font-medium text-sm">
              {{ authStore.user?.name?.charAt(0) }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- User Dropdown -->
    <div 
      v-if="showUserMenu"
      class="absolute right-4 top-16 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
    >
      <div class="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
        {{ authStore.user?.email }}
      </div>
      <router-link
        to="/performance"
        @click="showUserMenu = false"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        Performance Dashboard
      </router-link>
      <button
        @click="handleLogout"
        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
        Sign out
      </button>
    </div>
  </div>

  <!-- Voice Mode Indicator -->
  <div v-if="voiceMode" class="md:hidden fixed top-20 left-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-lg z-40 safe-area-top">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span class="text-sm font-medium">Voice Mode Active</span>
      </div>
      <button
        @click="toggleVoiceMode"
        class="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs transition-colors duration-200"
      >
        Stop
      </button>
    </div>
  </div>

  <!-- Install App Banner -->
  <div v-if="showInstallBanner" class="md:hidden fixed top-4 left-4 right-4 bg-primary-600 text-white p-3 rounded-lg z-40 safe-area-top">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium">Install JobLine.ai</p>
        <p class="text-xs opacity-90">Add to home screen for better experience</p>
      </div>
      <div class="flex space-x-2">
        <button
          @click="installApp"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-xs transition-colors duration-200"
        >
          Install
        </button>
        <button
          @click="dismissInstallBanner"
          class="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs transition-colors duration-200"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';
import { usePerformanceStore } from '../stores/performance';
import {
  HomeIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  DocumentTextIcon,
  BellIcon,
  MicrophoneIcon,
  TrophyIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const chatStore = useChatStore();
const performanceStore = usePerformanceStore();

const showUserMenu = ref(false);
const voiceMode = ref(false);
const showInstallBanner = ref(false);
const notificationCount = ref(3);

let deferredPrompt: any = null;

const mobileNavigation = computed(() => {
  const baseNav = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Performance', href: '/performance', icon: TrophyIcon },
    { name: 'Machines', href: '/machines', icon: CogIcon }
  ];

  // Filter based on user role
  if (!authStore.user) return baseNav;
  
  return baseNav.filter(item => {
    // All users can access these
    const publicRoutes = ['Dashboard', 'Jobs', 'Chat', 'Performance', 'Machines'];
    return publicRoutes.includes(item.name);
  });
});

const toggleVoiceMode = () => {
  voiceMode.value = !voiceMode.value;
  if (voiceMode.value) {
    chatStore.startVoiceListening();
  } else {
    chatStore.stopVoiceListening();
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
  showUserMenu.value = false;
};

const installApp = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        showInstallBanner.value = false;
      }
      deferredPrompt = null;
    });
  }
};

const dismissInstallBanner = () => {
  showInstallBanner.value = false;
  localStorage.setItem('installBannerDismissed', 'true');
};

const handleClickOutside = (event: Event) => {
  const target = event.target as Element;
  if (!target.closest('.relative')) {
    showUserMenu.value = false;
  }
};

const handleBeforeInstallPrompt = (e: Event) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install banner if not dismissed
  const dismissed = localStorage.getItem('installBannerDismissed');
  if (!dismissed) {
    showInstallBanner.value = true;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  
  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    showInstallBanner.value = false;
  }

  // Load performance data
  if (authStore.user) {
    performanceStore.fetchUserMetrics(authStore.user.id);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});
</script>