import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/SignupView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/pricing',
      name: 'Pricing',
      component: () => import('../views/PricingView.vue')
    },
    {
      path: '/success',
      name: 'Success',
      component: () => import('../views/SuccessView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/jobs',
      name: 'Jobs',
      component: () => import('../views/JobsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('../views/ChatView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/machines',
      name: 'Machines',
      component: () => import('../views/MachinesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/passdown',
      name: 'Passdown',
      component: () => import('../views/PassdownView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/integration',
      name: 'Integration',
      component: () => import('../views/IntegrationView.vue'),
      meta: { requiresAuth: true, requiresRole: ['admin', 'manager'] }
    },
    {
      path: '/optimization',
      name: 'Optimization',
      component: () => import('../views/OptimizationView.vue'),
      meta: { requiresAuth: true, requiresRole: ['lead', 'supervisor', 'manager', 'admin'] }
    },
    {
      path: '/performance',
      name: 'Performance',
      component: () => import('../views/PerformanceView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, requiresRole: ['admin'] }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
  } else if (to.meta.requiresRole && authStore.user) {
    const requiredRoles = to.meta.requiresRole as string[];
    if (!requiredRoles.includes(authStore.user.role)) {
      next('/dashboard'); // Redirect to dashboard if user doesn't have required role
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;