// `sabia kanban`: o quadro Kanban do projeto numa página local. A página desenha só o que a `sabia status` gera
// (a seção `quadro`: colunas, cards, WIP e alertas); o tema é o do site (paletas Sóbria - Sabiá e Sabiá, modo
// claro/escuro). Quem reordena, renomeia ou oculta colunas na página copia o JSON para o CONFIG_KANBAN do projeto.
// Servidor node:http sem dependências: cada carga da página lê o projeto de novo; ao fechar, a página avisa.
import http from "node:http";
import { statusDoProjeto } from "./status.mjs";

const PORTA = 4780;  // fixa para o navegador guardar o tema e o rascunho (o localStorage é por origem)

const CSS = `
:root{
  --bg:#ffffff; --card:#ffffff; --ink:#474D66; --title:#2C5168; --muted:#696F8C; --line:#E6E8F0; --soft:#F4F6FA; --grey:#F9FAFC; --grey2:#EDEFF5;
  --acento:#2C5168; --brand:#2C5168; --brand-hover:#24445A; --blue:#0086C8; --navy:#2C5168; --cyan:#00BBCE; --teal:#0094AD; --green:#76B043; --lime:#B2D235; --yellow:#FEBE10; --orange:#FAA61A; --red:#D9534F;
  --r:8px; --r-sm:4px; --r-xs:3px;
  --display:"SF UI Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --body:"SF UI Text",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:"SF Mono",Monaco,Inconsolata,"Fira Mono","Droid Sans Mono","Source Code Pro",monospace;
  --raised:0 1px 1px #1E1F2140,0 0 1px #1E1F214F;
  --overlay:0 8px 12px #1E1F2126,0 0 1px #1E1F214F;
  --borda:#C1C4D6;
}
:root[data-modo="escuro"]{
  color-scheme:dark;
  --bg:#1F1F21; --card:#242528; --ink:#CECFD2; --title:#DFE1E5; --muted:#96999E; --line:#3D3F43; --soft:#2B2C2F; --grey:#18191A; --grey2:#333438;
  --acento:#9DB7CC; --brand:#6E93B3; --brand-hover:#9DB7CC; --blue:#5C85FF; --navy:#2C5168; --borda:#3D3F43;
  --raised:0 0 0 1px #3D3F43; --overlay:0 8px 12px #01040475,0 0 1px #01040480;
}
/* paletas, como o tema.css do site: Sóbria - Sabiá (data-sobria) e Sabiá (data-paleta) */
:root:is([data-sobria="sobria-sabia"],[data-paleta="sabia"]){--brand:#219EBC; --blue:#187F97; --navy:#023047; --cyan:#8ECAE6; --lime:#FFB703; --green:#219EBC; --orange:#FB8500; --teal:#63787D; --yellow:#FFB703}
:root:is([data-sobria="sobria-sabia"],[data-paleta="sabia"]):not([data-modo="escuro"]){--ink:#38494D; --title:#023047; --muted:#63787D; --line:#D0DADD; --soft:#F0F8F9; --grey:#F6F8F9; --grey2:#E7EDEE; --acento:#187F97}
:root:is([data-sobria="sobria-sabia"],[data-paleta="sabia"])[data-modo="escuro"]{--acento:#5AB4D6; --blue:#219EBC}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;display:flex;flex-direction:column;height:100dvh;background:var(--bg);color:var(--ink);font:400 14px/20px var(--body)}
h1,h2,h3,p{margin:0}
h1,h2,h3{font-family:var(--display);font-weight:600;letter-spacing:0;color:var(--title)}
button,input{font:inherit;color:inherit}
button{cursor:pointer}
a{color:var(--blue)}
code{font:500 12px/16px var(--mono);background:var(--soft);color:var(--title);padding:1px 5px;border-radius:var(--r-xs)}
:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
::selection{background:color-mix(in srgb,var(--brand) 28%,transparent)}
[hidden]{display:none!important}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* topo: a marca, a versão e os controles de tema do site */
.top{display:flex;align-items:center;gap:14px;padding:10px 20px;border-bottom:1px solid var(--line)}
.brand{display:inline-flex;align-items:center;gap:10px;font:600 20px/1 var(--display);color:var(--title)}
.ave{width:32px;height:32px;flex:none}
.ver{font:600 12px/1 var(--mono);color:var(--muted)}
.onde{display:flex;align-items:baseline;gap:8px;padding-left:14px;border-left:1px solid var(--line);font:600 14px/20px var(--display);color:var(--title);min-width:0}
.onde span{font:400 13px/20px var(--body);color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tema{display:flex;align-items:center;gap:8px;margin-left:auto}
.tema svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.tema-btn{display:grid;place-items:center;width:38px;height:38px;padding:0;border:1px solid var(--borda);border-radius:var(--r-sm);background:var(--card);color:var(--ink)}
.tema-btn:hover{background:var(--soft);color:var(--title)}
.modo-sw{position:relative;width:64px;height:34px;padding:0;border:1px solid var(--borda);border-radius:999px;background:var(--soft);color:var(--muted)}
.modo-sw .trilha{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 8px}
.modo-sw .botao{position:absolute;top:3px;left:3px;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--card);color:var(--yellow);box-shadow:var(--raised);transition:transform .2s ease}
.modo-sw .botao svg{grid-area:1/1;width:16px;height:16px}
.modo-sw .botao .lua,.modo-sw[aria-checked="true"] .botao .sol{display:none}
.modo-sw[aria-checked="true"] .botao .lua{display:block}
.modo-sw[aria-checked="true"] .botao{transform:translateX(30px);color:var(--acento)}
[popover]{position:absolute;inset:auto;margin:0;padding:4px;min-width:170px;border:0;border-radius:var(--r);background:var(--card);color:var(--ink);box-shadow:var(--overlay)}
[data-modo="escuro"] [popover]{box-shadow:var(--overlay),0 0 0 1px var(--line)}
[popover] button{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:0;border-radius:var(--r-sm);background:none;font:400 14px/20px var(--body);text-align:left}
[popover] button:hover{background:var(--soft)}
#temas button[aria-checked="true"]{font-weight:600;color:var(--title)}
#temas button[aria-checked="true"]::after{content:"✓";margin-left:auto}
#temas i{width:16px;height:16px;border-radius:50%;flex:none}
#temas i.sobria-sabia{background:linear-gradient(135deg,#F0F8F9 50%,#023047 50%);box-shadow:inset 0 0 0 1px #D0DADD}
#temas i.sabia{background:linear-gradient(135deg,#187F97 50%,#FFB703 50%)}

/* a sprint e os alertas do quadro */
.ciclo{display:flex;align-items:center;flex-wrap:wrap;gap:6px 14px;padding:10px 20px 0}
.ciclo h1{font-size:16px;line-height:24px}
.ciclo .quando{color:var(--muted)}
.ciclo .meta{flex:1 1 320px;min-width:0;color:var(--ink)}
.ciclo .meta b{color:var(--title);font-weight:600}
.alertas{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:0;padding:8px 20px 0}
.alerta{display:flex;align-items:flex-start;gap:6px;padding:4px 10px 4px 8px;border-radius:var(--r-sm);font-size:13px;line-height:18px;color:var(--title);background:color-mix(in srgb,var(--cor) 13%,var(--card));box-shadow:inset 3px 0 0 var(--cor)}
.alerta svg,.av svg{flex:none;width:14px;height:14px;margin-top:2px;fill:none;stroke:var(--cor);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.critico{--cor:var(--red)}
.atencao{--cor:var(--orange)}

/* a barra: escopo, tipos (legenda e filtro), busca, colunas ocultas e o rascunho da configuração */
.barra{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;padding:10px 20px}
.seg{display:inline-flex;border:1px solid var(--borda);border-radius:var(--r-sm);overflow:hidden}
.seg button{border:0;background:var(--card);padding:6px 12px;font:500 13px/18px var(--body);color:var(--ink)}
.seg button+button{border-left:1px solid var(--borda)}
.seg button[aria-pressed="true"]{background:var(--navy);color:#fff}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.filtro{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 10px;border:1px solid var(--borda);border-radius:999px;background:var(--card);font:500 13px/1 var(--body);color:var(--ink)}
.filtro i{width:10px;height:10px;border-radius:2px;background:var(--tipo,var(--cor,var(--muted)))}
.filtro b{font-weight:600;color:var(--muted)}
.filtro[aria-pressed="false"]{color:var(--muted);background:var(--grey);text-decoration:line-through}
.filtro[aria-pressed="false"] i{opacity:.35}
.filtro.so[aria-pressed="true"]{background:color-mix(in srgb,var(--cor) 16%,var(--card));border-color:var(--cor);color:var(--title)}
.filtro.so[aria-pressed="false"]{text-decoration:none;color:var(--ink);background:var(--card)}
.busca{height:32px;width:300px;max-width:100%;padding:0 10px;border:1px solid var(--borda);border-radius:var(--r-sm);background:var(--card)}
.busca::placeholder{color:var(--muted)}
.btn{height:32px;padding:0 12px;border:1px solid var(--borda);border-radius:var(--r-sm);background:var(--card);font:500 13px/1 var(--body)}
.btn:hover{background:var(--soft);color:var(--title)}
.btn.pri{border-color:transparent;background:var(--yellow);color:#022338;font-weight:600}
.btn.pri:hover{filter:brightness(1.06);background:var(--yellow);color:#022338}
.empurra{margin-left:auto}
.rascunho{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;margin:0 20px 10px;padding:8px 12px;border-radius:var(--r-sm);background:color-mix(in srgb,var(--yellow) 14%,var(--card));box-shadow:inset 3px 0 0 var(--yellow);color:var(--title)}
.rascunho p{flex:1 1 360px}

/* o quadro: colunas em cinza claro e cards brancos com a sombra raised; cada coluna rola por dentro */
.quadro{flex:1;min-height:0;display:flex;align-items:flex-start;gap:10px;padding:2px 20px 14px;overflow:auto}
.coluna{flex:0 0 280px;display:flex;flex-direction:column;max-height:100%;border-radius:var(--r);background:var(--grey);box-shadow:inset 0 0 0 1px var(--line)}
.cab{display:flex;align-items:center;gap:6px;padding:10px 6px 6px 12px;cursor:grab}
.cab h2{flex:1;min-width:0;font-size:13px;line-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.conta{font:600 11px/18px var(--display);min-width:20px;text-align:center;padding:0 6px;border-radius:999px;background:var(--grey2);color:var(--muted)}
.wip{font:600 11px/18px var(--display);padding:0 6px;border-radius:var(--r-xs);white-space:nowrap;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:var(--muted)}
.wip.estourado{background:color-mix(in srgb,var(--red) 16%,var(--card));box-shadow:inset 0 0 0 1px var(--red);color:var(--title)}
.menu-btn{flex:none;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--r-sm);background:none;color:var(--muted);font:700 16px/1 var(--display)}
.menu-btn:hover{background:var(--grey2);color:var(--title)}
.renomear{flex:1;min-width:0;height:26px;padding:0 6px;border:1px solid var(--blue);border-radius:var(--r-sm);background:var(--card);font:600 13px/20px var(--display);color:var(--title)}
/* a coluna sem item fica magra, com o nome em pé: sobra largura para as que têm trabalho */
.coluna.magra{flex-basis:44px}
.magra .cab{flex-direction:column;gap:8px;padding:10px 0 12px}
.magra .cab h2{flex:none;writing-mode:vertical-rl;max-height:240px;line-height:20px}
.magra .conta{order:-1}
.magra .cartoes{display:none}
.cartoes{flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:2px 8px 10px}
.vazia{padding:6px 4px;color:var(--muted);font-size:13px}
.indo{opacity:.45}
.solta-e{box-shadow:-3px 0 0 var(--blue),inset 0 0 0 1px var(--line)}
.solta-d{box-shadow:3px 0 0 var(--blue),inset 0 0 0 1px var(--line)}

/* o em andamento: um substrato tinto do primeiro ao último status dele; recolhido, vira uma coluna só */
.grupo{flex:0 0 auto;display:flex;flex-direction:column;max-height:100%;border-radius:var(--r);--tom:color-mix(in srgb,var(--brand) 15%,var(--bg));background:var(--tom);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--brand) 38%,var(--line))}
[data-modo="escuro"] .grupo{--tom:color-mix(in srgb,var(--brand) 22%,var(--bg))}
[data-paleta] .grupo{padding-top:5px;background:linear-gradient(90deg,var(--cyan) 0 14.29%,var(--lime) 0 28.57%,var(--brand) 0 42.86%,var(--navy) 0 57.14%,var(--green) 0 71.43%,var(--orange) 0 85.71%,var(--teal) 0) top/100% 5px no-repeat,var(--tom)}
.grupo.recolhido{flex-basis:280px;width:280px}
.grupo>.cab{padding:8px 6px 8px 8px}
.grupo>.cab h2{flex:0 1 auto;font-size:14px}
.grupo>.cab .wips{display:flex;flex-wrap:wrap;gap:6px}
.grupo>.cab .menu-btn{margin-left:auto}
.grupo.recolhido>.cab{flex-wrap:wrap}
.grupo.recolhido .wips{order:9;flex-basis:100%;padding-left:34px}
.dobra{flex:none;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--r-sm);background:none;color:var(--title)}
.dobra:hover{background:color-mix(in srgb,var(--brand) 18%,transparent)}
.dobra svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;transition:transform .15s ease}
.dobra[aria-expanded="false"] svg{transform:rotate(-90deg)}
.grupo-colunas{flex:1;min-height:0;display:flex;gap:8px;padding:0 8px 8px}
.coluna.sub{flex-basis:264px;max-height:none;background:color-mix(in srgb,var(--card) 62%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--brand) 22%,var(--line))}
.coluna.sub.solta-e{box-shadow:-3px 0 0 var(--blue)}
.coluna.sub.solta-d{box-shadow:3px 0 0 var(--blue)}

/* o card: fundo do cartão com o filete na cor do tipo (Sóbria) ou o chapéu cheio (Sabiá) */
.cartao{--tipo:var(--muted);--tipo-txt:#fff;flex:none;border-radius:var(--r-sm);background:var(--card);box-shadow:var(--raised),inset 0 3px 0 var(--tipo);overflow:hidden}
[data-tipo="fatia"]{--tipo:var(--brand);--tipo-txt:#022338}
[data-tipo="bug"]{--tipo:var(--orange);--tipo-txt:#022338}
[data-tipo="épico"]{--tipo:var(--navy)}
[data-tipo="sustentação"]{--tipo:var(--teal)}
[data-modo="escuro"] [data-tipo="épico"]{--tipo:#6FA8C8;--tipo-txt:#022338}
.cartao.critico{box-shadow:0 0 0 2px var(--red),inset 0 3px 0 var(--tipo)}
.cartao.atencao{box-shadow:0 0 0 2px var(--orange),inset 0 3px 0 var(--tipo)}
.chapeu{display:flex;align-items:center;gap:8px;padding:10px 12px 0}
.chapeu .id{font:600 12px/16px var(--mono);color:var(--title)}
.loz{font:700 10px/16px var(--display);text-transform:uppercase;letter-spacing:.04em;padding:0 6px;border-radius:var(--r-xs);background:color-mix(in srgb,var(--tipo) 16%,var(--card));color:color-mix(in srgb,var(--tipo) 50%,var(--title))}
.loz.fase{background:var(--grey2);color:var(--ink)}
.loz.urg{margin-left:auto;background:var(--red);color:#fff}
[data-paleta] .cartao{box-shadow:var(--raised)}
[data-paleta] .cartao.critico{box-shadow:0 0 0 2px var(--red)}
[data-paleta] .cartao.atencao{box-shadow:0 0 0 2px var(--orange)}
[data-paleta] .chapeu{padding:6px 12px;background:var(--tipo)}
[data-paleta] .chapeu :is(.id,.loz.tipo){color:var(--tipo-txt)}
[data-paleta] .loz.tipo{background:color-mix(in srgb,var(--tipo-txt) 16%,transparent)}
.corpo{padding:6px 12px 10px}
.corpo h3{font-size:14px;line-height:20px;overflow-wrap:anywhere}
.semtitulo{color:var(--muted);font-style:italic;font-weight:400}
.linha{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;margin-top:8px;font-size:12px;line-height:18px;color:var(--muted)}
.quem{display:inline-flex;align-items:center;gap:6px;margin-right:auto;color:var(--ink)}
.quem i{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--navy);color:#fff;font:600 10px/1 var(--display);font-style:normal}
.quem.sem{color:var(--muted)}
.quem.sem i{background:var(--grey2);color:var(--muted)}
.dado{padding:0 6px;border-radius:var(--r-xs);background:var(--soft);color:var(--ink);white-space:nowrap}
.dado b{font-weight:600;color:var(--muted)}
.avisos{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:4px}
.av{display:flex;gap:6px;padding:4px 8px;border-radius:var(--r-xs);font-size:12px;line-height:18px;color:var(--title);background:color-mix(in srgb,var(--cor) 13%,var(--card))}

.rodape{display:flex;gap:6px 16px;flex-wrap:wrap;padding:8px 20px;border-top:1px solid var(--line);color:var(--muted);font-size:12px;line-height:16px}
.fora{position:fixed;inset:0;z-index:9;display:grid;place-content:center;gap:8px;text-align:center;padding:24px;background:var(--bg)}
.fora h1{font-size:20px;line-height:28px}
@media (max-width:820px){.top,.ciclo,.barra,.rodape{padding-inline:12px}.alertas{padding-inline:12px}.quadro{padding-inline:12px}.rascunho{margin-inline:12px}.ver,.onde span{display:none}.busca{width:100%}}
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
      m.style.top = r.bottom + 6 + "px"; m.style.right = document.documentElement.clientWidth - r.right + "px";
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

// A página no navegador: desenha o quadro do JSON embutido e guarda as mudanças de coluna como rascunho.
function cliente() {
  const D = JSON.parse(document.getElementById("dados").textContent), Q = D.quadro;
  const $ = (s) => document.querySelector(s);
  const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
  const dataBr = (d) => d.slice(8, 10) + "/" + d.slice(5, 7) + (d.length > 10 ? "" : "/" + d.slice(0, 4));
  const ICO = {
    critico: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9z"/><path d="M12 8v4M12 16h.01"/></svg>',
    atencao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  };
  const NIVEL = { critico: "Crítico", atencao: "Atenção" };

  // o que fica só neste navegador: o rascunho das colunas, o em andamento recolhido e o escopo
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

  let escopo = D.sprint && local.escopo !== "backlog" ? "sprint" : "backlog", recolhido = local.recolhido === true, texto = "", soAvisos = false;
  const desligados = new Set();
  const visivel = (c) => (escopo === "backlog" || c.na_sprint) && !desligados.has(c.tipo ?? "") && (!soAvisos || c.avisos.length)
    && (!texto || [c.id, c.titulo, c.responsavel].join(" ").toLowerCase().includes(texto));

  function cartao(c, comFase) {
    const nivel = c.avisos.some((a) => a.nivel === "critico") ? " critico" : c.avisos.length ? " atencao" : "";
    const dado = (rotulo, valor, dica) => '<span class="dado"' + (dica ? ' title="' + esc(dica) + '"' : "") + ">" + (rotulo ? "<b>" + rotulo + "</b> " : "") + valor + "</span>";
    const d = [];
    if (c.tamanho) d.push(dado("", esc(c.tamanho), "tamanho"));
    if (c.idade_dias != null) d.push(dado("idade", c.idade_dias + " d", "dias desde " + dataBr(c.iniciada_em) + (Q.sle ? " · SLE: " + Q.sle.dias + " dias" : "")));
    if (c.lead_time_dias != null) d.push(dado("lead time", c.lead_time_dias + " d", "concluída em " + dataBr(c.concluida_em)));
    if (c.adiada_ate) d.push(dado("até", dataBr(c.adiada_ate)));
    if (c.mr) d.push(dado("MR", /^https?:/.test(c.mr.url) ? '<a href="' + esc(c.mr.url) + '" target="_blank" rel="noopener">' + (c.mr.iid ? "!" + c.mr.iid : "abrir") + "</a>" : esc(c.mr.url)));
    if (c.pai) d.push(dado("pai", esc(c.pai)));
    if (c.ib) d.push(dado("IB", esc(c.ib)));
    if (c.trilha) d.push(dado("", esc(c.trilha), "trilha"));
    if (c.autonomia) d.push(dado("", esc(c.autonomia), "autonomia"));
    for (const s of c.sprint) if (s.tarefas) d.push(dado("", esc(s.tarefas), "tarefas do EWM"));
    const r = c.responsavel, ini = r ? r.split(/[.\s_-]+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") : "?";
    return '<article class="cartao' + nivel + '" data-tipo="' + esc(c.tipo) + '">'
      + '<div class="chapeu"><span class="id">' + esc(c.id) + '</span><span class="loz tipo">' + esc(c.tipo ?? "sem tipo") + "</span>"
      + (c.avisos.some((a) => a.tipo === "urgente") ? '<span class="loz urg">urgente</span>' : "") + "</div>"
      + '<div class="corpo"><h3>' + (c.titulo ? esc(c.titulo) : '<span class="semtitulo">sem título</span>') + "</h3>"
      + '<div class="linha"><span class="quem' + (r ? "" : " sem") + '"><i aria-hidden="true">' + esc(ini) + "</i>" + esc(r ?? "sem responsável") + "</span>"
      + (comFase ? '<span class="loz fase">' + esc(col(c.coluna)?.nome ?? c.coluna) + "</span>" : "") + "</div>"
      + (d.length ? '<div class="linha">' + d.join("") + "</div>" : "")
      + (c.avisos.length ? '<ul class="avisos">' + c.avisos.map((a) => '<li class="av ' + a.nivel + '">' + ICO[a.nivel] + '<span><span class="sr">' + NIVEL[a.nivel] + ": </span>" + esc(a.mensagem) + "</span></li>").join("") + "</ul>" : "")
      + "</div></article>";
  }
  const chipWip = (w, nome) => '<span class="wip' + (w.atual > w.limite ? " estourado" : "") + '" title="WIP do acordos.md: até ' + w.limite + (w.atual > w.limite ? " — estourado" : "")
    + ' (conta fatias e bugs do backlog inteiro)">' + (nome ? esc(nome) + " " : "WIP ") + w.atual + "/" + w.limite + "</span>";
  const cartoes = (cs, comFase) => '<div class="cartoes">' + (cs.map((c) => cartao(c, comFase)).join("") || '<p class="vazia">Nenhum item</p>') + "</div>";
  function coluna(c) {
    const cs = Q.itens.filter((x) => x.coluna === c.id && visivel(x)), w = Q.wip.find((x) => x.colunas.length === 1 && x.colunas[0] === c.id);
    return '<section class="coluna' + (c.grupo ? " sub" : "") + (cs.length ? "" : " magra") + '" data-id="' + esc(c.id) + '" aria-label="' + esc(c.nome) + '">'
      + '<header class="cab" draggable="true" data-arrasta="' + esc(c.id) + '"><h2 title="' + esc(c.nome) + ' — dois cliques renomeiam">' + esc(c.nome) + '</h2><span class="conta">' + cs.length + "</span>"
      + (w ? chipWip(w) : "") + '<button type="button" class="menu-btn" data-menu="' + esc(c.id) + '" aria-label="Opções da coluna ' + esc(c.nome) + '">⋯</button></header>'
      + cartoes(cs) + "</section>";
  }
  function grupo(cols) {
    const cs = Q.itens.filter((x) => NO_GRUPO.has(x.coluna) && visivel(x)).sort((a, b) => cols.findIndex((c) => c.id === a.coluna) - cols.findIndex((c) => c.id === b.coluna));
    const wips = Q.wip.filter((w) => w.colunas.length > 1 && w.colunas.every((id) => NO_GRUPO.has(id)));
    return '<section class="grupo' + (recolhido ? " recolhido" : "") + '" data-id="@grupo" aria-label="' + esc(cfg.grupo) + '">'
      + '<header class="cab" draggable="true" data-arrasta="@grupo"><button type="button" class="dobra" aria-expanded="' + !recolhido + '" aria-label="' + (recolhido ? "Expandir " : "Recolher ") + esc(cfg.grupo) + '">'
      + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><h2 title="' + esc(cfg.grupo) + ' — dois cliques renomeiam">' + esc(cfg.grupo) + '</h2><span class="conta">' + cs.length + "</span>"
      + '<span class="wips">' + wips.map((w) => chipWip(w, w.nome)).join("") + '</span><button type="button" class="menu-btn" data-menu="@grupo" aria-label="Opções de ' + esc(cfg.grupo) + '">⋯</button></header>'
      + (recolhido ? cartoes(cs, true) : '<div class="grupo-colunas">' + cols.filter((c) => !c.oculta).map(coluna).join("") + "</div>") + "</section>";
  }
  const quadro = $("#quadro");
  function desenhar() {
    const doGrupo = cfg.colunas.filter((c) => NO_GRUPO.has(c.id));
    let feito = false;
    quadro.innerHTML = cfg.colunas.map((c) => (NO_GRUPO.has(c.id) ? (feito ? "" : ((feito = true), grupo(doGrupo))) : c.oculta ? "" : coluna(c))).join("");
    const ocultas = cfg.colunas.filter((c) => c.oculta);
    $("#ocultas-btn").hidden = !ocultas.length;
    $("#ocultas-btn").textContent = "Colunas ocultas (" + ocultas.length + ")";
    $("#ocultas").innerHTML = ocultas.map((c) => '<button type="button" data-mostrar="' + esc(c.id) + '">Mostrar ' + esc(c.nome) + "</button>").join("");
    $("#rascunho").hidden = igual(exportar(cfg), servido);
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
    const lista = sub ? doGrupo : topo, de = lista.indexOf(id);
    if (de < 0 || id === alvo || !lista.includes(alvo)) return;
    lista.splice(de, 1); lista.splice(lista.indexOf(alvo) + (depois ? 1 : 0), 0, id);
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
  function dobrar() { recolhido = !recolhido; local.recolhido = recolhido; gravar(); desenhar(); quadro.querySelector(".dobra").focus(); }

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
    menu.style.top = r.bottom + 4 + "px"; menu.style.left = Math.min(r.left, innerWidth - 190) + "px";
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
    e.target.style.top = r.bottom + 4 + "px"; e.target.style.left = Math.min(r.left, innerWidth - 240) + "px";
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

  // a barra: escopo, tipos, só com aviso, busca e o rascunho
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
  const seg = $("#escopo");
  seg.hidden = !D.sprint;
  const marcar = () => seg.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === escopo)));
  seg.addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) { escopo = local.escopo = b.dataset.v; gravar(); marcar(); desenhar(); } });
  $("#busca").addEventListener("input", (e) => { texto = e.target.value.trim().toLowerCase(); desenhar(); });
  $("#copiar").addEventListener("click", async (e) => {
    const json = JSON.stringify(exportar(cfg), null, 2) + "\n";
    try { await navigator.clipboard.writeText(json); e.target.textContent = "Copiado"; setTimeout(() => { e.target.textContent = "Copiar JSON"; }, 2000); }
    catch { prompt("Copie o JSON:", json); }
  });
  $("#descartar").addEventListener("click", () => { cfg = structuredClone(servido); mudou(); });

  // a sprint, os alertas do quadro e o rodapé
  const hoje = D.gerado_em.slice(0, 10), sp = D.sprint;
  if (sp) {
    const dia = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5), total = dia(sp.inicio, sp.fim) + 1, n = dia(sp.inicio, hoje) + 1;
    $("#ciclo").innerHTML = "<h1>" + esc(sp.chave) + '</h1><span class="quando">' + dataBr(sp.inicio) + " → " + dataBr(sp.fim) + " · "
      + (n < 1 ? "começa em " + dataBr(sp.inicio) : n > total ? "encerrada" : "dia " + n + " de " + total) + "</span>" + (sp.meta ? '<p class="meta"><b>Meta:</b> ' + esc(sp.meta) + "</p>" : "");
  } else $("#ciclo").innerHTML = '<h1>Backlog</h1><span class="quando">sem sprint: o quadro mostra o backlog inteiro</span>';
  $("#alertas").innerHTML = Q.alertas.map((a) => '<li class="alerta ' + a.nivel + '">' + ICO[a.nivel] + "<span>" + esc(a.mensagem) + "</span></li>").join("");
  $("#alertas").hidden = !Q.alertas.length;
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
  <span class="onde">Quadro Kanban <span>${esc(status.projeto)}</span></span>
  <div class="tema">
    <button type="button" class="modo-sw" role="switch" aria-checked="false" aria-label="Modo escuro" title="Claro ou escuro"><span class="trilha">${SOL}${LUA}</span><span class="botao">${SOL}${LUA}</span></button>
    <button type="button" class="tema-btn" popovertarget="temas" aria-label="Paleta" title="Paleta">${PALETA}</button>
    <div id="temas" popover role="menu" aria-label="Paleta">
      <button type="button" role="menuitemradio" data-v="sobria-sabia"><i class="sobria-sabia"></i>Sóbria</button>
      <button type="button" role="menuitemradio" data-v="sabia"><i class="sabia"></i>Sabiá</button>
    </div>
  </div>
</header>
<div class="ciclo" id="ciclo"></div>
<ul class="alertas" id="alertas" aria-label="Alertas do quadro" hidden></ul>
<div class="barra">
  <div class="seg" id="escopo" role="group" aria-label="Itens do quadro"><button type="button" data-v="sprint">Sprint</button><button type="button" data-v="backlog">Backlog inteiro</button></div>
  <div class="chips" id="tipos" role="group" aria-label="Tipos de item"></div>
  <input class="busca" id="busca" type="search" placeholder="Filtrar por id, título ou responsável" aria-label="Filtrar por id, título ou responsável">
  <button type="button" class="btn empurra" id="ocultas-btn" popovertarget="ocultas" hidden></button>
  <div id="ocultas" popover></div>
</div>
<div class="rascunho" id="rascunho" role="status" hidden>
  <p>As colunas mudaram só neste navegador. Para valer no projeto, grave o JSON em <code>${esc(status.quadro.config.arquivo)}</code> e faça o commit.</p>
  <button type="button" class="btn pri" id="copiar">Copiar JSON</button>
  <button type="button" class="btn" id="descartar">Descartar</button>
</div>
<main class="quadro" id="quadro"></main>
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
