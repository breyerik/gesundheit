/* Lokaler Vorschaumodus. Greift nur auf localhost mit ?demo=… und niemals auf der Live-Seite. */
(function(){
  const host=location.hostname;
  if(host!=='localhost'&&host!=='127.0.0.1')return;
  const m=(location.search.match(/[?&]demo=(login|signup|erik|eren)\b/)||[])[1];
  if(!m)return;
  window.DEMO=m;

  const erik={id:'demo-erik',email:'erik@localhost'};
  const eren={id:'demo-eren',email:'eren@localhost'};
  const users={erik,eren};

  function daysBack(n){
    const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Etc/GMT-1',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const g=t=>p.find(x=>x.type===t).value;const iso=`${g('year')}-${g('month')}-${g('day')}`;
    const [y,mo,d]=iso.split('-').map(Number);const dt=new Date(Date.UTC(y,mo-1,d));dt.setUTCDate(dt.getUTCDate()-n);return dt.toISOString().slice(0,10);
  }
  const heute=daysBack(0);

  function synthWhoop(){
    const richtung={erholung:-1,hrv:-1,ruhepuls:1,atem:1,spo2:-1,haut:1,schlaf:-1,belastung:0,schritte:0};
    const tage=[];
    for(let i=29;i>=0;i--){
      const d=daysBack(i),detail=i<=1;
      const er=72+(i%5)*3,hrv=58+(i%6)*2,rp=54-(i%3),sch=7.1+(i%4)*0.2;
      const row={d,v:{erholung:er,hrv:hrv,ruhepuls:rp,atem:14.2,spo2:96.4,haut:0.1,schlaf:sch,belastung:10+i%8,schritte:7000+i*40},
        b:{erholung:{m:75,sd:7,n:30},hrv:{m:62,sd:8,n:30},ruhepuls:{m:53,sd:3,n:30},atem:{m:14.1,sd:0.4,n:30},spo2:{m:96.2,sd:0.5,n:30},haut:{m:0,sd:0.3,n:30},schlaf:{m:7.2,sd:0.5,n:30},belastung:{m:11,sd:3,n:30},schritte:{m:8000,sd:1500,n:30}},
        s:{hrv:'g',ruhepuls:'g',atem:'g',haut:'g'},
        h7:64,h60:[62,8],hrv_7d:{mittel:64,n:7,sd:6},hrv_60d:{mittel:62,sd:8}};
      if(detail){
        row.schlaf={dauer_h:sch,leistung_prozent:82,effizienz_prozent:91,rem_h:1.6,tief_h:1.3,leicht_h:3.8,wach_h:0.4};
        row.empfehlung='Ein ruhiger Tag passt gut – leichte Bewegung reicht.';
        row.belegstufe='gut belegt';
        row.empfehlungen=[{text:'Heute eher locker bleiben.',beleg:'erste Hinweise'},{text:'Am späten Nachmittag ein kurzer Spaziergang.',beleg:'Erfahrung'}];
        row.auffaellig=[];
        row.belastung_ratio={akut_7d:10,chronisch_28d:11,ratio:0.9};
        row.zone2_woche={minuten_7d:80,ziel_min:150,n_einheiten:2,moderat_min_7d:40,quelle:'demo'};
        row.schlafmitte={heute:'03:20',mittel_7d:'03:15',mittel_28d:'03:10',verschiebung_min:5,streuung_7d_min:20};
        row.infekt_warnung={stufe:'keine',gruende:[]};
        row.reise={aktiv:false,tipps:[]};
      }
      tage.push(row);
    }
    return{stand:heute+'T07:05:00+01:00',richtung,baseTage:30,luecken:[],tage,hinweis:'Beispieldaten nur für die lokale Vorschau, keine echten Messwerte.',arzt_schwellen:[],laborwerte:[]};
  }

  const store={
    erik:{
      profil:{user_id:'demo-erik',anzeigename:'Erik',gewicht_kg:73},
      whoop:{stand:'2026-11-18T07:05:00+01:00',data:synthWhoop(),updated_at:'2026-11-18T07:06:00+01:00'},
      ernaehrung:[
        {id:'e1',datum:'2026-11-05',uhrzeit:'',mahlzeit:'frühstück',was:'nichts gegessen',menge_geschaetzt:'-',notiz:'Einkauf noch nicht da',quelle:'sanji'},
        {id:'e2',datum:'2026-11-05',uhrzeit:'',mahlzeit:'mittag',was:'Halloumi-Burger mit Pommes',menge_geschaetzt:'1 Burger + 1 Portion Pommes',notiz:'frittiert',quelle:'sanji'},
        {id:'e3',datum:'2026-11-05',uhrzeit:'',mahlzeit:'abend',was:'Dal Tadka (Linsen-Dal) vom Inder',menge_geschaetzt:'1 Portion',notiz:'bestellt; Hülsenfrüchte',quelle:'sanji'},
        {id:'e4',datum:'2026-11-05',uhrzeit:'',mahlzeit:'abend',was:'Naan-Brot mit Ingwer',menge_geschaetzt:'1 Stück (geteilt?)',notiz:'Weißmehl',quelle:'sanji'},
        {id:'e5',datum:'2026-11-06',uhrzeit:'',mahlzeit:'frühstück',was:'YFood Trinkmahlzeit',menge_geschaetzt:'1 Flasche (500 ml)',notiz:'stark verarbeitet',quelle:'sanji'},
        {id:'e6',datum:'2026-11-06',uhrzeit:'',mahlzeit:'mittag',was:'Halloumi-Dürüm aus dem Dönerladen',menge_geschaetzt:'1 Dürüm',notiz:'',quelle:'sanji'},
        {id:'e7',datum:'2026-11-06',uhrzeit:'18:57',mahlzeit:'snack',was:'Barebells Proteinriegel Minzschokolade',menge_geschaetzt:'1 Riegel (55 g)',notiz:'unterwegs',quelle:'sanji'},
        {id:'e8',datum:'2026-11-06',uhrzeit:'18:57',mahlzeit:'getränk',was:'Wasser',menge_geschaetzt:'0.5 l',notiz:'laut Erik insgesamt zu wenig und zu spät getrunken (05.–06.11.)',quelle:'sanji'},
        {id:'e9',datum:'2026-11-17',uhrzeit:'17:24',mahlzeit:'abend',was:'Vollkornspaghetti mit Linsen-Bolognese (eigenes Rezept)',menge_geschaetzt:'1 Portion',notiz:'Einziges Rezept aus KW46, das gekocht wurde; genauer Tag unbekannt',quelle:'sanji'},
        {id:'e10',datum:'2026-11-18',uhrzeit:'',mahlzeit:'snack',was:'Kleines Lebkuchenherz (Büro)',menge_geschaetzt:'ca. 40 g (Handflächengröße)',notiz:'Schätzung, stark verarbeitet',kcal:160,protein_g:2,ballaststoffe_g:1,zucker_g:15,gemuese_obst_portionen:0,nova:4,frittiert:'nein',bewertung:'ungünstig',quelle:'sanji'},
        {id:'e11',datum:'2026-11-18',uhrzeit:'',mahlzeit:'mittag',was:'Edeka Asia-Station Bowl mit Tofu (frisch gemacht)',menge_geschaetzt:'1 Bowl (ca. 400 g)',notiz:'Keine offiziellen Nährwerte gefunden; Schätzung nach vergleichbaren Tofu-Reis-Bowls',kcal:550,protein_g:20,ballaststoffe_g:6,zucker_g:8,gemuese_obst_portionen:1.5,nova:3,frittiert:'nein',bewertung:'gut',quelle:'sanji'},
        {id:'e12',datum:'2026-11-18',uhrzeit:'',mahlzeit:'snack',was:'KitKat Mini Matcha',menge_geschaetzt:'2 Stück (ca. 34 g)',notiz:'stark verarbeitet',kcal:170,protein_g:2,ballaststoffe_g:0.5,zucker_g:16,gemuese_obst_portionen:0,nova:4,frittiert:'nein',bewertung:'ungünstig',quelle:'sanji'},
        {id:'e13',datum:'2026-11-18',uhrzeit:'',mahlzeit:'abend',was:'Reste: Japanischer Rundkornreis, Brokkoli, Lachs',menge_geschaetzt:'ca. 300 g Reis gekocht, ca. 150 g Brokkoli, 200 g Lachs',notiz:'Große Portion Reis',kcal:840,protein_g:51,ballaststoffe_g:5,zucker_g:2,gemuese_obst_portionen:1.5,nova:1,frittiert:'nein',bewertung:'gut',quelle:'sanji'},
        {id:'e14',datum:'2026-11-18',uhrzeit:'20:40',mahlzeit:'getränk',was:'Slow-Juicer-Saft: Karotte, Sellerie, Ingwer',menge_geschaetzt:'5 Karotten, 4 Selleriestangen, 2 daumengroße Stücke Ingwer (ca. 250 ml)',notiz:'Saft zählt max. 1 Portion; Zucker im Saft gilt als freier Zucker',kcal:110,protein_g:2,ballaststoffe_g:1,zucker_g:14,gemuese_obst_portionen:1,nova:1,frittiert:'nein',bewertung:'okay',quelle:'sanji'}
      ],
      tagebuch:[{id:'t1',datum:heute,erstellt:heute+'T08:10:00+01:00',text:'Guter Start in den Tag.',stichworte:['Sport']}],
      mc:[{datum:heute,energie:4,stimmung:4,muskelkater:2,geaendert:heute+'T08:05:00+01:00'}],
      labor:[{id:'l1',datum:'2026-10-02',name:'Vitamin D',wert:42,einheit:'ng/ml',referenz_min:30,referenz_max:100,erstellt:'2026-10-02T10:00:00+02:00'},
             {id:'l2',datum:'2026-10-02',name:'Ferritin',wert:85,einheit:'ng/ml',referenz_min:30,referenz_max:400,erstellt:'2026-10-02T10:00:00+02:00'}],
      sn:[]
    },
    eren:{
      profil:{user_id:'demo-eren',anzeigename:'Eren',gewicht_kg:78},
      whoop:null,
      ernaehrung:[
        {id:'r1',datum:heute,uhrzeit:'13:10',mahlzeit:'mittag',was:'Reis mit Gemüse und Tofu',menge_geschaetzt:'1 großer Teller',notiz:'selbst eingetragen',kcal:620,protein_g:24,ballaststoffe_g:9,zucker_g:7,gemuese_obst_portionen:2,nova:1,frittiert:'nein',bewertung:'gut',quelle:'manual'}
      ],
      tagebuch:[],mc:[],labor:[],sn:[]
    }
  };

  // Align whoop stand/dates to "today" in the fixture already via daysBack.
  store.erik.whoop.stand=heute+'T07:05:00+01:00';
  store.erik.whoop.updated_at=heute+'T07:06:00+01:00';
  store.erik.whoop.data.stand=heute+'T07:05:00+01:00';

  let who=null,ss=null,listeners=[];
  if(m==='erik'||m==='eren'){who=m;ss={access_token:'demo',refresh_token:'demo',expires_at:Math.floor(Date.now()/1000)+3600,user:users[who]}}

  function data(){return who?store[who]:null}
  function pathOf(path){return path.split('?')[0]}
  function qs(path){const i=path.indexOf('?');return new URLSearchParams(i>=0?path.slice(i+1):'')}

  async function api(path,opts={}){
    if(!ss){const err=new Error('Nicht angemeldet');err.status=401;throw err}
    const p=pathOf(path),method=(opts.method||'GET').toUpperCase(),body=opts.body||{};
    const d=data();
    if(p==='/rest/v1/rpc/ist_erik')return who==='erik';
    if(p==='/rest/v1/gesundheit')return who==='erik'&&d.whoop?[d.whoop]:[];
    if(p==='/rest/v1/gesundheit_profil'){
      if(method==='GET')return d.profil?[d.profil]:[];
      const next=Object.assign({},d.profil,body,{user_id:ss.user.id});d.profil=next;return[next];
    }
    if(p.startsWith('/rest/v1/gesundheit_ernaehrung')){
      if(method==='GET')return d.ernaehrung.slice();
      if(method==='POST'){const row=Object.assign({id:'m'+Math.random().toString(36).slice(2,8),quelle:'manual',erstellt:new Date().toISOString()},body);d.ernaehrung.push(row);return[row]}
      if(method==='DELETE'){const id=(path.match(/id=eq\.([^&]+)/)||[])[1];d.ernaehrung=d.ernaehrung.filter(z=>z.id!==id);return[]}
    }
    if(p.startsWith('/rest/v1/gesundheit_tagebuch'))return d.tagebuch.slice();
    if(p.startsWith('/rest/v1/gesundheit_morgencheck')){
      if(method==='GET')return d.mc.slice();
      const row=Object.assign({},d.mc[0]||{},body,{geaendert:new Date().toISOString()});d.mc=[row,...d.mc.filter(x=>x.datum!==row.datum)];return[row];
    }
    if(p.startsWith('/rest/v1/gesundheit_labor'))return d.labor.slice();
    if(p.startsWith('/rest/v1/gesundheit_sprachnotiz'))return d.sn.slice();
    return [];
  }

  const AuthDemo={
    signIn:async(email,password)=>{
      const w=String(email).toLowerCase().includes('eren')?'eren':'erik';
      who=w;ss={access_token:'demo',refresh_token:'demo',expires_at:Math.floor(Date.now()/1000)+3600,user:users[w]};
      listeners.forEach(f=>{try{f(true)}catch(e){}});
    },
    signUp:async(email,password)=>{
      await AuthDemo.signIn(email,password);return'in';
    },
    signOut:async()=>{ss=null;who=null;listeners.forEach(f=>{try{f(false)}catch(e){}})},
    api,fehler:t=>t||'Fehler',
    onChange:f=>listeners.push(f),
    get user(){return ss&&ss.user},
    get configured(){return true}
  };
  window.Auth=AuthDemo;
})();
