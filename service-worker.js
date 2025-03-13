// Nome do cache
const CACHE_NAME = 'codexp-cache-v1';

// Arquivos para cache
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/cadastro.html',
  '/styles.css',
  '/pwa.js',
  '/codes.js',
  '/image.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json',
  'https://img.icons8.com/ios-filled/50/000000/home.png',
  'https://img.icons8.com/ios-filled/50/000000/login-rounded-right.png',
  'https://img.icons8.com/ios-filled/50/000000/add-file.png',
  'https://img.icons8.com/ios-filled/50/000000/external-link.png'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna a resposta do cache
        if (response) {
          return response;
        }

        // Clonar a requisição
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Verificar se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar a resposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Adicionar a resposta ao cache
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Se falhar, tentar retornar uma página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
}); 