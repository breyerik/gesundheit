// Anmeldung über Supabase Auth (REST per fetch, keine externe Bibliothek).
// Nur Anmelden mit E-Mail + Passwort, Token-Erneuerung und Abmelden – kein Registrieren.
const Auth=(()=>{
  const CFG=window.SUPABASE_CFG||{},SK='gs-app-session';
  let ss=null;try{ss=JSON.parse(localStorage.getItem(SK)||'null')}catch(e){}
  const keep=()=>{try{ss?localStorage.setItem(SK,JSON.stringify(ss)):localStorage.removeItem(SK)}catch(e){}};
  const listeners=[];const emit=why=>listeners.forEach(f=>{try{f(!!ss,why)}catch(e){}});
  class HttpErr extends Error{constructor(st,msg){super(msg);this.status=st}}
  async function call(path,{method='GET',body,auth=true,headers={}}={}){
    if(!CFG.url||!CFG.anonKey)throw new HttpErr(500,'Konfiguration fehlt');
    const h={apikey:CFG.anonKey,'Content-Type':'application/json',...headers};
    if(auth&&ss)h.Authorization='Bearer '+ss.access_token;
    const r=await fetch(CFG.url+path,{method,headers:h,body:body&&JSON.stringify(body),cache:'no-store'});
    const t=await r.text();let j=null;try{j=t?JSON.parse(t):null}catch(e){}
    if(!r.ok)throw new HttpErr(r.status,(j&&(j.msg||j.message||j.error_description||j.error))||('HTTP '+r.status));
    return j;
  }
  const setSession=j=>{ss={access_token:j.access_token,refresh_token:j.refresh_token,
    expires_at:j.expires_at||Math.floor(Date.now()/1000)+(j.expires_in||3600),user:{id:j.user.id,email:j.user.email}};keep()};
  let refreshing=null;
  async function refresh(){
    if(refreshing)return refreshing;
    refreshing=(async()=>{const s=ss;if(!s)throw new HttpErr(401,'Nicht angemeldet');
      try{setSession(await call('/auth/v1/token?grant_type=refresh_token',{method:'POST',auth:false,body:{refresh_token:s.refresh_token}}))}
      catch(e){if(e.status&&e.status<500){ss=null;keep();emit('expired')}throw e}})();
    try{return await refreshing}finally{refreshing=null}
  }
  async function token(){if(!ss)throw new HttpErr(401,'Nicht angemeldet');if(ss.expires_at*1000-60000<=Date.now())await refresh()}
  // Authentifizierter Zugriff auf die Datenbank; bei 401 einmal Token erneuern und wiederholen
  async function api(path,opts){
    await token();
    try{return await call(path,opts)}
    catch(e){if(e.status!==401||!ss)throw e;await refresh();return call(path,opts)}
  }
  const fehler=t=>({'Invalid login credentials':'E-Mail oder Passwort falsch.',
    'Email not confirmed':'Die E-Mail-Adresse ist noch nicht bestätigt.',
    'Request rate limit reached':'Zu viele Versuche. Bitte kurz warten.'}[t]||('Fehler: '+t));
  async function signIn(email,password){
    setSession(await call('/auth/v1/token?grant_type=password',{method:'POST',auth:false,body:{email,password}}));emit()}
  async function signOut(){if(ss){try{await call('/auth/v1/logout',{method:'POST'})}catch(e){}}ss=null;keep();emit()}
  return{signIn,signOut,api,fehler,onChange:f=>listeners.push(f),get user(){return ss&&ss.user},get configured(){return!!(CFG.url&&CFG.anonKey)}};
})();
