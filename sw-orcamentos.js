/* Service worker do app de orçamentos da RAP (site só do app).
   Estratégia: rede primeiro; sem internet, usa a última cópia guardada.
   A nuvem (Firebase) não passa por aqui: ela usa outro endereço. */
const CACHE = 'orcamentos-rap-v5';
const INICIO = '/';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.add(INICIO)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.startsWith('orcamentos-rap-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(redePrimeiro(req));
});

async function redePrimeiro(req) {
  const cache = await caches.open(CACHE);
  let guardado = await cache.match(req, { ignoreSearch: true });
  if (!guardado && req.mode === 'navigate' && new URL(req.url).pathname === '/index.html') guardado = await cache.match(INICIO);
  const daRede = fetch(req).then(resp => {
    if (resp && resp.ok) cache.put(req, resp.clone());
    return resp;
  });
  if (!guardado) return daRede;                       // primeira vez: espera a internet
  daRede.catch(() => {});
  try {
    const resp = await Promise.race([                 // internet fraca: em 6 s usa a cópia guardada
      daRede,
      new Promise((_, rej) => setTimeout(() => rej(new Error('tempo')), 6000))
    ]);
    return resp.ok ? resp : guardado;
  } catch (err) {
    return guardado;
  }
}
