var CACHE_STATIC_NAME = 'static-v3';
var CACHE_DYNAMIC_NAME = 'dynamic-v3';

self.addEventListener('install', (event) => {
    console.log('[SW] Installing SW ...');
    event.waitUntil(caches.open(CACHE_STATIC_NAME).then((cache) => {
        console.log('[SW] Precaching App Shell');
        cache.addAll([
            '/',
            '/index.html',
            '/src/js/main.js',
            '/src/js/material.min.js',
            '/src/css/app.css',
            '/src/css/main.css',
            'https://fonts.googleapis.com/css?family=Roboto:400,700',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);
    }));
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating SW ...');
    event.waitUntil(caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if(key !== CACHE_DYNAMIC_NAME && key !== CACHE_STATIC_NAME) {
                console.log('[SW] Removing old cache', key);
                return caches.delete(key);
            }
        }));
    }));
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((response) => {
        if(response) {
            return response;
        } else {
            return fetch(event.request).then((res) => {
                return caches.open(CACHE_DYNAMIC_NAME). then((cache) => {
                    cache.put(event.request.url, res.clone());
                    return res;
                });
            }).catch((err) => {

            });
        }
    }));
});