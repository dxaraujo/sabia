/* Proposta D · Do geral ao detalhe: uma apresentação guiada do mapa, com os controles e a ficha do mapa atual. A câmera é do mapa, não da pessoa.
   A visão geral mostra tudo, como o mapa atual; escolhida uma linha, a câmera voa até ela, desde o primeiro passo, e as outras se apagam.
   Daí em diante a pessoa só avança ou volta uma fase: a linha inteira, depois estação por estação.
   Abaixo do tamanho natural tudo escala com o mapa; acima, símbolos e rótulos ficam com tamanho fixo na tela. */
(function(){
"use strict";
const M=window.SABIA_MAP,D=window.SABIA;if(!M)return;
const {ST,svg,esc,cv}=M,$=s=>document.querySelector(s),NS="http://www.w3.org/2000/svg";
const H=window.SABIA_HOOKS=window.SABIA_HOOKS||{};
const vista=$("#vista"),P=M.P,passos=$("#passos");
const el=(t,a,p)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);if(p)p.appendChild(n);return n};

/* escala k (px de tela por unidade do mapa) de cada fase; abaixo de S_MIN o mapa vira miniatura, sem rótulos */
const K_TRILHA=[.45,1.65],K_ESTACAO=2.2,S_MIN=.45;
const GERAL={x0:30,y0:36,x1:1372,y1:716};

/* ---------- camadas novas, antes de mexer na ordem do SVG ---------- */
const gDynL=M.gTrain.previousElementSibling,gXL=gDynL.previousElementSibling,gX=M.gTracks.nextElementSibling,gDyn=gX.nextElementSibling,defs=svg.querySelector("defs");
/* voltas de retrabalho: leves na trilha inteira, inteiras na estação */
gDyn.classList.add("dz-dyn");gDynL.classList.add("dz-dyn");M.gRows.classList.add("dz-rows");
/* rótulos de região: cada um some quando a trilha em foco é outra */
const REG=Object.fromEntries(D.TEXTS.filter(t=>t.l).map(t=>[t.t,t.l]));
M.gRows.querySelectorAll("text").forEach(t=>{const r=REG[t.textContent]||(t.classList.contains("badge-t")?"epico":"");if(r)t.dataset.l=r});
const pat=el("pattern",{id:"dz-grade",width:"40",height:"40",patternUnits:"userSpaceOnUse"},defs),ponto=el("circle",{cx:"20",cy:"20",r:"1.2"},pat);
const MKS=[...defs.querySelectorAll("marker")];MKS.forEach(m=>m.setAttribute("markerUnits","userSpaceOnUse"));
svg.insertBefore(el("rect",{x:"-3000",y:"-3000",width:"7400",height:"6800",fill:"url(#dz-grade)"}),defs.nextSibling);
const gCas=el("g",{class:"dz-casing"}),gHit=el("g",{class:"dz-hit"}),gVia=el("g",{class:"dz-vias"});
svg.insertBefore(gCas,M.gTracks);svg.insertBefore(gHit,M.gSt);svg.insertBefore(gVia,M.gTrain);
const CAS={};
for(const L in M.TRACK){
  const c=M.TRACK[L].cloneNode();c.removeAttribute("class");c.removeAttribute("stroke");gCas.appendChild(c);CAS[L]=c;
  const h=c.cloneNode();gHit.appendChild(h);
  h.addEventListener("click",()=>{ST.touring=false;M.setLine(L)});
  h.addEventListener("pointerenter",()=>quente(L));h.addEventListener("pointerleave",()=>quente(null));
}
function quente(L){svg.classList.toggle("sobre",!!L);for(const k in M.TRACK){M.TRACK[k].classList.toggle("quente",k===L);CAS[k].classList.toggle("quente",k===L)}}

/* ---------- peças que escalam em torno da âncora ---------- */
const FIXAS=[];let DYN=[],VIAS=[];
const pin=(e,x,y,o)=>{FIXAS.push({el:e,x,y,o});return e};
const ESTICA=[];
M.gSt.querySelectorAll(".st").forEach(g=>{const id=g.dataset.id,s=D.S[id],[x,y]=M.center(id);pin(g,x,y);
  /* a pílula (e o hub) atravessa trilhos paralelos: cresce com a geometria, o resto fica do tamanho fixo */
  if(s.g==="pill"||s.g==="hubpill"||s.g==="hub")ESTICA.push({s,cy:y,hs:s.g==="hub"?16:(s.y2-s.y1)/2,body:g.querySelector(".body"),halo:g.querySelector(".halo"),
    txt:[...g.querySelectorAll("text")].map(t=>({t,y:+t.getAttribute("y")}))});
});
M.gRows.querySelectorAll("text").forEach(t=>pin(t,+t.getAttribute("x"),+t.getAttribute("y")));
gXL.querySelectorAll(".xlab").forEach(g=>{const r=g.querySelector("rect");pin(g,+r.getAttribute("x")+ +r.getAttribute("width")/2,+r.getAttribute("y")+9)});
const tremG=M.gTrain.querySelector(".train"),trem=el("g",{},tremG);[...tremG.querySelectorAll("circle")].forEach(c=>trem.appendChild(c));

function estica(k,sc){const f=k/sc-1;
  for(const e of ESTICA){const d=Math.max(0,e.hs*f),s=e.s;
    if(s.g==="hub"){e.body.setAttribute("r",20+d);e.halo.setAttribute("r",26+d)}
    else{const pad=s.g==="hubpill"?8:10;e.body.setAttribute("y",s.y1-pad-d);e.body.setAttribute("height",s.y2-s.y1+2*pad+2*d);e.halo.setAttribute("r",(s.g==="hubpill"?34:e.hs+16)+d)}
    for(const x of e.txt){const off=x.y-e.cy;x.t.setAttribute("y",Math.abs(off)>e.hs?x.y+Math.sign(off)*d:x.y)}}}

/* ---------- câmera: centro no mapa e escala k ---------- */
let cam={x:700,y:380,k:1},voo=0;
const tela=()=>({w:vista.clientWidth||1,h:vista.clientHeight||1});
/* quanto da vista a ficha cobre quando fica sobre o mapa (no celular ela vai embaixo) */
const folga=()=>getComputedStyle(P).position==="absolute"?Math.max(0,vista.offsetWidth-P.offsetLeft+6):0;
function enquadra(b,kmin,kmax,m=72){const t=tela(),f=folga(),px=Math.min(m,t.w*.08),py=Math.min(m*.67,t.h*.08),livre=t.w-f-2*px;
  const k=Math.max(kmin,Math.min(kmax,livre/Math.max(1,b.x1-b.x0),(t.h-2*py)/Math.max(1,b.y1-b.y0)));
  /* se não cabe inteira (celular), a câmera fica no começo, onde está o primeiro passo */
  return{x:(b.x1-b.x0)*k>livre?b.x0+(t.w/2-px)/k:(b.x0+b.x1)/2+f/2/k,y:(b.y0+b.y1)/2,k}}
/* a trilha inteira vai do primeiro ao último passo do itinerário */
const BB={};
for(const L in D.ALL){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const raw of D.ALL[L]){const[x,y]=M.center(M.base(raw));x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
  if(L==="sprint"){const g=D.ROUTES.sprint.ring;y1=Math.max(y1,g.cy+g.r)}
  BB[L]={x0,y0,x1,y1}}
function alvo(){
  if(ST.st){const[x,y]=M.center(ST.st);return{x:x+folga()/2/K_ESTACAO,y,k:K_ESTACAO}}
  if(ST.line)return enquadra(BB[ST.line],K_TRILHA[0],K_TRILHA[1],32);
  /* a visão geral já inclui os rótulos na caixa: margem pequena */
  return enquadra(GERAL,0,K_TRILHA[1],20)}

function aplica(){
  const t=tela(),k=cam.k,w=t.w/k,h=t.h/k,s=Math.min(1,Math.max(S_MIN,k)),z=s/k;
  svg.setAttribute("viewBox",`${(cam.x-w/2).toFixed(2)} ${(cam.y-h/2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
  svg.style.setProperty("--s",s.toFixed(3));svg.classList.toggle("mini",k<S_MIN);
  for(const l of [FIXAS,DYN,VIAS])for(const p of l)p.el.setAttribute("transform",p.o?`translate(${p.x} ${p.y}) scale(${z})`:`translate(${p.x*(1-z)} ${p.y*(1-z)}) scale(${z})`);
  trem.setAttribute("transform",`scale(${z})`);
  const mw=(13*z).toFixed(3);for(const m of MKS){m.setAttribute("markerWidth",mw);m.setAttribute("markerHeight",mw)}
  ponto.setAttribute("r",(1.3/k).toFixed(3));
  estica(k,s);
}

/* voo de câmera: afasta, desloca e aproxima numa curva suave (van Wijk e Nuij, como o d3.interpolateZoom) */
function interp(a,b){const R=Math.SQRT2,dx=b[0]-a[0],dy=b[1]-a[1],d2=dx*dx+dy*dy;
  if(d2<1e-9){const S=Math.log(b[2]/a[2])/R;return{S,f:t=>[a[0]+t*dx,a[1]+t*dy,a[2]*Math.exp(R*t*S)]}}
  const d1=Math.sqrt(d2),b0=(b[2]*b[2]-a[2]*a[2]+4*d2)/(2*a[2]*2*d1),b1=(b[2]*b[2]-a[2]*a[2]-4*d2)/(2*b[2]*2*d1),
    r0=Math.log(Math.sqrt(b0*b0+1)-b0),r1=Math.log(Math.sqrt(b1*b1+1)-b1),S=(r1-r0)/R,c0=Math.cosh(r0);
  return{S,f:t=>{const s=t*S,u=a[2]/(2*d1)*(c0*Math.tanh(R*s+r0)-Math.sinh(r0));return[a[0]+u*dx,a[1]+u*dy,a[2]*c0/Math.cosh(R*s+r0)]}}}
const duracao=a=>{if(M.reduce())return 0;const t=tela();return Math.min(1400,Math.max(520,Math.abs(interp([cam.x,cam.y,t.w/cam.k],[a.x,a.y,t.w/a.k]).S)*850))};
function voa(a,dur){cancelAnimationFrame(voo);if(!dur){cam=a;aplica();return}
  const t=tela(),I=interp([cam.x,cam.y,t.w/cam.k],[a.x,a.y,t.w/a.k]),t0=performance.now();
  (function passo(now){const u=Math.min(1,(now-t0)/dur),e=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2,p=I.f(e);
    cam={x:p[0],y:p[1],k:t.w/p[2]};aplica();if(u<1)voo=requestAnimationFrame(passo)})(t0)}

/* o trem puxa a câmera junto */
H.follow=(x,y)=>{cancelAnimationFrame(voo);cam.x+=(x+folga()/2/cam.k-cam.x)*.14;cam.y+=(y-cam.y)*.14;aplica()};

/* ---------- fases: 0 visão geral, 1 trilha inteira, 2 estação ---------- */
const onde=()=>!ST.line?{it:[],i:-1}:ST.st?M.idxIn(ST.line,ST.st):{it:M.active(M.itinerary(ST.line)),i:-1};
function anda(d){const L=ST.line;if(!L)return;ST.touring=false;const{it,i}=onde();
  if(!ST.st||i<0){if(d>0&&it.length)M.pick(it[0].id,L,0);else M.setLine(null);return}
  const j=i+d;if(j>=0&&j<it.length)M.go(it[j].id);else M.setLine(L)}
/* a barra de fases só existe depois de escolhida uma linha */
function barra(){const L=ST.line;passos.hidden=!L;
  if(!L){passos.innerHTML="";return}
  const{it,i}=onde(),nome=x=>esc(D.S[x.id].nome),naEst=!!ST.st&&i>=0;
  const ant=!naEst?"Visão geral":i>0?nome(it[i-1]):"Linha inteira";
  const prox=!naEst?(it.length?"Começar: "+nome(it[0]):""):i<it.length-1?nome(it[i+1]):"Linha inteira";
  passos.innerHTML=`<button type="button" class="ant home" data-home title="Visão geral" aria-label="Visão geral"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/></svg></button>`+
    `<button type="button" class="ant" data-p="-1" title="Fase anterior (←)">←<span>${ant}</span></button>`+
    `<span class="dz-onde">${naEst?`passo ${i+1} de ${it.length}`:`${it.length} estações`}</span>`+
    (prox?`<button type="button" class="prox" data-p="1" title="Próxima fase (→)" style="--tc:${cv(D.LINES[L].c)}"><span>${prox}</span>→</button>`:"")}
passos.addEventListener("click",e=>{if(e.target.closest("[data-home]")){ST.touring=false;M.setLine(null);return}
  const b=e.target.closest("[data-p]");if(b)anda(+b.dataset.p)});

/* ---------- a cada mudança do mapa: foco, camadas, navegação e câmera ---------- */
let VIASkey="";
function vias(){const key=`${ST.line}|${ST.st}|${ST.sen}|${ST.tr}`;if(key===VIASkey)return;VIASkey=key;
  for(const v of VIAS)v.el.remove();VIAS=[];if(!ST.st||!ST.line)return;
  const{it,i}=M.idxIn(ST.line,ST.st);if(i<0)return;
  for(const[a,b]of[[it[i-1],it[i]],[it[i],it[i+1]]]){if(!a||!b)continue;const txt=M.viaLabel(ST.line,a.id,b.id);if(!txt)continue;
    /* sobre o trilho, entre as duas estações: o texto cabe no vão que elas deixam na aproximação da estação */
    const[x1,y1]=M.center(a.id),[x2,y2]=M.center(b.id),max=Math.max(8,Math.floor((Math.hypot(x2-x1,y2-y1)*K_ESTACAO-52)/6.9)-2);
    const g=el("g",{class:"dz-via"},gVia);el("title",{},g).textContent=txt;
    const r=el("rect",{rx:"8",height:"22",y:"-11"},g),t=el("text",{"text-anchor":"middle",y:"4"},g);t.textContent="→ "+(txt.length>max?txt.slice(0,max-1)+"…":txt);
    const w=t.getComputedTextLength()+18;r.setAttribute("x",-w/2);r.setAttribute("width",w);
    VIAS.push({el:g,x:(x1+x2)/2,y:(y1+y2)/2,o:true})}}
function dyn(){DYN=[...gDynL.querySelectorAll(".xlab")].map(g=>{const r=g.querySelector("rect");return{el:g,x:+r.getAttribute("x")+ +r.getAttribute("width")/2,y:+r.getAttribute("y")+9}})}
/* o endereço guarda a fase; num contexto em que o histórico é bloqueado, o mapa segue sem ele */
function hash(){const h=ST.st?`${ST.line||"x"}.${ST.st}`:ST.line||"";
  try{if(decodeURIComponent(location.hash.slice(1))!==h)history.replaceState(null,"",location.pathname+location.search+(h?"#"+h:""))}catch(e){}}
let chave=null;
H.afterView=()=>{
  const L=ST.line,f=ST.st?2:L?1:0;svg.classList.toggle("foco",!!L);
  for(const k in M.TRACK){const fora=L&&k!==L;M.TRACK[k].style.opacity=fora?".16":"";CAS[k].style.opacity=fora?"0":""}
  M.gRows.querySelectorAll("text[data-l]").forEach(t=>t.classList.toggle("dz-off",!!L&&!t.dataset.l.split(" ").includes(L)));
  /* na trilha inteira, o primeiro passo pulsa: é para onde o → leva */
  const ini=f===1?onde().it[0]:null;
  M.gSt.querySelectorAll(".st").forEach(g=>{g.classList.toggle("inicio",!!ini&&g.dataset.id===ini.id);g.setAttribute("tabindex",g.classList.contains("dim")?"-1":"0")});
  dyn();vias();barra();
  svg.classList.remove("f0","f1","f2");svg.classList.add("f"+f);
  const c=`${L||""}|${ST.st||""}`;
  if(c===chave){aplica();return}
  /* na carga, o endereço é lido (#linha ou #linha.estacao), não reescrito */
  const prim=chave===null;chave=c;if(!prim)hash();
  const a=alvo(),dur=prim?0:duracao(a);
  svg.style.setProperty("--dv",(dur/1000*.8).toFixed(3)+"s");voa(a,dur)};
/* ---------- teclado: → e ← andam pelas fases enquanto o mapa está na tela; Esc volta um nível ---------- */
document.addEventListener("keydown",e=>{if(e.target.closest("input,textarea,select"))return;
  const r=vista.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
  if((e.key==="ArrowRight"||e.key==="ArrowLeft")&&ST.line){e.preventDefault();e.stopImmediatePropagation();anda(e.key==="ArrowRight"?1:-1)}
  else if(e.key==="Escape"){ST.touring=false;if(ST.st)M.setLine(ST.line);else if(ST.line)M.setLine(null)}},true);

new ResizeObserver(()=>{if(chave===null)return;cancelAnimationFrame(voo);cam=alvo();aplica()}).observe(vista);
if(document.fonts)document.fonts.ready.then(aplica);
M.view();M.panel();
{const h=decodeURIComponent(location.hash.slice(1));if(D.LINES[h])M.setLine(h)}
})();
