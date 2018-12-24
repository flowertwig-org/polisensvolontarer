
var CACHE_APP_NAME = 'volontar-cache-v1';
var CACHE_SERVICE_NAME = 'volontar-service-cache-v1';
var urlsToCache = [
    // Pages
    '/',
    '/kakor/',
    '/restricted/',
    '/restricted/installningar/',
    '/restricted/offline/',
    '/restricted/andra-losenord/',
    '/restricted/assignment/',
    '/restricted/aterkoppling/',
    '/restricted/available-assignments/',
    '/restricted/uppdragsrapport/',
    // Images
    '/favicon-32x32.png',
    // Javascript
    '/resources/assignment-v2.js',
    '/resources/available-assignments-v8.js',
    '/resources/change-password-v2.js',
    '/resources/environment.js',
    '/resources/keep-alive-v3.js',
    '/resources/login-v3.js',
    '/resources/my-assignments-v4.js',
    '/resources/my-reports.js',
    '/resources/settings.js',
    '/resources/warnings-v5.js',
    // Styles
    '/resources/volontarer-basic-v6.css',
    '/resources/volontarer-grid.css',
    '/resources/volontarer-normalize.css'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_APP_NAME)
            .then(function (cache) {
                //console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    //console.log('fetch', event);
    // self.postMessage(new MessageEvent("test", {
    //     data: 'fetch'
    // }));
    event.respondWith(async function () {

        const url = new URL(event.request.url);

        //console.log('fetch url', url);

        var isLogout = url.pathname == '/api/logout';
        var isCachableResource = url.pathname != '/api/login'
            && url.pathname != '/api/assignmentreport'
            && url.pathname != '/api/changepassword'
            && url.pathname != '/api/logout';

        if (isLogout) {
            // clear cache when logout
            event.waitUntil(
                caches.keys().then(function (cacheNames) {
                    return Promise.all(
                        cacheNames.map(function (cacheName) {
                            var expectedCacheNames = Object.values(CACHE_APP_NAME);

                            if (!expectedCacheNames.includes(cacheName)) {
                                console.log('Deleting out of date cache:', cacheName);

                                return caches.delete(cacheName);
                            }
                        })
                    );
                })
            );
        }

        // ignore cache for this resource
        if (!isCachableResource) {
            return fetch(url);
        }

        // Create promises for both the network response,
        // and a copy of the response that can be used in the cache.
        const fetchResponseP = fetch(url);
        const fetchResponseCloneP = fetchResponseP.then(r => r.clone());

        // event.waitUntil() ensures that the service worker is kept alive
        // long enough to complete the cache update.
        event.waitUntil(async function () {
            console.log('fetch add to cache', url);
            const cache = await caches.open(CACHE_SERVICE_NAME);
            await cache.put(url, await fetchResponseCloneP);
            console.log('fetch added to cache', url);
        }());

        // Prefer the cached response, falling back to the fetch response.
        return (await caches.match(url)) || fetchResponseP;
    }());
});    