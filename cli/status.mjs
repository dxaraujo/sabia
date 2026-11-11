// `sabia status`: o estado do fluxo em JSON estável, para bots e scripts. Só lê: o backlog e as sprints do repositório
// (com o início e o fim de cada tarefa), os acordos do time (WIP, SLE e alertas), o `status.md` da branch dos itens em
// andamento (worktree ou branch publicada) e, com as variáveis do GitLab, os MRs abertos. A seção `quadro` é o que a
// `sabia kanban` exibe. O campo `versao` muda se o formato mudar.
import fs from "node:fs";
import path from "node:path";

const VERSAO_SABIA = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")).version;
const TERMINAIS = ["concluida", "concluido", "cancelada", "cancelado"];
const NAO_INICIADO = ["aceita", "elegivel"];
// As colunas padrão do quadro, na ordem do fluxo: [id, nome]. Os ids são do framework: os status do `backlog.md`
// (concluido e cancelado, do épico, caem em concluida e cancelada) e, no lugar do `em-andamento`, as fases do
// `status.md` da branch (FASES; `iniciada` é o em-andamento sem Fase). `backlog` é da página: o item fora da sprint
// escolhida nela, que ainda não começou. O projeto troca só a ordem, o nome e `oculta`, no CONFIG_KANBAN.
export const CONFIG_KANBAN = ".sabia/config/kanban.json";
const FASES = ["iniciada", "implementando", "revisando", "verificando", "pr-aberto", "retrabalho"];
const COLUNAS = [["backlog", "Backlog"], ["nova", "Nova"], ["a-moldar", "A moldar"], ["em-especificacao", "Em especificação"], ["fatiado", "Fatiado"],
  ["aceita", "Aceita"], ["elegivel", "Elegível"],
  ["iniciada", "Iniciada"], ["implementando", "Em desenvolvimento"], ["revisando", "Revisão do agente"], ["verificando", "Verificação do agente"],
  ["pr-aberto", "Aguardando aprovação do MR"], ["retrabalho", "Retrabalho"],
  ["impedida", "Impedido"], ["concluida", "Concluída"], ["cancelada", "Cancelada"]];
// As colunas que cada status do WIP do `acordos.json` conta. `em-revisao` é derivado (MR aberto) e nunca se grava.
const WIP = { "em-andamento": ["Em andamento", ["iniciada", "implementando", "revisando", "verificando"]], "em-revisao": ["MR em revisão", ["pr-aberto", "retrabalho"]] };
export const celulas = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
export const semValor = (x) => !x || x === "—";
/** O status no feminino dos três que o épico grava no masculino; o resto fica como está no backlog. */
const statusColuna = (s) => ({ impedido: "impedida", concluido: "concluida", cancelado: "cancelada" }[s] ?? s);
/** A coluna `motivo` do backlog: `<texto> · por <quem> · desde <data> · até <data> · de <status anterior>`. */
export function lerMotivo(celula) {
  if (semValor(celula)) return null;
  const m = { texto: null, por: null, desde: null, ate: null, de: null }, texto = [];
  for (const parte of celula.split(" · ")) {
    const c = parte.match(/^(por|desde|até|de) (.+)$/);
    if (c) m[c[1] === "até" ? "ate" : c[1]] = c[2].trim(); else texto.push(parte.trim());
  }
  return { ...m, texto: texto.join(" · ") || null };
}

/** As linhas da primeira tabela cujo cabeçalho começa com `coluna`, como objetos pelo nome da coluna. */
export function tabela(texto, coluna) {
  const ls = texto.split("\n"), i = ls.findIndex((l) => l.trim().startsWith("|") && celulas(l)[0] === coluna);
  if (i < 0) return [];
  const cab = celulas(ls[i]), out = [];
  for (let j = i + 2; j < ls.length && ls[j].trim().startsWith("|"); j++) out.push(Object.fromEntries(celulas(ls[j]).map((v, k) => [cab[k], v])));
  return out;
}

/** As sprints do projeto, da mais nova para a mais antiga; a primeira é a aberta (a de maior chave). */
export function sprintsDe(raiz, hoje) {
  const dir = path.join(raiz, ".sabia/planejamento/sprints");
  if (!fs.existsSync(dir)) return [];
  const chave = (f) => f.split(path.sep).slice(-2).join("/");
  return fs.readdirSync(dir, { recursive: true }).map(String).filter((f) => /(^|\/)sprint-\d+\.md$/.test(f)).sort((a, b) => chave(b).localeCompare(chave(a), "en", { numeric: true })).map((f) => {
    const texto = fs.readFileSync(path.join(dir, f), "utf8");
    const c = texto.match(/^# (\d{4}\/Sprint \d+) · (\d{4}-\d{2}-\d{2}) → (\d{4}-\d{2}-\d{2})/m);
    const reserva = texto.match(/^\*\*Reserva de capacidade:\*\* (\d+)/m);
    return c && { chave: c[1], inicio: c[2], fim: c[3], meta: texto.match(/^\*\*Meta:\*\* (.*)$/m)?.[1] ?? null, reserva: reserva ? +reserva[1] : null, aberta: hoje <= c[3], itens: tabela(texto, "Item"),
      arquivo: path.join(".sabia/planejamento/sprints", f) };
  }).filter(Boolean);
}

/** Os nomes das pessoas pelo `usuario` do equipe.json; vazio sem o arquivo. */
function pessoasDe(raiz) {
  try {
    return Object.fromEntries(JSON.parse(fs.readFileSync(path.join(raiz, ".sabia/planejamento/equipe.json"), "utf8")).membros.filter((m) => m.usuario && m.nome).map((m) => [m.usuario, m.nome]));
  } catch { return {}; }
}

/** O acesso ao GitLab do projeto, pelas variáveis GITLAB_API_URL e GITLAB_API_TOKEN: `ler(rota)` devolve o JSON da
 *  rota (relativa à API) ou lança. O token vai pela entrada do curl, para não aparecer na lista de processos. */
export function gitlab(raiz, exec) {
  const base = process.env.GITLAB_API_URL?.replace(/\/+$/, ""), token = process.env.GITLAB_API_TOKEN;
  if (!base || !token) return { motivo: "defina GITLAB_API_URL e GITLAB_API_TOKEN" };
  const remoto = exec("git", ["remote", "get-url", "origin"], { cwd: raiz });
  if (remoto.status !== 0) return { motivo: "o repositório não tem o remoto origin" };
  const caminho = remoto.stdout.trim().replace(/\.git$/, "").replace(/^[a-z+]+:\/\/[^/]+\//, "").replace(/^[^@/]+@[^:]+:/, "");
  const api = /\/api\/v\d+$/.test(base) ? base : `${base}/api/v4`, ca = process.env.GITLAB_CA_BUNDLE;
  return {
    motivo: null, projeto: `/projects/${encodeURIComponent(caminho)}`,
    ler(rota) {
      const r = exec("curl", ["-sS", "--fail", "--max-time", "20", ...(ca ? ["--cacert", ca] : []), "-K", "-", api + rota], { input: `header = "PRIVATE-TOKEN: ${token}"\n` });
      if (r.status !== 0) throw new Error((r.stderr || r.error?.message || "falhou").trim());
      try { return JSON.parse(r.stdout); } catch (e) { throw new Error(`resposta inválida (${e.message})`); }
    },
  };
}

/** Os MRs abertos do projeto e, à parte, os mesclados há pouco (para avisar do item que falta concluir). */
function mrsDoGitlab(raiz, exec) {
  const g = gitlab(raiz, exec), mr = (m) => ({ iid: m.iid, titulo: m.title, autor: m.author?.username ?? null, branch: m.source_branch,
    url: m.web_url, criado_em: m.created_at, atualizado_em: m.updated_at ?? null, rascunho: Boolean(m.draft) });
  if (g.motivo) return { abertos: { disponivel: false, motivo: g.motivo, itens: [] }, mesclados: [] };
  let abertos;
  try { abertos = { disponivel: true, motivo: null, itens: g.ler(`${g.projeto}/merge_requests?state=opened&per_page=100`).map(mr) }; }
  catch (e) { return { abertos: { disponivel: false, motivo: `GitLab: ${e.message}`, itens: [] }, mesclados: [] }; }
  let mesclados = [];
  // shortcut: só os 50 MRs mesclados mais recentes; item mesclado há mais tempo que isso não ganha o aviso
  try { mesclados = g.ler(`${g.projeto}/merge_requests?state=merged&order_by=updated_at&per_page=50`).filter((m) => m.state === "merged").map((m) => ({ ...mr(m), mesclado_em: m.merged_at ?? null })); } catch { /* sem os mesclados, só falta o aviso */ }
  return { abertos, mesclados };
}

/** Os acordos do time (`acordos.json`): WIP por status, SLE e os limites de alerta, com o padrão no que falta.
 *  Sem o arquivo, sem WIP nem SLE; JSON inválido devolve `erro`, e o quadro avisa. */
function acordosDe(raiz) {
  const f = path.join(raiz, ".sabia/planejamento/acordos.json"), num = (x, padrao) => (Number.isFinite(x) && x > 0 ? x : padrao);
  let a = {}, erro = null;
  if (fs.existsSync(f)) try { a = JSON.parse(fs.readFileSync(f, "utf8")) ?? {}; } catch (e) { erro = e.message; a = {}; }
  const wip = Object.fromEntries(Object.entries(a.wip ?? {}).filter(([, n]) => Number.isFinite(n)));
  return {
    wip: Object.keys(wip).length ? wip : null,
    sle: Number.isFinite(a.sle?.dias) ? { percentual: a.sle.percentual ?? null, dias: a.sle.dias } : null,
    alertas: { mr_parado_dias: num(a.alertas?.mr_parado_dias, 1), impedimento_dias: num(a.alertas?.impedimento_dias, 7) },
    erro,
  };
}

/** Os campos do status.md da fatia (a pasta da spec, na branch): Fase, MR, Trilha e Autonomia, e as linhas do
 *  Em aberto que bloqueiam (Bloqueia diferente de `nada`). */
function lerStatusMd(texto) {
  const l = Object.fromEntries(tabela(texto, "Campo").map((x) => [x.Campo, x.Valor]));
  const v = (k) => semValor(l[k]) ? null : l[k];
  let mr = null;
  if (v("MR")) {
    const m = l.MR.match(/!(\d+)\s+(\S+)/);
    mr = m ? { iid: +m[1], url: m[2] } : { iid: null, url: l.MR };
  }
  const bloqueios = tabela(texto, "Pergunta").filter((x) => !semValor(x.Pergunta) && !semValor(x.Bloqueia) && x.Bloqueia !== "nada")
    .map((x) => ({ pergunta: x.Pergunta, para: x["Para quem"] || null, bloqueia: x.Bloqueia }));
  const licoes = tabela(texto, "Lição").filter((x) => !semValor(x["Lição"])).map((x) => ({ licao: x["Lição"], origem: semValor(x.Origem) ? null : x.Origem, regra: semValor(x["Regra proposta"]) ? null : x["Regra proposta"] }));
  return { fase: v("Fase"), trilha: v("Trilha"), autonomia: v("Autonomia"), mr, bloqueios, licoes };
}

/** O status.md do item: a worktree `.sabia/local/wt/<id>` (a branch pode não estar publicada), a branch
 *  `origin/<id>` ou a pasta da spec na branch base (o projeto pode manter as specs nela até o merge). */
function statusDaBranch(raiz, exec, id) {
  const pref = id.toLowerCase(), nomes = [...new Set([id, id.toLowerCase()])];
  for (const nome of nomes) {
    const wt = path.join(raiz, ".sabia/local/wt", nome);
    if (!fs.existsSync(wt)) continue;
    for (const raizSpec of [".kiro/specs", "openspec/changes"]) {
      const dir = path.join(wt, ...raizSpec.split("/"));
      if (!fs.existsSync(dir)) continue;
      for (const d of fs.readdirSync(dir)) {
        if (!d.toLowerCase().startsWith(pref)) continue;
        const f = path.join(dir, d, "status.md");
        if (fs.existsSync(f)) return lerStatusMd(fs.readFileSync(f, "utf8"));
      }
    }
  }
  for (const nome of nomes) {
    const arq = exec("git", ["-C", raiz, "ls-tree", "-r", "--name-only", `origin/${nome}`]);
    if (arq.status !== 0) continue;
    const f = (arq.stdout ?? "").trim().split("\n").find((l) => l.endsWith("/status.md") && l.split("/").at(-2)?.toLowerCase().startsWith(pref));
    if (!f) continue;
    const s = exec("git", ["-C", raiz, "show", `origin/${nome}:${f}`]);
    if (s.status === 0) return lerStatusMd(s.stdout);
  }
  // sem branch do item: a pasta da spec na branch base, quando a spec é a do id (o projeto pode gravá-la
  // nela até o merge — a fase só vale se o item está em andamento, o que quem chama garante)
  const cabecas = ["origin/HEAD", "HEAD"].filter((r) => exec("git", ["-C", raiz, "rev-parse", "--verify", "--quiet", r]).status === 0);
  if (!cabecas.length) return null;
  for (const cabeca of cabecas) {
    const arq = exec("git", ["-C", raiz, "ls-tree", "-r", "--name-only", cabeca]);
    if (arq.status !== 0) continue;
    const f = (arq.stdout ?? "").trim().split("\n").find((l) => l.endsWith("/status.md") && l.split("/").at(-2)?.toLowerCase().startsWith(pref));
    if (!f) continue;
    const s = exec("git", ["-C", raiz, "show", `${cabeca}:${f}`]);
    if (s.status === 0) return lerStatusMd(s.stdout);
  }
  return null;
}

/** As colunas do quadro: as padrão do framework com a ordem, o nome e `oculta` do CONFIG_KANBAN do projeto. Id que o
 *  framework não conhece é ignorado, a coluna que falta entra no fim e as do em andamento ficam sempre juntas. */
function colunasDoProjeto(raiz) {
  const f = path.join(raiz, CONFIG_KANBAN), padrao = new Map(COLUNAS);
  let cfg = null, erro = null;
  if (fs.existsSync(f)) try { cfg = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { erro = e.message; }
  const vistos = new Set();
  const lista = [...(Array.isArray(cfg?.colunas) ? cfg.colunas : []), ...COLUNAS.map(([id]) => ({ id }))]
    .filter((c) => padrao.has(c?.id) && !vistos.has(c.id) && vistos.add(c.id))
    .map((c) => ({ id: c.id, nome: typeof c.nome === "string" && c.nome.trim() ? c.nome.trim() : padrao.get(c.id), oculta: c.oculta === true, grupo: FASES.includes(c.id) }));
  const i = lista.findIndex((c) => c.grupo);
  return {
    colunas: [...lista.slice(0, i), ...lista.filter((c) => c.grupo), ...lista.slice(i).filter((c) => !c.grupo)],
    grupo: typeof cfg?.grupo === "string" && cfg.grupo.trim() ? cfg.grupo.trim() : "Em andamento",
    config: { arquivo: CONFIG_KANBAN, do_projeto: Boolean(cfg), erro },
  };
}

/** O estado do fluxo. `agora` e `exec` são parâmetros para o teste. `usuario` ({ usuario, produto }) é quem está
 *  no quadro Kanban: com ele, cada card diz se a pessoa pode mudar a situação do item. */
export function statusDoProjeto({ projeto = ".", exec, agora = new Date(), usuario = null }) {
  const raiz = path.resolve(projeto), f = path.join(raiz, ".sabia/planejamento/backlog.md");
  if (!fs.existsSync(f)) throw new Error(`${f} não existe: rode na raiz de um projeto com o Sabiá configurado`);
  const backlog = tabela(fs.readFileSync(f, "utf8"), "id"), porId = Object.fromEntries(backlog.map((l) => [l.id, l]));
  const hoje = agora.toISOString().slice(0, 10), sprints = sprintsDe(raiz, hoje), sprint = sprints[0] ?? null;
  const dias = (d, ate = hoje) => Math.floor((Date.parse(ate) - Date.parse(d)) / 86400000);
  // as datas são da tarefa (a linha da sprint). O início do item é o primeiro `iniciada_em` das linhas do trabalho
  // principal dele, em qualquer sprint; a idade e o lead time do item partem daí
  const PRINCIPAL = { fatia: "desenvolvimento", bug: "desenvolvimento", "sustentação": "atendimento", "épico": "especificação" };
  const data = (x) => (/^\d{4}-\d{2}-\d{2}$/.test(x ?? "") ? x : null);
  const inicioDe = (l) => sprints.flatMap((sp) => sp.itens).filter((x) => x.Item === l.id && x.Trabalho === PRINCIPAL[l.tipo]).map((x) => data(x.iniciada_em)).filter(Boolean).sort()[0] ?? null;
  const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
  const porStatus = {};
  for (const l of backlog) porStatus[l.status] = (porStatus[l.status] ?? 0) + 1;
  const itens = sprint?.aberta ? sprint.itens.map((x) => ({ ...x, linha: porId[x.Item] })).filter((x) => x.linha && !TERMINAIS.includes(x.linha.status)) : [];

  // o quadro: os MRs abertos (o GitLab, quando disponível), os acordos e o status.md dos itens em andamento
  const { abertos: mrs, mesclados } = mrsDoGitlab(raiz, exec), acordos = acordosDe(raiz), { colunas, grupo, config } = colunasDoProjeto(raiz);
  const mdCache = {};
  const mdDe = (id) => (id in mdCache ? mdCache[id] : (mdCache[id] = statusDaBranch(raiz, exec, id)));
  const mrGitlabDe = (id) => mrs.disponivel ? (mrs.itens.find((x) => (x.branch ?? "").toLowerCase() === id.toLowerCase() && !x.rascunho) ?? null) : null;
  // a coluna do item: o status do backlog; no em-andamento, a Fase do status.md da branch (ela manda), e sem
  // Fase o MR aberto no GitLab (pr-aberto) ou `iniciada`
  const colunaDe = (l) => {
    const st = statusColuna(l.status) || "sem-dados";
    if (st !== "em-andamento") return st;
    const fase = mdDe(l.id)?.fase;
    return FASES.includes(fase) ? fase : mrGitlabDe(l.id) ? "pr-aberto" : "iniciada";
  };
  const devolvido = (id) => [id, id.toLowerCase()].some((n) => {
    const a = path.join(raiz, ".sabia/local", `loop-${n}.md`);
    return fs.existsSync(a) && /^Devolvido:/m.test(fs.readFileSync(a, "utf8"));
  });

  // os cards: o backlog inteiro, mais as linhas da sprint que não estão nele; `na_sprint` separa a sprint
  const linhas = sprint?.itens ?? [];
  const cards = [...backlog, ...[...new Set(linhas.map((x) => x.Item))].filter((id) => !porId[id]).map((id) => ({ id, status: "sem-dados" }))].map((l) => {
    const daSprint = linhas.filter((x) => x.Item === l.id);
    const st = statusColuna(l.status) || "sem-dados", terminal = TERMINAIS.includes(st), andando = st === "em-andamento";
    const md = andando ? mdDe(l.id) : null, mrG = andando ? mrGitlabDe(l.id) : null;
    const inicio = inicioDe(l), idade = !terminal && inicio ? dias(inicio) : null;
    const motivo = st === "impedida" || st === "cancelada" ? lerMotivo(l.motivo) : null, desde = data(motivo?.desde);
    // os avisos: o que o acordos.json e o fluxo do sa-status pedem para olhar; `critico` pede ação já, `atencao` acompanha
    const avisos = [], aviso = (tipo, nivel, mensagem) => avisos.push({ tipo, nivel, mensagem });
    if (l.prioridade === "crítica" && !terminal) aviso("urgente", "critico", "urgente: prioridade crítica, vai ao topo");
    if (acordos.sle && andando && idade > acordos.sle.dias) aviso("sle", "critico", `idade ${idade} dias, acima do SLE de ${acordos.sle.dias} dias`);
    if (andando && devolvido(l.id)) aviso("devolvido", "critico", "devolvido pelo autopilot: o dono resolve e relança");
    for (const b of md?.bloqueios ?? []) aviso("bloqueio", "critico", `em aberto bloqueia ${b.bloqueia}: ${b.pergunta}${b.para ? ` (para ${b.para})` : ""}`);
    if (mrG?.atualizado_em) {
      const d = Math.floor((agora - new Date(mrG.atualizado_em)) / 86400000);
      if (d >= acordos.alertas.mr_parado_dias) aviso("mr-parado", "atencao", `MR !${mrG.iid} parado: sem atualização há ${plural(d, "dia", "dias")}`);
    }
    const mesclado = andando ? (mesclados.find((x) => (x.branch ?? "").toLowerCase() === l.id.toLowerCase()) ?? null) : null;
    if (mesclado) aviso("mesclado", "atencao", `MR !${mesclado.iid} mesclado: falta registrar a conclusão`);
    // quem pode mudar a situação: quem tem produto, ou o responsável da tarefa em curso (sem tarefa em curso, o do item)
    const emCurso = daSprint.find((x) => data(x.iniciada_em) && !data(x.concluida_em) && !semValor(x["Responsável"]))?.["Responsável"] ?? (semValor(l["responsável"]) ? null : l["responsável"]);
    if (md?.fase === "retrabalho") aviso("retrabalho", "atencao", "retrabalho: o dono retoma no mesmo MR");
    if (st === "impedida") {
      if (!motivo) aviso("impedimento", "atencao", "impedida sem a coluna motivo");
      // com a data "até" ainda no futuro, o impedimento é um adiamento combinado: não alarma
      else if (desde && dias(desde) > acordos.alertas.impedimento_dias && !(data(motivo.ate) && motivo.ate >= hoje)) aviso("impedimento", "critico", `impedida há ${dias(desde)} dias${motivo.texto ? `: ${motivo.texto}` : ""}`);
      if (data(motivo?.ate) && motivo.ate < hoje) aviso("impedimento-vencido", "atencao", `impedimento com a data vencida em ${motivo.ate}: pode ser liberado`);
    }
    const falta = st === "nova" ? l.obs?.match(/falta: ([^·]+)/)?.[1].trim() : null;
    if (falta) aviso("falta-informacao", "atencao", `falta: ${falta}`);
    if (sprint?.aberta && !terminal) {
      for (const x of daSprint) if (semValor(x["Responsável"])) aviso("sem-responsavel", "atencao", `sem responsável na sprint (${x.Trabalho})`);
      if (andando && !daSprint.length) aviso("fora-da-sprint", "atencao", "em andamento sem linha na sprint aberta");
    }
    return {
      id: l.id,
      titulo: l["título"] || null,
      tipo: l.tipo || null,
      status: st,
      coluna: colunaDe(l),
      fase: md?.fase ?? null,
      na_sprint: daSprint.length > 0,
      responsavel: (semValor(l["responsável"]) ? daSprint.map((x) => x["Responsável"]).find((r) => !semValor(r)) : l["responsável"]) ?? null,
      prioridade: l.prioridade || null,
      tamanho: l.tamanho || null,
      pai: l.pai || null,
      ib: l.ib || null,
      entrou_em: data(l.entrou_em),
      iniciada_em: inicio,
      concluida_em: data(l.concluida_em),
      idade_dias: idade,
      lead_time_dias: inicio && data(l.concluida_em) ? dias(inicio, l.concluida_em) : null,
      trilha: md?.trilha ?? null,
      autonomia: md?.autonomia ?? null,
      mr: mrG ? { iid: mrG.iid, url: mrG.url } : (md?.mr ?? null),
      motivo,
      mesclado: mesclado && { iid: mesclado.iid, url: mesclado.url, em: mesclado.mesclado_em?.slice(0, 10) ?? null },
      licoes: md?.licoes ?? [],
      pode: Boolean(usuario && (usuario.produto || (emCurso && emCurso === usuario.usuario))),
      impedida_dias: st === "impedida" && desde ? dias(desde) : null,
      avisos,
    };
  });
  // status fora dos do framework (erro de digitação, linha da sprint fora do backlog): a coluna entra no fim
  for (const c of cards) if (!colunas.some((x) => x.id === c.coluna)) colunas.push({ id: c.coluna, nome: c.coluna === "sem-dados" ? "Fora do backlog" : c.coluna, oculta: false, grupo: false });

  // o WIP conta só fatia e bug (os status do `acordos.json` são os deles), no backlog inteiro
  const wip = Object.entries(acordos.wip ?? {}).map(([status, limite]) => {
    const [nome, cols] = WIP[status] ?? [colunas.find((c) => c.id === status)?.nome ?? status, [status]];
    return { status, nome, colunas: cols, // o impedido segue contando no WIP do status de onde veio
      atual: cards.filter((c) => (c.tipo === "fatia" || c.tipo === "bug") && (cols.includes(c.coluna) || (c.status === "impedida" && c.motivo?.de === status))).length, limite };
  });
  // os alertas do quadro: a configuração inválida, o WIP estourado, a reserva de capacidade e o fim do ciclo
  const alertas = [];
  if (acordos.erro) alertas.push({ tipo: "acordos", nivel: "critico", mensagem: `.sabia/planejamento/acordos.json inválido (${acordos.erro}): o quadro segue sem WIP nem SLE` });
  if (config.erro) alertas.push({ tipo: "config", nivel: "critico", mensagem: `${CONFIG_KANBAN} inválido (${config.erro}): o quadro usa o padrão` });
  for (const w of wip) if (w.atual > w.limite) alertas.push({ tipo: "wip", nivel: "critico", mensagem: `WIP estourado em ${w.nome}: ${w.atual} de ${w.limite}` });
  const atendimentos = linhas.filter((x) => x.Trabalho === "atendimento").length;
  if (sprint?.reserva != null && atendimentos > sprint.reserva) alertas.push({ tipo: "reserva", nivel: "atencao", mensagem: `reserva de capacidade estourada: ${atendimentos} de ${plural(sprint.reserva, "item", "itens")} de atendimento` });
  if (sprint && hoje >= sprint.fim) {
    const abertos = plural(cards.filter((c) => c.na_sprint && !TERMINAIS.includes(c.status)).length, "item em aberto", "itens em aberto");
    alertas.push({ tipo: "fim-do-ciclo", nivel: "atencao", mensagem: hoje === sprint.fim ? `último dia da sprint: ${abertos}` : `sprint encerrada em ${sprint.fim}: ${abertos} para a virada` });
  }

  return {
    versao: 4,
    sabia: VERSAO_SABIA,
    projeto: path.basename(raiz),
    gerado_em: agora.toISOString(),
    sprint: sprint && { chave: sprint.chave, inicio: sprint.inicio, fim: sprint.fim, meta: sprint.meta, reserva: sprint.reserva, aberta: sprint.aberta },
    por_status: porStatus,
    sem_responsavel: itens.filter((x) => semValor(x["Responsável"])).map((x) => ({ id: x.Item, titulo: x.linha["título"], trabalho: x.Trabalho, status: x.linha.status })),
    nao_iniciados: itens.filter((x) => x.Trabalho === "desenvolvimento" && NAO_INICIADO.includes(x.linha.status)).map((x) => ({ id: x.Item, titulo: x.linha["título"], status: x.linha.status })),
    em_andamento: backlog.filter((l) => l.status === "em-andamento").map((l) => ({ id: l.id, titulo: l["título"], responsavel: semValor(l["responsável"]) ? null : l["responsável"],
      iniciada_em: inicioDe(l), idade_dias: inicioDe(l) ? dias(inicioDe(l)) : null })),
    mrs_aguardando: mrs,
    quadro: {
      config, grupo, colunas, itens: cards, wip, sle: acordos.sle, limites: acordos.alertas, alertas, pessoas: pessoasDe(raiz),
      // as sprints, da aberta para a primeira, com as linhas de cada uma (a página escolhe qual mostra)
      sprints: sprints.map((x) => ({ chave: x.chave, inicio: x.inicio, fim: x.fim, meta: x.meta, reserva: x.reserva, aberta: x.aberta,
        itens: x.itens.map((l) => ({ id: l.Item, trabalho: l.Trabalho ?? null, responsavel: semValor(l["Responsável"]) ? null : l["Responsável"], tarefas: semValor(l.Tarefas) ? null : l.Tarefas,
          // a tarefa: início e fim daquele trabalho, e o lead time dele
          iniciada_em: data(l.iniciada_em), concluida_em: data(l.concluida_em),
          lead_time_dias: data(l.iniciada_em) && data(l.concluida_em) ? dias(l.iniciada_em, l.concluida_em) : null })) })),
    },
  };
}
