import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png', 'icons/*.svg'],
            manifest: {
                name: 'JobLine.ai - Manufacturing Job Tracker',
                short_name: 'JobLine.ai',
                description: 'AI-powered manufacturing job tracking and optimization',
                theme_color: '#2563eb',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait-primary',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'icons/icon-72x72.png',
                        sizes: '72x72',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-96x96.png',
                        sizes: '96x96',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-128x128.png',
                        sizes: '128x128',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-144x144.png',
                        sizes: '144x144',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-152x152.png',
                        sizes: '152x152',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-384x384.png',
                        sizes: '384x384',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable any'
                    },
                    {
                        src: 'icons/icon-maskable-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: 'icons/icon-maskable-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ],
                screenshots: [
                    {
                        src: 'screenshots/dashboard.png',
                        sizes: '1280x720',
                        type: 'image/png',
                        platform: 'wide',
                        label: 'Dashboard view of JobLine.ai'
                    },
                    {
                        src: 'screenshots/jobs.png',
                        sizes: '1280x720',
                        type: 'image/png',
                        platform: 'wide',
                        label: 'Jobs management in JobLine.ai'
                    },
                    {
                        src: 'screenshots/mobile-dashboard.png',
                        sizes: '750x1334',
                        type: 'image/png',
                        platform: 'narrow',
                        label: 'Mobile dashboard view'
                    },
                    {
                        src: 'screenshots/mobile-chat.png',
                        sizes: '750x1334',
                        type: 'image/png',
                        platform: 'narrow',
                        label: 'Mobile AI assistant chat'
                    }
                ]
            },
            injectManifest: {
                swSrc: 'src/sw.ts',
                swDest: 'dist/sw.js'
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'pexels-images-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/api\.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 5 // 5 minutes
                            },
                            networkTimeoutSeconds: 10
                        }
                    }
                ]
            }
        })
    ],
    server: {
        host: true,
        port: 5173
    },
    build: {
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
        assetsInlineLimit: 4096, // 4kb - smaller assets will be inlined
        cssCodeSplit: true,
        sourcemap: process.env.NODE_ENV !== 'production',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'vue-router', 'pinia'],
                    charts: ['chart.js', 'vue-chartjs'],
                    ui: ['@headlessui/vue', '@heroicons/vue'],
                    database: ['@supabase/supabase-js']
                }
            },
            external: ['body-scroll-lock', 'focus-trap', 'hammerjs']
        }
    },
    optimizeDeps: {
        include: [
            'vue',
            'vue-router',
            'pinia',
            '@supabase/supabase-js',
            'chart.js',
            'vue-chartjs',
            '@headlessui/vue',
            '@heroicons/vue',
            'date-fns',
            'hammerjs',
            'focus-trap',
            'body-scroll-lock'
        ]
    }
});
