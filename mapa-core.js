(function(){
"use strict";
const D=window.SABIA;
if(!document.getElementById("map"))return;
const H=()=>window.SABIA_HOOKS||{};
const NS="http://www.w3.org/2000/svg";
const $=(s,r=document)=>r.querySelector(s);
const reduce=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
const cv=v=>`var(${v})`;
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const RX=/(\[[A-Z]+\]|\.(?:kiro|sabia|opencode)\/(?:[\w.\/*-]|&lt;|&gt;)*|(?:[\w.\/*-]|&lt;|&gt;)+\.(?:md|json|csv|sh|py)\b|\bsa-[a-z]+(?:\.[a-z-]+){0,2}|elm_[a-z_]+|gitlab_[a-z_]+)/g;
const fmt=t=>esc(t).replace(RX,"<code>$1</code>");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

const ST={line:null,st:null,sen:null,tr:D.ROTA0||"padrao",art:"sim",zoom:1,touring:false};
const aviso=()=>D.AVISO?D.AVISO(ST):null;
const rotaNome=()=>((D.ROTAS||[]).find(x=>x[0]===ST.tr)||[,ST.tr])[1];
window.SABIA_STATE=ST;
const val=(v)=>typeof v==="function"?v(ST):v;

/* ---------- geometria ---------- */
function rpath(pts,r=16){
  let d=`M${pts[0][0]},${pts[0][1]}`;
  for(let i=1;i<pts.length-1;i++){
    const [x0,y0]=pts[i-1],[x1,y1]=pts[i],[x2,y2]=pts[i+1];
    const l1=Math.hypot(x1-x0,y1-y0),l2=Math.hypot(x2-x1,y2-y1),rr=Math.min(r,l1/2,l2/2);
    d+=` L${x1-(x1-x0)/l1*rr},${y1-(y1-y0)/l1*rr} Q${x1},${y1} ${x1+(x2-x1)/l2*rr},${y1+(y2-y1)/l2*rr}`;
  }
  const p=pts[pts.length-1];return d+` L${p[0]},${p[1]}`;
}
const ringD=({cx,cy,r})=>`M${cx},${cy-r} A${r},${r} 0 1 1 ${cx},${cy+r} A${r},${r} 0 1 1 ${cx},${cy-r}`;
function center(id){const s=D.S[id];if(s.g==="pill"||s.g==="hubpill")return[s.x,(s.y1+s.y2)/2];return[s.x,s.y]}

/* membros de cada linha, a partir dos itinerários */
const base=id=>id.split("@")[0];
const MEMB={};
for(const L in D.ALL)for(const raw of D.ALL[L]){const id=base(raw);(MEMB[id]=MEMB[id]||[]).includes(L)||MEMB[id].push(L)}
const LORDER=Object.keys(D.LINES);
const membOf=id=>(MEMB[id]||[]).slice().sort((a,b)=>LORDER.indexOf(a)-LORDER.indexOf(b));

/* ---------- SVG ---------- */
const svg=$("#map");
function el(t,a={},p=svg){const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);p.appendChild(n);return n}
const defs=el("defs");
const MK={loop:"--orange",alt:"--navy",skip:"--l-rapida",xfer:"--yellow"};
for(const k in MK){const m=el("marker",{id:"arr-"+k,viewBox:"0 0 10 10",refX:"7",refY:"5",markerWidth:"5",markerHeight:"5",orient:"auto-start-reverse"},defs);el("path",{d:"M0,0 L10,5 L0,10 z",fill:cv(MK[k])},m)}
const gRows=el("g"),gConn=el("g"),gTracks=el("g"),gX=el("g"),gDyn=el("g"),gFlow=el("g"),gSt=el("g"),gXL=el("g"),gDynL=el("g"),gTrain=el("g");
for(const d of D.DECOR||[])el("path",{d:rpath(d.pts,6),class:d.cls||"decor"},gConn);
for(const t of D.TEXTS)el("text",{x:t.x,y:t.y,class:t.cls||"rowlbl","text-anchor":t.a||"start"},gRows).textContent=t.t;

const TRACK={},FLOW={};
for(const L in D.ROUTES){
  const r=D.ROUTES[L],d=r.ring?ringD(r.ring):rpath(r.pts,r.rad||16);
  TRACK[L]=el("path",{d,class:"track"+(D.LINES[L].dash?" dash":""),stroke:cv(D.LINES[L].c),"data-line":L},gTracks);
  FLOW[L]=el("path",{d,class:"flow"},gFlow);
}
if(D.TRUNK)el("path",{d:rpath(D.TRUNK),class:"track",stroke:cv("--navy"),"stroke-width":"12"},gTracks);

/* transições desenhadas (laços, desvios, baldeações) */
for(const e of D.EXTRA){
  if(!e.pts&&!e.d)continue;
  const g=el("g",{class:`xedge x-${e.kind}`,"data-e":e.id},gX);
  const d=e.d||rpath(e.pts,e.rad||14);
  e.el=el("path",{d,class:"xpath","marker-end":`url(#arr-${e.kind})`},g);
  if(e.lp){const lg=el("g",{class:`xlab x-${e.kind}`},gXL);e.lab_el=lg;const txt=val(e.short||e.lab);const w=Math.max(30,txt.length*5.6+14);
    el("rect",{x:e.lp[0]-w/2,y:e.lp[1]-9,width:w,height:18,rx:6},lg);const tt=el("text",{x:e.lp[0],y:e.lp[1]+3.5,"text-anchor":"middle"},lg);tt.textContent=txt;e.lab_t=tt;e.lab_r=lg.querySelector("rect")}
  e.g=g;
}

/* estações */
for(const id in D.S){
  const s=D.S[id];const g=el("g",{class:`st g-${s.g}`,tabindex:"0",role:"button","aria-label":`${s.nome} — ${s.sk||""}`,"data-id":id},gSt);
  const [cx,cy]=center(id);
  el("circle",{cx,cy,r:s.g==="hubpill"?34:s.g==="hub"?26:s.g==="pill"?((s.y2-s.y1)/2+16):18,class:"halo"},g);
  if(s.g==="hub")el("circle",{cx:s.x,cy:s.y,r:20,class:"body"},g);
  else if(s.g==="hubpill")el("rect",{x:s.x-15,y:s.y1-8,width:30,height:s.y2-s.y1+16,rx:15,class:"body"},g);
  else if(s.g==="pill")el("rect",{x:s.x-10,y:s.y1-10,width:20,height:s.y2-s.y1+20,rx:10,class:"body"},g);
  else if(s.g==="gate"){el("rect",{x:s.x-13,y:s.y-13,width:26,height:26,rx:3,transform:`rotate(45 ${s.x} ${s.y})`,class:"body"},g);el("text",{x:s.x,y:s.y+3.2,"text-anchor":"middle",class:"gtxt"},g).textContent="GATE"}
  else el("circle",{cx:s.x,cy:s.y,r:s.term?10:8.5,class:"body"},g);
  const top=s.g==="pill"||s.g==="hubpill"?s.y1-(s.g==="hubpill"?8:10):s.y-(s.g==="gate"?18:s.g==="hub"?20:9);
  const bot=s.g==="pill"||s.g==="hubpill"?s.y2+(s.g==="hubpill"?8:10):s.y+(s.g==="gate"?18:s.g==="hub"?20:9);
  let tx=s.x,ty,an="middle";const L=s.lab||"below";
  if(L==="above")ty=top-22;else if(L==="below")ty=bot+17;
  else if(L==="left"){tx=s.x-20;ty=cy-2;an="end"}else if(L==="right"){tx=s.x+20;ty=cy-2;an="start"}
  else if(L==="in-left"){tx=s.x-16;ty=cy-2;an="end"}
  if(s.dx)tx+=s.dx;if(s.dy)ty+=s.dy;if(s.an)an=s.an;
  el("text",{x:tx,y:ty,"text-anchor":an,class:"name halo-t"},g).textContent=s.nome;
  if(s.sk&&!s.nosk)el("text",{x:tx,y:ty+13,"text-anchor":an,class:"skill halo-t"},g).textContent=s.sk;
  g.addEventListener("click",()=>pick(id));
  g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pick(id)}});
}

/* trem */
const train=el("g",{class:"train"},gTrain);
const tg=el("circle",{r:16,class:"tg"},train),tb=el("circle",{r:11,class:"tb"},train),tc=el("circle",{r:4.5,class:"tc"},train);
function paint(L){const c=cv(D.LINES[L]?D.LINES[L].c:"--navy");tb.setAttribute("stroke",c);tc.setAttribute("fill",c);tg.setAttribute("stroke",c)}

/* posição de cada estação ao longo da linha */
const POS={};
function measure(){for(const L in D.ALL){const p=TRACK[L];if(!p)continue;const T=p.getTotalLength(),N=Math.ceil(T/3),pts=[];
  for(let i=0;i<=N;i++){const q=p.getPointAtLength(T*i/N);pts.push([q.x,q.y])}
  let k=0;POS[L]=D.ALL[L].map(raw=>{const c=center(base(raw));let b=k,bd=1e12;for(let i=k;i<pts.length;i++){const d=(pts[i][0]-c[0])**2+(pts[i][1]-c[1])**2;if(d<bd-0.01){bd=d;b=i}}k=b;return T*b/N})}}
measure();

function animateAlong(path,a,b,L){return new Promise(res=>{
  paint(L);const q0=path.getPointAtLength(a);train.setAttribute("transform",`translate(${q0.x},${q0.y})`);
  if(reduce()){const q=path.getPointAtLength(b);train.setAttribute("transform",`translate(${q.x},${q.y})`);train.classList.add("on");setTimeout(()=>{train.classList.remove("on");res()},250);return}
  train.classList.add("on");const dur=Math.min(3200,Math.max(1200,Math.abs(b-a)*4.5)),t0=performance.now();
  (function step(t){const k=Math.min(1,(t-t0)/dur),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,q=path.getPointAtLength(a+(b-a)*e);
    train.setAttribute("transform",`translate(${q.x},${q.y})`);follow(q.x,q.y);if(k<1)requestAnimationFrame(step);else{setTimeout(()=>train.classList.remove("on"),500);res()}})(t0);
})}

/* ---------- itinerário ---------- */
function itinerary(L){
  const out=[];const all=D.ALL[L]||[];
  all.forEach((raw,i)=>{const id=base(raw);const sk=D.SKIP[`${L}:${id}`]||D.SKIP[id];const why=sk?sk(ST):null;out.push({raw,id,i,skip:why})});
  return out;
}
const active=it=>it.filter(x=>!x.skip);
function idxIn(L,id){const it=active(itinerary(L));if(ST.k!=null&&it[ST.k]&&it[ST.k].id===id)return{it,i:ST.k};let i=it.findIndex(x=>x.id===id);return{it,i}}
function viaLabel(L,a,b){const v=D.VIA[`${L}:${a}>${b}`]||D.VIA[`${a}>${b}`];return v?val(v):""}
function okEdge(e){return!e.when||e.when(ST)}
function edgeFor(a,b,L){return D.EXTRA.find(e=>e.f===a&&e.t===b&&(!e.lines||e.lines.includes(L))&&okEdge(e))}

/* ---------- estado e vista ---------- */
function setLine(L,keepSt){ST.line=L;if(!keepSt)ST.st=null;view();panel()}
function pick(id,L,k){
  ST.k=k==null?null:k;
  const m=membOf(id);
  if(L)ST.line=L;else if(!ST.line||!m.includes(ST.line))ST.line=m[0]||null;
  ST.st=id;view();panel();
}
function view(){
  const L=ST.line;
  for(const k in TRACK){const t=TRACK[k];t.setAttribute("stroke",cv(D.LINES[k].c));t.classList.toggle("on",k===L);
    t.style.opacity=L&&k!==L?.14:"";
    const blocked=k==="afk"&&ST.sen==="jr";t.classList.toggle("blocked",blocked&&(!L||L==="afk"));
    FLOW[k].classList.toggle("on",k===L&&!blocked)}
  const it=L?itinerary(L):[];
  document.querySelectorAll("#map .st").forEach(g=>{const id=g.dataset.id;const m=membOf(id);
    const inL=!L||m.includes(L)||(D.S[id].also||[]).includes(L);
    const sk=L&&it.find(x=>x.id===id&&x.skip);
    g.classList.toggle("dim",!inL);g.classList.toggle("skip",!!sk&&inL);g.classList.toggle("sel",id===ST.st)});
  for(const e of D.EXTRA){if(!e.g)continue;const vis=!L||!e.lines||e.lines.includes(L);
    e.g.classList.toggle("hid",!vis||!okEdge(e));e.g.classList.toggle("na",false);
    if(e.lab_el){e.lab_el.style.opacity=vis&&okEdge(e)?1:0;const t=val(e.short||e.lab);if(e.lab_t.textContent!==t){e.lab_t.textContent=t;const w=Math.max(30,t.length*5.6+14);e.lab_r.setAttribute("width",w);e.lab_r.setAttribute("x",e.lp[0]-w/2)}}}
  document.querySelectorAll("#lineChips .chip").forEach(c=>c.setAttribute("aria-pressed",c.dataset.k===L));
  document.querySelectorAll("#senChips .chip").forEach(c=>c.setAttribute("aria-pressed",(c.dataset.k||null)===(ST.sen||null)||(c.dataset.k==="all"&&!ST.sen)));
  document.querySelectorAll("#trChips .chip").forEach(c=>{c.setAttribute("aria-pressed",c.dataset.k===ST.tr);c.classList.toggle("na",!!L&&!["hitl","afk"].includes(L))});
  document.querySelectorAll("#artChips .chip").forEach(c=>{c.setAttribute("aria-pressed",c.dataset.k===ST.art);c.classList.toggle("na",!!L&&!["hitl","afk"].includes(L))});
  document.querySelectorAll(".svc").forEach(b=>b.classList.remove("sel"));
  drawDyn();
  phases();
  H().afterView&&H().afterView();
}

/* arcos das transições da linha e da estação escolhidas */
function anchor(id){return center(id)}
function arcOf(e){const[x1,y1]=anchor(e.f),[x2,y2]=anchor(e.t);const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1;const nx=-dy/len,ny=dx/len;
  const b=(e.bend||1)*Math.min(160,Math.max(46,len*.3));const cx=(x1+x2)/2+nx*b,cy=(y1+y2)/2+ny*b;
  return{d:`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`,mx:.25*x1+.5*cx+.25*x2,my:.25*y1+.5*cy+.25*y2}}
function drawDyn(){gDyn.innerHTML="";gDynL.innerHTML="";const L=ST.line;if(!L)return;
  for(const e of D.EXTRA){if(e.pts||e.kind==="xfer")continue;
    const rel=(!e.lines||e.lines.includes(L))||e.toLine===L;if(!rel)continue;
    const hot=ST.st&&(e.f===ST.st||e.t===ST.st);if(ST.st&&!hot)continue;
    const ok=okEdge(e);if(!ok)continue;const a=arcOf(e);
    const g=el("g",{class:`xedge dyn x-${e.kind}${hot?" hot":""}${ok?"":" na"}`},gDyn);
    e.el=el("path",{d:a.d,class:"xpath","marker-end":`url(#arr-${e.kind})`},g);
    if(hot&&ok){const t=val(e.short||e.lab);const txt=t.length>34?t.slice(0,33)+"…":t;const w=txt.length*5.6+14;const lg=el("g",{class:`xlab x-${e.kind}`},gDynL);
      el("rect",{x:a.mx-w/2,y:a.my-9,width:w,height:18,rx:6},lg);el("text",{x:a.mx,y:a.my+3.5,"text-anchor":"middle"},lg).textContent=txt}}}

/* rolagem do mapa ampliado para acompanhar o trem ou a estação */
const box=$(".mapscroll");
function follow(x,y){if(H().follow){H().follow(x,y);return}if(ST.zoom<=1||!box)return;const r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal,sx=r.width/vb.width;
  const px=x*sx,py=y*sx;if(px<box.scrollLeft+80||px>box.scrollLeft+box.clientWidth-80)box.scrollLeft=px-box.clientWidth/2;
  if(py<box.scrollTop+60||py>box.scrollTop+box.clientHeight-60)box.scrollTop=py-box.clientHeight/2}

/* ---------- movimento entre estações ---------- */
let busy=false;
async function go(to,opt={}){
  if(busy)return;busy=true;
  const L=opt.line||ST.line,from=ST.st;
  let nk=null;if(from&&L&&!opt.toLine){const r=idxIn(L,from);if(r.i>=0&&r.it[r.i+1]&&r.it[r.i+1].id===to)nk=r.i+1;else if(r.i>0&&r.it[r.i-1].id===to)nk=r.i-1}
  try{
    const e=opt.edge||(from?edgeFor(from,to,L):null);
    if(e&&e.el&&!opt.track){await animateAlong(e.el,0,e.el.getTotalLength(),L)}
    else if(from&&L&&TRACK[L]){
      const all=D.ALL[L];let ia=-1,ib=-1;
      const fullA=itinerary(L);const ai=a=>{const act=fullA.filter(x=>!x.skip);return act[a]?act[a].i:-1};
      const r0=idxIn(L,from);if(r0.i>=0)ia=ai(r0.i);
      if(ia<0)for(let i=0;i<all.length;i++){if(base(all[i])===from){ia=i;break}}
      if(nk!=null)ib=ai(nk);
      if(ib<0)for(let i=Math.max(0,ia+1);i<all.length;i++){if(base(all[i])===to){ib=i;break}}
      if(ia<0||ib<0){for(let i=all.length-1;i>=0;i--){if(base(all[i])===to){ib=i;break}}}
      if(ia>=0&&ib>=0&&POS[L])await animateAlong(TRACK[L],POS[L][ia],POS[L][ib],L);
    }
    pick(to,opt.toLine||L,opt.toLine?null:nk);
  }finally{busy=false}
}
async function tour(){
  if(ST.touring){ST.touring=false;panel();return}
  if(!ST.line)return;ST.touring=true;
  let{it,i}=idxIn(ST.line,ST.st);if(i<0){pick(it[0].id,ST.line);i=0;await sleep(700)}
  while(ST.touring){const r=idxIn(ST.line,ST.st);if(r.i<0||r.i>=r.it.length-1)break;await go(r.it[r.i+1].id);if(H().gate){const ok=await H().gate(ST.st);if(!ok||!ST.touring)break;if(ok==="aprovado")continue}for(let w=0;w<(H().pausa||60)&&ST.touring;w++)await sleep(100)}
  ST.touring=false;panel();
}

/* ---------- ficha lateral ---------- */
const P=$("#panel");
function info(id){const s=D.S[id];const ctx=(s.ctx&&ST.line&&s.ctx[ST.line])||{};const tr=(s.trv&&ST.tr&&s.trv[ST.tr]&&["hitl","afk"].includes(ST.line))?s.trv[ST.tr]:{};return Object.assign({},s,ctx,tr)}
function lbar(L){return `--lc:${cv(D.LINES[L].c)}`}
function trBtn(o){return `<button class="tr k-${o.kind||"main"}${o.na?" na":""}${o.back?" back":""}" ${o.na?"disabled":""} data-to="${o.to||""}" data-edge="${o.edge||""}" ${o.toLine?`data-line="${o.toLine}"`:""} ${o.kind==="main"&&o.L?`style="--tc:${cv(D.LINES[o.L].c)}"`:""}><span class="ico">${o.ico||"→"}</span><b>${esc(o.title)}</b><span>${fmt(o.sub||"")}</span></button>`}
function panel(){const h=H();if(!(h.panel&&h.panel(ST)))panel0();h.afterPanel&&h.afterPanel()}
function panel0(){
  P.style.cssText="";
  if(!ST.st&&!ST.line){P.innerHTML=D.INTRO;bind();return}
  if(!ST.st){lineView(ST.line);return}
  stationView(ST.st);
}
function lineView(L){
  const Ln=D.LINES[L];const it=itinerary(L);
  const warn=aviso();
  P.innerHTML=`<div class="ph" style="${lbar(L)}"><div class="ltabs"><button aria-pressed="true" style="--c:${cv(Ln.c)}"><i></i>${esc(Ln.nome)}</button></div>
  <h3>${esc(Ln.nome)}</h3><div class="sk">${esc(Ln.sub||"")}</div>
  <div class="nav"><button class="play" data-act="tour">${ST.touring?"❚❚ Pausar":"▶ Percorrer a linha"}</button><span class="sp"></span></div></div>
  <div class="pb fade">${warn?`<div class="note warn">${fmt(warn)}</div>`:""}
  <div class="linecard">${fmt(Ln.quando)}</div>${senStrip(Ln.sen)}
  <div class="blk"><h4>Itinerário${["hitl","afk"].includes(L)?` · rota ${esc(rotaNome())}`:""}${ST.sen&&D.SENNOME?` · ${D.SENNOME[ST.sen]}`:""}</h4>${itinHTML(L,it,null)}</div></div>`;
  bind();
}
function itinHTML(L,it,cur){
  let prev=null,k=-1;const curK=ST.k;
  return `<ol class="itin" style="${lbar(L)}">`+it.map(x=>{const s=D.S[x.id];
    const via=!x.skip&&prev?viaLabel(L,prev,x.id):"";if(!x.skip){prev=x.id;k++}
    const isCur=x.id===cur&&!x.skip&&(curK==null?(cur&&!it.slice(0,x.i).some(y=>y.id===cur&&!y.skip)):k===curK);
    return `<li class="${x.skip?"skip":""}${isCur?" cur":""}${s.g==="gate"?" gate":""}"><span class="dot"></span>${via?`<span class="via">${esc(via)}</span>`:""}<button data-to="${x.id}" data-line="${L}" ${x.skip?"":`data-k="${k}"`}><b>${esc(s.nome)}</b><small>${x.skip?esc(x.skip):esc(s.sk||"")}</small></button></li>`}).join("")+`</ol>`;
}
function senStrip(n){if(!n)return"";const k=["jr","pl","sr"];
  return `<div class="blk"><h4>Senioridade de quem implementa</h4><div class="senbox">${k.map(x=>`<div class="${ST.sen===x?"on":ST.sen?"off":""}"><b>${D.SENNOME[x]}</b>${fmt(val(n[x]))}</div>`).join("")}</div></div>`}
function stationView(id){
  const L=ST.line;const s=info(id);const m=membOf(id).concat((D.S[id].also||[]).filter(x=>!membOf(id).includes(x)));
  const{it,i}=L?idxIn(L,id):{it:[],i:-1};
  const full=L?itinerary(L):[];
  const skipped=full.find(x=>x.id===id&&x.skip);
  const prevId=i>0?it[i-1].id:null,nextId=i>=0&&i<it.length-1?it[i+1].id:null;
  /* transições de saída */
  const outs=[];
  if(skipped)outs.push({kind:"alt",na:true,title:"Fora do itinerário",sub:skipped.skip});
  if(nextId){const e=edgeFor(id,nextId,L);outs.push({kind:e&&e.kind!=="loop"?e.kind:"main",L,to:nextId,title:D.S[nextId].nome,sub:(e?val(e.lab):"")||viaLabel(L,id,nextId)||D.S[nextId].sk,ico:e&&e.kind==="skip"?"⤳":"→"})}
  /* próxima estação pulada nesta linha, para mostrar o porquê */
  if(L){const fi=full.findIndex(x=>x.id===id);if(fi>=0)for(let j=fi+1;j<full.length&&full[j].skip;j++)outs.push({kind:"alt",na:true,title:D.S[full[j].id].nome,sub:full[j].skip,ico:"⊘"})}
  for(const e of D.EXTRA){if(e.f!==id)continue;if(e.lines&&L&&!e.lines.includes(L))continue;if(e.pts&&e.kind==="alt"&&e.t===nextId)continue;if(e.t===nextId&&okEdge(e))continue;
    const ok=okEdge(e);if(!ok)continue;outs.push({kind:e.kind,na:!ok,to:e.t,edge:e.id,toLine:e.toLine,title:(e.tname||D.S[e.t].nome),sub:ok?val(e.lab):(e.why?val(e.why):val(e.lab)),ico:e.kind==="loop"?"↺":e.kind==="xfer"?"⇄":e.kind==="skip"?"⤳":"↗"})}
  const ins=[];
  if(prevId)ins.push({back:true,to:prevId,title:D.S[prevId].nome,sub:viaLabel(L,prevId,id)||D.S[prevId].sk,ico:"←"});
  for(const e of D.EXTRA){if(e.t!==id||!okEdge(e)||e.f===prevId)continue;if(e.lines&&L&&!e.lines.includes(L)&&e.toLine!==L)continue;ins.push({back:true,to:e.f,edge:"",title:D.S[e.f].nome,sub:val(e.lab),ico:e.kind==="loop"?"↺":"←",toLine:e.fromLine||(e.lines&&!e.lines.includes(L)?e.lines[0]:L)})}
  const tabs=m.map(x=>`<button data-tab="${x}" aria-pressed="${x===L}" style="--c:${cv(D.LINES[x].c)}"><i></i>${esc(D.LINES[x].nome)}</button>`).join("");
  P.innerHTML=`<div class="ph" style="${L?lbar(L):""}"><div class="ltabs">${tabs}</div>
   <h3>${esc(s.nome)}</h3><div class="sk">${esc(s.sk||"")}</div>
   <div class="nav"><button data-to="${prevId||""}" ${prevId?"":"disabled"} aria-label="Estação anterior">◀</button><button data-to="${nextId||""}" ${nextId?"":"disabled"} aria-label="Próxima estação">▶</button>
   <span>${i>=0?`passo ${i+1} de ${it.length}`:skipped?"fora deste itinerário":""}</span><span class="sp"></span>${L?`<button class="play" data-act="tour">${ST.touring?"❚❚ Pausar":"▶ Percorrer"}</button>`:""}</div></div>
   <div class="pb fade">
   ${s.aviso?`<div class="note">${fmt(val(s.aviso))}</div>`:""}
   ${aviso()?`<div class="note warn">${fmt(aviso())}</div>`:""}
   <dl class="kv"><dt>Papel</dt><dd>${fmt(val(s.papel))}</dd><dt>Agente</dt><dd>${fmt(val(s.agente))}</dd><dt>Tarefa</dt><dd>${fmt(val(s.tarefa))}</dd>${s.fase?`<dt>Fase</dt><dd>${fmt(val(s.fase))}</dd>`:""}</dl>
   ${senStrip(s.sen)}
   <div class="blk"><h4>Transições</h4><div class="trans">${outs.map(trBtn).join("")||`<span class="hint">Fim da linha.</span>`}</div></div>
   ${ins.length?`<div class="blk"><h4>Chega de</h4><div class="trans">${ins.map(trBtn).join("")}</div></div>`:""}
   <div class="blk"><h4>O que acontece</h4><ul>${val(s.faz).map(x=>`<li>${fmt(val(x))}</li>`).join("")}</ul></div>
   <div class="blk"><h4>Arquivos</h4><ul>${val(s.arq).map(x=>`<li>${fmt(val(x))}</li>`).join("")}</ul></div>
   <div class="blk elm"><h4>${["hitl","afk"].includes(L)?"ELM e PR":"ELM"}</h4><ul>${val(s.elm).map(x=>`<li>${fmt(val(x))}</li>`).join("")}</ul></div>
   ${L?`<div class="blk"><h4>Itinerário · ${esc(D.LINES[L].nome)}</h4>${itinHTML(L,full,id)}</div>`:""}
   </div>`;
  bind();
}
function bind(){
  P.querySelectorAll("[data-to]").forEach(b=>b.addEventListener("click",()=>{const to=b.dataset.to;if(!to)return;const eid=b.dataset.edge;const e=eid?D.EXTRA.find(x=>x.id===eid):null;
    const tl=b.dataset.line;
    if(b.closest(".itin")){pick(to,tl,b.dataset.k!=null?+b.dataset.k:null);return}
    go(to,{edge:e,toLine:tl||(e&&e.toLine)})}));
  P.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{ST.line=b.dataset.tab;view();panel()}));
  P.querySelectorAll("[data-act=tour]").forEach(b=>b.addEventListener("click",tour));
  P.querySelectorAll("[data-line-pick]").forEach(b=>b.addEventListener("click",()=>setLine(b.dataset.linePick)));
  P.querySelectorAll("[data-sen-pick]").forEach(b=>b.addEventListener("click",()=>{ST.sen=b.dataset.senPick;view();panel()}));
}

/* ---------- controles ---------- */
const lc=$("#lineChips");
if(lc)for(const k in D.LINES){const b=document.createElement("button");b.className="chip";b.dataset.k=k;b.style.setProperty("--c",cv(D.LINES[k].c));
  b.innerHTML=`<span class="sw${D.LINES[k].dash?" dash":""}"></span>${esc(D.LINES[k].nome)}`;b.setAttribute("aria-pressed","false");
  b.addEventListener("click",()=>{ST.touring=false;setLine(ST.line===k?null:k)});lc.appendChild(b)}
const sc=$("#senChips");
/* sem senioridade nos dados, a linha de controle some */
if(sc&&!D.SENNOME){sc.style.display="none";const lb=sc.previousElementSibling;if(lb&&lb.classList.contains("lbl"))lb.style.display="none"}
else if(sc)[["all","Todas"],["jr","Júnior"],["pl","Pleno"],["sr","Sênior"]].forEach(([k,n])=>{const b=document.createElement("button");b.className="chip snr";b.dataset.k=k;b.textContent=n;
  b.addEventListener("click",()=>{ST.sen=k==="all"?null:k;view();panel()});sc.insertBefore(b,sc.querySelector(".hint"))});
const tc2=$("#trChips");
if(tc2)(D.ROTAS||[["padrao","Padrão"],["rapida","Rápida"]]).forEach(([k,n])=>{const b=document.createElement("button");b.className="chip";b.dataset.k=k;b.style.setProperty("--c",cv(k==="rapida"||k==="trivial"?"--l-rapida":"--blue"));b.textContent=n;
  b.addEventListener("click",()=>{ST.tr=k;view();panel()});tc2.insertBefore(b,tc2.querySelector(".hint"))});
const ac=$("#artChips");
if(ac)[["sim","Com artefatos"],["nao","Sem artefatos"]].forEach(([k,n])=>{const b=document.createElement("button");b.className="chip";b.dataset.k=k;b.style.setProperty("--c",cv("--blue"));b.textContent=n;
  b.addEventListener("click",()=>{ST.art=k;view();panel()});ac.insertBefore(b,ac.querySelector(".hint"))});
document.querySelectorAll(".maptools button").forEach(b=>b.addEventListener("click",()=>{const z=b.dataset.z;ST.zoom=z==="in"?Math.min(2.2,ST.zoom+.4):z==="out"?Math.max(1,ST.zoom-.4):1;
  svg.style.width=(ST.zoom*100)+"%";svg.style.minWidth=(1040*ST.zoom)+"px";if(ST.st){const[x,y]=center(ST.st);setTimeout(()=>follow(x,y),380)}}));
document.addEventListener("keydown",e=>{if(e.target.closest("input,textarea"))return;if(!ST.st||!ST.line)return;
  const{it,i}=idxIn(ST.line,ST.st);if(e.key==="ArrowRight"&&i>=0&&i<it.length-1){e.preventDefault();go(it[i+1].id)}if(e.key==="ArrowLeft"&&i>0){e.preventDefault();pick(it[i-1].id)}});

/* serviços (fora das linhas) */
const sv=$("#services");
if(sv)for(const s of D.SERV){const b=document.createElement("button");b.className="svc";b.innerHTML=`<code>${esc(s.sk)}</code><b>${esc(s.nome)}</b><span>${esc(s.desc)}</span>`;
  b.addEventListener("click",()=>{ST.st=null;ST.line=null;ST.touring=false;view();b.classList.add("sel");
    P.innerHTML=`<div class="ph"><h3>${esc(s.nome)}</h3><div class="sk">${esc(s.sk)}</div></div><div class="pb fade"><dl class="kv"><dt>Papel</dt><dd>${fmt(s.papel)}</dd><dt>Agente</dt><dd>${fmt(s.agente)}</dd><dt>Tarefa</dt><dd>${fmt(s.tarefa)}</dd></dl>
    <div class="blk"><h4>O que acontece</h4><ul>${s.faz.map(x=>`<li>${fmt(x)}</li>`).join("")}</ul></div><div class="blk"><h4>Arquivos</h4><ul>${s.arq.map(x=>`<li>${fmt(x)}</li>`).join("")}</ul></div><div class="blk elm"><h4>ELM</h4><ul>${s.elm.map(x=>`<li>${fmt(x)}</li>`).join("")}</ul></div></div>`;bind()});sv.appendChild(b)}

function phases(){}
window.SABIA_PICK=(id,L)=>{pick(id,L);document.getElementById("mapa").scrollIntoView({behavior:reduce()?"auto":"smooth"})};
window.SABIA_SEN=(k)=>{ST.sen=k;view();panel();document.getElementById("mapa").scrollIntoView({behavior:reduce()?"auto":"smooth"})};
window.SABIA_LINE=(L)=>{setLine(L);document.getElementById("mapa").scrollIntoView({behavior:reduce()?"auto":"smooth"})};
window.SABIA_MAP={ST,D,svg,el,TRACK,FLOW,center,base,membOf,itinerary,active,idxIn,view,panel,pick,go,tour,setLine,info,fmt,esc,cv,val,sleep,reduce,P,gSt,gRows,gTracks,gTrain,lbar,trBtn,bind,edgeFor,viaLabel,okEdge};
view();panel();
{const h=decodeURIComponent(location.hash.slice(1)),m=h.match(/^([a-z]+)\.([\w@-]+)$/);
 if(m&&D.S[m[2]])setTimeout(()=>window.SABIA_PICK(m[2],D.LINES[m[1]]?m[1]:undefined),250);
 else if(/^sen-(jr|pl|sr)$/.test(h))setTimeout(()=>window.SABIA_SEN(h.slice(4)),250);}
})();
