<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Organization Admin Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">JL</span>
              </div>
              <span class="ml-2 text-xl font-semibold text-gray-900">Organization Admin</span>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center">
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
                  to="/dashboard"
                  @click="showUserMenu = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Exit Admin Mode
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
    </header>

    <!-- Organization Admin Navigation -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex space-x-4 overflow-x-auto pb-2">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          :class="$route.path === item.href 
            ? 'bg-primary-100 text-primary-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <component :is="item.icon" class="w-4 h-4 inline mr-1" />
          {{ item.name }}
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {
  ChevronDownIcon,
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  CircleStackIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const showUserMenu = ref(false);

const navigation = [
  { name: 'Dashboard', href: '/org/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/org/users', icon: UserGroupIcon },
  { name: 'Departments', href: '/org/departments', icon: BuildingOfficeIcon },
  { name: 'Integrations', href: '/org/integrations', icon: CircleStackIcon },
  { name: 'Settings', href: '/org/settings', icon: Cog6ToothIcon }
];

const handleLogout = async () => {
  await authStore.signOut();
  router.push('/login');
};
</script>
```