// `sabia kanban`: o quadro Kanban da sprint aberta numa página local. Exibe o JSON que a `sabia status`
// gera: uma página única com o JSON embutido, o tema do site (paletas Sóbria - Sabiá e Sabiá, modo claro/
// escuro, como o tema.js) e um servidor node:http sem dependências. `abrirQuadro` monta o estado, sobe o
// servidor, escreve a URL no log e devolve { url, fechar, fechou }; o comando espera o Ctrl+C para fechar.
import http from "node:http";
import { statusDoProjeto } from "./status.mjs";

const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// A data do rodapé no formato dd/mm/yyyy hh:mm:ss (o horário local de quem serviu o quadro).
const dois = (n) => String(n).padStart(2, "0");
const dataBr = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? esc(iso ?? "")
    : `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()} ${dois(d.getHours())}:${dois(d.getMinutes())}:${dois(d.getSeconds())}`;
};

// O texto legível de cada status do JSON, como o Kanban exibe (as chaves do dado seguem as de máquina).
const ROTULOS = {
  "a-moldar": "A moldar", "em-especificacao": "Em especificação", fatiado: "Fatiado", nova: "Nova",
  aceita: "Aceita", elegivel: "Elegível", "em-andamento": "Em Andamento", "em-revisao": "Em Revisão", adiada: "Adiada",
  concluida: "Concluída", concluido: "Concluído", cancelada: "Cancelada", cancelado: "Cancelado", "sem-dados": "Sem dados",
};
// Os sub-status do em-andamento (o status do backlog): a Fase do status.md da branch e o MR aberto.
// A ordem é a do fluxo: implementando → verificando → revisando → pr-aberto → retrabalho. O retrabalho só
// vem depois do pr-aberto — é o MR aberto que volta (thread não resolvida, CI vermelho ou conflito). A
// homologação humana (a aprovação do MR e o aceite quando pedido) acontece no pr-aberto, sem coluna própria;
// `—`/sem status.md fica na coluna principal, que já tem o rótulo do grupo.
const FASES = {
  "em-andamento": [["implementando", "Em desenvolvimento"], ["verificando", "Em Verificação"]],
  "em-revisao": [["pr-aberto", "Aguardando aprovação do PR"], ["retrabalho", "Retrabalho"]],
};
const rotuloDe = (st) => ROTULOS[st] ?? st;
// A coluna do card: a do status efetivo, ou a da fase (quando o em andamento/revisão se subdivide nela).
const colunaDoCartao = (c) => {
  const f = (FASES[c.status_efetivo] ?? []).find(([x]) => x === c.fase);
  return f ? `${c.status_efetivo}::${f[0]}` : c.status_efetivo;
};
// A página agrupa a família do em-andamento: o status do backlog e os sub-status que o seguem (a Fase do
// status.md da branch e o MR aberto), todos seguidos na ordem do fluxo; as outras colunas ficam soltas.
function gruposDe(q) {
  const cols = q.colunas.flatMap((st) => [{ chave: st, rotulo: rotuloDe(st) }, ...(FASES[st] ?? []).map(([f, r]) => ({ chave: `${st}::${f}`, rotulo: r }))]);
  const grupos = [];
  let familia = null;
  const fecha = () => { if (familia) { grupos.push({ familia: true, colunas: familia }); familia = null; } };
  for (const c of cols) {
    if (familia && (c.chave === "em-revisao" || c.chave.includes("::"))) { familia.push(c); continue; }
    if (c.chave === "em-andamento" || c.chave === "em-revisao") { fecha(); familia = [c]; continue; }
    fecha();
    grupos.push({ familia: false, colunas: [c] });
  }
  fecha();
  return grupos;
}

function cartaoHtml(c) {
  const dt = [];
  if (c.trilha) dt.push(`<span class="dt"><b>Trilha</b> ${esc(c.trilha)}</span>`);
  if (c.autonomia) dt.push(`<span class="dt"><b>Autonomia</b> ${esc(c.autonomia)}</span>`);
  if (c.mr) dt.push(`<span class="dt"><b>MR</b> ${c.mr.url ? `<a href="${esc(c.mr.url)}" target="_blank" rel="noopener">${c.mr.iid ? `!${c.mr.iid}` : esc(c.mr.url)}</a>` : esc(c.mr)}</span>`);
  if (c.idade_dias != null) dt.push(`<span class="dt"><b>Idade</b> ${c.idade_dias} ${c.idade_dias === 1 ? "dia" : "dias"}</span>`);
  if (c.adiada_ate) dt.push(`<span class="dt"><b>Adiada até</b> ${esc(c.adiada_ate)}</span>`);
  const alertas = (c.avisos ?? []).map((a) => `<p class="alerta" role="alert">⚠ ${esc(a.mensagem)}</p>`).join("");
  const fora = c.status === "sem-dados" ? `<p class="vazio">fora do backlog</p>` : "";
  return `<article class="cartao${c.avisos?.length ? " aviso" : ""}${c.tipo ? ` tipo-${c.tipo}` : ""}">
  <div class="chapeu"><code class="id">${esc(c.id)}</code><span class="tipo">${esc(c.tipo ?? "—")}</span></div>
  <h3 class="titulo">${c.titulo ? esc(c.titulo) : "<span class=\"vazio\">sem título</span>"}</h3>
  <p class="pessoas"><span class="resp">${c.responsavel ? esc(c.responsavel) : "<span class=\"vazio\">sem responsável</span>"}</span>${c.trabalho ? `<span class="trab">${esc(c.trabalho)}</span>` : ""}</p>
  ${c.tarefas ? `<p class="tarefas">${esc(c.tarefas)}</p>` : ""}
  ${dt.length ? `<div class="detalhes">${dt.join("")}</div>` : ""}
  ${alertas}
  ${fora}
</article>`;
}

function colunaHtml(col, q) {
  const cards = q.itens.filter((c) => colunaDoCartao(c) === col.chave);
  // o WIP fica no cabeçalho da coluna principal da família (ele conta o status do backlog, não a fase)
  const wip = q.wip?.[col.chave];
  const estourado = wip && wip.atual > wip.limite;
  return `<section class="coluna${col.chave.includes("::") ? " sub" : ""}">
  <header class="cheio">
    <h2>${esc(col.rotulo)}</h2>
    <span class="conta" title="itens da sprint na coluna">${cards.length}</span>
    ${wip ? `<span class="wip${estourado ? " estourado" : ""}" title="WIP do acordos.md: ${wip.limite}${estourado ? " — estourado" : ""} (conta os itens ${col.rotulo} do backlog inteiro, não só da sprint)">${wip.atual}/${wip.limite}</span>` : ""}
  </header>
  <div class="cartoes">${cards.map(cartaoHtml).join("") || `<p class="vazio vazia">—</p>`}</div>
</section>`;
}

// A página: HTML estático gerado aqui (sem CDN, sem dependência de rede) com o JSON do `sabia status`
// embutido em <script id="quadro"> (e servido também em /dados.json). O tema é o do site: as mesmas tokens
// do tema.css — a paleta Sóbria - Sabiá (data-sobria) ou a Sabiá (data-paleta) e o modo claro/escuro —,
// com as escolhas no localStorage (sabia-paleta, sabia-modo), aplicadas antes do paint.
export function paginaHtml(status) {
  const q = status.quadro, sp = status.sprint;
  const json = JSON.stringify(status).replace(/</g, "\\u003c");
  const ave = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 175 185" class="ave" aria-hidden="true"><polygon points="56,57 70,42 90,38 104,46 106,62 84,74 57,70" style="fill:var(--cyan);stroke:var(--cyan)" stroke-width=".6" stroke-linejoin="round"/><polygon points="84,74 106,62 118,74 116,92 92,94" style="fill:var(--lime);stroke:var(--lime)" stroke-width=".6" stroke-linejoin="round"/><polygon points="57,70 84,74 92,94 86,122 70,112 60,92" style="fill:var(--brand);stroke:var(--brand)" stroke-width=".6" stroke-linejoin="round"/><polygon points="92,94 116,92 134,108 112,124 86,122" style="fill:var(--navy);stroke:var(--navy)" stroke-width=".6" stroke-linejoin="round"/><polygon points="86,122 112,124 132,152 118,170 94,146" style="fill:var(--green);stroke:var(--green)" stroke-width=".6" stroke-linejoin="round"/><polygon points="134,108 150,128 150,154 132,152 112,124" style="fill:var(--orange);stroke:var(--orange)" stroke-width=".6" stroke-linejoin="round"/><polygon points="132,152 150,154 180,196 164,198" style="fill:var(--teal);stroke:var(--teal)" stroke-width=".6" stroke-linejoin="round"/><polygon points="36,64 56,57 57,70" fill="#1B1F1C"/><circle cx="82" cy="54" r="4.6" fill="#0E1210"/><circle cx="83.6" cy="52.4" r="1.4" fill="#fff"/></svg>`;
  const sol = `<svg class="sol" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
  const lua = `<svg class="lua" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  const paleta = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Quadro${sp ? ` · ${esc(sp.chave)}` : ""}</title>
<script>
// paleta e modo antes do paint (o mesmo contrato do site: as escolhas ficam no localStorage)
(function(){var root=document.documentElement,p=null;try{p=localStorage.getItem("sabia-paleta")}catch(e){}
if(p!=="sabia"&&p!=="sobria-sabia")p="sobria-sabia";
if(p==="sabia"){root.removeAttribute("data-sobria");root.setAttribute("data-paleta","sabia")}
else{root.removeAttribute("data-paleta");root.setAttribute("data-sobria","sobria-sabia")}
var m=null;try{m=localStorage.getItem("sabia-modo")}catch(e){}
if(m!=="claro"&&m!=="escuro")m=(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)?"escuro":"claro";
if(m==="escuro")root.setAttribute("data-modo","escuro");else root.removeAttribute("data-modo");})();
</script>
<style>
:root{
  --bg:#ffffff; --card:#ffffff; --ink:#474D66; --title:#2C5168; --muted:#696F8C; --line:#E6E8F0; --soft:#F4F6FA; --grey:#F9FAFC; --grey2:#EDEFF5;
  --acento:#2C5168; --brand:#2C5168; --brand-hover:#24445A; --blue:#0086C8; --navy:#2C5168; --cyan:#00BBCE; --teal:#0094AD; --green:#76B043; --lime:#B2D235; --yellow:#FEBE10; --orange:#FAA61A; --red:#D9534F;
  --r:8px; --r-sm:4px; --r-xs:3px;
  --display:"SF UI Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --body:"SF UI Text",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:"SF Mono",Monaco,Inconsolata,"Fira Mono","Droid Sans Mono","Source Code Pro",monospace;
  --raised:0 1px 1px #1E1F2140,0 0 1px #1E1F214F;
  --overlay:0 8px 12px #1E1F2126,0 0 1px #1E1F214F;
}
:root[data-modo="escuro"]{
  --bg:#1F1F21; --card:#242528; --ink:#CECFD2; --title:#DFE1E5; --muted:#96999E; --line:#3D3F43; --soft:#2B2C2F; --grey:#18191A; --grey2:#333438;
  --acento:#9DB7CC; --brand:#6E93B3; --brand-hover:#9DB7CC; --blue:#5C85FF; --navy:#2C5168;
  --raised:0 0 0 1px #3D3F43; --overlay:0 8px 12px #01040475,0 0 1px #01040480;
}
/* paletas, como o tema.css: Sóbria - Sabiá (data-sobria) e Sabiá (data-paleta) */
:root[data-sobria="sobria-sabia"]{--navy:#023047; --cyan:#8ECAE6; --lime:#FFB703; --green:#219EBC; --orange:#FB8500; --teal:#63787D; --yellow:#FFB703}
:root[data-sobria="sobria-sabia"]:not([data-modo="escuro"]){--bg:#FFFFFF; --card:#FFFFFF; --ink:#38494D; --title:#023047; --muted:#63787D; --line:#D0DADD; --soft:#F0F8F9; --grey:#F6F8F9; --grey2:#E7EDEE; --acento:#187F97; --brand:#219EBC; --brand-hover:#023047; --blue:#187F97}
:root[data-sobria="sobria-sabia"][data-modo="escuro"]{--acento:#5AB4D6; --brand:#219EBC; --brand-hover:#5AB4D6; --blue:#219EBC}
:root[data-paleta="sabia"]{--brand:#219EBC; --blue:#187F97; --navy:#023047; --cyan:#8ECAE6; --lime:#FFB703; --green:#219EBC; --orange:#FB8500; --teal:#63787D; --yellow:#FFB703}
:root[data-paleta="sabia"]:not([data-modo="escuro"]){--bg:#FFFFFF; --card:#FFFFFF; --ink:#38494D; --title:#023047; --muted:#63787D; --line:#D0DADD; --soft:#F0F8F9; --grey:#F6F8F9; --grey2:#E7EDEE; --acento:#187F97}
:root[data-paleta="sabia"][data-modo="escuro"]{--acento:#5AB4D6}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:400 14px/20px var(--body)}
h1,h2,h3{margin:0;font-weight:600;letter-spacing:0;font-family:var(--display)}
code{font:500 12px/16px var(--mono);background:var(--soft);color:var(--title);padding:1px 5px;border-radius:var(--r-xs)}
a{color:var(--blue)}
.vazio{color:var(--muted);font-style:italic}

.top{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:14px 24px 16px;border-bottom:1px solid var(--line)}
.marca{display:flex;align-items:center;gap:12px;font-size:22px;line-height:1;color:var(--title)}
.ave{width:34px;height:34px;flex:none}
.sprint{font:400 16px/24px var(--body);color:var(--muted)}
.selo{display:inline-flex;align-items:center;height:22px;padding:0 10px;border-radius:100em;font:600 11px/1 var(--body);text-transform:uppercase;letter-spacing:.04em;background:var(--grey2);color:var(--muted);box-shadow:inset 0 0 0 1px var(--line);vertical-align:2px}
.janela{margin:6px 0 0;font-size:13px;line-height:18px;color:var(--muted)}
.janela .meta{color:var(--ink)}

/* os controles do tema, como o site: switch claro/escuro e paleta (tema.css/tema.js) */
.tema{display:flex;align-items:center;gap:8px;margin-left:auto}
.tema>svg{display:none}
.tema .tema-btn{display:grid;place-items:center;width:38px;height:38px;padding:0;border:1px solid #C1C4D6;border-radius:var(--r-sm);background:var(--card);color:var(--ink);cursor:pointer}
.tema .tema-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.tema .tema-btn:hover{background:var(--soft);border-color:#8F95B2;color:var(--title)}
.modo-sw{position:relative;width:64px;height:34px;padding:0;border:1px solid #C1C4D6;border-radius:999px;background:var(--soft);color:var(--muted);cursor:pointer}
.modo-sw:hover{border-color:#8F95B2}
.modo-sw .trilha{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 8px}
.modo-sw .trilha svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.modo-sw .botao{position:absolute;top:3px;left:3px;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--card);color:var(--yellow);box-shadow:var(--raised);transition:transform .2s ease}
.modo-sw .botao svg{grid-area:1/1;width:16px;height:16px}
.modo-sw .botao .lua,.modo-sw[aria-checked="true"] .botao .sol{display:none}
.modo-sw[aria-checked="true"] .botao .lua{display:block}
.modo-sw[aria-checked="true"] .botao{transform:translateX(30px);color:var(--acento)}
#temas{position:absolute;inset:auto;margin:0;padding:4px;min-width:170px;border:0;border-radius:var(--r);background:var(--card);color:var(--ink);box-shadow:var(--overlay)}
#temas button{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:0;border-radius:var(--r-sm);background:none;color:inherit;font:400 14px/20px var(--body);text-align:left;cursor:pointer}
#temas button:hover{background:var(--soft)}
#temas button[aria-checked="true"]{font-weight:600;color:var(--title)}
#temas button[aria-checked="true"]::after{content:"✓";margin-left:auto}
#temas i{width:16px;height:16px;border-radius:50%;flex:none}
#temas i.sobria-sabia{background:linear-gradient(135deg,#F0F8F9 50%,#023047 50%);box-shadow:inset 0 0 0 1px #D0DADD}
#temas i.sabia{background:linear-gradient(135deg,#187F97 50%,#FFB703 50%)}
[data-modo="escuro"] :is(.modo-sw,.tema .tema-btn){border-color:var(--line)}
[data-modo="escuro"] #temas{box-shadow:var(--overlay),0 0 0 1px var(--line)}

/* o quadro: colunas brancas com a sombra raised, como as portas do site; os cards em soft com o filete
   na cor do tipo, como os etapas/roles; a família do em-andamento agrupa o status do backlog e os sub-status */
.quadro{display:flex;gap:12px;align-items:flex-start;padding:20px 24px;overflow-x:auto}
.familia{flex:0 0 auto;display:flex;flex-direction:column;gap:8px}
/* o agregador: o filete trilho em cima, título centralizado, como a marca das seções da paleta */
.familia-cab{display:flex;flex-direction:column;align-items:center;gap:6px;padding:0 2px}
.familia-cab::before{content:"";width:84px;height:6px;border-radius:3px;background:var(--viva-trilho,linear-gradient(90deg,var(--cyan) 0 14.29%,var(--lime) 0 28.57%,var(--brand) 0 42.86%,var(--navy) 0 57.14%,var(--green) 0 71.43%,var(--orange) 0 85.71%,var(--teal) 0))}
.familia-cab .loz{font:700 11px/18px var(--display);text-transform:uppercase;letter-spacing:.02em;padding:0 7px;border-radius:var(--r-xs);background:var(--brand);color:#fff}
.familia-colunas{display:flex;gap:12px;align-items:flex-start}
/* o fundo da família em soft: os status do em andamento se destacam das colunas soltas */
.familia-colunas .coluna{background:var(--soft)}
/* sub-status: fundo mais tinto e contorno pontilhado na cor do agregador, ligando-os a ele */
.coluna{flex:0 0 272px;background:var(--card);border-radius:var(--r);box-shadow:var(--raised);padding:8px}
.coluna.sub{flex-basis:248px;background:color-mix(in srgb,var(--brand) 5%,var(--soft));box-shadow:var(--raised);border:1.5px dashed color-mix(in srgb,var(--brand) 55%,var(--line))}
.cheio{display:flex;align-items:center;gap:6px;padding:8px 6px 4px}
.cheio h2{font-size:13px;line-height:20px;color:var(--title)}
.coluna.sub .cheio h2{font-size:12px;color:var(--muted)}
.conta{margin-left:auto;font:600 11px/16px var(--display);padding:0 6px;border-radius:var(--r-xs);background:color-mix(in srgb,var(--acento) 12%,var(--card));color:var(--acento)}
.wip{font:600 11px/16px var(--display);padding:0 6px;border-radius:var(--r-xs);background:var(--soft);box-shadow:inset 0 0 0 1px var(--line);color:var(--muted)}
.wip.estourado{background:color-mix(in srgb,var(--red) 14%,var(--card));box-shadow:inset 0 0 0 1px var(--red);color:var(--red)}
.cartoes{display:grid;gap:8px;padding:4px 2px}
.vazia{margin:4px 0}

/* o card como as etapas do site: fundo do cartão, filete na cor do tipo no topo, sombra raised */
.cartao{background:var(--card);border-radius:var(--r-sm);box-shadow:var(--raised),inset 0 3px 0 var(--tipo,var(--line));padding:10px 12px}
.cartao:hover{box-shadow:var(--overlay),inset 0 3px 0 var(--tipo,var(--line))}
.cartao.tipo-fatia{--tipo:var(--brand)}
.cartao.tipo-bug{--tipo:var(--orange)}
.cartao.tipo-épico{--tipo:var(--navy)}
.cartao.tipo-sustentação{--tipo:var(--teal)}
[data-modo="escuro"] .cartao.tipo-épico{--tipo:#6FA8C8}
/* marco estourado (MR parado, idade acima do SLE): destaque distinto do card normal */
.cartao.aviso{--tipo:var(--orange);background:color-mix(in srgb,var(--yellow) 10%,var(--card))}
.cartao code{background:var(--soft)}
.chapeu{display:flex;align-items:baseline;gap:8px;margin-bottom:2px}
.tipo{font:700 10px/16px var(--display);text-transform:uppercase;letter-spacing:.04em;padding:0 7px;border-radius:var(--r-xs);background:color-mix(in srgb,var(--tipo,var(--muted)) 14%,var(--card));color:var(--tipo,var(--muted))}
.titulo{font-size:14px;line-height:20px;color:var(--title);margin:0 0 4px}
.pessoas{display:flex;gap:8px;align-items:center;margin:0;font-size:12px;color:var(--muted)}
.trab{font:600 11px/16px var(--body);padding:0 6px;border-radius:var(--r-xs);background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:var(--muted)}
.tarefas{margin:2px 0 0;font:500 12px/16px var(--mono);color:var(--muted)}
.detalhes{display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:8px}
.dt{font-size:12px;color:var(--muted)}
.dt b{color:var(--title);font-weight:600}
.alerta{margin:8px 0 0;padding:6px 8px 6px 10px;border-left:4px solid var(--yellow);border-radius:0 var(--r-sm) var(--r-sm) 0;font-size:12px;line-height:18px;color:var(--title);background:color-mix(in srgb,var(--yellow) 14%,var(--card))}

.rodape{margin-top:24px;padding:14px 24px 20px;border-top:1px solid var(--line);color:var(--muted);font-size:12px}
@media (max-width:820px){.top{padding-inline:16px}.quadro{padding:16px}.rodape{padding-inline:16px}}
@media (prefers-reduced-motion:reduce){.modo-sw .botao{transition:none}}
</style>
</head>
<body>
<header class="top">
  <div class="titulos">
    <h1 class="marca">${ave}<span>Quadro${sp ? ` <span class="sprint">· ${esc(sp.chave)}</span>` : ""}</span>${sp && !sp.aberta ? ` <span class="selo">fechada</span>` : ""}</h1>
    ${sp ? `<p class="janela">${esc(sp.inicio)} → ${esc(sp.fim)}${sp.meta ? ` · <span class="meta">Meta: ${esc(sp.meta)}</span>` : ""}</p>` : ""}
  </div>
  <div class="tema">
    <button type="button" class="modo-sw" role="switch" aria-checked="false" aria-label="Modo escuro" title="Claro ou escuro">
      <span class="trilha">${sol}${lua}</span><span class="botao">${sol}${lua}</span>
    </button>
    <button type="button" class="tema-btn" popovertarget="temas" aria-label="Paleta" title="Paleta">${paleta}</button>
    <div id="temas" popover role="menu" aria-label="Paleta">
      <button type="button" role="menuitemradio" data-v="sobria-sabia" aria-checked="true"><i class="sobria-sabia"></i>Sóbria - Sabiá</button>
      <button type="button" role="menuitemradio" data-v="sabia" aria-checked="false"><i class="sabia"></i>Sabiá</button>
    </div>
  </div>
</header>
<main class="quadro">
${gruposDe(q).map((g) => g.familia
    ? `<div class="familia">
  <div class="familia-cab"><span class="loz">Em andamento</span></div>
  <div class="familia-colunas">
${g.colunas.map((col) => colunaHtml(col, q)).join("\n")}
  </div>
</div>`
    : colunaHtml(g.colunas[0], q)).join("\n")}
</main>
<footer class="rodape">gerado em ${dataBr(status.gerado_em)} · <code>sabia status</code> v${esc(status.versao)} · o dado completo está em <code>/dados.json</code></footer>
<script id="quadro" type="application/json">${json}</script>
<script>
(function(){
  var root=document.documentElement;
  function gravar(k,x){try{localStorage.setItem("sabia-"+k,x)}catch(e){}}
  function paleta(){return root.hasAttribute("data-paleta")?"sabia":"sobria-sabia"}
  function aplicarPaleta(x){
    if(x==="sabia"){root.removeAttribute("data-sobria");root.setAttribute("data-paleta","sabia")}
    else{root.removeAttribute("data-paleta");root.setAttribute("data-sobria","sobria-sabia")}
    document.querySelectorAll("#temas [data-v]").forEach(function(b){b.setAttribute("aria-checked",String(b.dataset.v===x))});
  }
  function escuro(){return root.getAttribute("data-modo")==="escuro"}
  function aplicarModo(x){
    if(x==="escuro")root.setAttribute("data-modo","escuro");else root.removeAttribute("data-modo");
    var s=document.querySelector(".modo-sw");if(s)s.setAttribute("aria-checked",String(x==="escuro"));
  }
  aplicarPaleta(paleta()); aplicarModo(escuro()?"escuro":"claro");
  var m=document.getElementById("temas"),btn=document.querySelector(".tema-btn");
  if(m&&btn){
    // popover fica na camada do topo; posição absoluta no documento, alinhada à direita do botão
    m.addEventListener("beforetoggle",function(e){if(e.newState!=="open")return;var r=btn.getBoundingClientRect();
      m.style.top=(r.bottom+window.scrollY+6)+"px";m.style.right=(document.documentElement.clientWidth-r.right)+"px"});
    m.addEventListener("click",function(e){var b=e.target.closest("[data-v]");if(b){aplicarPaleta(b.dataset.v);gravar("paleta",b.dataset.v);m.hidePopover()}});
  }
  var sw=document.querySelector(".modo-sw");
  if(sw)sw.addEventListener("click",function(){var x=escuro()?"claro":"escuro";aplicarModo(x);gravar("modo",x)});
})();
</script>
</body>
</html>`;
}

// Servidor local: GET / (a página), GET /dados.json (o JSON cru) e nada mais. Sem dependências;
// a porta 0 pega uma livre. `fechou` resolve quando o servidor fecha de fato (conexões incluídas).
export function servirQuadro(status, { porta = 0, host = "127.0.0.1" } = {}) {
  const html = paginaHtml(status), json = JSON.stringify(status, null, 2);
  const server = http.createServer((req, res) => {
    const fim = (codigo, corpo, tipo) => { res.writeHead(codigo, { "content-type": tipo, "cache-control": "no-store" }); res.end(corpo); };
    if (req.method !== "GET" && req.method !== "HEAD") return fim(405, "use GET", "text/plain; charset=utf-8");
    if (req.url === "/dados.json") return fim(200, json, "application/json; charset=utf-8");
    if (req.url === "/" || req.url === "/index.html" || req.url === "/quadro.html") return fim(200, html, "text/html; charset=utf-8");
    return fim(404, "não encontrado", "text/plain; charset=utf-8");
  });
  return new Promise((resolve, reject) => {
    let fecharFechou;
    const fechou = new Promise((r) => { fecharFechou = r; });
    server.once("error", reject);
    server.listen(porta, host, () => {
      server.removeListener("error", reject);
      const { port } = server.address();
      server.on("close", fecharFechou);
      resolve({
        url: `http://${host}:${port}/`, porta: port, host,
        fechar: () => { if (server.listening) { server.close(); server.closeAllConnections?.(); } else fecharFechou(); },
        fechou,
      });
    });
  });
}

// O comando: monta o estado do projeto, sobe o servidor, escreve a URL no log e devolve o punho
// { url, fechar, fechou }; quem chama decide quando aguardar o fechamento (o comando espera o sinal).
export async function abrirQuadro({ projeto = ".", exec, log = console.log, porta, host, agora } = {}) {
  const q = await servirQuadro(statusDoProjeto({ projeto, exec, agora }), { porta: porta ? Number.parseInt(porta, 10) || 0 : 0, host });
  log(q.url);
  return q;
}
