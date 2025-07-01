<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Navigation -->
    <MobileNavigation />
    
    <!-- Desktop Navigation -->
    <nav class="hidden md:block bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">JL</span>
              </div>
              <span class="ml-2 text-xl font-semibold text-gray-900">JobLine.ai</span>
            </div>
            
            <!-- Navigation Links -->
            <div class="hidden md:ml-10 md:flex md:space-x-8">
              <router-link
                v-for="item in visibleNavigation"
                :key="item.name"
                :to="item.href"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
                :class="$route.path.startsWith(item.href) 
                  ? 'border-b-2 border-primary-500 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                <component :is="item.icon" class="w-4 h-4 mr-2" />
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Subscription Status -->
            <div v-if="subscriptionStore.currentPlan" class="hidden lg:flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
              <CheckCircleIcon class="w-4 h-4 text-green-600" />
              <span class="text-sm font-medium text-green-900">{{ subscriptionStore.currentPlan.name }}</span>
            </div>
            
            <!-- Performance Score -->
            <div v-if="performanceStore.userMetrics" class="hidden lg:flex items-center space-x-2 px-3 py-1 bg-purple-50 rounded-full">
              <TrophyIcon class="w-4 h-4 text-purple-600" />
              <span class="text-sm font-medium text-purple-900">{{ performanceStore.userMetrics.totalScore }}</span>
              <span class="text-xs text-purple-600">Level {{ performanceStore.userLevel }}</span>
            </div>
            
            <!-- Notifications -->
            <button class="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200">
              <BellIcon class="w-5 h-5" />
            </button>
            
            <!-- User Profile -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-medium text-sm">
                    {{ authStore.user?.name?.charAt(0) }}
                  </span>
                </div>
                <span class="hidden md:block text-gray-700 font-medium">
                  {{ authStore.user?.name }}
                </span>
                <ChevronDownIcon class="w-4 h-4 text-gray-400" />
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <div class="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  {{ authStore.user?.email }}
                </div>
                <router-link
                  to="/settings"
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Settings
                </router-link>
                <router-link
                  to="/performance"
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Performance Dashboard
                </router-link>
                <router-link
                  to="/pricing"
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Subscription
                </router-link>
                <router-link
                  v-if="isDeveloper"
                  to="/admin/dashboard"
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Admin Panel
                </router-link>
                <router-link
                  v-if="isOrgAdmin"
                  to="/org/dashboard"
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Organization Admin
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20 md:pb-6 safe-area-left safe-area-right">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.ts';
import { usePerformanceStore } from '../stores/performance.ts';
import { useSubscriptionStore } from '../stores/subscription.ts';
import MobileNavigation from './MobileNavigation.vue';
import {
  HomeIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  DocumentTextIcon,
  BellIcon,
  ChevronDownIcon,
  CircleStackIcon,
  LightBulbIcon,
  TrophyIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  UserIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const performanceStore = usePerformanceStore();
const subscriptionStore = useSubscriptionStore();
const showUserMenu = ref(false);

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
  { name: 'Machines', href: '/machines', icon: CogIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
  { name: 'Passdown', href: '/passdown', icon: DocumentTextIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
  { name: 'Performance', href: '/performance', icon: TrophyIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
  { name: 'Optimization', href: '/optimization', icon: LightBulbIcon, roles: ['lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
  { name: 'Integration', href: '/integration', icon: CircleStackIcon, roles: ['manager', 'admin', 'organization_admin'] },
  { name: 'Settings', href: '/settings', icon: UserIcon, roles: ['operator', 'lead', 'supervisor', 'manager', 'admin', 'organization_admin'] },
  { name: 'Admin', href: '/admin/dashboard', icon: Cog6ToothIcon, roles: ['admin'] },
];

const visibleNavigation = computed(() => {
  if (!authStore.user) return [];
  return navigation.filter(item => item.roles.includes(authStore.user!.role));
});

const isOrgAdmin = computed(() => {
  return authStore.isOrgAdmin;
});

const isDeveloper = computed(() => {
  return authStore.isDeveloper;
});

const handleLogout = async () => {
  await authStore.signOut();
  router.push('/login');
  showUserMenu.value = false;
};

const handleClickOutside = (event: Event) => {
  const target = event.target as Element;
  if (!target.closest('.relative')) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Load user performance data
  if (authStore.user) {
    performanceStore.fetchUserMetrics();
    subscriptionStore.fetchSubscription();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>