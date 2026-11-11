// O que o quadro Kanban grava: as mudanças de situação da `sa-status.situacao` (impedir, liberar, cancelar, devolver
// ao backlog), a entrada na sprint, a conclusão do item já mesclado (com as Regras aprendidas) e a ordem do backlog.
// Cada ação altera os `.md` do projeto e vai num commit direto na branch base, com push, como o
// `fluxo/commit-na-branch-base.md`: só na branch base, com a árvore limpa, depois do pull.
import fs from "node:fs";
import path from "node:path";
import { celulas, semValor, lerMotivo, tabela, sprintsDe, gitlab } from "./status.mjs";

const BACKLOG = ".sabia/planejamento/backlog.md", SABIA_MD = ".sabia/sabia.md";
const TERMINAIS = ["concluida", "concluido", "cancelada", "cancelado"], IMPEDIDOS = ["impedida", "impedido"];
const PRINCIPAL = { fatia: "desenvolvimento", bug: "desenvolvimento", "sustentação": "atendimento", "épico": "especificação" };
const TRABALHOS = ["especificação", "desenvolvimento", "atendimento"];
// o texto da pessoa vai para dentro de uma célula de tabela: sem barra vertical, sem quebra de linha e sem o
// separador das partes do motivo
const limpo = (x, max = 300) => String(x ?? "").replace(/[|\r\n]+/g, " ").replace(/ · /g, " - ").replace(/\s+/g, " ").trim().slice(0, max);
const ehData = (x) => /^\d{4}-\d{2}-\d{2}$/.test(x ?? "");
const junta = (...partes) => partes.filter(Boolean).join(" · ");

/** Edita a primeira tabela cujo cabeçalho começa com `coluna`: `fn` recebe as linhas como objetos (pelo nome da
 *  coluna) e pode alterá-las ou devolver outra lista. Só a linha que mudou é reescrita; as outras ficam como estão. */
export function editarTabela(texto, coluna, fn) {
  const ls = texto.split("\n"), i = ls.findIndex((l) => l.trim().startsWith("|") && celulas(l)[0] === coluna);
  if (i < 0) throw new Error(`tabela ${coluna} não encontrada`);
  const cab = celulas(ls[i]);
  let j = i + 2;
  while (j < ls.length && ls[j].trim().startsWith("|")) j++;
  const linhas = ls.slice(i + 2, j).map((l) => { const o = Object.fromEntries(celulas(l).map((v, k) => [cab[k], v])); return Object.defineProperties(o, { _texto: { value: l }, _antes: { value: JSON.stringify(o) } }); });
  const novas = fn(linhas, cab) ?? linhas;
  const escrita = novas.map((o) => (o._texto && JSON.stringify(o) === o._antes ? o._texto : `| ${cab.map((c) => o[c] ?? "").join(" | ")} |`));
  return [...ls.slice(0, i + 2), ...escrita, ...ls.slice(j)].join("\n");
}

/** Quem está no quadro: o usuário do GitLab (pelo token) ou, sem ele, o do git da máquina (a parte do e-mail antes
 *  do @, ou o nome), procurado no `equipe.json`. Nulo se não é da equipe: o quadro fica só leitura. */
export function usuarioDaMaquina(raiz, exec) {
  let membros = [];
  try { membros = JSON.parse(fs.readFileSync(path.join(raiz, ".sabia/planejamento/equipe.json"), "utf8")).membros.filter((m) => m.ativo !== false); } catch { return null; }
  const acha = (pred) => { const m = membros.find(pred); return m ? { usuario: m.usuario, nome: m.nome, produto: m.produto === true } : null; };
  const g = gitlab(raiz, exec);
  if (!g.motivo) try { const u = g.ler("/user").username; const m = u && acha((x) => x.usuario === u); if (m) return m; } catch { /* sem o GitLab, vale o git */ }
  const cfg = (k) => { const r = exec("git", ["-C", raiz, "config", k]); return r.status === 0 ? r.stdout.trim() : ""; };
  const email = cfg("user.email").split("@")[0].toLowerCase(), nome = cfg("user.name").toLowerCase();
  return (email && acha((x) => x.usuario?.toLowerCase() === email)) || (nome && acha((x) => x.nome?.toLowerCase() === nome)) || null;
}

/** O quadro só grava na branch base (`branch_base` do agentes.json), com a árvore limpa. */
export function podeGravar(raiz, exec, usuario) {
  if (!usuario) return { ok: false, motivo: "seu usuário do git não está no equipe.json" };
  const git = (...a) => exec("git", ["-C", raiz, ...a]);
  const atual = git("rev-parse", "--abbrev-ref", "HEAD");
  if (atual.status !== 0) return { ok: false, motivo: "a pasta não é um repositório git" };
  let base = null;
  try { base = JSON.parse(fs.readFileSync(path.join(raiz, ".sabia/config/agentes.json"), "utf8")).branch_base ?? null; } catch { /* sem agentes.json, vale a branch atual */ }
  if (base && atual.stdout.trim() !== base) return { ok: false, motivo: `o projeto está na branch ${atual.stdout.trim()}; o quadro grava só na ${base}` };
  if (git("status", "--porcelain").stdout.trim()) return { ok: false, motivo: "há alteração pendente no projeto: faça o commit ou desfaça antes" };
  return { ok: true, motivo: null };
}

/** Prepara a mudança: lê o projeto, confere a regra e devolve { arquivos: {caminho: texto}, remover: [pastas],
 *  commit, avisos }. Não grava nada. `agora` é parâmetro para o teste. */
export function preparar(raiz, acao, { usuario, agora = new Date() }) {
  const hoje = agora.toISOString().slice(0, 10), ler = (rel) => fs.readFileSync(path.join(raiz, rel), "utf8");
  if (!fs.existsSync(path.join(raiz, BACKLOG))) throw new Error(`${BACKLOG} não existe`);
  let backlog = ler(BACKLOG);
  const itens = tabela(backlog, "id"), item = itens.find((l) => l.id === acao.id);
  if (!item) throw new Error(`${acao.id ?? "o item"} não está no backlog`);
  const sprint = sprintsDe(raiz, hoje)[0] ?? null, linhas = (sprint?.itens ?? []).filter((x) => x.Item === item.id), abertas = linhas.filter((x) => !ehData(x.concluida_em));
  const terminal = TERMINAIS.includes(item.status), impedido = IMPEDIDOS.includes(item.status), epico = item.tipo === "épico";
  // quem pode: produto, ou o responsável da tarefa em curso (sem tarefa em curso, o do item)
  const emCurso = linhas.find((x) => ehData(x.iniciada_em) && !ehData(x.concluida_em) && !semValor(x["Responsável"]))?.["Responsável"] ?? (semValor(item["responsável"]) ? null : item["responsável"]);
  const exige = (soProduto) => {
    if (!usuario) throw new Error("seu usuário do git não está no equipe.json");
    if (usuario.produto || (!soProduto && emCurso === usuario.usuario)) return;
    throw new Error(soProduto ? "isso é de quem tem produto" : `isso é de quem tem produto${emCurso ? ` ou de ${emCurso}` : ""}`);
  };
  const naLinha = (fn) => { backlog = editarTabela(backlog, "id", (ls) => { fn(ls.find((l) => l.id === item.id), ls); }); };
  const comObs = (l, texto) => { l.obs = junta(semValor(l.obs) ? "" : l.obs, texto); };
  const out = { arquivos: {}, remover: [], commit: "", avisos: [] };
  // a última fatia aberta do épico fecha o épico, como a sa-desenvolver.encerrar e a sa-refinar.ajustar
  const fecharEpico = (ls) => {
    const pai = item.pai && ls.find((l) => l.id === item.pai);
    if (!pai || pai.status !== "fatiado") return;
    const irmas = ls.filter((l) => l.pai === pai.id);
    if (irmas.some((l) => !TERMINAIS.includes(l.status))) return;
    if (irmas.some((l) => l.status === "concluida")) { pai.status = "concluido"; pai.concluida_em = hoje; }
    else { pai.status = "cancelado"; pai.motivo = junta("fatias canceladas", `desde ${hoje}`); }
    out.avisos.push(`o épico ${pai.id} ficou ${pai.status}`);
  };

  if (acao.tipo === "impedir") {
    exige(false);
    if (terminal || impedido) throw new Error(`${item.id} está ${item.status}`);
    const motivo = limpo(acao.motivo), por = limpo(acao.por, 80), ate = acao.ate || null;
    if (!motivo) throw new Error("diga o motivo do impedimento");
    if (ate && (!ehData(ate) || ate < hoje)) throw new Error("a data \"até\" precisa ser de hoje em diante");
    naLinha((l) => { l.motivo = junta(motivo, por && `por ${por}`, `desde ${hoje}`, ate && `até ${ate}`, `de ${l.status}`); l.status = epico ? "impedido" : "impedida"; });
    out.commit = `${item.id} impedir`;
    if (item.status === "em-andamento") out.avisos.push(item.tipo === "sustentação" ? "anote o impedimento na Atividade do registro" : "branch, MR e tarefa do EWM ficam como estão; anote o impedimento no Retomar do status.md");
  } else if (acao.tipo === "liberar") {
    exige(false);
    if (!impedido) throw new Error(`${item.id} não está impedido`);
    const m = lerMotivo(item.motivo);
    if (!m?.de) throw new Error(`o motivo de ${item.id} não diz o status anterior ("de <status>"): libere pela sa-status.situacao`);
    naLinha((l) => { l.status = m.de; l.motivo = ""; comObs(l, `impedida ${m.desde ?? "?"} a ${hoje}${m.texto ? `: ${m.texto}` : ""}`); });
    out.commit = `${item.id} liberar`;
  } else if (acao.tipo === "cancelar") {
    exige(false);
    if (terminal) throw new Error(`${item.id} está ${item.status}`);
    const motivo = limpo(acao.motivo);
    if (!motivo) throw new Error("diga o motivo do cancelamento");
    if (epico && itens.some((l) => l.pai === item.id && !TERMINAIS.includes(l.status))) throw new Error(`${item.id} tem fatias abertas: cancele o épico pela sa-refinar.ajustar`);
    naLinha((l, ls) => { l.status = epico ? "cancelado" : "cancelada"; l.motivo = junta(motivo, `desde ${hoje}`); fecharEpico(ls); });
    // a pasta da spec sai da branch base, para não valer como vigente nem prender artefato
    for (const base of [".kiro/specs", "openspec/changes"]) {
      const dir = path.join(raiz, base);
      if (!epico && fs.existsSync(dir)) for (const d of fs.readdirSync(dir)) if (d.toLowerCase().startsWith(item.id.toLowerCase() + "-")) out.remover.push(path.join(base, d));
    }
    out.commit = `${item.id} cancelar`;
    if (item.status === "em-andamento" || lerMotivo(item.motivo)?.de === "em-andamento") out.avisos.push("feche o MR, apague a branch remota e remova a worktree; com ELM, cancele a tarefa pela sa-elm.finalizar");
  } else if (acao.tipo === "para-sprint") {
    exige(true);
    if (!sprint?.aberta) throw new Error("não há sprint aberta: planeje pela sa-planejamento.sprint");
    if (terminal) throw new Error(`${item.id} está ${item.status}`);
    const trabalho = acao.trabalho || (["fatia", "bug"].includes(item.tipo) && item.status !== "elegivel" ? "especificação" : PRINCIPAL[item.tipo] ?? "especificação");
    if (!TRABALHOS.includes(trabalho)) throw new Error("trabalho inválido");
    if (abertas.some((x) => x.Trabalho === trabalho)) throw new Error(`${item.id} já tem a tarefa de ${trabalho} na sprint`);
    const resp = limpo(acao.responsavel, 60) || "—";
    out.arquivos[sprint.arquivo] = editarTabela(ler(sprint.arquivo), "Item", (ls) => [...ls, { Item: item.id, Trabalho: trabalho, "Responsável": resp, Tarefas: "", iniciada_em: "", concluida_em: "" }]);
    if (semValor(item.status)) naLinha((l) => { l.status = "nova"; });  // sem status, entra como nova
    out.commit = `${sprint.chave}: reabastecimento`;
  } else if (acao.tipo === "para-backlog") {
    exige(false);
    if (!sprint?.aberta || !abertas.length) throw new Error(`${item.id} não tem tarefa aberta na sprint`);
    // as tarefas abertas saem da sprint; o que elas guardavam (início, tarefa do EWM) vai para a obs do item
    const rastro = abertas.map((x) => junta(x.Trabalho, ehData(x.iniciada_em) && `iniciada em ${x.iniciada_em}`, !semValor(x.Tarefas) && x.Tarefas)).join("; ");
    out.arquivos[sprint.arquivo] = editarTabela(ler(sprint.arquivo), "Item", (ls) => ls.filter((x) => !(x.Item === item.id && !ehData(x.concluida_em))));
    const volta = item.tipo === "sustentação" ? "nova" : "elegivel";
    naLinha((l) => {
      if (l.status === "em-andamento") l.status = volta;
      else if (impedido) { const m = lerMotivo(l.motivo); if (m?.de === "em-andamento") l.motivo = l.motivo.replace(/de em-andamento$/, `de ${volta}`); }
      comObs(l, `saiu da ${sprint.chave} em ${hoje} (${rastro})`);
    });
    out.commit = `${item.id} devolver ao backlog`;
    if (abertas.some((x) => !semValor(x.Tarefas))) out.avisos.push("com ELM, cancele a tarefa do item pela sa-elm.finalizar");
  } else if (acao.tipo === "concluir") {
    exige(false);
    if (!["fatia", "bug"].includes(item.tipo) || item.status !== "em-andamento") throw new Error(`só se conclui pelo quadro a fatia ou o bug em andamento; ${item.id} está ${item.status}`);
    const em = ehData(acao.mesclado_em) ? acao.mesclado_em : hoje;
    if (!acao.mesclado_em && acao.confirmo !== true) throw new Error("confirme que o MR foi mesclado");
    naLinha((l, ls) => { l.status = "concluida"; l.concluida_em = em; fecharEpico(ls); });
    const dev = linhas.find((x) => x.Trabalho === "desenvolvimento" && !ehData(x.concluida_em));
    if (dev && "concluida_em" in dev) out.arquivos[sprint.arquivo] = editarTabela(ler(sprint.arquivo), "Item", (ls) => { ls.find((x) => x.Item === item.id && x.Trabalho === "desenvolvimento" && !ehData(x.concluida_em)).concluida_em = em; });
    // as lições escolhidas e editadas no quadro viram Regras aprendidas do .sabia/sabia.md
    const regras = (acao.regras ?? []).map((r) => limpo(r, 240)).filter(Boolean);
    if (regras.length) {
      if (!fs.existsSync(path.join(raiz, SABIA_MD))) throw new Error(`${SABIA_MD} não existe`);
      const ls = ler(SABIA_MD).split("\n"), i = ls.findIndex((l) => /^## Regras aprendidas\s*$/.test(l));
      if (i < 0) throw new Error(`${SABIA_MD} não tem a seção Regras aprendidas`);
      let fim = ls.findIndex((l, k) => k > i && /^## /.test(l));
      if (fim < 0) fim = ls.length;
      const secao = ls.slice(i, fim).filter((l) => !/^<!-- Nenhuma regra ainda\. -->$/.test(l.trim()));
      while (secao.at(-1)?.trim() === "") secao.pop();
      const novas = regras.map((r) => `- ${r} · origem ${item.id} · ${hoje}`);
      if (!/^- /.test(secao.at(-1) ?? "")) secao.push("");
      out.arquivos[SABIA_MD] = [...ls.slice(0, i), ...secao, ...novas, "", ...ls.slice(fim)].join("\n");
    }
    out.commit = `${item.id} concluir`;
    out.avisos.push("falta o archive da spec e a worktree: rode a sa-desenvolver.encerrar se o projeto usa OpenSpec, ELM ou autopilot");
  } else if (acao.tipo === "ordenar") {
    exige(true);
    for (const ref of [acao.antes, acao.depois]) if (ref && (ref === item.id || !itens.some((l) => l.id === ref))) throw new Error(`${ref} não serve de referência para a ordem`);
    backlog = editarTabela(backlog, "id", (ls) => {
      const resto = ls.filter((l) => l.id !== item.id);
      const k = acao.antes ? resto.findIndex((l) => l.id === acao.antes) : acao.depois ? resto.findIndex((l) => l.id === acao.depois) + 1 : resto.length;
      return [...resto.slice(0, k), ls.find((l) => l.id === item.id), ...resto.slice(k)];
    });
    out.commit = "backlog: ordem";
  } else throw new Error("ação desconhecida");

  if (backlog !== ler(BACKLOG)) out.arquivos[BACKLOG] = backlog;
  if (!Object.keys(out.arquivos).length) throw new Error("nada mudou");
  return out;
}

/** Faz a mudança: confere a branch e a árvore, `git pull --ff-only`, grava, commit e push. Se o commit falha, os
 *  arquivos voltam ao que eram; se só o push falha, o commit fica local e o erro diz isso. */
export function executar(raiz, acao, { exec, usuario, agora }) {
  const pode = podeGravar(raiz, exec, usuario);
  if (!pode.ok) throw new Error(pode.motivo);
  const git = (...a) => exec("git", ["-C", raiz, ...a]), falha = (r) => (r.stderr || r.stdout || r.error?.message || "falhou").trim().split("\n").at(-1);
  const pull = git("pull", "--ff-only");
  if (pull.status !== 0) throw new Error(`git pull --ff-only: ${falha(pull)}`);
  const m = preparar(raiz, acao, { usuario, agora }), caminhos = Object.keys(m.arquivos);
  const antes = Object.fromEntries(caminhos.map((c) => [c, fs.readFileSync(path.join(raiz, c), "utf8")]));
  const desfaz = () => { for (const c of caminhos) fs.writeFileSync(path.join(raiz, c), antes[c]); git("reset", "--quiet"); for (const d of m.remover) git("checkout", "--", d); };
  for (const c of caminhos) fs.writeFileSync(path.join(raiz, c), m.arquivos[c]);
  for (const d of m.remover) { const r = git("rm", "-r", "--quiet", d); if (r.status !== 0) { desfaz(); throw new Error(`git rm ${d}: ${falha(r)}`); } }
  const add = git("add", "--", ...caminhos), commit = add.status === 0 ? git("commit", "--quiet", "-m", m.commit) : add;
  if (commit.status !== 0) { desfaz(); throw new Error(`git commit: ${falha(commit)}`); }
  const push = git("push", "--quiet");
  if (push.status !== 0) throw new Error(`o commit "${m.commit}" ficou só nesta máquina; o push falhou: ${falha(push)}`);
  return { commit: m.commit, avisos: m.avisos };
}
