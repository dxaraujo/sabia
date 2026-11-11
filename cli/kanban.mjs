// `sabia kanban`: o quadro Kanban do projeto numa página local. A página desenha só o que a `sabia status` gera
// (a seção `quadro`: colunas, cards, WIP e alertas); o tema é o do site (paletas Sóbria - Sabiá e Sabiá, modo
// claro/escuro). Quem reordena, renomeia ou oculta colunas na página copia o JSON para o CONFIG_KANBAN do projeto.
// Servidor node:http sem dependências: cada carga da página lê o projeto de novo; ao fechar, a página avisa.
import http from "node:http";
import { statusDoProjeto } from "./status.mjs";

const PORTA = 4780;  // fixa para o navegador guardar o tema e o rascunho (o localStorage é por origem)

const CSS = `
/* Os tons do Sabiá (tema.css do site) em quatro superfícies, da mais funda à mais alta: página, mesa do quadro, raia e
   card. Quem separa uma da outra é a cor; o card tem a única sombra, e não há contorno. */
:root{
  --pagina:#FFFFFF; --mesa:#F1F5F6; --raia:#E2E9EB; --card:#FFFFFF; --suave:#E9EFF1; --suave-h:#D9E2E5;
  --ink:#38494D; --title:#023047; --muted:#55696E;
  --brand:#219EBC; --blue:#187F97; --navy:#023047; --cyan:#8ECAE6; --lime:#FFB703; --green:#219EBC; --orange:#FB8500; --teal:#63787D; --yellow:#FFB703;
  --critico:#C9403C; --atencao:#C98A00; --epico:#023047; --sust:#63787D;
  --sombra:0 1px 2px rgba(2,48,71,.16); --overlay:0 8px 24px rgba(2,48,71,.2);
  --poco:color-mix(in srgb,var(--brand) 22%,var(--mesa)); --poco-sombra:inset 0 2px 5px rgba(2,48,71,.18);
  --r:10px; --r-sm:6px;
  --display:"SF UI Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --body:"SF UI Text",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:"SF Mono",Monaco,Inconsolata,"Fira Mono","Droid Sans Mono","Source Code Pro",monospace;
}
:root[data-modo="escuro"]{
  color-scheme:dark;
  --pagina:#1F1F21; --mesa:#151617; --raia:#232427; --card:#303236; --suave:#2B2C2F; --suave-h:#393B3F;
  --ink:#CECFD2; --title:#ECEEF0; --muted:#A1A5AB; --blue:#5AB4D6;
  --critico:#F0706B; --atencao:#FFB703; --epico:#6FA8C8; --sust:#93A7AC;
  --sombra:0 0 0 transparent; --overlay:0 8px 24px rgba(0,0,0,.55);
  --poco:color-mix(in srgb,var(--brand) 17%,var(--mesa)); --poco-sombra:inset 0 2px 6px rgba(0,0,0,.5);
}
*{box-sizing:border-box}
html{height:100%}
body{margin:0;display:flex;flex-direction:column;height:100dvh;overflow:hidden;background:var(--pagina);color:var(--ink);font:400 14px/20px var(--body)}
h1,h2,h3,p{margin:0}
h1,h2,h3{font-family:var(--display);font-weight:600;letter-spacing:0;color:var(--title)}
button,input,select{font:inherit;color:inherit}
button,select,summary{cursor:pointer}
a{color:var(--blue);text-underline-offset:2px}
code{font:500 12px/16px var(--mono);background:var(--suave);color:var(--title);padding:1px 5px;border-radius:4px}
:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
::selection{background:color-mix(in srgb,var(--brand) 30%,transparent)}
*{scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--muted) 45%,transparent) transparent}
[hidden]{display:none!important}
svg.i{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

/* topo: a marca, a versão, a sprint e os controles de tema do site */
.top{display:flex;align-items:center;gap:14px;padding:10px 20px}
[data-paleta] .top{background:linear-gradient(90deg,var(--cyan) 0 14.29%,var(--lime) 0 28.57%,var(--brand) 0 42.86%,var(--navy) 0 57.14%,var(--green) 0 71.43%,var(--orange) 0 85.71%,var(--teal) 0) bottom/100% 4px no-repeat;padding-bottom:14px}
.brand{display:inline-flex;align-items:center;gap:10px;font:600 20px/1 var(--display);color:var(--title)}
.ave{width:32px;height:32px;flex:none}
.ver{font:600 12px/1 var(--mono);color:var(--muted)}
.onde{font:600 14px/20px var(--display);color:var(--title);white-space:nowrap}
.onde span{font:400 13px/20px var(--body);color:var(--muted);margin-left:6px}
.campo{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)}
select{height:32px;padding:0 8px;border:0;border-radius:var(--r-sm);background:var(--suave);color:var(--title);font-weight:600;font-size:13px}
select:hover{background:var(--suave-h)}
.tema{display:flex;align-items:center;gap:8px;margin-left:auto}
.tema svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.tema-btn{display:grid;place-items:center;width:34px;height:34px;padding:0;border:0;border-radius:var(--r-sm);background:var(--suave);color:var(--ink)}
.tema-btn:hover{background:var(--suave-h);color:var(--title)}
.modo-sw{position:relative;width:64px;height:34px;padding:0;border:0;border-radius:999px;background:var(--suave);color:var(--muted)}
.modo-sw .trilha{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 9px}
.modo-sw .botao{position:absolute;top:4px;left:4px;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--card);color:var(--atencao);box-shadow:var(--sombra);transition:transform .2s cubic-bezier(.2,.8,.2,1)}
.modo-sw .botao svg{grid-area:1/1;width:16px;height:16px}
.modo-sw .botao .lua,.modo-sw[aria-checked="true"] .botao .sol{display:none}
.modo-sw[aria-checked="true"] .botao .lua{display:block}
.modo-sw[aria-checked="true"] .botao{transform:translateX(30px);color:var(--blue)}
[popover]{position:fixed;inset:auto;margin:0;padding:4px;min-width:180px;border:0;border-radius:var(--r);background:var(--card);color:var(--ink);box-shadow:var(--overlay)}
[popover] button{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:0;border-radius:var(--r-sm);background:none;font:400 14px/20px var(--body);text-align:left}
[popover] button:hover{background:var(--suave)}
#temas button svg{display:none;margin-left:auto;width:16px;height:16px}
#temas button[aria-checked="true"]{font-weight:600;color:var(--title)}
#temas button[aria-checked="true"] svg{display:block}
#temas i{width:16px;height:16px;border-radius:50%;flex:none}
#temas i.sobria-sabia{background:linear-gradient(135deg,#F0F8F9 50%,#023047 50%)}
#temas i.sabia{background:linear-gradient(135deg,#187F97 50%,#FFB703 50%)}

/* a sprint escolhida e os alertas do quadro: uma linha, a bolinha dá o nível */
.ciclo{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 18px;padding:6px 20px 0;font-size:13px}
.ciclo .quando{color:var(--muted);font-variant-numeric:tabular-nums}
.ciclo .meta b{color:var(--title);font-weight:600}
.ciclo ul{display:contents;list-style:none}
.ciclo li{display:inline-flex;align-items:baseline;gap:6px;color:var(--title);font-weight:500}
.ponto{display:inline-block;flex:none;width:9px;height:9px;border-radius:50%;background:var(--cor)}
.critico{--cor:var(--critico)}
.atencao{--cor:var(--atencao)}

/* a barra: vista, tipos (legenda e filtro), busca e a configuração das colunas */
.barra{display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px;padding:10px 20px 12px}
.seg{display:inline-flex;padding:3px;border-radius:8px;background:var(--suave)}
.seg button{border:0;border-radius:var(--r-sm);background:none;padding:4px 12px;font:500 13px/18px var(--body);color:var(--muted)}
.seg button[aria-pressed="true"]{background:var(--card);color:var(--title);box-shadow:var(--sombra)}
[data-modo="escuro"] .seg button[aria-pressed="true"]{background:var(--suave-h)}
.chips{display:flex;flex-wrap:wrap;gap:2px}
.filtro{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 10px;border:0;border-radius:var(--r-sm);background:none;font:500 13px/1 var(--body);color:var(--title);white-space:nowrap}
.filtro:hover{background:var(--suave)}
.filtro i{width:10px;height:10px;border-radius:3px;background:var(--tipo)}
.filtro.so i{background:var(--cor)}
.filtro.so i{border-radius:50%}
.filtro[aria-pressed="false"]:not(.so){color:var(--muted)}
.filtro[aria-pressed="false"]:not(.so) i{background:none;box-shadow:inset 0 0 0 1.5px var(--muted)}
.filtro.so[aria-pressed="true"]{background:var(--suave-h)}
.filtro b{font-weight:600;color:var(--muted);font-variant-numeric:tabular-nums}
.busca{height:32px;width:280px;max-width:100%;padding:0 10px;border:0;border-radius:var(--r-sm);background:var(--suave);color:var(--title)}
.busca::placeholder{color:var(--muted)}
.btn{height:32px;padding:0 12px;border:0;border-radius:var(--r-sm);background:var(--suave);font:500 13px/1 var(--body);color:var(--title);white-space:nowrap}
.btn:hover{background:var(--suave-h)}
.btn.pri{background:var(--yellow);color:#022338;font-weight:600}
.btn.pri:hover{background:#FFC533}
.config{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-left:auto}
.config p{font-size:13px;color:var(--title)}

/* a mesa: o quadro ocupa o que sobra da janela; cada raia vai até o fundo e rola por dentro */
.mesa{flex:1;min-height:0;display:flex;background:var(--mesa)}
.quadro{flex:1;min-width:0;display:flex;align-items:stretch;gap:10px;padding:12px 20px;overflow:auto hidden}
.coluna{flex:0 0 272px;display:flex;flex-direction:column;min-height:0;border-radius:var(--r);background:var(--raia)}
.cab{flex:none;display:flex;align-items:center;gap:8px;padding:8px 6px 6px 12px;cursor:grab}
.cab h2{flex:0 1 auto;min-width:0;font-size:13px;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.conta{font:500 12px/20px var(--body);color:var(--muted);font-variant-numeric:tabular-nums}
.wip{display:inline-flex;align-items:center;gap:5px;font:500 12px/20px var(--body);color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.wip.estourado{color:var(--title);font-weight:600}
.menu-btn{flex:none;display:grid;place-items:center;width:28px;height:28px;margin-left:auto;padding:0;border:0;border-radius:var(--r-sm);background:none;color:var(--muted)}
.menu-btn:hover{background:color-mix(in srgb,var(--muted) 18%,transparent);color:var(--title)}
.renomear{flex:1;min-width:0;height:26px;padding:0 6px;border:0;outline:2px solid var(--blue);border-radius:4px;background:var(--card);font:600 13px/20px var(--display);color:var(--title)}
.cartoes{flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:2px 8px 10px}
.vazia{padding:2px 4px;color:var(--muted);font-size:13px}
.indo{opacity:.45}
.solta-e{box-shadow:-3px 0 0 var(--blue)}
.solta-d{box-shadow:3px 0 0 var(--blue)}

/* o em andamento aberto: um poço em baixo-relevo, até o fundo, com as raias dele dentro; recolhido, é uma raia como as outras */
.grupo{flex:0 0 auto;display:flex;flex-direction:column;min-height:0;padding:0 8px 8px;border-radius:calc(var(--r) + 2px);background:var(--poco);box-shadow:var(--poco-sombra)}
.grupo>.cab{padding:8px 0 6px 2px}
.grupo>.cab h2{font-size:14px}
.grupo>.cab .wips{display:flex;flex-wrap:wrap;gap:4px 14px;margin-left:6px}
.grupo-colunas{flex:1;min-height:0;display:flex;gap:8px}
.grupo.recolhido{flex-basis:272px;width:272px;padding:0;border-radius:var(--r);background:var(--raia);box-shadow:none}
.grupo.recolhido>.cab{flex-wrap:wrap;padding:8px 6px 6px 6px}
.grupo.recolhido .wips{order:9;flex-basis:100%;margin-left:34px}
.grupo.solta-e{box-shadow:-3px 0 0 var(--blue)}
.grupo.solta-d{box-shadow:3px 0 0 var(--blue)}
.dobra{flex:none;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--r-sm);background:none;color:var(--title)}
.dobra:hover{background:color-mix(in srgb,var(--title) 10%,transparent)}
.dobra svg{transition:transform .18s cubic-bezier(.2,.8,.2,1)}
.dobra[aria-expanded="false"] svg{transform:rotate(-90deg)}

/* o card, como as etapas do site: na Sóbria, branco com o filete do tipo em cima; na Sabiá, o cabeçalho na cor
   do tipo clareada, com o texto escuro por cima */
.cartao,.filtro,td{--tipo:var(--muted)}
[data-tipo="fatia"]{--tipo:var(--brand)}
[data-tipo="bug"]{--tipo:var(--orange)}
[data-tipo="épico"]{--tipo:var(--epico)}
[data-tipo="sustentação"]{--tipo:var(--sust)}
.cartao{flex:none;border-radius:8px;background:var(--card);box-shadow:var(--sombra),inset 0 3px 0 var(--tipo);overflow:hidden}
.chapeu{display:flex;align-items:center;gap:8px;padding:12px 12px 0;font-size:12px;line-height:16px}
.chapeu .id{font:600 12px/16px var(--mono);color:var(--title)}
.chapeu .tipo{font-weight:600;color:color-mix(in srgb,var(--tipo) 60%,var(--title))}
.chapeu .ponto{margin-left:auto;box-shadow:0 0 0 2px var(--card)}
[data-paleta] .cartao{box-shadow:var(--sombra)}
[data-paleta] .chapeu{padding:7px 12px;background:color-mix(in srgb,var(--tipo) 42%,#fff);color:#022338}
[data-paleta][data-modo="escuro"] .chapeu{background:color-mix(in srgb,var(--tipo) 46%,var(--card));color:#fff}
[data-paleta] .chapeu :is(.id,.tipo){color:inherit}
.corpo{padding:7px 12px 11px}
.corpo h3{font-size:14px;line-height:20px;overflow-wrap:anywhere}
.semtitulo{color:var(--muted);font-weight:400}
.quem{display:flex;align-items:center;gap:7px;margin-top:8px;font-size:13px;line-height:18px;color:var(--ink)}
.quem i{flex:none;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--suave);color:var(--title);font:600 10px/1 var(--display);font-style:normal}
.quem.sem{color:var(--muted)}
.quem span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.situ{flex:none;margin-left:auto;padding:1px 7px;border-radius:999px;background:var(--suave);font:500 12px/16px var(--body);color:var(--title);white-space:nowrap}
.motivo{margin-top:6px;font-size:13px;line-height:18px;color:var(--ink)}
.dados{margin-top:6px;font-size:12px;line-height:18px;color:var(--muted);font-variant-numeric:tabular-nums}
.avisos{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:3px}
.avisos li{display:flex;align-items:baseline;gap:7px;font-size:12px;line-height:17px;color:var(--title)}
.avisos .ponto{width:7px;height:7px;transform:translateY(-1px)}

/* a lista: uma tabela por sprint, da aberta para a primeira, e a do backlog */
.lista{flex:1;min-width:0;overflow:auto;padding:12px 20px 20px}
.bloco{max-width:1400px;margin:0 auto 14px;border-radius:var(--r);background:var(--raia)}
.bloco summary svg{align-self:center;color:var(--title);transition:transform .18s cubic-bezier(.2,.8,.2,1)}
.bloco:not([open]) summary svg{transform:rotate(-90deg)}
.bloco summary{display:flex;align-items:baseline;gap:10px;padding:10px 14px;list-style:none}
.bloco summary::-webkit-details-marker{display:none}
.bloco summary h2{font-size:14px;line-height:20px}
.bloco summary span{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.rola{margin:0 8px 8px;border-radius:8px;background:var(--card);overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px;line-height:18px;font-variant-numeric:tabular-nums}
th{padding:8px 12px;text-align:left;font-weight:600;font-size:12px;color:var(--muted);white-space:nowrap}
td{padding:8px 12px;vertical-align:top;border-top:1px solid var(--mesa)}
td.id{font:600 12px/18px var(--mono);color:var(--title);white-space:nowrap}
td.tit{min-width:240px;color:var(--title);font-weight:500}
td.nw{white-space:nowrap}
td .t{display:inline-block;width:9px;height:9px;margin-right:6px;border-radius:3px;background:var(--tipo)}
td .ponto{margin-right:6px}
.nada{padding:10px 14px 14px;color:var(--muted);font-size:13px}

.rodape{display:flex;gap:6px 16px;flex-wrap:wrap;padding:7px 20px;color:var(--muted);font-size:12px;line-height:16px}
.fora{position:fixed;inset:0;z-index:9;display:grid;place-content:center;gap:8px;text-align:center;padding:24px;background:var(--pagina)}
.fora h1{font-size:20px;line-height:28px}
@media (max-width:820px){.top,.ciclo,.barra,.rodape{padding-inline:12px}.top{flex-wrap:wrap}.quadro,.lista{padding-inline:12px}.ver,.onde span{display:none}.busca{width:100%}.config{margin-left:0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

// O tema antes do paint, com o mesmo contrato do tema.js do site (localStorage: sabia-paleta, sabia-modo).
function tema() {
  const root = document.documentElement, SO = matchMedia("(prefers-color-scheme: dark)");
  const ler = (k) => { try { return localStorage.getItem("sabia-" + k); } catch { return null; } };
  const doSistema = () => (SO.matches ? "escuro" : "claro");
  let paleta = ler("paleta") === "sabia" ? "sabia" : "sobria-sabia", modo = ["claro", "escuro"].includes(ler("modo")) ? ler("modo") : doSistema();
  function aplicarPaleta(x) {
    paleta = x;
    if (x === "sabia") { root.removeAttribute("data-sobria"); root.setAttribute("data-paleta", "sabia"); }
    else { root.removeAttribute("data-paleta"); root.setAttribute("data-sobria", x); }
    document.querySelectorAll("#temas [data-v]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.v === x)));
  }
  function aplicarModo(x) {
    modo = x;
    if (x === "escuro") root.setAttribute("data-modo", "escuro"); else root.removeAttribute("data-modo");
    document.querySelector(".modo-sw")?.setAttribute("aria-checked", String(x === "escuro"));
  }
  aplicarPaleta(paleta); aplicarModo(modo);
  SO.addEventListener("change", () => { if (!ler("modo")) aplicarModo(doSistema()); });
  document.addEventListener("DOMContentLoaded", () => {
    const m = document.getElementById("temas"), btn = document.querySelector(".tema-btn");
    m.addEventListener("beforetoggle", (e) => {
      if (e.newState !== "open") return;
      const r = btn.getBoundingClientRect();
      m.style.top = r.bottom + 6 + "px"; m.style.left = "auto"; m.style.right = document.documentElement.clientWidth - r.right + "px";
    });
    m.addEventListener("click", (e) => {
      const b = e.target.closest("[data-v]");
      if (b) { aplicarPaleta(b.dataset.v); try { localStorage.setItem("sabia-paleta", paleta); } catch {} m.hidePopover(); }
    });
    document.querySelector(".modo-sw").addEventListener("click", () => {
      aplicarModo(modo === "escuro" ? "claro" : "escuro");
      // voltar ao modo do sistema apaga a escolha: a página torna a segui-lo
      try { if (modo === doSistema()) localStorage.removeItem("sabia-modo"); else localStorage.setItem("sabia-modo", modo); } catch {}
    });
    aplicarPaleta(paleta); aplicarModo(modo);
  });
}

// A página no navegador: desenha o quadro e a lista do JSON embutido e guarda as mudanças de coluna como rascunho.
function cliente() {
  const D = JSON.parse(document.getElementById("dados").textContent), Q = D.quadro, SP = Q.sprints;
  const $ = (s) => document.querySelector(s);
  const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
  const dataBr = (d) => d.slice(8, 10) + "/" + d.slice(5, 7) + "/" + d.slice(0, 4);
  const svg = (d) => '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + d + "</svg>";
  const PONTOS = svg('<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'), SETA = svg('<path d="m6 9 6 6 6-6"/>');
  const NIVEL = { critico: "Crítico", atencao: "Atenção" };
  const ponto = (nivel) => '<span class="ponto ' + nivel + '" role="img" aria-label="' + NIVEL[nivel] + '"></span>';
  const nivelDe = (c) => (c.avisos.some((a) => a.nivel === "critico") ? "critico" : c.avisos.length ? "atencao" : null);
  const nome = (u) => Q.pessoas[u] ?? u;

  // o que fica só neste navegador: o rascunho das colunas, o em andamento recolhido e a vista
  const CHAVE = "sabia-kanban:" + D.projeto;
  let local = {};
  try { local = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch {}
  const gravar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(local)); } catch {} };

  // a configuração: a servida (o padrão do Sabiá ou a do projeto) e a de trabalho (com o rascunho, se ainda vale)
  const exportar = (c) => ({ grupo: c.grupo, colunas: c.colunas.map((x) => ({ id: x.id, nome: x.nome, ...(x.oculta ? { oculta: true } : {}) })) });
  const servido = exportar(Q), igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const ids = (c) => (c?.colunas ?? []).map((x) => x.id).sort().join("|");
  const NO_GRUPO = new Set(Q.colunas.filter((c) => c.grupo).map((c) => c.id));
  let cfg = ids(local.rascunho) === ids(servido) && !igual(local.rascunho, servido) ? local.rascunho : structuredClone(servido);
  const col = (id) => cfg.colunas.find((c) => c.id === id);

  let si = 0, vista = local.vista === "lista" ? "lista" : "quadro", recolhido = local.recolhido === true, texto = "", soAvisos = false;
  const desligados = new Set(), TERMINAL = new Set(["concluida", "concluido", "cancelada", "cancelado"]);
  const naAtual = new Set((SP[0]?.itens ?? []).map((l) => l.id));
  const linhasDe = (c, sp = SP[si]) => (sp?.itens ?? []).filter((l) => l.id === c.id);
  const passa = (c) => !desligados.has(c.tipo ?? "") && (!soAvisos || c.avisos.length) && (!texto || [c.id, c.titulo, c.responsavel, nome(c.responsavel)].join(" ").toLowerCase().includes(texto));
  // o backlog: o item que não terminou, não começou e não está na sprint aberta
  const noBacklog = (c) => !TERMINAL.has(c.status) && !naAtual.has(c.id) && !NO_GRUPO.has(c.coluna);
  // a raia do card na sprint escolhida: o item dela fica na coluna da situação; o resto do backlog, na raia Backlog.
  // Na sprint aberta entra também o que está em andamento fora dela (com o aviso). Sem sprint, vale a situação.
  const raia = (c) => (!SP.length || linhasDe(c).length || (si === 0 && NO_GRUPO.has(c.coluna)) ? c.coluna : noBacklog(c) ? "backlog" : null);

  function cartao(c, situ) {
    const nv = nivelDe(c), r = c.responsavel, ini = r ? nome(r).split(/[.\s_-]+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") : "–";
    const d = [];
    if (c.tamanho) d.push("tamanho " + esc(c.tamanho));
    if (c.idade_dias != null) d.push("idade " + c.idade_dias + " d");
    if (c.lead_time_dias != null) d.push("lead time " + c.lead_time_dias + " d");
    const mv = c.motivo;
    if (mv?.por) d.push("por " + esc(mv.por));
    if (c.impedida_dias != null) d.push("impedida há " + c.impedida_dias + " d");
    else if (mv?.desde) d.push("desde " + dataBr(mv.desde));
    if (mv?.ate) d.push("até " + dataBr(mv.ate));
    if (mv?.de) d.push("antes: " + esc(mv.de === "em-andamento" ? cfg.grupo : col(mv.de)?.nome ?? mv.de));
    if (c.mr) d.push(/^https?:/.test(c.mr.url) ? '<a href="' + esc(c.mr.url) + '" target="_blank" rel="noopener">MR ' + (c.mr.iid ? "!" + c.mr.iid : "aberto") + "</a>" : "MR " + esc(c.mr.url));
    if (c.pai) d.push("pai " + esc(c.pai));
    if (c.ib) d.push("IB " + esc(c.ib));
    if (c.trilha) d.push(esc(c.trilha));
    if (c.autonomia) d.push(esc(c.autonomia));
    for (const l of linhasDe(c)) if (l.tarefas) d.push(esc(l.tarefas));
    return '<article class="cartao" data-tipo="' + esc(c.tipo) + '"><div class="chapeu"><span class="id">' + esc(c.id) + '</span><span class="tipo">' + esc(c.tipo ?? "sem tipo") + "</span>" + (nv ? ponto(nv) : "") + "</div>"
      + '<div class="corpo"><h3>' + (c.titulo ? esc(c.titulo) : '<span class="semtitulo">sem título</span>') + "</h3>"
      + (mv?.texto ? '<p class="motivo">' + esc(mv.texto) + "</p>" : "")
      + '<div class="quem' + (r ? "" : " sem") + '"><i aria-hidden="true">' + esc(ini) + "</i><span" + (r ? ' title="' + esc(r) + '"' : "") + ">" + esc(r ? nome(r) : "sem responsável") + "</span>"
      + (situ ? '<span class="situ">' + esc(col(c.coluna)?.nome ?? c.coluna) + "</span>" : "") + "</div>"
      + (d.length ? '<p class="dados">' + d.join(" · ") + "</p>" : "")
      + (c.avisos.length ? '<ul class="avisos">' + c.avisos.map((a) => "<li>" + ponto(a.nivel) + "<span>" + esc(a.mensagem) + "</span></li>").join("") + "</ul>" : "")
      + "</div></article>";
  }
  const chipWip = (w, rotulo) => '<span class="wip' + (w.atual > w.limite ? " estourado" : "") + '" title="WIP do acordos.json: até ' + w.limite + " (conta fatias e bugs do backlog inteiro)" + '">'
    + (w.atual > w.limite ? ponto("critico") : "") + esc(rotulo) + " " + w.atual + "/" + w.limite + "</span>";
  const cartoes = (cs, situ) => '<div class="cartoes">' + (cs.map((c) => cartao(c, situ)).join("") || '<p class="vazia">Nenhum item</p>') + "</div>";
  function coluna(c, mapa) {
    const cs = mapa[c.id] ?? [], w = Q.wip.find((x) => x.colunas.length === 1 && x.colunas[0] === c.id);
    return '<section class="coluna' + (NO_GRUPO.has(c.id) ? " sub" : "") + '" data-id="' + esc(c.id) + '" aria-label="' + esc(c.nome) + '">'
      + '<header class="cab" draggable="true" data-arrasta="' + esc(c.id) + '"><h2 title="' + esc(c.nome) + ' (dois cliques renomeiam)">' + esc(c.nome) + '</h2><span class="conta">' + cs.length + "</span>"
      + (w ? chipWip(w, "WIP") : "") + '<button type="button" class="menu-btn" data-menu="' + esc(c.id) + '" aria-label="Opções da coluna ' + esc(c.nome) + '">' + PONTOS + "</button></header>"
      + cartoes(cs, c.id === "backlog") + "</section>";
  }
  function grupo(cols, mapa) {
    const cs = cols.flatMap((c) => mapa[c.id] ?? []), wips = Q.wip.filter((w) => w.colunas.length > 1 && w.colunas.every((id) => NO_GRUPO.has(id)));
    return '<section class="grupo' + (recolhido ? " recolhido" : "") + '" data-id="@grupo" aria-label="' + esc(cfg.grupo) + '">'
      + '<header class="cab" draggable="true" data-arrasta="@grupo"><button type="button" class="dobra" aria-expanded="' + !recolhido + '" aria-label="' + (recolhido ? "Expandir " : "Recolher ") + esc(cfg.grupo) + '">' + SETA
      + '</button><h2 title="' + esc(cfg.grupo) + ' (dois cliques renomeiam)">' + esc(cfg.grupo) + '</h2><span class="conta">' + cs.length + "</span>"
      + '<span class="wips">' + wips.map((w) => chipWip(w, w.nome)).join("") + '</span><button type="button" class="menu-btn" data-menu="@grupo" aria-label="Opções de ' + esc(cfg.grupo) + '">' + PONTOS + "</button></header>"
      + (recolhido ? cartoes(cs, true) : '<div class="grupo-colunas">' + cols.filter((c) => !c.oculta).map((c) => coluna(c, mapa)).join("") + "</div>") + "</section>";
  }

  // a lista: a tabela do backlog e uma por sprint (da aberta para a primeira). Na sprint, uma linha por tarefa, com o
  // início, o fim e o lead time daquele trabalho; no backlog, uma por item
  function tabela(titulo, sub, linhas, sp, aberta) {
    const dt = (d) => (d ? dataBr(d) : ""), avisos = (c) => { const nv = nivelDe(c); return nv ? ponto(nv) + esc(c.avisos.map((a) => a.mensagem).join("; ")) : ""; };
    const comum = (c) => '<td class="id">' + esc(c.id) + '</td><td class="tit">' + esc(c.titulo ?? "sem título") + '</td><td class="nw" data-tipo="' + esc(c.tipo) + '"><span class="t"></span>' + esc(c.tipo ?? "")
      + '</td><td class="nw">' + esc(col(c.coluna)?.nome ?? c.coluna) + "</td>";
    const linha = sp
      ? ({ c, l }) => "<tr>" + comum(c) + '<td class="nw">' + esc(l.trabalho ?? "") + '</td><td class="nw">' + esc(l.responsavel ? nome(l.responsavel) : "") + '</td><td class="nw">' + dt(l.iniciada_em)
        + '</td><td class="nw">' + dt(l.concluida_em) + '</td><td class="nw">' + (l.lead_time_dias != null ? l.lead_time_dias + " d" : "") + "</td><td>" + avisos(c) + "</td></tr>"
      : ({ c }) => "<tr>" + comum(c) + '<td class="nw">' + esc(c.responsavel ? nome(c.responsavel) : "") + "</td><td>" + esc(c.tamanho ?? "") + '</td><td class="nw">' + dt(c.entrou_em) + "</td><td>"
        + esc(c.motivo?.texto ?? "") + "</td><td>" + avisos(c) + "</td></tr>";
    const cab = sp ? "<th>Trabalho</th><th>Responsável</th><th>Início</th><th>Fim</th><th>Lead time</th>" : "<th>Responsável</th><th>Tamanho</th><th>Entrou em</th><th>Motivo</th>";
    return '<details class="bloco"' + (aberta ? " open" : "") + "><summary>" + SETA + "<h2>" + esc(titulo) + "</h2><span>" + esc(sub) + "</span></summary>"
      + (linhas.length ? '<div class="rola"><table><thead><tr><th>Item</th><th>Título</th><th>Tipo</th><th>Situação</th>' + cab + "<th>Avisos</th></tr></thead><tbody>"
        + linhas.map(linha).join("") + "</tbody></table></div>" : '<p class="nada">Nenhum item</p>') + "</details>";
  }
  const itens = (n) => n + (n === 1 ? " item" : " itens");
  function lista() {
    const doBacklog = Q.itens.filter((c) => noBacklog(c) && passa(c)).map((c) => ({ c })), porId = Object.fromEntries(Q.itens.map((c) => [c.id, c]));
    return tabela("Backlog", itens(doBacklog.length), doBacklog, null, true) + SP.map((sp, i) => {
      const ls = sp.itens.map((l) => ({ c: porId[l.id], l })).filter((x) => x.c && passa(x.c));
      return tabela(sp.chave, dataBr(sp.inicio) + " → " + dataBr(sp.fim) + " · " + ls.length + (ls.length === 1 ? " tarefa" : " tarefas"), ls, sp, i === 0);
    }).join("");
  }

  const quadro = $("#quadro");
  function desenhar() {
    $("#quadro").hidden = vista !== "quadro"; $("#lista").hidden = vista !== "lista";
    if (vista === "lista") $("#lista").innerHTML = lista();
    else {
      const mapa = {};
      for (const c of Q.itens) { const r = passa(c) && raia(c); if (r) (mapa[r] ??= []).push(c); }
      const doGrupo = cfg.colunas.filter((c) => NO_GRUPO.has(c.id));
      let feito = false;
      quadro.innerHTML = cfg.colunas.map((c) => (NO_GRUPO.has(c.id) ? (feito ? "" : ((feito = true), grupo(doGrupo, mapa))) : c.oculta ? "" : coluna(c, mapa))).join("");
    }
    const ocultas = cfg.colunas.filter((c) => c.oculta), mudado = !igual(exportar(cfg), servido);
    $("#ocultas-btn").hidden = !ocultas.length || vista !== "quadro";
    $("#ocultas-btn").textContent = "Colunas ocultas (" + ocultas.length + ")";
    $("#ocultas").innerHTML = ocultas.map((c) => '<button type="button" data-mostrar="' + esc(c.id) + '">Mostrar ' + esc(c.nome) + "</button>").join("");
    $("#rascunho").hidden = $("#descartar").hidden = !mudado;
    $("#copiar").classList.toggle("pri", mudado);
    ciclo();
  }
  function ciclo() {
    const sp = SP[si], hoje = D.gerado_em.slice(0, 10);
    let h = '<span class="quando">sem sprint: o quadro mostra o backlog inteiro</span>';
    if (sp) {
      const dia = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5), total = dia(sp.inicio, sp.fim) + 1, n = dia(sp.inicio, hoje) + 1;
      h = '<span class="quando">' + dataBr(sp.inicio) + " → " + dataBr(sp.fim) + " · " + (n < 1 ? "ainda não começou" : n > total ? "encerrada" : "dia " + n + " de " + total) + "</span>"
        + (sp.meta ? '<span class="meta"><b>Meta:</b> ' + esc(sp.meta) + "</span>" : "");
    }
    $("#ciclo").innerHTML = h + (Q.alertas.length ? '<ul aria-label="Alertas do quadro">' + Q.alertas.map((a) => "<li>" + ponto(a.nivel) + esc(a.mensagem) + "</li>").join("") + "</ul>" : "");
  }
  function mudou(foco) {
    local.rascunho = igual(exportar(cfg), servido) ? undefined : exportar(cfg);
    gravar(); desenhar();
    if (foco) quadro.querySelector('[data-menu="' + CSS.escape(foco) + '"]')?.focus();
  }

  // a ordem: as colunas soltas e o bloco do em andamento num nível; as colunas dele, entre si, noutro
  function mover(id, alvo, depois) {
    const sub = NO_GRUPO.has(id), doGrupo = cfg.colunas.filter((c) => NO_GRUPO.has(c.id)).map((c) => c.id), topo = [];
    for (const c of cfg.colunas) if (!NO_GRUPO.has(c.id)) topo.push(c.id); else if (!topo.includes("@grupo")) topo.push("@grupo");
    const ordem = sub ? doGrupo : topo, de = ordem.indexOf(id);
    if (de < 0 || id === alvo || !ordem.includes(alvo)) return;
    ordem.splice(de, 1); ordem.splice(ordem.indexOf(alvo) + (depois ? 1 : 0), 0, id);
    const por = Object.fromEntries(cfg.colunas.map((c) => [c.id, c]));
    cfg.colunas = topo.flatMap((x) => (x === "@grupo" ? doGrupo.map((g) => por[g]) : [por[x]]));
    mudou(id);
  }
  function passo(id, d) {
    const nivel = [...quadro.querySelectorAll(NO_GRUPO.has(id) ? ".coluna.sub" : ".grupo,.coluna:not(.sub)")].map((e) => e.dataset.id);
    const v = nivel[nivel.indexOf(id) + d];
    if (v) mover(id, v, d > 0);
  }
  function renomear(id) {
    const h = quadro.querySelector('[data-id="' + CSS.escape(id) + '"] h2'), atual = id === "@grupo" ? cfg.grupo : col(id).nome;
    const i = Object.assign(document.createElement("input"), { className: "renomear", value: atual, maxLength: 40 });
    i.setAttribute("aria-label", "Nome da coluna " + atual);
    h.closest(".cab").draggable = false;
    h.replaceWith(i); i.focus(); i.select();
    let fim = (ok) => {
      fim = () => {};
      const v = i.value.trim();
      if (ok && v && v !== atual) { if (id === "@grupo") cfg.grupo = v; else col(id).nome = v; }
      mudou(id);
    };
    i.addEventListener("keydown", (e) => { if (e.key === "Enter") fim(true); else if (e.key === "Escape") fim(false); });
    i.addEventListener("blur", () => fim(true));
  }
  function dobrar() { recolhido = local.recolhido = !recolhido; gravar(); desenhar(); quadro.querySelector(".dobra").focus(); }

  // o menu da coluna: o caminho do teclado para o que o arrasto e os dois cliques fazem
  const menu = $("#menu");
  let menuDe = null;
  quadro.addEventListener("click", (e) => {
    if (e.target.closest(".dobra")) return dobrar();
    const b = e.target.closest(".menu-btn");
    if (!b) return;
    menuDe = b.dataset.menu;
    menu.innerHTML = '<button type="button" data-acao="renomear">Renomear</button><button type="button" data-acao="esq">Mover para a esquerda</button><button type="button" data-acao="dir">Mover para a direita</button>'
      + (menuDe === "@grupo" ? '<button type="button" data-acao="dobrar">' + (recolhido ? "Expandir" : "Recolher") + "</button>" : '<button type="button" data-acao="ocultar">Ocultar coluna</button>');
    const r = b.getBoundingClientRect();
    menu.style.top = r.bottom + 4 + "px"; menu.style.left = Math.min(r.left, innerWidth - 200) + "px";
    menu.showPopover(); menu.querySelector("button").focus();
  });
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("[data-acao]")?.dataset.acao;
    if (!a) return;
    menu.hidePopover();
    if (a === "renomear") renomear(menuDe);
    else if (a === "esq") passo(menuDe, -1);
    else if (a === "dir") passo(menuDe, 1);
    else if (a === "dobrar") dobrar();
    else { col(menuDe).oculta = true; mudou(); $("#ocultas-btn").focus(); }
  });
  quadro.addEventListener("dblclick", (e) => { const h = e.target.closest(".cab h2"); if (h) renomear(h.closest("[data-id]").dataset.id); });
  $("#ocultas").addEventListener("click", (e) => {
    const id = e.target.closest("[data-mostrar]")?.dataset.mostrar;
    if (id) { $("#ocultas").hidePopover(); col(id).oculta = false; mudou(id); }
  });
  $("#ocultas").addEventListener("beforetoggle", (e) => {
    if (e.newState !== "open") return;
    const r = $("#ocultas-btn").getBoundingClientRect();
    e.target.style.top = r.bottom + 4 + "px"; e.target.style.left = Math.min(r.left, innerWidth - 260) + "px";
  });

  // arrastar pelo cabeçalho: a coluna solta e o bloco do em andamento trocam entre si; as do bloco, dentro dele
  let arrastando = null;
  const limpar = () => quadro.querySelectorAll(".solta-e,.solta-d").forEach((e) => e.classList.remove("solta-e", "solta-d"));
  const alvoDe = (e) => {
    if (!arrastando) return null;
    const el = e.target.closest(NO_GRUPO.has(arrastando) ? ".coluna.sub" : ".grupo,.coluna:not(.sub)");
    if (!el || el.dataset.id === arrastando) return null;
    const r = el.getBoundingClientRect();
    return { el, id: el.dataset.id, depois: e.clientX > r.left + r.width / 2 };
  };
  quadro.addEventListener("dragstart", (e) => {
    const h = e.target.closest?.("[data-arrasta]");
    if (!h) return;
    arrastando = h.dataset.arrasta;
    e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", arrastando);
    h.parentElement.classList.add("indo");
  });
  quadro.addEventListener("dragover", (e) => { limpar(); const a = alvoDe(e); if (a) { e.preventDefault(); a.el.classList.add(a.depois ? "solta-d" : "solta-e"); } });
  quadro.addEventListener("drop", (e) => { const a = alvoDe(e); if (a) { e.preventDefault(); mover(arrastando, a.id, a.depois); } });
  quadro.addEventListener("dragend", () => { arrastando = null; limpar(); quadro.querySelector(".indo")?.classList.remove("indo"); });

  // o topo e a barra: sprint, vista, tipos, só com aviso, busca e a configuração das colunas
  const sel = $("#sprint");
  sel.innerHTML = SP.map((sp, i) => '<option value="' + i + '">' + esc(sp.chave) + (i === 0 && sp.aberta ? " (atual)" : "") + "</option>").join("");
  sel.closest(".campo").hidden = !SP.length;
  sel.addEventListener("change", () => { si = +sel.value; desenhar(); });
  const tipos = [...new Set(["fatia", "bug", "épico", "sustentação", ...Q.itens.map((c) => c.tipo)])].filter((t) => Q.itens.some((c) => c.tipo === t));
  const comAviso = Q.itens.filter((c) => c.avisos.length).length;
  $("#tipos").innerHTML = tipos.map((t) => '<button type="button" class="filtro" data-tipo="' + esc(t) + '" aria-pressed="true" title="Mostrar ou esconder ' + esc(t) + '"><i></i>' + esc(t) + "</button>").join("")
    + (comAviso ? '<button type="button" class="filtro so critico" id="so-avisos" aria-pressed="false"><i></i>Só com aviso <b>' + comAviso + "</b></button>" : "");
  $("#tipos").addEventListener("click", (e) => {
    const b = e.target.closest(".filtro");
    if (!b) return;
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(on));
    if (b.id === "so-avisos") soAvisos = on; else if (on) desligados.delete(b.dataset.tipo); else desligados.add(b.dataset.tipo);
    desenhar();
  });
  const seg = $("#vista"), marcar = () => seg.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === vista)));
  seg.addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) { vista = local.vista = b.dataset.v; gravar(); marcar(); desenhar(); } });
  $("#busca").addEventListener("input", (e) => { texto = e.target.value.trim().toLowerCase(); desenhar(); });
  $("#copiar").addEventListener("click", async (e) => {
    const json = JSON.stringify(exportar(cfg), null, 2) + "\n";
    try { await navigator.clipboard.writeText(json); e.target.textContent = "Copiado"; setTimeout(() => { e.target.textContent = "Copiar JSON"; }, 2000); }
    catch { prompt("Copie o JSON:", json); }
  });
  $("#descartar").addEventListener("click", () => { cfg = structuredClone(servido); mudou(); });
  const g = new Date(D.gerado_em), p2 = (x) => String(x).padStart(2, "0");
  $("#gerado").textContent = "Gerado em " + p2(g.getDate()) + "/" + p2(g.getMonth() + 1) + "/" + g.getFullYear() + " " + p2(g.getHours()) + ":" + p2(g.getMinutes()) + ":" + p2(g.getSeconds());
  marcar(); desenhar();

  // o servidor fechou (Ctrl+C): a página sai; se ele voltar na mesma porta, recarrega
  const vivo = new EventSource("/vivo");
  vivo.onerror = () => { $("#fora").hidden = false; };
  vivo.onopen = () => { if (!$("#fora").hidden) location.reload(); };
}

const AVE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 175 185" class="ave" aria-hidden="true"><polygon points="56,57 70,42 90,38 104,46 106,62 84,74 57,70" style="fill:var(--cyan);stroke:var(--cyan)" stroke-width=".6" stroke-linejoin="round"/><polygon points="84,74 106,62 118,74 116,92 92,94" style="fill:var(--lime);stroke:var(--lime)" stroke-width=".6" stroke-linejoin="round"/><polygon points="57,70 84,74 92,94 86,122 70,112 60,92" style="fill:var(--brand);stroke:var(--brand)" stroke-width=".6" stroke-linejoin="round"/><polygon points="92,94 116,92 134,108 112,124 86,122" style="fill:var(--navy);stroke:var(--navy)" stroke-width=".6" stroke-linejoin="round"/><polygon points="86,122 112,124 132,152 118,170 94,146" style="fill:var(--green);stroke:var(--green)" stroke-width=".6" stroke-linejoin="round"/><polygon points="134,108 150,128 150,154 132,152 112,124" style="fill:var(--orange);stroke:var(--orange)" stroke-width=".6" stroke-linejoin="round"/><polygon points="132,152 150,154 180,196 164,198" style="fill:var(--teal);stroke:var(--teal)" stroke-width=".6" stroke-linejoin="round"/><polygon points="36,64 56,57 57,70" fill="#1B1F1C"/><circle cx="82" cy="54" r="4.6" fill="#0E1210"/><circle cx="83.6" cy="52.4" r="1.4" fill="#fff"/></svg>`;
const SOL = `<svg class="sol" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const LUA = `<svg class="lua" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
const PALETA = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>`;
const CERTO = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>`;
const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** A página: HTML único, sem rede, com o JSON da `sabia status` embutido em <script id="dados">. */
export function paginaHtml(status) {
  return `<!doctype html>
<html lang="pt-BR" data-sobria="sobria-sabia">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Quadro · ${esc(status.projeto)}</title>
<script>(${tema})()</script>
<style>${CSS}</style>
</head>
<body>
<header class="top">
  <span class="brand">${AVE}<span>Sabiá</span></span>
  <span class="ver">${esc(status.sabia)}</span>
  <span class="onde">Quadro Kanban<span>${esc(status.projeto)}</span></span>
  <label class="campo">Sprint <select id="sprint"></select></label>
  <div class="tema">
    <button type="button" class="modo-sw" role="switch" aria-checked="false" aria-label="Modo escuro" title="Claro ou escuro"><span class="trilha">${SOL}${LUA}</span><span class="botao">${SOL}${LUA}</span></button>
    <button type="button" class="tema-btn" popovertarget="temas" aria-label="Paleta" title="Paleta">${PALETA}</button>
    <div id="temas" popover role="menu" aria-label="Paleta">
      <button type="button" role="menuitemradio" data-v="sobria-sabia"><i class="sobria-sabia"></i>Sóbria${CERTO}</button>
      <button type="button" role="menuitemradio" data-v="sabia"><i class="sabia"></i>Sabiá${CERTO}</button>
    </div>
  </div>
</header>
<div class="ciclo" id="ciclo"></div>
<div class="barra">
  <div class="seg" id="vista" role="group" aria-label="Vista"><button type="button" data-v="quadro">Quadro</button><button type="button" data-v="lista">Lista</button></div>
  <div class="chips" id="tipos" role="group" aria-label="Tipos de item"></div>
  <input class="busca" id="busca" type="search" placeholder="Filtrar por id, título ou responsável" aria-label="Filtrar por id, título ou responsável">
  <div class="config">
    <p id="rascunho" role="status" hidden>Colunas alteradas só neste navegador: grave o JSON em <code>${esc(status.quadro.config.arquivo)}</code></p>
    <button type="button" class="btn" id="descartar" hidden>Descartar</button>
    <button type="button" class="btn" id="ocultas-btn" popovertarget="ocultas" hidden></button>
    <div id="ocultas" popover></div>
    <button type="button" class="btn" id="copiar" title="Copia a configuração das colunas (ordem, nomes e ocultas) para gravar em ${esc(status.quadro.config.arquivo)}">Copiar JSON</button>
  </div>
</div>
<main class="mesa"><div class="quadro" id="quadro"></div><div class="lista" id="lista" hidden></div></main>
<footer class="rodape"><span id="gerado"></span><span>Sabiá ${esc(status.sabia)}</span></footer>
<div id="menu" popover></div>
<div class="fora" id="fora" role="alert" hidden><h1>O quadro foi encerrado</h1><p>Rode <code>sabia kanban</code> de novo para abrir.</p></div>
<script id="dados" type="application/json">${JSON.stringify(status).replace(/</g, "\\u003c")}</script>
<script>(${cliente})()</script>
</body>
</html>`;
}

/** Servidor local: GET / (a página), /dados.json (o JSON cru) e /vivo (o sinal de que o servidor segue de pé).
 *  `gerar` roda a cada carga, para a página mostrar o projeto de agora. Sem porta pedida, usa a PORTA e, com ela
 *  ocupada, uma livre. `fechou` resolve quando o servidor fecha de fato (conexões incluídas). */
export function servirQuadro(gerar, { porta, host = "127.0.0.1" } = {}) {
  const server = http.createServer((req, res) => {
    const fim = (codigo, corpo, tipo = "text/plain; charset=utf-8") => { res.writeHead(codigo, { "content-type": tipo, "cache-control": "no-store" }); res.end(corpo); };
    if (req.method !== "GET" && req.method !== "HEAD") return fim(405, "use GET");
    if (req.url === "/vivo") { res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store" }); return res.write(": vivo\n\n"); }
    try {
      if (req.url === "/dados.json") return fim(200, JSON.stringify(gerar(), null, 2), "application/json; charset=utf-8");
      if (req.url === "/" || req.url === "/index.html") return fim(200, paginaHtml(gerar()), "text/html; charset=utf-8");
    } catch (e) { return fim(500, `sabia kanban: ${e.message}`); }
    return fim(404, "não encontrado");
  });
  return new Promise((resolve, reject) => {
    let fecharFechou;
    const fechou = new Promise((r) => { fecharFechou = r; });
    server.on("error", (e) => (e.code === "EADDRINUSE" && !porta ? server.listen(0, host) : reject(e)));
    server.on("listening", () => {
      const { port } = server.address();
      server.on("close", fecharFechou);
      resolve({
        url: `http://${host}:${port}/`, porta: port, host,
        fechar: () => { if (server.listening) { server.close(); server.closeAllConnections?.(); } else fecharFechou(); },
        fechou,
      });
    });
    server.listen(porta || PORTA, host);
  });
}

/** O comando: confere o projeto (sem backlog, falha antes de servir), sobe o servidor, escreve a URL no log e
 *  devolve { url, fechar, fechou }; quem chama decide quando aguardar o fechamento (o comando espera o sinal). */
export async function abrirQuadro({ projeto = ".", exec, log = console.log, porta, host, agora } = {}) {
  const gerar = () => statusDoProjeto({ projeto, exec, agora });
  gerar();
  const q = await servirQuadro(gerar, { porta: Number.parseInt(porta, 10) || 0, host });
  // a URL sozinha na linha: o terminal a torna clicável; com OSC 8, também onde ele não detecta o link
  const link = process.stdout.isTTY ? `\x1b]8;;${q.url}\x1b\\${q.url}\x1b]8;;\x1b\\` : q.url;
  log(`Quadro Kanban do projeto ${gerar().projeto} (Ctrl+C encerra):\n\n  ${link}\n`);
  return q;
}
