/* Vita Experience · piezas compartidas.
   Cada página elige las suyas con <body data-vx="wa top progress loader">.
   Siempre activos: saltar al contenido, aviso de cookies, origen de visitas (UTM),
   botones de copiar, avisos de éxito/error y ventana de confirmación.
   Nada de esto guarda datos personales: solo preferencias en el navegador de cada visitante. */
(function(){
'use strict';
var WA = '525664674617';
var T = {
  es:{skip:'Saltar al contenido',ck:'Usamos lo esencial para que el sitio funcione y, si aceptas, estadísticas anónimas sin cookies publicitarias.',ckMore:'Aviso de privacidad',ckOk:'Aceptar',ckNo:'Solo lo esencial',wa:'Escríbenos por WhatsApp',top:'Volver arriba',copied:'Copiado',copyErr:'No se pudo copiar. Selecciónalo y cópialo a mano.',yes:'Sí, continuar',no:'Cancelar',loading:'VITA EXPERIENCE'},
  en:{skip:'Skip to content',ck:'We use only what the site needs to work and, if you agree, anonymous statistics with no advertising cookies.',ckMore:'Privacy notice',ckOk:'Accept',ckNo:'Essentials only',wa:'Message us on WhatsApp',top:'Back to top',copied:'Copied',copyErr:'Couldn’t copy. Select it and copy it by hand.',yes:'Yes, continue',no:'Cancel',loading:'VITA EXPERIENCE'},
  he:{skip:'דילוג לתוכן',ck:'אנחנו משתמשים רק במה שהאתר צריך כדי לעבוד, ואם תאשרו, גם בסטטיסטיקה אנונימית בלי עוגיות פרסום.',ckMore:'מדיניות פרטיות',ckOk:'אישור',ckNo:'רק ההכרחי',wa:'כתבו לנו בוואטסאפ',top:'חזרה למעלה',copied:'הועתק',copyErr:'לא הצלחנו להעתיק. סמנו והעתיקו ידנית.',yes:'כן, להמשיך',no:'ביטול',loading:'VITA EXPERIENCE'}
};
function L(){ var l=(document.documentElement.lang||'es').slice(0,2); return T[l]?l:'es'; }
function t(k){ return T[L()][k]; }
function store(k,v){ try{ if(v===undefined) return localStorage.getItem(k); localStorage.setItem(k,v); }catch(e){ return null; } }
var opts = ((document.body && document.body.getAttribute('data-vx'))||'').split(/\s+/);
function has(o){ return opts.indexOf(o)>-1; }
function el(tag, cls, html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }

/* ---- origen de la visita (UTM): se guarda la primera fuente por 30 días ---- */
(function(){
  var keys=/^(utm_[a-z]+|ref|src|gclid|fbclid)$/, got={}, any=false;
  try{ new URLSearchParams(location.search).forEach(function(v,k){ if(keys.test(k)){ got[k]=String(v).slice(0,120); any=true; } }); }catch(e){}
  var prev=null; try{ prev=JSON.parse(store('vx_src')||'null'); }catch(e){}
  if(any && (!prev || Date.now()-prev.at>30*864e5)){ got.landing=location.pathname; got.at=Date.now(); store('vx_src',JSON.stringify(got)); prev=got; }
  else if(!prev && document.referrer && document.referrer.indexOf(location.host)<0){ try{ prev={ref:new URL(document.referrer).hostname,landing:location.pathname,at:Date.now()}; store('vx_src',JSON.stringify(prev)); }catch(e){} }
  window.vxSource=function(){ var o={}; if(prev) for(var k in prev) if(k!=='at') o[k]=prev[k]; if(any) for(var j in got) if(j!=='at') o[j]=got[j]; return o; };
})();

/* ---- estadísticas (Vercel Web Analytics, sin cookies) solo con permiso ---- */
function analytics(){
  if(window.__vxA) return; window.__vxA=1;
  window.va=window.va||function(){ (window.vaq=window.vaq||[]).push(arguments); };
  var s=document.createElement('script'); s.defer=true; s.src='/_vercel/insights/script.js'; document.head.appendChild(s);
}

/* ---- saltar al contenido ---- */
function skip(){
  var target=document.querySelector('main,[data-main]'); if(!target) return;
  if(!target.id) target.id='contenido';
  if(!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
  var a=el('a','vx-skip'); a.href='#'+target.id; a.textContent=t('skip'); a.dataset.k='skip';
  a.addEventListener('click',function(e){ e.preventDefault(); target.focus({preventScroll:false}); target.scrollIntoView(); });
  document.body.insertBefore(a,document.body.firstChild);
}

/* ---- aviso de cookies ---- */
var ck;
function cookie(){
  var c=store('vx_consent');
  if(c==='all'){ analytics(); return; }
  if(c==='min') return;
  ck=el('div','vx-cookie vx-noprint'); ck.setAttribute('role','region'); ck.setAttribute('aria-label','Cookies');
  ck.innerHTML='<p><span data-k="ck"></span> <a href="/privacidad" data-k="ckMore"></a></p><div class="b"><button type="button" class="vx-btn" data-c="min" data-k="ckNo"></button><button type="button" class="vx-btn pri" data-c="all" data-k="ckOk"></button></div>';
  document.body.appendChild(ck); text(ck);
  setTimeout(function(){ ck.classList.add('on'); },900);
  ck.addEventListener('click',function(e){ var b=e.target.closest('[data-c]'); if(!b) return; store('vx_consent',b.dataset.c); if(b.dataset.c==='all') analytics(); ck.classList.remove('on'); setTimeout(function(){ ck.remove(); ck=null; },700); });
}

/* ---- botones flotantes ---- */
var wa, top;
function fabs(){
  var svgWa='<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';
  if(has('wa')){
    wa=el('a','vx-fab vx-wa vx-noprint',svgWa+'<span class="vx-tip" data-k="wa"></span>');
    wa.href='https://wa.me/'+WA; wa.target='_blank'; wa.rel='noopener'; wa.dataset.ka='wa';
    document.body.appendChild(wa); document.body.classList.add('vx-has-wa');
  }
  if(has('top')){
    top=el('button','vx-fab vx-top vx-noprint','<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg><span class="vx-tip" data-k="top"></span>');
    top.type='button'; top.dataset.ka='top';
    top.addEventListener('click',function(){ window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}); var s=document.querySelector('.vx-skip'); if(s) s.focus(); });
    document.body.appendChild(top);
  }
}

/* ---- barra de lectura ---- */
var bar;
function progress(){ if(!has('progress')) return; var p=el('div','vx-progress vx-noprint','<i></i>'); p.setAttribute('aria-hidden','true'); document.body.appendChild(p); bar=p.firstChild; }
function onScroll(){
  var h=document.documentElement, max=h.scrollHeight-h.clientHeight, y=h.scrollTop||document.body.scrollTop;
  if(bar) bar.style.transform='scaleX('+(max>0?Math.min(1,y/max):0)+')';
  if(top) top.classList.toggle('on', y>innerHeight*1.2);
}

/* ---- pantalla de carga ---- */
function loader(){
  if(!has('loader')) return;
  var d=el('div','vx-loader vx-noprint','<div></div><span data-k="loading"></span>'); d.setAttribute('aria-hidden','true');
  document.body.appendChild(d); text(d);
  function done(){ d.classList.add('out'); setTimeout(function(){ d.remove(); },700); }
  if(document.readyState==='complete') done(); else { addEventListener('load',done); setTimeout(done,2500); }
}

/* ---- avisos ---- */
var toastEl, toastTimer;
window.vxToast=function(msg, kind){
  if(!toastEl){ toastEl=el('div','vx-toast'); toastEl.setAttribute('role','status'); toastEl.setAttribute('aria-live','polite'); document.body.appendChild(toastEl); }
  toastEl.className='vx-toast '+(kind||'ok'); toastEl.textContent=msg;
  requestAnimationFrame(function(){ toastEl.classList.add('on'); });
  clearTimeout(toastTimer); toastTimer=setTimeout(function(){ toastEl.classList.remove('on'); },2600);
};

/* ---- copiar: <button data-copy="texto"> ---- */
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-copy]'); if(!b) return;
  var v=b.getAttribute('data-copy')||location.href;
  function ok(){ window.vxToast(t('copied'),'ok'); }
  function bad(){ window.vxToast(t('copyErr'),'err'); }
  try{ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(v).then(ok,bad); return; } }catch(x){}
  try{ var ta=el('textarea'); ta.value=v; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); var r=document.execCommand('copy'); ta.remove(); r?ok():bad(); }catch(x){ bad(); }
});

/* ---- ventana de confirmación: vxConfirm({title, text, yes, no}).then(bool) ---- */
window.vxConfirm=function(o){
  o=o||{};
  return new Promise(function(res){
    var last=document.activeElement;
    var m=el('div','vx-modal'); m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true');
    m.innerHTML='<div class="box"><h2></h2><p></p><div class="b"><button type="button" class="vx-btn" data-a="0"></button><button type="button" class="vx-btn pri" data-a="1"></button></div></div>';
    m.querySelector('h2').textContent=o.title||''; m.querySelector('p').textContent=o.text||'';
    m.querySelector('[data-a="0"]').textContent=o.no||t('no'); m.querySelector('[data-a="1"]').textContent=o.yes||t('yes');
    m.setAttribute('aria-label',o.title||'');
    document.body.appendChild(m); requestAnimationFrame(function(){ m.classList.add('on'); });
    var btns=m.querySelectorAll('button'); btns[0].focus();
    function close(v){ m.classList.remove('on'); setTimeout(function(){ m.remove(); },250); document.removeEventListener('keydown',key); if(last&&last.focus) last.focus(); res(v); }
    function key(e){ if(e.key==='Escape') close(false); if(e.key==='Tab'){ var a=btns[0],b=btns[1]; if(e.shiftKey&&document.activeElement===a){ e.preventDefault(); b.focus(); } else if(!e.shiftKey&&document.activeElement===b){ e.preventDefault(); a.focus(); } } }
    document.addEventListener('keydown',key);
    m.addEventListener('click',function(e){ if(e.target===m) close(false); var b=e.target.closest('[data-a]'); if(b) close(b.dataset.a==='1'); });
  });
};

/* ---- textos en el idioma de la página (cambian si la página cambia de idioma) ---- */
function text(root){
  (root||document).querySelectorAll('[data-k]').forEach(function(n){ n.textContent=t(n.dataset.k); });
  (root||document).querySelectorAll('[data-ka]').forEach(function(n){ n.setAttribute('aria-label',t(n.dataset.ka)); });
}

function boot(){
  skip(); progress(); fabs(); loader(); cookie(); text();
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  new MutationObserver(function(){ text(); }).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
