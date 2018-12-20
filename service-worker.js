
var CACHE_NAME = 'volontar-cache-v1';
var urlsToCache = [
    // Pages
    '/',
    '/kakor/',
    '/restricted/',
    '/restricted/offline/',
    '/restricted/andra-losenord/',
    '/restricted/assignment/',
    '/restricted/aterkoppling/',
    '/restricted/available-assignments/',
    '/restricted/uppdragsrapport/',
    // Images
    '/favicon-32x32.png',
    // Javascript
    '/resources/warnings-v4.js',
    // Styles
    '/resources/volontarer-normalize.css',
    '/resources/volontarer-grid.css',
    '/resources/volontarer-basic-v5.css',
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    self.postMessage(new MessageEvent("test", {
        data: 'fetch'
    }));
    
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});    