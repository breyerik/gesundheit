/* Profil je angemeldetem Konto: Anzeigename und Gewicht. Proteinziel = 0,8 g × kg. */
window.Profil=(()=>{
  const PK='gs-app-profil';
  const PRO_KG=0.8;
  const DGE={ballaststoffe:30, portionen:5, wasserL:1.5};
  let row=null, listeners=[];
  const emit=()=>listeners.forEach(f=>{try{f(row)}catch(e){}});
  const uid=()=>Auth.user&&Auth.user.id;
  const jget=()=>{try{return JSON.parse(localStorage.getItem(PK)||'null')}catch(e){return null}};
  const jset=v=>{try{localStorage.setItem(PK,JSON.stringify(v))}catch(e){}};
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const fmt=n=>n==null||!isFinite(n)?'–':new Intl.NumberFormat('de-DE',{maximumFractionDigits:1,minimumFractionDigits:0}).format(n);
  const zielGramm=kg=>kg&&kg>0?Math.round(PRO_KG*kg*10)/10:null;
  const zielAnzeige=kg=>{const g=zielGramm(kg);return g==null?'–':new Intl.NumberFormat('de-DE',{maximumFractionDigits:0}).format(Math.round(g))};

  async function load(){
    const u=uid();if(!u){row=null;return null}
    const cached=jget();if(cached&&cached.uid===u)row=cached.row;
    try{
      const rows=await Auth.api('/rest/v1/gesundheit_profil?select=user_id,anzeigename,gewicht_kg,geaendert');
      row=(rows&&rows[0])||{user_id:u,anzeigename:'',gewicht_kg:null};
      jset({uid:u,row});emit();
      return row;
    }catch(e){
      if(!row)row={user_id:u,anzeigename:'',gewicht_kg:null};
      return row;
    }
  }

  async function save(anzeigename,gewicht_kg){
    const u=uid();if(!u)throw new Error('Nicht angemeldet');
    const body={user_id:u,anzeigename:(anzeigename||'').trim().slice(0,80),gewicht_kg:gewicht_kg==null||gewicht_kg===''?null:Number(gewicht_kg)};
    const rows=await Auth.api('/rest/v1/gesundheit_profil?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body});
    row=(rows&&rows[0])||Object.assign({},row,body);jset({uid:u,row});emit();return row;
  }

  function anzeigename(){
    if(row&&row.anzeigename&&row.anzeigename.trim())return row.anzeigename.trim();
    const em=Auth.user&&Auth.user.email;return em?em.split('@')[0]:'';
  }
  function gewicht(){return row&&row.gewicht_kg!=null?Number(row.gewicht_kg):null}

  function view(el){
    if(!el)return;
    const name=row&&row.anzeigename||'';
    const kg=gewicht();
    const ziel=zielGramm(kg);
    el.innerHTML=`<section class="en-page" id="profilRoot">
      <header class="en-hero en-hero-plain">
        <p class="en-kicker">Profil</p>
        <h2 class="en-insight">${esc(anzeigename()||'Dein Profil')}</h2>
        <p class="en-lead">Gewicht und Name gelten nur für dein Konto. Das Proteinziel folgt der DGE-Referenz von 0,8&nbsp;g je Kilogramm.</p>
      </header>
      <form class="en-card en-form" id="profilForm">
        <label class="fld"><span>Anzeigename</span><div class="inp"><input name="anzeigename" maxlength="80" value="${esc(name)}" placeholder="Wie du angesprochen werden möchtest" autocomplete="nickname"></div></label>
        <label class="fld"><span>Körpergewicht</span><div class="inp weight-row">
          <button type="button" class="stepper" id="pfMinus" aria-label="Gewicht verringern">–</button>
          <input name="gewicht" type="number" inputmode="decimal" min="35" max="200" step="0.5" value="${kg!=null?kg:''}" placeholder="kg" aria-label="Körpergewicht in Kilogramm">
          <button type="button" class="stepper" id="pfPlus" aria-label="Gewicht erhöhen">+</button>
        </div></label>
        <p class="en-preview" id="pfPreview"></p>
        <button class="btn-primary" type="submit">Speichern</button>
        <p class="en-msg" id="pfMsg" role="status"></p>
      </form>
      <section class="en-card">
        <h3 class="en-card-name">Feste Ziele (DGE)</h3>
        <ul class="en-goals">
          <li>Ballaststoffe: mindestens ${DGE.ballaststoffe}&nbsp;g</li>
          <li>Gemüse und Obst: ${DGE.portionen} Portionen</li>
          <li>Wasser: ca. ${String(DGE.wasserL).replace('.',',')}&nbsp;l</li>
        </ul>
        <p class="en-note">Diese Werte gelten für alle und lassen sich hier nicht ändern. Kalorien werden nur als Info gezeigt, ohne Warnung.</p>
      </section>
    </section>`;
    const f=el.querySelector('#profilForm'), preview=el.querySelector('#pfPreview'), msg=el.querySelector('#pfMsg');
    const show=()=>{const n=Number(f.gewicht.value);if(!n){preview.innerHTML='Noch kein Gewicht – das Proteinziel erscheint, sobald du eines angibst.';return}
      preview.innerHTML=`Proteinziel: <strong>ca. ${zielAnzeige(n)}\u00a0g</strong> (0,8\u00a0g × ${fmt(n)}\u00a0kg${zielGramm(n)!=null&&zielGramm(n)%1?' = '+fmt(zielGramm(n))+'&nbsp;g':''}).`};
    show();
    f.gewicht.addEventListener('input',show);
    const step=d=>{const cur=Number(f.gewicht.value)||75;const n=Math.min(200,Math.max(35,Math.round((cur+d)*2)/2));f.gewicht.value=String(n);show()};
    el.querySelector('#pfMinus').onclick=()=>step(-0.5);
    el.querySelector('#pfPlus').onclick=()=>step(0.5);
    f.onsubmit=async ev=>{ev.preventDefault();msg.textContent='';
      const n=f.gewicht.value===''?null:Number(f.gewicht.value);
      if(n!=null&&(n<35||n>200)){msg.textContent='Bitte ein Gewicht zwischen 35 und 200 kg angeben.';return}
      try{await save(f.anzeigename.value,n);msg.textContent='Gespeichert.';show()}
      catch(e){msg.textContent=e.status?('Konnte nicht speichern: '+(e.message||e.status)):'Keine Verbindung.'}};
  }

  return{load,save,view,anzeigename,gewicht,zielGramm,zielAnzeige,dge:DGE,onChange:f=>listeners.push(f)};
})();
