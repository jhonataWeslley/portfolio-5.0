/* ===== Conteúdo editável ===== */
const CONFIG = {
  email: "mailto:jhonataweslley321@gmail.com",      // ex.: "seuemail@exemplo.com"
  github: "https://github.com/jhonataWeslley",     // ex.: "https://github.com/seu-usuario"
  linkedin: "https://www.linkedin.com/in/jhonata-weslley-sousa-de-oliveira-183835385/",   // ex.: "https://www.linkedin.com/in/seu-perfil"
  instagram: "https://www.instagram.com/weslley8_/"   // ex.: "https://www.instagram.com/seu-usuario"
};
const FRASES = ["estudo tecnologia","organizo processos","automatizo tarefas","aprendo todo dia","conecto áreas"];
const PILARES = [["Curiosidade intelectual","Quero entender como as coisas funcionam."],["Disciplina","Constância para aprender e entregar."],["Capacidade de aprendizado","Aprendo rápido e de forma autodidata."],["Pensamento analítico","Quebro problemas em partes menores."],["Responsabilidade","Compromisso com o que assumo."]];
const SKILLS = ["Criatividade","Organização","Resolução de problemas","Adaptabilidade","Liderança","Comunicação","Pesquisa","Escrita"];

const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
$('#ano').textContent = new Date().getFullYear();

/* ===== Montagem de conteúdo ===== */
$('#pilares').innerHTML = PILARES.map(p=>`<div class="card rv"><h3>${p[0]}</h3><p>${p[1]}</p></div>`).join('');
$('#skills').innerHTML = SKILLS.map(s=>`<span>${s}</span>`).join('');
const CONTATOS = [["E-mail", CONFIG.email && 'mailto:'+CONFIG.email, true],["GitHub", CONFIG.github],["LinkedIn", CONFIG.linkedin],["Instagram", CONFIG.instagram]];
$('#links').innerHTML = CONTATOS.map(c => {
  const ext = c[1] && !c[1].startsWith('mailto') ? ' target="_blank" rel="noopener"' : '';
  return `<a class="btn ${c[2]?'pri':''}" href="${c[1]||'#contato'}"${ext}${c[1]?'':' data-vazio'}>${c[0]}</a>`;
}).join('');
const toast = $('#toast'); let tt;
$('#links').addEventListener('click', e => {
  const a = e.target.closest('a[data-vazio]'); if(!a) return; e.preventDefault();
  toast.textContent = a.textContent + ': link em breve.'; toast.classList.add('show');
  clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2600);
});

/* ===== Tema ===== */
$('#theme').onclick = () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  try{localStorage.setItem('tema', t)}catch(e){}
};

/* ===== Menu mobile ===== */
const nav = $('#nav'), mb = $('#menu');
mb.onclick = () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); };
nav.addEventListener('click', e => { if(e.target.tagName==='A'){ nav.classList.remove('open'); mb.setAttribute('aria-expanded', false); }});

/* ===== Seção ativa e revelação ===== */
const links = [...document.querySelectorAll('nav a')];
const so = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#'+e.target.id));
}), {rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('main section').forEach(s => so.observe(s));
let started = false;
const ro = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting && started){ e.target.classList.add('in'); ro.unobserve(e.target); }}), {threshold:.12});
function observeReveal(){ document.querySelectorAll('.rv').forEach((el,i)=>{ el.style.transitionDelay = (i%4)*70+'ms'; ro.observe(el); }); }

/* ===== Telas: início e projetos ===== */
const home = $('#home'), vproj = $('#vproj');
let ultima = null;
function rota(){
  const proj = location.hash === '#projetos';
  const mudou = ultima !== null && ultima !== proj;
  home.hidden = proj; vproj.hidden = !proj;
  if(mudou){ const alvo = proj ? vproj : home; alvo.classList.remove('view-in'); void alvo.offsetWidth; alvo.classList.add('view-in'); }
  ultima = proj;
  if(proj){
    scrollTo({top:0, behavior:'instant'});
    links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#projetos'));
  } else if(mudou){
    const el = document.getElementById(location.hash.slice(1));
    el ? el.scrollIntoView({behavior:'instant'}) : scrollTo({top:0, behavior:'instant'});
  }
}
addEventListener('hashchange', rota); rota();

/* ===== Brilho nos cards ===== */
document.addEventListener('pointermove', e => {
  const c = e.target.closest && e.target.closest('.card'); if(!c) return;
  const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX-r.left)+'px'); c.style.setProperty('--my', (e.clientY-r.top)+'px');
});

/* ===== Frases rotativas ===== */
let fi = 0;
function rodar(){ const el = $('#rot'); fi = (fi+1)%FRASES.length; el.textContent = FRASES[fi]; }
if(!reduce) setInterval(rodar, 2600);

/* ===== Intro ===== */
const intro = $('#intro');
let done = false, timers = [];
const wait = ms => new Promise(r => timers.push(setTimeout(r, ms)));
function finish(){
  if(done) return; done = true; timers.forEach(clearTimeout);
  intro.classList.add('out'); document.body.classList.remove('lock'); started = true; observeReveal();
  setTimeout(() => intro.remove(), 1500);
}
intro.onclick = finish;
(async () => { await wait(reduce ? 1200 : 2400); finish(); })();
