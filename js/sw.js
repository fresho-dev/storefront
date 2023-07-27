importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.routing.registerRoute(
    ({ request }) => request.destination === 'audio',
    new workbox.strategies.CacheFirst({
        cacheName: 'audio-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({ maxAgeSeconds: 1 * 60 * 60 }),
            new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
            new workbox.rangeRequests.RangeRequestsPlugin(),
        ],
    }),
);

workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({ maxAgeSeconds: 24 * 60 * 60 }),
            new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
        ],
    }),
);