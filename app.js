// App-Steuerung: Login-Bildschirm oder Hauptansicht, Kopfzeile mit Menü (Stand, Neu laden, Abmelden), Service Worker.
(()=>{
const VER='2.0';
const $=s=>document.querySelector(s),app=$('#app');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const I={
 dots:'<circle cx="5.5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
 reload:'<path d="M20 11.5A8 8 0 1 0 17.7 17"/><path d="M20 4.5v7h-7"/>',
 out:'<path d="M14.5 4.5h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3"/><path d="M10 16.5 5.5 12 10 7.5M5.5 12h10"/>',
 eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 eyeoff:'<path d="M3 3l18 18M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3.1 3.9M6.3 6.9C3.9 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
 lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>'
};
const ico=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const meta=document.querySelector('meta[name=theme-color]');

let toastT;
function toast(t){let el=$('#toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';el.setAttribute('role','status');document.body.appendChild(el)}
  el.textContent=t;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),2200)}

// ---------- Login ----------
function login(msg){
  closeMenu();removeEventListener('scroll',onScroll);
  app.innerHTML=`<div class="login"><div class="lg-in">
   <svg class="lg-logo" viewBox="0 0 120 120" aria-hidden="true"><defs>
    <linearGradient id="lgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6ee7b7"/><stop offset=".5" stop-color="#22d3ee"/><stop offset="1" stop-color="#a78bfa"/></linearGradient>
    <filter id="lgGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="8"/>
    <circle class="lg-ring" pathLength="1" cx="60" cy="60" r="46" fill="none" stroke="url(#lgG)" stroke-width="8" stroke-linecap="round" transform="rotate(-90 60 60)" filter="url(#lgGlow)"/>
    <polyline class="lg-ecg" pathLength="1" points="30,60 47,60 52,48 60,76 67,38 73,66 77,60 90,60" fill="none" stroke="#f4f6fb" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#lgGlow)"/>
    <circle class="lg-dot" cx="32.3" cy="32.9" r="4" fill="#fff" filter="url(#lgGlow)"/></svg>
   <h1>Gesundheit</h1>
   <p class="lg-sub">Erholung, Schlaf, Tagesempfehlung und Tagebuch – nur für dich.</p>
   <form class="lg-card" id="lgForm" novalidate>
    <label class="fld"><span>E-Mail</span><div class="inp"><input name="email" type="email" inputmode="email" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="name@beispiel.de" required></div></label>
    <label class="fld"><span>Passwort</span><div class="inp"><input class="pw" name="pw" type="password" autocomplete="current-password" placeholder="••••••••" required><button type="button" class="eye" id="lgEye" aria-label="Passwort anzeigen">${ico('eye')}</button></div></label>
    <button class="lg-btn" id="lgBtn">Anmelden</button>
    <p class="lg-msg" id="lgMsg" role="alert">${esc(msg||'')}</p>
   </form>
   <p class="lg-foot">${ico('lock')}Mit deinem bestehenden Konto anmelden</p>
  </div></div>`;
  const f=$('#lgForm'),btn=$('#lgBtn'),m=t=>{$('#lgMsg').textContent=t||''};
  $('#lgEye').onclick=()=>{const p=f.pw,show=p.type==='password';p.type=show?'text':'password';$('#lgEye').innerHTML=ico(show?'eyeoff':'eye');$('#lgEye').setAttribute('aria-label',show?'Passwort verbergen':'Passwort anzeigen')};
  f.onsubmit=async e=>{e.preventDefault();const email=f.email.value.trim(),pw=f.pw.value;
    if(!email||!pw){m('Bitte E-Mail und Passwort eingeben.');return}
    if(!Auth.configured){m('Die App ist nicht konfiguriert.');return}
    btn.disabled=true;btn.innerHTML='<i></i>Melde an …';m('');
    try{await Auth.signIn(email,pw)} // onChange -> main()
    catch(err){btn.disabled=false;btn.textContent='Anmelden';m(err.status?Auth.fehler(err.message):'Keine Verbindung. Bitte später erneut versuchen.')}};
}

// ---------- Hauptansicht ----------
let loading=false;
function main(){
  app.innerHTML=`<header id="bar"><div class="bar-in"><div class="brand"><img src="icon-192.png" alt="">Gesundheit</div><span class="bar-sp"></span>
    <button class="ibtn" id="menuBtn" aria-label="Menü" aria-haspopup="true" aria-expanded="false">${ico('dots')}</button></div></header>
   <main id="main"></main>
   <div class="menu-veil" id="menuVeil"></div>
   <div class="menu" id="menu" role="menu"><div class="mstand" id="mStand"></div>
    <button class="mitem" role="menuitem" id="mReload">${ico('reload')}Neu laden</button>
    <button class="mitem danger" role="menuitem" id="mOut">${ico('out')}Abmelden</button>
    <div class="mver">Gesundheit ${VER}</div></div>`;
  $('#menuBtn').onclick=()=>$('#menu').classList.contains('open')?closeMenu():openMenu();
  $('#menuVeil').onclick=closeMenu;
  $('#mReload').onclick=()=>{closeMenu();reload(true)};
  $('#mOut').onclick=()=>{closeMenu();signOut()};
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  render();
}
async function render(){loading=true;try{await GS.view($('#main'),hooks)}finally{loading=false}}
async function reload(user){
  if(loading||!$('#main'))return;const b=$('#menuBtn');b&&b.classList.add('busy');
  const before=GS.info();await render();b&&b.classList.remove('busy');
  if(!user||!Auth.user)return;const now=GS.info();
  toast(!navigator.onLine?'Offline – zeige gespeicherte Daten':now&&before&&now.loaded===before.loaded?'Konnte nicht neu laden':'Aktualisiert');
}
async function signOut(){
  const n=GS.pending();
  if(!confirm('Abmelden?\n\nDie Gesundheitsdaten werden von diesem Gerät entfernt.'+(n?`\n\nAchtung: ${n} Tagebuch-Eintrag${n>1?'e sind':' ist'} noch nicht übertragen und ${n>1?'gehen':'geht'} verloren.`:'')))return;
  GS.clear();await Auth.signOut();
}
const hooks={relogin:()=>login('Bitte melde dich erneut an.'),reload:()=>reload(true),signOut};
function onScroll(){const b=$('#bar');if(b)b.classList.toggle('scrolled',scrollY>8)}
const fmtDT=t=>{const d=new Date(t);if(isNaN(d))return'–';const today=d.toDateString()===new Date().toDateString();
  return(today?'heute':d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}))+', '+d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})+' Uhr'};
function openMenu(){
  const i=GS.info(),u=Auth.user;
  $('#mStand').innerHTML=`<h4>Stand</h4>${i?`<div class="mrow">Whoop-Daten<b>${esc(fmtDT(i.stand))}</b></div><div class="mrow">Zuletzt geladen<b>${esc(fmtDT(i.loaded))}</b></div>
    <div class="mrow">Verlauf<b>${i.tage} Tage</b></div>`:'<div class="mrow">Noch keine Daten geladen</div>'}
    ${navigator.onLine?'':'<div class="mrow" style="color:#fde68a">Offline</div>'}${u?`<div class="muser">Angemeldet als ${esc(u.email)}</div>`:''}`;
  $('#menu').classList.add('open');$('#menuVeil').classList.add('open');$('#menuBtn').setAttribute('aria-expanded','true')}
function closeMenu(){const m=$('#menu');if(!m)return;m.classList.remove('open');$('#menuVeil').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false')}
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

// Beim Zurückholen der App: Daten auffrischen, wenn sie älter als 10 Minuten sind
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible'||!Auth.user||!$('#main')||!navigator.onLine)return;
  const i=GS.info();if(!i||Date.now()-i.loaded>600000)reload(false)});
addEventListener('online',()=>{if(Auth.user&&$('#main')&&!GS.info())reload(false)});

Auth.onChange((on,why)=>{on?main():login(why==='expired'?'Deine Anmeldung ist abgelaufen. Bitte melde dich erneut an.':'')});
if(meta)meta.setAttribute('content','#05070d');
Auth.user?main():login();

// ---------- Service Worker (offline) ----------
if('serviceWorker' in navigator&&location.protocol!=='file:'){
  const had=!!navigator.serviceWorker.controller;let reloaded=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had&&!reloaded){reloaded=true;location.reload()}});
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
})();
