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
        // Catch-all route for 404
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('../views/NotFoundView.vue')
        }
    ]
});
router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    }
    else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next('/dashboard');
    }
    else if (to.meta.requiresRole && authStore.user) {
        const requiredRoles = to.meta.requiresRole;
        // Check if route requires platform admin (no organization)
        if (to.meta.requiresPlatformAdmin && authStore.user.organization_id) {
            next('/dashboard'); // Redirect if user is not a platform admin
        }
        else if (!requiredRoles.includes(authStore.user.role)) {
            next('/dashboard'); // Redirect if user doesn't have required role
        }
        else {
            next();
        }
    }
    else {
        next();
    }
});
export default router;
