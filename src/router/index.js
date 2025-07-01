"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_router_1 = require("vue-router");
var auth_1 = require("../stores/auth");
var router = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createWebHistory)(),
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/login',
            name: 'Login',
            component: function () { return Promise.resolve().then(function () { return require('../views/LoginView.vue'); }); },
            meta: { requiresGuest: true }
        },
        {
            path: '/signup',
            name: 'Signup',
            component: function () { return Promise.resolve().then(function () { return require('../views/SignupView.vue'); }); },
            meta: { requiresGuest: true }
        },
        {
            path: '/pricing',
            name: 'Pricing',
            component: function () { return Promise.resolve().then(function () { return require('../views/PricingView.vue'); }); }
        },
        {
            path: '/success',
            name: 'Success',
            component: function () { return Promise.resolve().then(function () { return require('../views/SuccessView.vue'); }); },
            meta: { requiresAuth: true }
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: function () { return Promise.resolve().then(function () { return require('../views/DashboardView.vue'); }); },
            meta: { requiresAuth: true }
        },
        {
            path: '/jobs',
            name: 'Jobs',
            component: function () { return Promise.resolve().then(function () { return require('../views/JobsView.vue'); }); },
            meta: { requiresAuth: true }
        },
        {
            path: '/chat',
            name: 'Chat',
            component: function () { return Promise.resolve().then(function () { return require('../views/ChatView.vue'); }); },
            meta: { requiresAuth: true }
        },
        {
            path: '/machines',
            name: 'Machines',
            component: function () { return Promise.resolve().then(function () { return require('../views/MachinesView.vue'); }); },
            meta: { requiresAuth: true }
        },
        {
            path: '/passdown',
            name: 'Passdown',
            component: function () { return Promise.resolve().then(function () { return require('../views/PassdownView.vue'); }); },
            meta: { requiresAuth: true }
        },
        {
            path: '/integration',
            name: 'Integration',
            component: function () { return Promise.resolve().then(function () { return require('../views/IntegrationDashboardView.vue'); }); },
            meta: { requiresAuth: true, requiresRole: ['admin', 'manager', 'organization_admin'] }
        },
        {
            path: '/integration/settings',
            name: 'IntegrationSettings',
            component: function () { return Promise.resolve().then(function () { return require('../views/IntegrationSettingsView.vue'); }); },
            meta: { requiresAuth: true, requiresRole: ['admin', 'manager', 'organization_admin'] }
        },
        {
            path: '/integration/scheduler',
            name: 'IntegrationScheduler',
            component: function () { return Promise.resolve().then(function () { return require('../views/IntegrationSchedulerView.vue'); }); },
            meta: { requiresAuth: true, requiresRole: ['admin', 'manager', 'organization_admin', 'supervisor'] }
        },
        {
            path: '/optimization',
            name: 'Optimization',
            component: function () { return Promise.resolve().then(function () { return require('../views/OptimizationView.vue'); }); },
            meta: { requiresAuth: true, requiresRole: ['lead', 'supervisor', 'manager', 'admin', 'organization_admin'] }
        },
        {
            path: '/performance',
            name: 'Performance',
            component: function () { return Promise.resolve().then(function () { return require('../views/PerformanceView.vue'); }); },
            meta: { requiresAuth: true }
        },
        {
            path: '/settings',
            name: 'Settings',
            component: function () { return Promise.resolve().then(function () { return require('../views/SettingsView.vue'); }); },
            meta: { requiresAuth: true }
        },
        {
            path: '/components',
            name: 'ComponentLibrary',
            component: function () { return Promise.resolve().then(function () { return require('../views/ComponentLibrary.vue'); }); }
        },
        {
            path: '/admin',
            name: 'Admin',
            component: function () { return Promise.resolve().then(function () { return require('../admin/index.vue'); }); },
            meta: { requiresAuth: true, requiresRole: ['admin'], requiresPlatformAdmin: true },
            children: [
                {
                    path: 'dashboard',
                    component: function () { return Promise.resolve().then(function () { return require('../admin/dashboard.vue'); }); }
                },
                {
                    path: 'organizations',
                    component: function () { return Promise.resolve().then(function () { return require('../admin/organizations.vue'); }); }
                },
                {
                    path: 'users',
                    component: function () { return Promise.resolve().then(function () { return require('../admin/users.vue'); }); }
                },
                {
                    path: 'subscriptions',
                    component: function () { return Promise.resolve().then(function () { return require('../admin/subscriptions.vue'); }); }
                },
                {
                    path: 'plans',
                    component: function () { return Promise.resolve().then(function () { return require('../admin/plans.vue'); }); }
                },
                {
                    path: 'settings',
                    component: function () { return Promise.resolve().then(function () { return require('../admin/settings.vue'); }); }
                },
                {
                    path: 'logs',
                    component: function () { return Promise.resolve().then(function () { return require('../admin/logs.vue'); }); }
                },
                {
                    path: 'integrations',
                    component: function () { return Promise.resolve().then(function () { return require('../admin/integrations.vue'); }); }
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
            component: function () { return Promise.resolve().then(function () { return require('../org/index.vue'); }); },
            meta: { requiresAuth: true, requiresRole: ['organization_admin', 'admin'] },
            children: [
                {
                    path: 'dashboard',
                    component: function () { return Promise.resolve().then(function () { return require('../org/dashboard.vue'); }); }
                },
                {
                    path: 'users',
                    component: function () { return Promise.resolve().then(function () { return require('../org/users.vue'); }); }
                },
                {
                    path: 'departments',
                    component: function () { return Promise.resolve().then(function () { return require('../org/departments.vue'); }); }
                },
                {
                    path: 'integrations',
                    component: function () { return Promise.resolve().then(function () { return require('../org/integrations.vue'); }); }
                },
                {
                    path: 'settings',
                    component: function () { return Promise.resolve().then(function () { return require('../org/settings.vue'); }); }
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
            component: function () { return Promise.resolve().then(function () { return require('../team/index.vue'); }); },
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'dashboard',
                    component: function () { return Promise.resolve().then(function () { return require('../team/dashboard.vue'); }); }
                },
                {
                    path: 'jobs',
                    component: function () { return Promise.resolve().then(function () { return require('../views/JobsView.vue'); }); }
                },
                {
                    path: 'chat',
                    component: function () { return Promise.resolve().then(function () { return require('../views/ChatView.vue'); }); }
                },
                {
                    path: 'machines',
                    component: function () { return Promise.resolve().then(function () { return require('../views/MachinesView.vue'); }); }
                },
                {
                    path: 'passdown',
                    component: function () { return Promise.resolve().then(function () { return require('../views/PassdownView.vue'); }); }
                },
                {
                    path: 'performance',
                    component: function () { return Promise.resolve().then(function () { return require('../views/PerformanceView.vue'); }); }
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
            component: function () { return Promise.resolve().then(function () { return require('../views/ShareTargetView.vue'); }); },
            meta: { requiresAuth: true }
        },
        // Catch-all route for 404
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: function () { return Promise.resolve().then(function () { return require('../views/NotFoundView.vue'); }); }
        }
    ]
});
router.beforeEach(function (to, from, next) {
    var authStore = (0, auth_1.useAuthStore)();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    }
    else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next('/dashboard');
    }
    else if (to.meta.requiresRole && authStore.user) {
        var requiredRoles = to.meta.requiresRole;
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
exports.default = router;
