// `sabia retrospective` e `sabia review`: a página da cerimônia, no tema do quadro Kanban. O time entra só com o nome, inclui
// pontos, vota e remove; a cerimônia fica na memória do servidor, e o `sprint-<nn>.md` só muda no botão Publicar, que
// pede a mensagem, grava a seção `## Retro` (ou `## Review`) e faz o commit e o push na branch base. Quem levantou e quem votou em cada ponto vai na própria linha.
// Servidor node:http sem dependências, como o do quadro; com --rede, escuta na rede local para o time abrir o link.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { statusDoProjeto, sprintsDe, tabela, semValor } from "./status.mjs";
import { usuarioDaMaquina } from "./acoes.mjs";
import { CSS, tema, AVE, SOL, LUA, PALETA, CERTO, esc, linksDaRede } from "./kanban.mjs";

const MODOS = {
  retrospective: { titulo: "Retrospectiva", secao: "Retro", commit: "retrospectiva", porta: 4782 },
  review: { titulo: "Review", secao: "Review", commit: "review", porta: 4781 },
};
// os cinco grupos da retro, na ordem da página e a palavra de cada um na linha do sprint-<nn>.md (template sa-planejamento/sprint.md)
const RETRO = [
  { id: "positivo", nome: "Pontos positivos", tag: "Positivo", linha: "Positivo" },
  { id: "negativo", nome: "Pontos negativos", tag: "Negativo", linha: "Negativo" },
  { id: "melhoria", nome: "Pontos de melhoria", tag: "Melhoria", linha: "Melhoria" },
  { id: "licao", nome: "Lições aprendidas", tag: "Lição", linha: "Lição" },
  { id: "acao", nome: "Ações propostas", tag: "Ação", linha: "Ação" },
];
// as palavras do formato anterior da Retro (bom · melhorar · ações), ainda lidas dos sprint-<nn>.md já gravados
const ANTIGAS = { Bom: "Positivo", Melhorar: "Melhoria" };
const PEDIDO = "pedido", LINHA_PEDIDO = "pedido novo";
const CONCLUIDOS = ["concluida", "concluido"];
const PRINCIPAL = { fatia: "desenvolvimento", bug: "desenvolvimento", "sustentação": "atendimento", "épico": "especificação" };
const ehData = (x) => /^\d{4}-\d{2}-\d{2}$/.test(x ?? "");
const dias = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
// o texto da pessoa vira uma linha de lista do .md: sem quebra, sem barra vertical e sem o separador das partes
const limpo = (x, max = 280) => String(x ?? "").replace(/[|\r\n]+/g, " ").replace(/ · /g, " - ").replace(/\s+/g, " ").trim().slice(0, max);
// o nome da pessoa vai dentro da linha do ponto: sem os sinais que separam as partes dela
const nomeLimpo = (x) => limpo(x, 40).replace(/[(),;]|—/g, " ").replace(/\s+/g, " ").trim();
export const chaveDe = (nome) => String(nome ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const votosDe = (i) => i.votos.length + (i.base ?? 0);
const plural = (n) => `${n} voto${n === 1 ? "" : "s"}`;

/** Os números do ciclo pelas linhas da sprint: por trabalho, quantas linhas, as concluídas até o fim da sprint, as
 *  concluídas depois, as abertas e o lead time médio (concluida_em − iniciada_em). */
export function numerosDaSprint(sprint) {
  return ["especificação", "desenvolvimento", "atendimento"].map((trabalho) => {
    const ls = sprint.itens.filter((x) => x.Trabalho === trabalho), fechadas = ls.filter((x) => ehData(x.concluida_em));
    const leads = fechadas.filter((x) => ehData(x.iniciada_em)).map((x) => dias(x.iniciada_em, x.concluida_em));
    return { trabalho, linhas: ls.length, no_prazo: fechadas.filter((x) => x.concluida_em <= sprint.fim).length, depois: fechadas.filter((x) => x.concluida_em > sprint.fim).length,
      abertas: ls.length - fechadas.length, lead_medio: leads.length ? Math.round(10 * leads.reduce((a, b) => a + b, 0) / leads.length) / 10 : null };
  }).filter((n) => n.linhas);
}

const TERMINAIS_OK = ["concluida", "concluido"];
const norma = (x) => String(x ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** As Lições aprendidas dos itens concluídos da sprint, candidatas a Regra aprendida: da tabela Lição do `status.md`
 *  da fatia (Kiro `.kiro/specs/<id>-…/`, OpenSpec `openspec/changes/<id>-…/` ou o archive) e do registro de
 *  Sustentação. O texto do ponto é a regra proposta (sem ela, a lição); `ja_esta` marca a que já é Regra aprendida do
 *  `.sabia/sabia.md`. A lição do MR da trilha trivial não é lida aqui. */
export function licoesDoCiclo(raiz, sprint, itens) {
  const ler = (f) => { try { return fs.readFileSync(f, "utf8"); } catch { return ""; } };
  const dirs = (d) => { try { return fs.readdirSync(path.join(raiz, d)); } catch { return []; } };
  const sabiaMd = ler(path.join(raiz, ".sabia/sabia.md")), regras = lerSecao(sabiaMd, "Regras aprendidas").filter((l) => /^- /.test(l)).map((l) => norma(l.slice(2).split(" · ")[0]));
  const out = [];
  for (const id of new Set(sprint.itens.map((x) => x.Item))) {
    const item = itens.find((c) => c.id === id);
    if (!item || !TERMINAIS_OK.includes(item.status)) continue;
    const pre = id.toLowerCase() + "-", arquivos = [
      ...dirs(".kiro/specs").filter((d) => d.toLowerCase().startsWith(pre)).map((d) => path.join(".kiro/specs", d, "status.md")),
      ...dirs("openspec/changes").filter((d) => d.toLowerCase().startsWith(pre)).map((d) => path.join("openspec/changes", d, "status.md")),
      ...dirs("openspec/changes/archive").filter((d) => d.toLowerCase().includes("-" + pre)).map((d) => path.join("openspec/changes/archive", d, "status.md")),
      ...dirs(".sabia/planejamento/sustentacao").filter((d) => d.toLowerCase().startsWith(pre)).map((d) => path.join(".sabia/planejamento/sustentacao", d)),
    ];
    for (const arq of arquivos) for (const l of tabela(ler(path.join(raiz, arq)), "Lição")) {
      if (semValor(l["Lição"])) continue;
      const proposta = l["Regra proposta"], temRegra = !semValor(proposta) && !/^—/.test(proposta.trim());
      const texto = limpo(temRegra ? proposta : l["Lição"]);
      if (texto && !out.some((x) => x.origem === id && x.texto === texto)) out.push({ origem: id, texto, detalhe: temRegra ? limpo(l["Lição"], 400) : null, ja_esta: regras.includes(norma(texto)) });
    }
  }
  return out;
}

/** Junta as lições do ciclo aos pontos da cerimônia: a que já está na `## Retro` (marcada pelo time) ganha o detalhe;
 *  a que não está entra sem voto, só para a escolha na página. */
export function juntarLicoes(estado, licoes) {
  for (const l of licoes) {
    const ja = estado.itens.find((i) => i.grupo === "licao" && i.texto === l.texto && (i.origem ?? l.origem) === l.origem);
    if (ja) Object.assign(ja, { origem: l.origem, detalhe: l.detalhe, ja_esta: l.ja_esta, do_ciclo: true });
    else estado.itens.push({ id: randomUUID().slice(0, 8), grupo: "licao", texto: l.texto, autor: null, em: estado.itens.length, votos: [], origem: l.origem, detalhe: l.detalhe, ja_esta: l.ja_esta, do_ciclo: true });
  }
  return estado;
}

/** O resumo do ciclo para o painel da retro: conclusão (linhas concluídas sobre as da sprint), o que fechou até o
 *  fim da sprint, a vazão por trabalho, o lead time médio do desenvolvimento, o SLE medido nas linhas de
 *  desenvolvimento e atendimento, os dias além do fim e a parte do atendimento contra a reserva de capacidade. */
export function resumoDaSprint(sprint, { sle = null, reservaPct = null } = {}) {
  const ls = sprint.itens, fechadas = ls.filter((x) => ehData(x.concluida_em)), pct = (a, b) => (b ? Math.round(100 * a / b) : null);
  const de = (t) => fechadas.filter((x) => x.Trabalho === t), media = (v) => (v.length ? Math.round(10 * v.reduce((a, b) => a + b, 0) / v.length) / 10 : null);
  const lead = (xs) => xs.filter((x) => ehData(x.iniciada_em)).map((x) => dias(x.iniciada_em, x.concluida_em));
  const noPrazo = fechadas.filter((x) => x.concluida_em <= sprint.fim).length, ultima = fechadas.map((x) => x.concluida_em).sort().at(-1) ?? null;
  const medidos = lead([...de("desenvolvimento"), ...de("atendimento")]), atend = ls.filter((x) => x.Trabalho === "atendimento").length;
  return { linhas: ls.length, itens: new Set(ls.map((x) => x.Item)).size, concluidas: fechadas.length, no_prazo: noPrazo, depois: fechadas.length - noPrazo, abertas: ls.length - fechadas.length,
    pct_conclusao: pct(fechadas.length, ls.length), pct_no_prazo: pct(noPrazo, ls.length),
    vazao: { desenvolvimento: de("desenvolvimento").length, atendimento: de("atendimento").length, "especificação": de("especificação").length },
    lead_medio: { desenvolvimento: media(lead(de("desenvolvimento"))), atendimento: media(lead(de("atendimento"))), "especificação": media(lead(de("especificação"))) },
    sle: sle && medidos.length ? { dias: sle.dias, alvo: sle.percentual, medidos: medidos.length, dentro: medidos.filter((d) => d <= sle.dias).length, pct: pct(medidos.filter((d) => d <= sle.dias).length, medidos.length) } : null,
    ultima_conclusao: ultima, dias_alem: ultima && ultima > sprint.fim ? dias(sprint.fim, ultima) : 0,
    atendimento: { linhas: atend, pct: pct(atend, ls.length), reserva_pct: reservaPct } };
}

/** Se a máquina pode publicar (commit e push): quem está nela é da equipe e o projeto está na branch base. */
export function podePublicar(raiz, exec, usuario) {
  if (!usuario) return { ok: false, motivo: "seu usuário do git não está no equipe.json" };
  const atual = exec("git", ["-C", raiz, "rev-parse", "--abbrev-ref", "HEAD"]);
  if (atual.status !== 0) return { ok: false, motivo: "a pasta não é um repositório git" };
  let base = null;
  try { base = JSON.parse(fs.readFileSync(path.join(raiz, ".sabia/config/agentes.json"), "utf8")).branch_base ?? null; } catch { /* sem agentes.json, vale a branch atual */ }
  if (base && atual.stdout.trim() !== base) return { ok: false, motivo: `o projeto está na branch ${atual.stdout.trim()}; a cerimônia publica só na ${base}` };
  return { ok: true, motivo: null };
}

/** O que a página desenha: a sprint da cerimônia (a aberta, a de maior chave), os grupos em que se inclui ponto e,
 *  na retro, os números do ciclo. Na review, um grupo por item entregue (o trabalho principal concluído na sprint)
 *  e o dos pedidos novos. */
export function cerimoniaDoProjeto({ projeto = ".", modo, exec, agora = new Date(), usuario = null }) {
  if (!MODOS[modo]) throw new Error(`cerimônia desconhecida: ${modo}`);
  const st = statusDoProjeto({ projeto, exec, agora, usuario }), sprint = sprintsDe(projeto, agora.toISOString().slice(0, 10))[0];
  if (!sprint) throw new Error("não há sprint: planeje pela sa-planejamento.sprint");
  const pessoas = st.quadro.pessoas, nome = (u) => pessoas[u] ?? u;
  let reservaPct = null;
  try { reservaPct = JSON.parse(fs.readFileSync(path.join(projeto, ".sabia/planejamento/acordos.json"), "utf8")).reserva_capacidade_pct ?? null; } catch { /* sem acordos, sem a reserva */ }
  let grupos;
  if (modo === "retrospective") grupos = RETRO.map((g) => ({ id: g.id, nome: g.nome, tag: g.tag, cor: g.id, dono: g.id === "acao" }));
  else {
    const vistos = new Set();
    grupos = sprint.itens.flatMap((l) => {
      const item = st.quadro.itens.find((c) => c.id === l.Item);
      if (!item || vistos.has(l.Item) || !CONCLUIDOS.includes(item.status) || l.Trabalho !== PRINCIPAL[item.tipo] || !ehData(l.concluida_em)) return [];
      vistos.add(l.Item);
      const mr = item.mesclado ?? item.mr;
      return [{ id: item.id, nome: `${item.id} · ${item.titulo ?? ""}`, tag: "Retorno", cor: "retorno",
        sub: [item.tipo, item.responsavel && nome(item.responsavel), `concluída em ${l.concluida_em.slice(8)}/${l.concluida_em.slice(5, 7)}`].filter(Boolean).join(" · "),
        mr: mr?.url ? { iid: mr.iid, url: mr.url } : null }];
    }).sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
    grupos.push({ id: PEDIDO, nome: "Pedidos novos", tag: "Pedido", cor: "pedido", sub: "viram item pelo cadastro (sa-triar)" });
  }
  return { versao: 1, sabia: st.sabia, projeto: st.projeto, gerado_em: st.gerado_em, modo, titulo: MODOS[modo].titulo, secao: MODOS[modo].secao, votos: modo === "retrospective",
    sprint: { chave: sprint.chave, inicio: sprint.inicio, fim: sprint.fim, meta: sprint.meta, arquivo: sprint.arquivo }, pessoas, grupos,
    numeros: modo === "retrospective" ? numerosDaSprint(sprint) : [], sle: st.quadro.sle ?? null,
    licoes: modo === "retrospective" ? licoesDoCiclo(projeto, sprint, st.quadro.itens) : [],
    resumo: modo === "retrospective" ? resumoDaSprint(sprint, { sle: st.quadro.sle ?? null, reservaPct }) : null,
    publicar: { usuario, ...podePublicar(projeto, exec, usuario) } };
}

/** O corpo da seção `## <titulo>` do .md (as linhas entre o título e o próximo `## `), sem as vazias. */
export function lerSecao(texto, titulo) {
  const ls = texto.split("\n"), i = ls.findIndex((l) => l.trim() === `## ${titulo}`);
  if (i < 0) return [];
  let fim = ls.findIndex((l, k) => k > i && /^## /.test(l));
  if (fim < 0) fim = ls.length;
  return ls.slice(i + 1, fim).filter((l) => l.trim());
}

/** Troca o corpo da seção `## <titulo>` pelas `linhas` (a seção que falta entra no fim) e mantém as linhas dela que
 *  casam com `manter` (a `- Números:` da retro, que é do passo `fechar`). Devolve o texto novo. */
export function trocarSecao(texto, titulo, linhas, manter = null) {
  const ls = texto.replace(/\n+$/, "").split("\n"), arejado = ls.some((l, k) => /^## /.test(l) && ls[k + 1]?.trim() === "" && ls[k + 2] !== undefined);
  let i = ls.findIndex((l) => l.trim() === `## ${titulo}`);
  if (i < 0) { if (arejado) ls.push(""); ls.push(`## ${titulo}`); i = ls.length - 1; }
  let fim = ls.findIndex((l, k) => k > i && /^## /.test(l));
  if (fim < 0) fim = ls.length;
  const mantidas = manter ? ls.slice(i + 1, fim).filter((l) => manter.test(l)) : [];
  const corpo = [...linhas, ...mantidas], resto = ls.slice(fim);
  return [...ls.slice(0, i + 1), ...(arejado && corpo.length ? [""] : []), ...corpo, ...(arejado && resto.length ? [""] : []), ...resto].join("\n") + "\n";
}

const ordenados = (itens) => [...itens].sort((a, b) => votosDe(b) - votosDe(a) || (a.em ?? 0) - (b.em ?? 0));
const votosTxt = (i) => (votosDe(i) ? `${plural(votosDe(i))}${i.votos.length ? ` (${i.votos.map((v) => v.nome).join(", ")})` : ""}` : "");

/** As linhas que a cerimônia grava na seção: os pontos pela ordem dos votos, com quem levantou e quem votou — o
 *  sprint-<nn>.md guarda tudo, sem arquivo à parte. Retro: `- Positivo: … · por <autor> · dono <usuario> · <n> votos
 *  (<nome>, <nome>)`, com `Negativo`, `Melhoria` e `Ação` do mesmo jeito. Review: `- <id> · <retorno> — por <autor>;
 *  <retorno> — por <autor>` ou `- <id> · sem retorno`, uma linha por item entregue, e `- pedido novo · … — por <autor>`. */
export function linhasDaSecao(dados, estado) {
  const doGrupo = (g) => (dados.votos ? ordenados : (x) => x)(estado.itens.filter((i) => i.grupo === g));
  if (dados.modo === "retrospective") return RETRO.flatMap((g) => doGrupo(g.id).filter((i) => !i.do_ciclo || votosDe(i)).map((i) => [`- ${g.linha}: ${i.texto}`, i.origem && `origem ${i.origem}`, i.autor && `por ${i.autor}`, i.dono && `dono ${i.dono}`, votosTxt(i)].filter(Boolean).join(" · ")));
  const com = (i) => `${i.texto}${i.autor ? ` — por ${i.autor}` : ""}`;
  return dados.grupos.flatMap((g) => (g.id === PEDIDO ? doGrupo(PEDIDO).map((i) => `- ${LINHA_PEDIDO} · ${com(i)}`) : [`- ${g.id} · ${doGrupo(g.id).map(com).join("; ") || "sem retorno"}`]));
}

/** Os pontos que estão na seção do .md, com o autor e os votos de cada linha: é de onde a cerimônia parte. O voto sem
 *  nome (linha escrita à mão, ou do formato anterior) conta como base do ponto. */
export function importarSecao(dados, texto) {
  const itens = [], novo = (grupo, t, mais = {}) => { if (t) itens.push({ id: randomUUID().slice(0, 8), grupo, texto: t, autor: null, em: itens.length, votos: [], ...mais }); };
  for (const l of lerSecao(texto, dados.secao)) {
    if (dados.modo === "retrospective") {
      const m = l.match(/^- (Positivo|Negativo|Melhoria|Lição|Ação|Bom|Melhorar): (.*)$/);
      if (!m) continue;
      const [primeira, ...partes] = m[2].trim().split(" · "), mais = {}, textos = [primeira];
      for (const parte of partes) {
        const por = parte.match(/^por (.+)$/), dono = parte.match(/^dono (\S+)$/), origem = parte.match(/^origem (\S+)$/), v = parte.match(/^(\d+) votos?(?: \((.*)\))?$/);
        if (por) mais.autor = por[1].trim();
        else if (dono) mais.dono = dono[1];
        else if (origem) mais.origem = origem[1];
        else if (v) {
          mais.votos = (v[2] ?? "").split(",").map((n) => n.trim()).filter((n) => chaveDe(n)).map((n) => ({ chave: chaveDe(n), nome: n }));
          if (+v[1] > mais.votos.length) mais.base = +v[1] - mais.votos.length;
        } else textos.push(parte);
      }
      novo(RETRO.find((g) => g.linha === (ANTIGAS[m[1]] ?? m[1])).id, textos.join(" - ").trim(), mais);
    } else {
      const m = l.match(/^- (.+?) · (.*)$/);
      if (!m) continue;
      const grupo = m[1] === LINHA_PEDIDO ? PEDIDO : m[1];
      if (!dados.grupos.some((g) => g.id === grupo) || m[2].trim() === "sem retorno") continue;
      for (const parte of grupo === PEDIDO ? [m[2]] : m[2].split("; ")) {
        const por = parte.match(/ — por (.+)$/);
        novo(grupo, (por ? parte.slice(0, por.index) : parte).trim(), por ? { autor: por[1].trim() } : {});
      }
    }
  }
  return itens;
}

/** Aplica uma mudança da página no estado: incluir (grupo, texto e, na ação da retro, o dono), votar (liga e desliga
 *  o voto de quem pediu) e remover. Toda mudança exige o nome de quem está na página. */
export function aplicar(estado, acao, dados, agora = Date.now()) {
  const nome = nomeLimpo(acao.nome), chave = chaveDe(nome);
  if (!chave) throw new Error("diga o seu nome para participar");
  if (acao.tipo === "incluir") {
    const g = dados.grupos.find((x) => x.id === acao.grupo);
    if (!g) throw new Error("grupo desconhecido");
    let texto = limpo(acao.texto);
    if (dados.modo === "review") texto = texto.replace(/;/g, ",").replace(/ — /g, " - ");
    if (estado.itens.some((i) => i.grupo === g.id && i.texto === texto)) throw new Error("esse ponto já está na lista");
    if (!texto) throw new Error("escreva o ponto");
    if (estado.itens.length >= 500) throw new Error("a cerimônia chegou a 500 pontos: remova algum antes de incluir");
    const dono = g.dono && acao.dono ? String(acao.dono) : null;
    if (dono && !(dono in dados.pessoas)) throw new Error(`${dono} não está no equipe.json`);
    estado.itens.push({ id: randomUUID().slice(0, 8), grupo: g.id, texto, autor: nome, em: agora, votos: [], ...(dono ? { dono } : {}) });
    return;
  }
  const item = estado.itens.find((i) => i.id === acao.id);
  if (!item) throw new Error("esse ponto não existe mais");
  if (acao.tipo === "votar") {
    if (!dados.votos) throw new Error("a review não tem votação");
    if (item.ja_esta) throw new Error("essa lição já é Regra aprendida");
    const k = item.votos.findIndex((v) => v.chave === chave);
    if (k >= 0) item.votos.splice(k, 1); else item.votos.push({ chave, nome });
  } else if (acao.tipo === "remover") {
    if (item.do_ciclo) throw new Error("a lição do ciclo não se remove: tire o voto para não considerá-la");
    estado.itens.splice(estado.itens.indexOf(item), 1);
  }
  else throw new Error("ação desconhecida");
}

/** As propostas de quem prepara a cerimônia, de um JSON `{ "retrospective": [{ tipo, texto, autor, dono? }],
 *  "review": [{ item, texto, autor }] }`: `tipo` é positivo, negativo, melhoria ou acao; `item` é o id do item entregue ou
 *  "pedido". Toda proposta diz o autor dela: o Sabiá não gera ponto nenhum. */
export function lerPropostas(arquivo, dados) {
  const doc = JSON.parse(fs.readFileSync(arquivo, "utf8")), bruto = doc[dados.modo] ?? [];
  return bruto.flatMap((p, k) => {
    const grupo = dados.modo === "retrospective" ? p.tipo : p.item, texto = limpo(p.texto), autor = nomeLimpo(p.autor);
    if (!texto || !dados.grupos.some((g) => g.id === grupo)) return [];
    if (!chaveDe(autor)) throw new Error(`a proposta ${k + 1} de ${path.basename(arquivo)} não tem "autor"`);
    return [{ id: randomUUID().slice(0, 8), grupo, texto, autor, em: k, votos: [], ...(p.dono && p.dono in dados.pessoas ? { dono: p.dono } : {}) }];
  });
}

/** O texto do `sprint-<nn>.md` com a seção da cerimônia como está na página (a linha Números da retro fica). */
export function comASecao(dados, estado, texto) {
  return trocarSecao(texto, dados.secao, linhasDaSecao(dados, estado), dados.modo === "retrospective" ? /^- Números:/ : null);
}

/** A mensagem de commit que a página propõe: a do fluxo, `<AAAA>/Sprint <nn>: retrospectiva` (ou `review`). */
export const mensagemPadrao = (dados) => `${dados.sprint.chave}: ${MODOS[dados.modo].commit}`;

/** Publicar: só aqui o `sprint-<nn>.md` muda. Depois do `git pull --ff-only`, grava a seção como está na página e faz
 *  o commit só desse arquivo, com a mensagem que a pessoa confirmou, e o push na branch base. Se o commit falha, o
 *  arquivo volta ao que era; se só o push falha, o commit fica local e o erro diz isso. */
export function publicar(raiz, dados, estado, { exec, usuario, mensagem }) {
  const pode = podePublicar(raiz, exec, usuario);
  if (!pode.ok) throw new Error(pode.motivo);
  const git = (...a) => exec("git", ["-C", raiz, ...a]), falha = (r) => (r.stderr || r.stdout || r.error?.message || "falhou").trim().split("\n").at(-1);
  const arquivo = dados.sprint.arquivo, caminho = path.join(raiz, arquivo), texto = String(mensagem ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 300) || mensagemPadrao(dados);
  const pull = git("pull", "--ff-only");
  if (pull.status !== 0) throw new Error(`git pull --ff-only: ${falha(pull)}`);
  const antes = fs.readFileSync(caminho, "utf8"), depois = comASecao(dados, estado, antes);
  if (depois === antes && !git("status", "--porcelain", "--", arquivo).stdout.trim()) throw new Error(`nada a publicar: a seção ${dados.secao} do ${path.basename(arquivo)} já está assim no repositório`);
  fs.writeFileSync(caminho, depois);
  const add = git("add", "--", arquivo), commit = add.status === 0 ? git("commit", "--quiet", "-m", texto, "--", arquivo) : add;
  if (commit.status !== 0) { fs.writeFileSync(caminho, antes); git("reset", "--quiet", "--", arquivo); throw new Error(`git commit: ${falha(commit)}`); }
  const push = git("push", "--quiet");
  if (push.status !== 0) throw new Error(`o commit "${texto}" ficou só nesta máquina; o push falhou: ${falha(push)}`);
  return { commit: texto };
}

const CSS_CERIMONIA = `
/* a cerimônia: a lista do quadro, com um bloco por grupo; a linha do ponto leva o selo, os votos e quem criou */
:root{--bom:#2E8B57}
:root[data-modo="escuro"]{--bom:#5CC08B}
[data-g]{--g:var(--muted)}
[data-g="positivo"]{--g:var(--bom)}
[data-g="negativo"]{--g:var(--critico)}
[data-g="melhoria"]{--g:var(--atencao)}
[data-g="acao"],[data-g="retorno"]{--g:var(--brand)}
[data-g="licao"]{--g:var(--epico)}
[data-g="pedido"]{--g:var(--orange)}
.bloco summary{flex-wrap:wrap}
.bloco summary h2{box-shadow:inset 0 -2px 0 var(--g)}
.bloco summary a{font-size:13px}
.ponto-l td{vertical-align:middle}
td.tit{box-shadow:inset 3px 0 0 var(--g);overflow-wrap:anywhere}
td.tit small{display:block;font-weight:400;color:var(--muted)}
.ja{display:inline-block;margin-left:8px;padding:0 7px;border-radius:999px;background:var(--suave);color:var(--muted);font:500 12px/18px var(--body)}
.voto:disabled{border-color:var(--suave-h);cursor:default}
.voto:disabled:hover{background:none}
.selo{display:inline-block;min-width:76px;padding:3px 10px;border-radius:var(--r-sm);background:color-mix(in srgb,var(--g) 20%,var(--card));color:color-mix(in srgb,var(--g) 62%,var(--title));font:600 12px/18px var(--body);text-align:center}
td.selo-c{width:112px;white-space:nowrap}
td.quem-c{width:48px;white-space:nowrap}
td.votos{width:240px;min-width:170px}
.voto-l{display:flex;align-items:center;gap:8px}
.voto{flex:none;display:grid;place-items:center;width:24px;height:24px;padding:0;border:2px solid var(--blue);border-radius:50%;background:none;color:transparent}
.voto svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.voto:hover{background:color-mix(in srgb,var(--blue) 18%,transparent)}
.voto[aria-pressed="true"]{background:var(--blue);color:var(--card)}
.trilho{flex:1;min-width:48px;height:12px;border-radius:3px;background:var(--suave);overflow:hidden}
.trilho i{display:block;height:100%;background:var(--blue);transition:width .2s}
.voto-l b{min-width:18px;text-align:right;color:var(--title)}
.av{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--suave);color:var(--title);font:600 10px/1 var(--display);font-style:normal}
td.fim{width:1%;white-space:nowrap;text-align:right}
.rm{display:inline-grid;place-items:center;min-width:28px;height:28px;padding:0 6px;border:0;border-radius:var(--r-sm);background:none;color:var(--muted);font-size:13px}
.rm:hover,.rm[data-armado]{background:var(--suave);color:var(--critico)}
.novo{display:flex;flex-wrap:wrap;gap:8px;padding:8px 12px 10px;border-top:1px solid var(--mesa)}
.novo input,.entrar input{flex:1 1 240px;min-width:0;height:32px;padding:0 10px;border:0;border-radius:var(--r-sm);background:var(--suave);color:var(--title)}
.novo input::placeholder,.entrar input::placeholder{color:var(--muted)}
.entrar{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--title)}
.entrar input{flex:0 1 200px}
#aviso{font-size:13px;color:var(--title);font-weight:500}
#aviso.erro{color:var(--critico)}
/* os dados do ciclo: cartões com o número da equipe e, por trabalho, a barra do que fechou no prazo, depois e em aberto */
.bom-s{--cor:var(--bom)}
.painel{max-width:1400px;margin:0 auto 14px;padding:10px 8px 8px;border-radius:var(--r);background:var(--raia)}
.painel>header{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;padding:0 6px 8px}
.painel>header h2{font-size:14px;line-height:20px}
.painel>header span{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(172px,1fr));gap:8px}
.tile{display:flex;flex-direction:column;gap:2px;min-width:0;padding:12px 14px;border-radius:8px;background:var(--card);box-shadow:var(--sombra)}
.tile .rot{font:600 12px/16px var(--body);color:var(--muted)}
.tile .val{font:600 26px/32px var(--display);color:var(--title);font-variant-numeric:tabular-nums}
.tile .val small{font:500 12px/16px var(--body);color:var(--muted)}
.tile .sub{margin-top:auto;padding-top:4px;font-size:12px;line-height:16px;color:var(--muted);font-variant-numeric:tabular-nums}
.med{height:6px;margin:4px 0 2px;border-radius:3px;background:var(--suave);overflow:hidden}
.med i{display:block;height:100%;border-radius:3px;background:var(--blue)}
.estado{display:flex;align-items:baseline;gap:6px;font:600 12px/16px var(--body);color:var(--title)}
.trab{display:grid;gap:8px;margin-top:8px;padding:10px 14px 12px;border-radius:8px;background:var(--card);box-shadow:var(--sombra)}
.trab-l{display:grid;grid-template-columns:128px minmax(80px,1fr) 150px 120px;gap:12px;align-items:center;font-size:13px;line-height:18px}
.trab-l b{font-weight:500;color:var(--title)}
.trab-n{text-align:right;color:var(--title);font-variant-numeric:tabular-nums;white-space:nowrap}
.cab-l,.cab-l .trab-n{font-size:12px;font-weight:600;color:var(--muted)}
.pilha{display:flex;gap:2px;height:14px}
.pilha i{display:block;min-width:4px;border-radius:3px}
.pilha .p,.leg .p{background:var(--blue)}
.pilha .d,.leg .d{background:color-mix(in srgb,var(--blue) 42%,var(--card))}
.pilha .a,.leg .a{background:var(--suave-h)}
.leg{display:flex;align-items:center;flex-wrap:wrap;gap:4px 6px;font-weight:500}
.leg i{width:10px;height:10px;border-radius:3px}
.leg i:not(:first-child){margin-left:8px}
@media (max-width:720px){.trab-l{grid-template-columns:1fr 1fr}.trab-l .pilha,.trab-l .leg{grid-column:1/-1;order:3}.trab-l .trab-n:last-child{display:none}}
`;

// A página no navegador: desenha os blocos uma vez e, a cada estado que chega (resposta de uma ação ou o /vivo),
// troca só as linhas, para não fechar bloco nem apagar o que a pessoa está digitando.
function cliente() {
  const D = JSON.parse(document.getElementById("dados").textContent), TOKEN = document.querySelector('meta[name="sabia-token"]').content;
  const $ = (s) => document.querySelector(s);
  const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
  const dataBr = (d) => d.slice(8, 10) + "/" + d.slice(5, 7) + "/" + d.slice(0, 4);
  const SETA = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>', CERTO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
  const chave = (n) => String(n ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const iniciais = (n) => { const p = String(n || "?").replace(/\(.*?\)/g, " ").trim().split(/[\s.]+/).filter(Boolean); return (p.length > 1 ? p[0][0] + p[p.length - 1][0] : (p[0] || "?").slice(0, 2)).toUpperCase(); };
  const votos = (i) => i.votos.length + (i.base || 0);
  const um = (palavra, n) => palavra + (n === 1 ? "" : "s");
  const CHAVE = "sabia-cerimonia-nome";
  let estado = D.estado, nome = null, ordem = "votos", tAviso;
  try { nome = localStorage.getItem(CHAVE) || null; } catch {}

  function aviso(texto, erro) {
    const a = $("#aviso"); a.textContent = texto; a.classList.toggle("erro", !!erro);
    clearTimeout(tAviso); if (texto) tAviso = setTimeout(() => { a.textContent = ""; }, 6000);
  }
  async function enviar(acao) {
    try {
      const r = await fetch("/acao", { method: "POST", headers: { "content-type": "application/json", "x-sabia-token": TOKEN }, body: JSON.stringify({ ...acao, nome }) });
      const j = await r.json();
      if (!r.ok) { aviso(j.erro || "não deu para gravar", true); return null; }
      if (j.estado) { estado = j.estado; desenhar(); }
      return j;
    } catch { aviso("sem resposta do servidor da cerimônia", true); return null; }
  }
  function exigeNome() {
    if (nome) return true;
    aviso("Entre com o seu nome para participar", true); $("#nome")?.focus(); return false;
  }

  // quem está na página: só o nome, guardado neste navegador
  function desenharQuem() {
    $("#quem").innerHTML = nome
      ? '<i class="av">' + esc(iniciais(nome)) + "</i><span>" + esc(nome) + '</span><button type="button" class="btn" id="sair">Trocar</button>'
      : '<input id="nome" maxlength="40" list="equipe" placeholder="Seu nome" aria-label="Seu nome" autocomplete="off"><button type="submit" class="btn pri">Entrar</button>';
  }
  $("#quem").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#nome").value.trim().replace(/\s+/g, " ").slice(0, 40);
    if (!chave(v)) return aviso("Digite o seu nome", true);
    nome = v; try { localStorage.setItem(CHAVE, nome); } catch {}
    aviso(""); desenharQuem(); desenhar();
  });
  $("#quem").addEventListener("click", (e) => {
    if (!e.target.closest("#sair")) return;
    nome = null; try { localStorage.removeItem(CHAVE); } catch {}
    desenharQuem(); desenhar();
  });
  $("#equipe").innerHTML = Object.values(D.pessoas).map((n) => '<option value="' + esc(n) + '">').join("");

  // o esqueleto: os números do ciclo (retro) e um bloco por grupo, com o formulário de inclusão
  const donos = '<select name="dono" aria-label="Dono da ação"><option value="">sem dono</option>' + Object.entries(D.pessoas).map(([u, n]) => '<option value="' + esc(u) + '">' + esc(n) + "</option>").join("") + "</select>";
  // os dados do ciclo (retro): sempre à vista — os números da equipe em cartões e, por trabalho, o que fechou até o fim
  // da sprint, o que fechou depois e o que ficou em aberto
  const numeros = (() => {
    const R = D.resumo;
    if (!R || !R.linhas) return "";
    const v = (x) => (x == null ? "—" : String(x).replace(".", ",")), fim = dataBr(D.sprint.fim).slice(0, 5);
    const pl = (n, um, muitos) => n + " " + (n === 1 ? um : muitos);
    const tile = (rot, val, sub, mais) => '<div class="tile"><p class="rot">' + rot + '</p><p class="val">' + val + "</p>" + (mais || "") + '<p class="sub">' + sub + "</p></div>";
    const med = (p) => '<div class="med" role="img" aria-label="' + p + '%"><i style="width:' + Math.max(0, Math.min(100, p)) + '%"></i></div>';
    const estado = (nivel, texto) => '<p class="estado"><span class="ponto ' + nivel + '"></span>' + texto + "</p>";
    const tiles = [
      tile("Conclusão", v(R.pct_conclusao) + "%", R.concluidas + " de " + pl(R.linhas, "linha", "linhas") + " · " + pl(R.itens, "item", "itens"), med(R.pct_conclusao)),
      tile("Concluído no prazo", v(R.pct_no_prazo) + "%", R.no_prazo + " até " + fim + " · " + R.depois + " depois · " + pl(R.abertas, "em aberto", "em aberto"), med(R.pct_no_prazo)),
      tile("Vazão", R.vazao.desenvolvimento + ' <small>desenvolvimento</small>', "atendimento " + R.vazao.atendimento + " · especificação " + R.vazao["especificação"]),
      tile("Lead time médio", v(R.lead_medio.desenvolvimento) + ' <small>dias · desenvolvimento</small>', "atendimento " + v(R.lead_medio.atendimento) + " · especificação " + v(R.lead_medio["especificação"])),
      R.sle ? tile("SLE · até " + pl(R.sle.dias, "dia", "dias"), v(R.sle.pct) + "%", R.sle.dentro + " de " + R.sle.medidos + " linhas · alvo " + R.sle.alvo + "%", estado(R.sle.pct >= R.sle.alvo ? "bom-s" : "atencao", R.sle.pct >= R.sle.alvo ? "dentro do alvo" : "abaixo do alvo")) : "",
      tile("Prazo da sprint", R.dias_alem ? "+" + pl(R.dias_alem, "dia", "dias") : "no prazo", R.ultima_conclusao ? "última conclusão em " + dataBr(R.ultima_conclusao).slice(0, 5) + " · fim em " + fim : "nada concluído ainda", estado(R.dias_alem ? "atencao" : "bom-s", R.dias_alem ? "passou do timebox" : "dentro do timebox")),
      tile("Atendimento", v(R.atendimento.pct) + "%", pl(R.atendimento.linhas, "linha", "linhas") + " da sprint" + (R.atendimento.reserva_pct != null ? " · reserva " + R.atendimento.reserva_pct + "%" : ""), R.atendimento.reserva_pct != null ? estado(R.atendimento.pct > R.atendimento.reserva_pct ? "atencao" : "bom-s", R.atendimento.pct > R.atendimento.reserva_pct ? "acima da reserva" : "dentro da reserva") : ""),
    ].join("");
    const seg = (cls, n, total, rotulo) => (n ? '<i class="' + cls + '" style="flex:' + n + '" title="' + n + " " + rotulo + '"></i>' : "");
    const linhas = D.numeros.map((n) => '<div class="trab-l"><b>' + esc(n.trabalho) + '</b><span class="pilha" role="img" aria-label="' + n.no_prazo + " no prazo, " + n.depois + " depois, " + n.abertas + ' em aberto">' + seg("p", n.no_prazo, n.linhas, "até " + fim) + seg("d", n.depois, n.linhas, "depois de " + fim) + seg("a", n.abertas, n.linhas, "em aberto")
      + '</span><span class="trab-n">' + n.no_prazo + " · " + n.depois + " · " + n.abertas + '</span><span class="trab-n">' + (n.lead_medio == null ? "—" : v(n.lead_medio) + " dias") + "</span></div>").join("");
    return '<section class="painel" aria-label="Dados do ciclo"><header><h2>Dados do ciclo</h2><span>' + esc(D.sprint.chave) + " · " + dataBr(D.sprint.inicio).slice(0, 5) + " → " + fim + '</span></header><div class="tiles">' + tiles + "</div>"
      + '<div class="trab"><div class="trab-l cab-l"><span>Por trabalho</span><span class="leg"><i class="p"></i>até ' + fim + '<i class="d"></i>depois<i class="a"></i>em aberto</span><span class="trab-n">no prazo · depois · aberto</span><span class="trab-n">lead time médio</span></div>' + linhas + "</div></section>";
  })();
  $("#lista").innerHTML = numeros + D.grupos.map((g) =>
    '<details class="bloco" open data-g="' + esc(g.cor) + '" data-grupo="' + esc(g.id) + '"><summary>' + SETA + "<h2>" + esc(g.nome) + '</h2><span class="n"></span>' + (g.sub ? "<span>" + esc(g.sub) + "</span>" : g.id === "licao" ? "<span>marque as que devem virar Regra aprendida</span>" : "")
    + (g.mr && /^https?:\/\//.test(g.mr.url) ? '<a href="' + esc(g.mr.url) + '" target="_blank" rel="noopener">MR !' + esc(g.mr.iid) + "</a>" : "")
    + '</summary><div class="rola"><table><tbody></tbody></table><form class="novo"><input name="texto" maxlength="280" autocomplete="off" placeholder="' + esc(g.id === "pedido" ? "Novo pedido" : D.modo === "review" ? "Retorno sobre este item" : g.id === "acao" ? "Nova ação" : g.id === "licao" ? "Lição levantada agora" : "Novo ponto") + '" aria-label="Novo ponto em ' + esc(g.nome) + '">'
    + (g.dono ? donos : "") + '<button type="submit" class="btn">Incluir</button></form></div></details>').join("");

  function desenhar() {
    const eu = nome ? chave(nome) : null, max = Math.max(1, ...estado.itens.map(votos));
    let total = 0;
    for (const g of D.grupos) {
      const bloco = document.querySelector('.bloco[data-grupo="' + CSS.escape(g.id) + '"]');
      const itens = estado.itens.filter((i) => i.grupo === g.id).sort((a, b) => (D.votos && ordem === "votos" ? votos(b) - votos(a) : 0) || (a.em || 0) - (b.em || 0));
      const nv = itens.reduce((s, i) => s + votos(i), 0);
      total += g.id === "licao" ? 0 : itens.length;
      bloco.querySelector("summary .n").textContent = itens.length + " " + (g.id === "licao" ? (itens.length === 1 ? "lição" : "lições") : um(g.id === "pedido" ? "pedido" : D.modo === "review" ? "retorno" : "ponto", itens.length)) + (g.id === "licao" ? " · " + itens.filter((i) => votos(i)).length + " a considerar" : D.votos ? " · " + nv + (nv === 1 ? " voto" : " votos") : "");
      bloco.querySelector("tbody").innerHTML = itens.map((i) => {
        const n = votos(i), meu = !!eu && i.votos.some((v) => v.chave === eu), quem = i.votos.map((v) => v.nome).join(", ");
        return '<tr class="ponto-l" data-id="' + esc(i.id) + '"><td class="tit">' + esc(i.texto) + (i.ja_esta ? '<span class="ja">já é regra</span>' : "") + (i.dono ? "<small>dono: " + esc(D.pessoas[i.dono] || i.dono) + "</small>" : "") + (i.origem ? "<small>origem " + esc(i.origem) + (i.detalhe ? " · " + esc(i.detalhe) : "") + "</small>" : "") + '</td><td class="selo-c"><span class="selo">' + esc(g.tag) + '</span></td>'
          + (!D.votos ? "" : '<td class="votos"><div class="voto-l"><button type="button" class="voto"' + (i.ja_esta ? " disabled" : "") + ' aria-pressed="' + meu + '" aria-label="' + (g.id === "licao" ? (meu ? "Não considerar esta lição" : "Considerar esta lição") : meu ? "Tirar o meu voto" : "Votar") + '" title="' + esc(quem ? "Votaram: " + quem : "Ninguém votou ainda") + '">' + CERTO + '</button><span class="trilho"><i style="width:' + Math.round(100 * n / max) + '%"></i></span><b>' + n + "</b></div></td>")
          + '<td class="quem-c"><i class="av" title="' + esc(i.autor ? "Criado por " + i.autor : i.do_ciclo ? "Lição de " + i.origem : "Veio do " + D.arquivo) + '">' + esc(i.autor ? iniciais(i.autor) : i.do_ciclo ? String(i.origem).slice(0, 2) : "md") + '</i></td><td class="fim">' + (i.do_ciclo ? "" : '<button type="button" class="rm" title="Remover" aria-label="Remover o ponto">✕</button>') + "</td></tr>";
      }).join("") || '<tr><td class="nada" colspan="5">' + (g.id === "pedido" ? "Nenhum pedido novo." : D.modo === "review" ? "Sem retorno ainda." : g.id === "licao" ? "Nenhuma lição registrada nos itens concluídos do ciclo." : "Nenhum ponto ainda.") + "</td></tr>";
    }
    $("#pendente").hidden = !estado.nao_publicado;
    if ($("#total")) $("#total").textContent = total + " " + um("ponto", total);
  }

  $("#lista").addEventListener("click", (e) => {
    const linha = e.target.closest("tr[data-id]");
    if (!linha) return;
    if (e.target.closest(".voto")) { if (exigeNome()) enviar({ tipo: "votar", id: linha.dataset.id }); return; }
    const rm = e.target.closest(".rm");
    if (!rm || !exigeNome()) return;
    // remover pede o segundo clique: o primeiro arma o botão por alguns segundos
    if (rm.dataset.armado) return void enviar({ tipo: "remover", id: linha.dataset.id });
    rm.dataset.armado = "1"; rm.textContent = "Remover?";
    setTimeout(() => { if (rm.isConnected) { delete rm.dataset.armado; rm.textContent = "✕"; } }, 4000);
  });
  $("#lista").addEventListener("submit", async (e) => {
    const f = e.target.closest(".novo");
    if (!f) return;
    e.preventDefault();
    if (!exigeNome()) return;
    const texto = f.elements.texto.value.trim();
    if (!texto) return f.elements.texto.focus();
    const r = await enviar({ tipo: "incluir", grupo: f.closest(".bloco").dataset.grupo, texto, dono: f.elements.dono?.value || null });
    if (r) { f.elements.texto.value = ""; f.elements.texto.focus(); }
  });
  $("#ordem")?.addEventListener("change", (e) => { ordem = e.target.value; desenhar(); });
  // publicar: o popup pede a mensagem do commit, já preenchida; sem commit possível, o botão só grava o arquivo
  $("#publicar")?.addEventListener("click", async () => {
    if (D.publicar.ok) { $("#erro-publicar").hidden = true; $("#modal").showModal(); $("#mensagem").select(); return; }
    const r = await enviar({ tipo: "publicar" });
    if (r) aviso("Gravado no " + r.gravado);
  });
  $("#cancelar").addEventListener("click", () => $("#modal").close());
  $("#form-publicar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const botao = $("#confirmar"); botao.disabled = true;
    const r = await enviar({ tipo: "publicar", mensagem: $("#mensagem").value });
    botao.disabled = false;
    if (r) { $("#modal").close(); aviso("Publicado: " + r.commit); }
    else { $("#erro-publicar").textContent = $("#aviso").textContent; $("#erro-publicar").hidden = false; }
  });

  $("#ciclo").innerHTML = '<span class="quando">' + dataBr(D.sprint.inicio) + " → " + dataBr(D.sprint.fim) + "</span>" + (D.sprint.meta ? '<span class="meta"><b>Meta:</b> ' + esc(D.sprint.meta) + "</span>" : "");
  $("#gerado").textContent = "Aberta em " + new Date(D.gerado_em).toLocaleString("pt-BR");
  desenharQuem(); desenhar();

  // o /vivo traz o estado a cada mudança de qualquer pessoa; se o servidor fecha (Ctrl+C), a página avisa
  const vivo = new EventSource("/vivo");
  vivo.onmessage = (e) => { try { estado = JSON.parse(e.data); desenhar(); } catch {} };
  vivo.onerror = () => { $("#fora").hidden = false; };
  vivo.onopen = () => { if (!$("#fora").hidden) location.reload(); };
}

/** A página: HTML único, sem rede, com os dados da cerimônia e o estado em <script id="dados">. `local` diz se quem
 *  pediu a página está na máquina do servidor: só ela vê o botão Publicar. */
export function paginaCerimonia(dados, estado, token = "", { local = false } = {}) {
  const arquivo = path.basename(dados.sprint.arquivo), embutido = { ...dados, arquivo, estado };
  const publica = local && dados.publicar.ok;
  return `<!doctype html>
<html lang="pt-BR" data-sobria="sobria-sabia">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="sabia-token" content="${esc(token)}">
<title>${esc(dados.titulo)} · ${esc(dados.sprint.chave)} · ${esc(dados.projeto)}</title>
<script>(${tema})()</script>
<style>${CSS}${CSS_CERIMONIA}</style>
</head>
<body>
<header class="top">
  <span class="brand">${AVE}<span>Sabiá</span></span>
  <span class="ver">${esc(dados.sabia)}</span>
  <span class="onde">${esc(dados.titulo)} · ${esc(dados.sprint.chave)}<span>${esc(dados.projeto)}</span></span>
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
  <form class="entrar" id="quem"></form>
  <datalist id="equipe"></datalist>
  ${dados.votos ? `<label class="campo">Ordem <select id="ordem"><option value="votos">mais votados</option><option value="chegada">ordem de chegada</option></select></label>
  <span class="conta" id="total"></span>` : ""}
  <p id="aviso" role="status"></p>
  <div class="config">
    <p id="gravacao">O <code>${esc(arquivo)}</code> só muda ao publicar<span id="pendente" hidden> · há mudanças não publicadas</span>${publica ? "" : local ? ` · sem commit: ${esc(dados.publicar.motivo)}` : ""}</p>
    ${local ? `<button type="button" class="btn pri" id="publicar">${publica ? "Publicar" : `Gravar no ${esc(arquivo)}`}</button>` : ""}
  </div>
</div>
<main class="mesa"><div class="lista" id="lista"></div></main>
<footer class="rodape"><span id="gerado"></span><span>${esc(dados.sprint.arquivo)}</span><span>Sabiá ${esc(dados.sabia)}</span></footer>
<dialog id="modal" aria-labelledby="modal-titulo"><form method="dialog" id="form-publicar">
  <h2 id="modal-titulo">Publicar a ${esc(dados.titulo.toLowerCase())}</h2>
  <p class="sub">Grava a seção <code>## ${esc(dados.secao)}</code> do <code>${esc(arquivo)}</code> como está na página e faz o commit e o push na branch base.</p>
  <label>Mensagem do commit<input type="text" id="mensagem" maxlength="300" value="${esc(mensagemPadrao(dados))}" autocomplete="off"></label>
  <p class="erro" id="erro-publicar" role="alert" hidden></p>
  <div class="botoes"><button type="button" class="btn" id="cancelar">Cancelar</button><button type="submit" class="btn pri" id="confirmar">Publicar</button></div>
</form></dialog>
<div class="fora" id="fora" role="alert" hidden><h1>A cerimônia foi encerrada</h1><p>Rode <code>sabia ${esc(dados.modo)}</code> de novo para abrir.</p></div>
<script id="dados" type="application/json">${JSON.stringify(embutido).replace(/</g, "\\u003c")}</script>
<script>(${cliente})()</script>
</body>
</html>`;
}

const LOCAIS = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

/** O comando: lê a sprint, carrega os pontos da cerimônia (os que já estão na
 *  seção do .md e as propostas), sobe o servidor e devolve { url, urls, fechar, fechou, token }. Rotas: GET / (a
 *  página), /dados.json, /vivo (o estado a cada mudança) e POST /acao (com o token que só a página conhece). */
export async function abrirCerimonia({ projeto = ".", modo, exec, log = console.log, porta, rede = false, host, propostas, agora } = {}) {
  if (!MODOS[modo]) throw new Error(`cerimônia desconhecida: ${modo}`);
  const usuario = usuarioDaMaquina(projeto, exec), token = randomUUID();
  const gerar = () => cerimoniaDoProjeto({ projeto, modo, exec, agora, usuario });
  let dados = gerar();
  const md = () => path.join(projeto, dados.sprint.arquivo);
  // de onde a cerimônia parte: o que já está na seção do sprint-<nn>.md; com a seção vazia, as propostas
  const estado = { versao: 1, modo, sprint: dados.sprint.chave, itens: importarSecao(dados, fs.readFileSync(md(), "utf8")) };
  if (propostas && !estado.itens.length) estado.itens = lerPropostas(propostas, dados);
  juntarLicoes(estado, dados.licoes);
  // a cerimônia fica na memória: o sprint-<nn>.md só muda no Publicar; `nao_publicado` diz à página se há o que publicar
  const marcar = () => { const t = fs.readFileSync(md(), "utf8"); estado.nao_publicado = comASecao(dados, estado, t) !== t; return estado; };
  marcar();
  const vivos = new Set();
  const server = http.createServer((req, res) => {
    const fim = (codigo, corpo, tipo = "text/plain; charset=utf-8") => { res.writeHead(codigo, { "content-type": tipo, "cache-control": "no-store" }); res.end(corpo); };
    const json = (codigo, o) => fim(codigo, JSON.stringify(o), "application/json; charset=utf-8");
    const local = LOCAIS.includes(req.socket.remoteAddress);
    if (req.method === "POST" && req.url === "/acao") {
      const origem = req.headers.origin;
      if (req.headers["x-sabia-token"] !== token || (origem && origem !== `http://${req.headers.host}`)) return json(403, { erro: "pedido recusado" });
      let corpo = "";
      req.on("data", (d) => { corpo += d; if (corpo.length > 65536) req.destroy(); });
      req.on("end", () => {
        try {
          const acao = JSON.parse(corpo);
          if (acao.tipo === "publicar") {
            if (!local) throw new Error("publicar é de quem abriu a cerimônia, na máquina dela");
            // quem não pode fazer o commit (fora da equipe ou da branch base) ainda grava o arquivo
            const r = dados.publicar.ok ? publicar(projeto, dados, estado, { exec, usuario, mensagem: acao.mensagem }) : (fs.writeFileSync(md(), comASecao(dados, estado, fs.readFileSync(md(), "utf8"))), { commit: null, gravado: path.basename(dados.sprint.arquivo) });
            marcar();
            const aviso = `data: ${JSON.stringify(estado)}\n\n`;
            for (const v of vivos) v.write(aviso);
            return json(200, { ok: true, ...r, estado });
          }
          aplicar(estado, acao, dados);
          marcar();
          const linha = `data: ${JSON.stringify(estado)}\n\n`;
          for (const v of vivos) v.write(linha);
          json(200, { ok: true, estado });
        } catch (e) { json(400, { erro: e.message }); }
      });
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") return fim(405, "use GET");
    if (req.url === "/vivo") {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store" });
      res.write(`data: ${JSON.stringify(estado)}\n\n`);
      vivos.add(res); req.on("close", () => vivos.delete(res));
      return;
    }
    try {
      if (req.url === "/dados.json") return fim(200, JSON.stringify({ ...dados, estado }, null, 2), "application/json; charset=utf-8");
      if (req.url === "/" || req.url === "/index.html") { dados = gerar(); return fim(200, paginaCerimonia(dados, estado, token, { local }), "text/html; charset=utf-8"); }
    } catch (e) { return fim(500, `sabia ${modo}: ${e.message}`); }
    return fim(404, "não encontrado");
  });
  const escuta = host ?? (rede ? "0.0.0.0" : "127.0.0.1"), pedida = Number.parseInt(porta, 10) || 0, livre = porta === 0;  // porta 0: uma livre qualquer (os testes)
  const q = await new Promise((resolve, reject) => {
    let fecharFechou;
    const fechou = new Promise((r) => { fecharFechou = r; });
    server.on("error", (e) => (e.code === "EADDRINUSE" && !pedida ? server.listen(0, escuta) : reject(e)));
    server.on("listening", () => {
      const { port } = server.address();
      server.on("close", fecharFechou);
      // na rede, o link de cada endereço da máquina, para o time abrir (no WSL em NAT, o do Windows e a dica da porta)
      const daRede = escuta === "0.0.0.0" ? linksDaRede(port, exec) : { urls: [], dica: null };
      resolve({ url: `http://${escuta === "0.0.0.0" ? "127.0.0.1" : escuta}:${port}/`, urls: daRede.urls, dica: daRede.dica, porta: port, token,
        fechar: () => { if (server.listening) { server.close(); server.closeAllConnections?.(); } else fecharFechou(); }, fechou });
    });
    server.listen(livre ? 0 : pedida || MODOS[modo].porta, escuta);
  });
  const link = (u) => (process.stdout.isTTY ? `\x1b]8;;${u}\x1b\\${u}\x1b]8;;\x1b\\` : u);
  log(`${dados.titulo} da ${dados.sprint.chave} do projeto ${dados.projeto} (Ctrl+C encerra):\n\n  ${link(q.url)}\n${q.urls.map((u) => `  ${link(u)}  (para o time, na rede)\n`).join("")}${q.dica ? `\n  ${q.dica}\n` : ""}`);
  return q;
}
