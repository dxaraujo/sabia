/* seções abaixo do mapa: papéis, agentes, arquivos e gates; cada uma leva de volta ao mapa */
(function(){
"use strict";
const D=window.SABIA;
const $=(s,r=document)=>r.querySelector(s);
const cv=v=>`var(${v})`;
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const RX=/(\[[A-Z]+\]|\.kiro\/(?:[\w.\/*-]|&lt;|&gt;)*|(?:[\w.\/*-]|&lt;|&gt;)+\.(?:md|json|csv|sh|py)\b|\bsa-[a-z]+|elm_[a-z_]+|gitlab_[a-z_]+)/g;
const fmt=t=>esc(t).replace(RX,"<code>$1</code>");
const PICK=(id,L)=>window.SABIA_PICK?PICK(id,L):(location.href="index.html#"+encodeURIComponent((L||"x")+"."+id));
const SEN=(k)=>window.SABIA_SEN?SEN(k):(location.href="index.html#sen-"+k);
const set=(s,h)=>{const e=$(s);if(e)e.innerHTML=h};

set("#statuses",D.STATUSES);set("#elmbody",D.ELM_HTML);set("#sencards",D.SENCARDS);set("#golden",D.GOLDEN);

/* papéis */
const rolesEl=$("#roles");
if(rolesEl)for(const r of D.ROLES){const b=document.createElement("button");b.className="role";b.style.setProperty("--rc",cv(r.c));
  b.innerHTML=`<div class="top"><div><h3>${esc(r.nome)}</h3><div class="who">${esc(r.who)}</div></div><span class="tag">${esc(r.tarefa)}</span></div>
  <div class="rb"><ul>${r.faz.map(s=>`<li>${fmt(s)}</li>`).join("")}</ul><div><span class="tag">${esc(r.agente)}</span></div><span class="go">ver no mapa: ${esc(D.S[r.st].nome)} →</span></div>`;
  b.addEventListener("click",()=>PICK(r.st,r.line));rolesEl.appendChild(b)}

/* agentes */
const tb=$("#agents tbody");
if(tb)for(const a of D.AGENTS){const tr=document.createElement("tr");
  tr.innerHTML=`<td><code>${esc(a.id)}</code></td><td>${esc(a.quem)}</td><td>${a.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</td><td>${esc(a.sub)}</td><td><span class="pill ${a.pk}">${esc(a.push)}</span></td><td>${fmt(a.obs)}</td>`;tb.appendChild(tr)}

/* arquivos */
const tree=$("#tree"),fi=$("#fileinfo");
const BN={git:"git",local:"local",gen:"setup"},BL={git:"versionado no git",local:"local · fora do git",gen:"instalado pela setup"};
function build(nodes,parent){for(const n of nodes){
  if(n.d){const d=document.createElement("details");if(n.open)d.open=true;const s=document.createElement("summary");s.textContent=n.d;d.appendChild(s);build(n.c,d);parent.appendChild(d)}
  else{const b=document.createElement("button");b.className="f";b.innerHTML=`<span>${esc(n.f)}</span><span class="badge ${n.b}">${BN[n.b]}</span>`;
    b.addEventListener("click",()=>{tree.querySelectorAll(".f.sel").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");show(n)});parent.appendChild(b)}}}
function show(n){fi.innerHTML=`<span class="badge ${n.b}" style="margin:0;align-self:flex-start">${BL[n.b]}</span><h3>${esc(n.f)}</h3><p>${fmt(n.o)}</p>
  <div><div class="k">Quem escreve</div><p>${fmt(n.w)}</p></div><div><div class="k">Quando</div><p>${fmt(n.q)}</p></div>${n.st?`<button class="go" data-st="${n.st}">ver a estação no mapa</button>`:""}`;
  const g=fi.querySelector(".go");if(g)g.addEventListener("click",()=>PICK(n.st,n.line))}
if(tree){build(D.TREE,tree);
fi.innerHTML=`<h3 style="font-family:var(--display)">Escolha um arquivo</h3><p>A árvore mostra o projeto depois da setup. Cada arquivo diz quem o escreve e quando, e leva à estação do mapa que o grava. A pasta do produto aparece com o nome padrão, <code>.kiro/planejamento</code>.</p>
<div class="flowr"><span class="badge git" style="margin:0">git</span><em>registro e decisão</em><span class="badge local" style="margin:0">local</span><em>fora do git</em><span class="badge gen" style="margin:0">setup</span><em>configuração</em></div>`;

/* gates */
}
const gc=$("#gatecards");
if(gc)for(const g of D.GATES){const b=document.createElement("button");b.className="gt";
  b.innerHTML=`<div class="dia"><span>GATE</span></div><h3>${esc(g.n)}</h3><div class="q">${esc(g.q)}</div><p>${esc(g.o)}</p>`;
  b.addEventListener("click",()=>PICK(g.st,g.line));gc.appendChild(b)}
document.querySelectorAll(".sen>div[data-sen]").forEach(d=>d.addEventListener("click",()=>SEN(d.dataset.sen)));
})();


(function(){
"use strict";
const D=window.SABIA,$=(s)=>document.querySelector(s),phEl=$("#phases");if(!phEl)return;
const cv=v=>`var(${v})`,esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const RX=/(\[[A-Z]+\]|\.kiro\/(?:[\w.\/*-]|&lt;|&gt;)*|(?:[\w.\/*-]|&lt;|&gt;)+\.(?:md|json|csv|sh|py)\b|\bsa-[a-z]+|elm_[a-z_]+|gitlab_[a-z_]+)/g;
const fmt=t=>esc(t).replace(RX,"<code>$1</code>");
const ST={sen:null,tr:"padrao"},val=v=>typeof v==="function"?v(ST):v;let PM="hitl";
const chips=(el,opts,get,set,color)=>{el.innerHTML="";for(const [k,n] of opts){const b=document.createElement("button");b.className="chip";b.dataset.k=k;if(color)b.style.setProperty("--c",color(k));b.innerHTML=n;b.addEventListener("click",()=>{set(k);draw()});el.appendChild(b)}};
function draw(){
  for(const [sel,cur] of [["#modeChips",PM],["#cSen",ST.sen||"all"],["#cTr",ST.tr]])$(sel).querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",String(c.dataset.k===cur)));
  const ctx={mode:PM,sen:ST.sen,tr:ST.tr};
  phEl.innerHTML=D.PHASES[PM].map(p=>{const sk=p.skip?p.skip(ctx):null;return `<a class="ph-step${sk?" skip":""}" style="--c:${cv(D.LINES[PM].c)}" href="index.html#${PM}.${val(p.st)}" title="${esc(sk||p.sub)}"><b>${esc(p.f)}</b><small>${esc(sk||p.sub)}</small></a>`}).join("");
  $("#phnote").innerHTML=fmt(D.PHNOTE(ctx));
}
chips($("#modeChips"),[["hitl",'<span class="sw"></span>HITL'],["afk",'<span class="sw dash"></span>AFK']],0,k=>PM=k,k=>cv(D.LINES[k].c));
chips($("#cSen"),[["all","Todas"],["jr","Júnior"],["pl","Pleno"],["sr","Sênior"]],0,k=>ST.sen=k==="all"?null:k);
chips($("#cTr"),[["padrao","Padrão"],["rapida","Rápida"]],0,k=>ST.tr=k,k=>cv(k==="rapida"?"--l-rapida":"--blue"));
draw();
})();
