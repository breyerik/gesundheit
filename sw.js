// Offline-App-Hülle. Nur eigene Dateien werden gecacht; Supabase-Aufrufe gehen immer direkt ans Netz.
const C='gs-v2';
const F=['./','index.html','app.css','gesundheit.css','config.js','auth.js','gesundheit.js','app.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
// Nur eigene alte Caches (gs-…) löschen; andere Apps auf derselben Domain bleiben unberührt
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('gs-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const req=e.request,u=new URL(req.url);
  if(req.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  const key=req.mode==='navigate'?'index.html':req;
  e.respondWith(caches.open(C).then(c=>c.match(key,{ignoreSearch:true}).then(hit=>{
    if(hit)return hit;
    // Fehlt etwas im Cache (z. B. gelöscht), aus dem Netz holen und wieder ablegen
    return fetch(req).then(r=>{if(r.ok&&req.mode!=='navigate')c.put(req,r.clone());return r})
      .catch(()=>req.mode==='navigate'?c.match('./'):Response.error());
  })));
});
