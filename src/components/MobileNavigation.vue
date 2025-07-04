<template>
  <!-- Mobile Bottom Navigation -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
    <div class="grid grid-cols-5 h-16">
      <router-link
        v-for="item in mobileNavigation"
        :key="item.name"
        :to="item.href"
        class="flex flex-col items-center justify-center space-y-1 text-xs transition-colors duration-200 tap-highlight"
        :class="$route.path.startsWith(item.href) 
          ? 'text-primary-600 bg-primary-50' 
          : 'text-gray-500 hover:text-gray-700'"
        active-class="text-primary-600 bg-primary-50"
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
          class="p-2 rounded-full transition-colors duration-200 tap-highlight"
          aria-label="Toggle voice mode"
        >
          <MicrophoneIcon class="w-5 h-5" />
        </button>
        
        <!-- Notifications -->
        <button 
          class="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200 relative tap-highlight"
          aria-label="Notifications"
        >
          <BellIcon class="w-5 h-5" />
          <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {{ notificationCount }}
          </span>
        </button>
        
        <!-- User Menu -->
        <button 
          @click="showUserMenu = !showUserMenu"
          class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 tap-highlight"
          aria-label="User menu"
          :aria-expanded="showUserMenu"
          aria-controls="user-menu"
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
      id="user-menu"
      class="absolute right-4 top-16 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
      ref="userMenuRef"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';
import { usePerformanceStore } from '../stores/performance';
import { createAccessibleFocusTrap } from '../utils/accessibility';
import { addTapGesture } from '../utils/gesture';
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
const notificationCount = ref(3);
const userMenuRef = ref<HTMLElement | null>(null);

// Focus trap for accessibility
let focusTrap: { activate: () => void; deactivate: () => void } | null = null;

const mobileNavigation = computed(() => {
  const baseNav = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Passdown', href: '/passdown', icon: DocumentTextIcon },
    { name: 'Machines', href: '/machines', icon: CogIcon }
  ];

  // Filter based on user role
  if (!authStore.user) return baseNav;
  
  return baseNav.filter(item => {
    // All users can access these
    const publicRoutes = ['Dashboard', 'Jobs', 'Chat', 'Passdown', 'Machines'];
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

const handleClickOutside = (event: Event) => {
  const target = event.target as Element;
  if (userMenuRef.value && !userMenuRef.value.contains(target) && !target.closest('button')) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Set up focus trap for user menu
  if (userMenuRef.value) {
    focusTrap = createAccessibleFocusTrap(userMenuRef.value);
  }
  
  // Add tap gestures for better mobile experience
  const navLinks = document.querySelectorAll('.grid-cols-5 > a');
  navLinks.forEach(link => {
    addTapGesture(link as HTMLElement, () => {
      // The router-link will handle navigation
    });
  });
  
  // Load user performance data
  if (authStore.user) {
    performanceStore.fetchUserMetrics();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  
  // Clean up focus trap
  if (focusTrap) {
    focusTrap.deactivate();
  }
});
</script>

<style scoped>
/* Fix for iOS safe areas */
:global(.ios-device) .safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

:global(.ios-device) .safe-area-top {
  padding-top: env(safe-area-inset-top, 0);
}

/* Active tab indicator with animation */
.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 2px;
  background-color: currentColor;
  transition: all 0.3s ease;
}
</style>