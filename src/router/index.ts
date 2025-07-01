import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { supabase } from '../lib/supabase';

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
      component: () => import('../views/IntegrationDashboardView.vue'),
      meta: { requiresAuth: true, requiresRole: ['admin', 'manager', 'organization_admin'] }
    },
    {
      path: '/integration/settings',
      name: 'IntegrationSettings',
      component: () => import('../views/IntegrationSettingsView.vue'),
      meta: { requiresAuth: true, requiresRole: ['admin', 'manager', 'organization_admin'] }
    },
    {
      path: '/integration/scheduler',
      name: 'IntegrationScheduler',
      component: () => import('../views/IntegrationSchedulerView.vue'),
      meta: { requiresAuth: true, requiresRole: ['admin', 'manager', 'organization_admin', 'supervisor'] }
    },
    {
      path: '/optimization',
      name: 'Optimization',
      component: () => import('../views/OptimizationView.vue'),
      meta: { requiresAuth: true, requiresRole: ['lead', 'supervisor', 'manager', 'admin', 'organization_admin'] }
    },
    {
      path: '/performance',
      name: 'Performance',
      component: () => import('../views/PerformanceView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/components',
      name: 'ComponentLibrary',
      component: () => import('../views/ComponentLibrary.vue')
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../admin/index.vue'),
      meta: { requiresAuth: true, requiresRole: ['admin'], requiresPlatformAdmin: true },
      children: [
        {
          path: 'dashboard',
          component: () => import('../admin/dashboard.vue')
        },
        {
          path: 'organizations',
          component: () => import('../admin/organizations.vue')
        },
        {
          path: 'users',
          component: () => import('../admin/users.vue')
        },
        {
          path: 'subscriptions',
          component: () => import('../admin/subscriptions.vue')
        },
        {
          path: 'plans',
          component: () => import('../admin/plans.vue')
        },
        {
          path: 'settings',
          component: () => import('../admin/settings.vue')
        },
        {
          path: 'logs',
          component: () => import('../admin/logs.vue')
        },
        {
          path: 'integrations',
          component: () => import('../admin/integrations.vue')
        },
        {
          path: '',
          redirect: '/admin/dashboard'
        }
      ]
    },
    {
      path: '/org',
      name: 'OrganizationAdmin',
      component: () => import('../org/index.vue'),
      meta: { requiresAuth: true, requiresRole: ['organization_admin', 'admin'] },
      children: [
        {
          path: 'dashboard',
          component: () => import('../org/dashboard.vue')
        },
        {
          path: 'users',
          component: () => import('../org/users.vue')
        },
        {
          path: 'departments',
          component: () => import('../org/departments.vue')
        },
        {
          path: 'integrations',
          component: () => import('../org/integrations.vue')
        },
        {
          path: 'settings',
          component: () => import('../org/settings.vue')
        },
        {
          path: '',
          redirect: '/org/dashboard'
        }
      ]
    },
    {
      path: '/team',
      name: 'TeamMember',
      component: () => import('../team/index.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          component: () => import('../team/dashboard.vue')
        },
        {
          path: 'jobs',
          component: () => import('../views/JobsView.vue')
        },
        {
          path: 'chat',
          component: () => import('../views/ChatView.vue')
        },
        {
          path: 'machines',
          component: () => import('../views/MachinesView.vue')
        },
        {
          path: 'passdown',
          component: () => import('../views/PassdownView.vue')
        },
        {
          path: 'performance',
          component: () => import('../views/PerformanceView.vue')
        },
        {
          path: '',
          redirect: '/team/dashboard'
        }
      ]
    },
    // Share target route for PWA
    {
      path: '/share-target',
      name: 'ShareTarget',
      component: () => import('../views/ShareTargetView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/onboarding',
      name: 'Onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: { requiresAuth: true }
    },
    // Catch-all route for 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  // Wait for auth to be ready if needed
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard');
  }
  // Onboarding enforcement
  if (authStore.isAuthenticated && to.path !== '/onboarding') {
    // Fetch onboarding_complete from profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', authStore.user?.id)
      .single();
    if (!error && profile && profile.onboarding_complete === false) {
      return next('/onboarding');
    }
  }
  // Role-based access
  if (to.meta.requiresRole && authStore.user) {
    const requiredRoles = to.meta.requiresRole as string[];
    if (to.meta.requiresPlatformAdmin && authStore.user.organization_id) {
      return next('/dashboard');
    } else if (!requiredRoles.includes(authStore.user.role)) {
      return next('/dashboard');
    }
  }
  next();
});

export default router;