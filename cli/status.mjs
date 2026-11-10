// `sabia status`: o estado do fluxo em JSON estável, para bots e scripts. Só lê: o backlog e a sprint aberta do repositório,
// os acordos do time (WIP e SLE), o `status.md` da branch dos itens em andamento (worktree ou branch publicada) e, com as
// variáveis do GitLab, os MRs abertos. A seção `quadro` é o que a `sabia kanban` exibe. O campo `versao` muda se o formato mudar.
import fs from "node:fs";
import path from "node:path";

const TERMINAIS = ["concluida", "concluido", "cancelada", "cancelado"];
const NAO_INICIADO = ["aceita", "elegivel"];
// A Fase do status.md da branch manda no status efetivo do item em andamento: `revisando`, `pr-aberto` ou
// `retrabalho` o colocam em `em-revisao`; qualquer outra fase (ou o `—`/ausência de status.md) o mantém em
// `em-andamento`. Só sem Fase se consulta o MR aberto do GitLab.
const FASES_REVISAO = ["revisando", "pr-aberto", "retrabalho"];
// Os status que cada tipo pode ter (`backlog.md`), para as colunas do quadro. `em-revisao` é derivado do MR aberto e nunca se grava.
const MAQUINAS = {
  fatia: ["nova", "aceita", "elegivel", "em-andamento", "concluida", "adiada", "cancelada"],
  bug: ["nova", "aceita", "elegivel", "em-andamento", "concluida", "adiada", "cancelada"],
  "épico": ["a-moldar", "em-especificacao", "fatiado", "concluido", "cancelado"],
  "sustentação": ["nova", "em-andamento", "concluida", "cancelada"],
};
const ORDEM = ["a-moldar", "em-especificacao", "fatiado", "nova", "aceita", "elegivel", "em-andamento", "em-revisao", "adiada", "concluida", "concluido", "cancelada", "cancelado"];
const celulas = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
const semValor = (x) => !x || x === "—";
/** `adiada até <data>` ocupa uma coluna só (`adiada`); o resto fica como está no backlog. */
const statusColuna = (s) => (s && s.startsWith("adiada") ? "adiada" : s);

/** As linhas da primeira tabela cujo cabeçalho começa com `coluna`, como objetos pelo nome da coluna. */
function tabela(texto, coluna) {
  const ls = texto.split("\n"), i = ls.findIndex((l) => l.trim().startsWith("|") && celulas(l)[0] === coluna);
  if (i < 0) return [];
  const cab = celulas(ls[i]), out = [];
  for (let j = i + 2; j < ls.length && ls[j].trim().startsWith("|"); j++) out.push(Object.fromEntries(celulas(ls[j]).map((v, k) => [cab[k], v])));
  return out;
}

function sprintAberta(raiz, hoje) {
  const dir = path.join(raiz, ".sabia/planejamento/sprints");
  if (!fs.existsSync(dir)) return null;
  const chave = (f) => f.split(path.sep).slice(-2).join("/");
  const arqs = fs.readdirSync(dir, { recursive: true }).map(String).filter((f) => /(^|\/)sprint-\d+\.md$/.test(f)).sort((a, b) => chave(a).localeCompare(chave(b), "en", { numeric: true }));
  if (!arqs.length) return null;
  const texto = fs.readFileSync(path.join(dir, arqs.at(-1)), "utf8");
  const c = texto.match(/^# (\d{4}\/Sprint \d+) · (\d{4}-\d{2}-\d{2}) → (\d{4}-\d{2}-\d{2})/m);
  if (!c) return null;
  return { chave: c[1], inicio: c[2], fim: c[3], meta: texto.match(/^\*\*Meta:\*\* (.*)$/m)?.[1] ?? null, aberta: hoje <= c[3], itens: tabela(texto, "Item") };
}

function mrsAbertos(raiz, exec) {
  const sem = (motivo) => ({ disponivel: false, motivo, itens: [] });
  const base = process.env.GITLAB_API_URL?.replace(/\/+$/, ""), token = process.env.GITLAB_API_TOKEN;
  if (!base || !token) return sem("defina GITLAB_API_URL e GITLAB_API_TOKEN");
  const remoto = exec("git", ["remote", "get-url", "origin"], { cwd: raiz });
  if (remoto.status !== 0) return sem("o repositório não tem o remoto origin");
  const caminho = remoto.stdout.trim().replace(/\.git$/, "").replace(/^[a-z+]+:\/\/[^/]+\//, "").replace(/^[^@/]+@[^:]+:/, "");
  const api = /\/api\/v\d+$/.test(base) ? base : `${base}/api/v4`;
  const ca = process.env.GITLAB_CA_BUNDLE;
  // o token vai pela entrada do curl, para não aparecer na lista de processos
  const r = exec("curl", ["-sS", "--fail", "--max-time", "20", ...(ca ? ["--cacert", ca] : []), "-K", "-", `${api}/projects/${encodeURIComponent(caminho)}/merge_requests?state=opened&per_page=100`],
    { input: `header = "PRIVATE-TOKEN: ${token}"\n` });
  if (r.status !== 0) return sem(`GitLab: ${(r.stderr || r.error?.message || "falhou").trim()}`);
  try {
    return { disponivel: true, motivo: null, itens: JSON.parse(r.stdout).map((m) => ({ iid: m.iid, titulo: m.title, autor: m.author?.username ?? null, branch: m.source_branch,
      url: m.web_url, criado_em: m.created_at, atualizado_em: m.updated_at ?? null, rascunho: Boolean(m.draft) })) };
  } catch (e) {
    return sem(`GitLab: resposta inválida (${e.message})`);
  }
}

/** Os acordos do time: WIP por status e SLE; nulo quando o arquivo ou a linha falta. */
function acordosDe(raiz) {
  const f = path.join(raiz, ".sabia/planejamento/acordos.md");
  if (!fs.existsSync(f)) return { wip: null, sle: null };
  const linhas = tabela(fs.readFileSync(f, "utf8"), "Item");
  const wip = {};
  for (const parte of (linhas.find((x) => x.Item === "WIP")?.Acordo ?? "").split("·")) {
    const m = parte.trim().match(/^([a-z][a-z-]*)\s*:\s*(\d+)$/i);
    if (m) wip[m[1].toLowerCase()] = +m[2];
  }
  const s = (linhas.find((x) => x.Item === "SLE")?.Acordo ?? "").match(/(\d+)\s*%\s*em até\s*(\d+)\s*dias/i);
  return { wip: Object.keys(wip).length ? wip : null, sle: s ? { percentual: +s[1], dias: +s[2] } : null };
}

/** Os campos do status.md da fatia (a pasta da spec, na branch): Fase, MR, Trilha e Autonomia. A Fase sai no
 *  vocabulário de hoje: o template antigo dizia `aguardando-aprovacao-pr` (hoje `pr-aberto`) e `bloqueada (de: <fase>)`
 *  (hoje a própria fase, com o bloqueio no campo Bloqueio). */
function lerStatusMd(texto) {
  const l = Object.fromEntries(tabela(texto, "Campo").map((x) => [x.Campo, x.Valor]));
  const v = (k) => semValor(l[k]) ? null : l[k];
  let mr = null;
  if (v("MR")) {
    const m = l.MR.match(/!(\d+)\s+(\S+)/);
    mr = m ? { iid: +m[1], url: m[2] } : { iid: null, url: l.MR };
  }
  return { fase: normalizarFase(v("Fase")), trilha: v("Trilha"), autonomia: v("Autonomia"), mr };
}

/** A Fase do status.md no vocabulário de hoje. O template antigo usava `aguardando-aprovacao-pr` (o MR aberto,
 *  hoje `pr-aberto`) e `bloqueada (de: <fase>)` (a fase continua, com o motivo no campo Bloqueio); sem tradução,
 *  a fase vem como está. */
function normalizarFase(f) {
  if (!f) return null;
  const m = f.match(/^bloqueada\s*\(de:\s*([^)]+)\)$/);
  if (m) return m[1].trim();
  return f === "aguardando-aprovacao-pr" ? "pr-aberto" : f;
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

/** As colunas do quadro: os status que os tipos da sprint podem ter, mais os do WIP (o derivado incluso) e os inesperados, na ordem canônica. */
function colunasDoQuadro(tipos, efetivos, wip) {
  const conj = new Set(efetivos);
  for (const t of tipos) for (const s of MAQUINAS[t] ?? []) conj.add(s);
  for (const s of Object.keys(wip ?? {})) conj.add(s);
  const cols = ORDEM.filter((s) => conj.has(s));
  for (const s of [...conj].sort()) if (!cols.includes(s)) cols.push(s);
  return cols;
}

/** O estado do fluxo. `agora` e `exec` são parâmetros para o teste. */
export function statusDoProjeto({ projeto = ".", exec, agora = new Date() }) {
  const raiz = path.resolve(projeto), f = path.join(raiz, ".sabia/planejamento/backlog.md");
  if (!fs.existsSync(f)) throw new Error(`${f} não existe: rode na raiz de um projeto com o Sabiá configurado`);
  const backlog = tabela(fs.readFileSync(f, "utf8"), "id"), porId = Object.fromEntries(backlog.map((l) => [l.id, l]));
  const hoje = agora.toISOString().slice(0, 10), sprint = sprintAberta(raiz, hoje);
  const dias = (d) => Math.floor((Date.parse(hoje) - Date.parse(d)) / 86400000);
  const porStatus = {};
  for (const l of backlog) porStatus[l.status] = (porStatus[l.status] ?? 0) + 1;
  const itens = sprint?.aberta ? sprint.itens.map((x) => ({ ...x, linha: porId[x.Item] })).filter((x) => x.linha && !TERMINAIS.includes(x.linha.status)) : [];

  // o quadro: os MRs abertos (o GitLab, quando disponível), os acordos e o status.md dos itens em andamento
  const mrs = mrsAbertos(raiz, exec), acordos = acordosDe(raiz);
  const mdCache = {};
  const mdDe = (id) => (id in mdCache ? mdCache[id] : (mdCache[id] = statusDaBranch(raiz, exec, id)));
  const mrGitlabDe = (id) => mrs.disponivel ? (mrs.itens.find((x) => (x.branch ?? "").toLowerCase() === id.toLowerCase() && !x.rascunho) ?? null) : null;
  const revisaoDe = (id) => {
    const fase = mdDe(id)?.fase;
    if (fase) return FASES_REVISAO.includes(fase) ? { origem: "status.md" } : null;
    return mrGitlabDe(id) ? { origem: "gitlab" } : null;
  };
  const statusEfetivo = (l) => (l.status === "em-andamento" && revisaoDe(l.id) ? "em-revisao" : statusColuna(l.status));
  // o WIP conta só fatia e bug (os status do `acordos.md` são os deles)
  const wip = {};
  if (acordos.wip) for (const [st, limite] of Object.entries(acordos.wip)) wip[st] = { atual: backlog.filter((l) => (l.tipo === "fatia" || l.tipo === "bug") && statusEfetivo(l) === st).length, limite };

  const tipos = new Set(sprint?.itens.map((x) => porId[x.Item]?.tipo).filter(Boolean));
  const cards = (sprint?.itens ?? []).map((x) => {
    const l = porId[x.Item] ?? null;
    const emAndamento = l?.status === "em-andamento";
    const md = emAndamento ? mdDe(x.Item) : null;
    const mrG = emAndamento ? mrGitlabDe(x.Item) : null;
    const efetivo = l ? statusEfetivo(l) : "sem-dados";
    const avisos = [];
    if (mrG?.atualizado_em) {
      const h = (agora - new Date(mrG.atualizado_em)) / 3600000;
      if (h > 24) avisos.push({ tipo: "mr-parado", mensagem: `MR !${mrG.iid} parado: sem atualização há ${Math.floor(h / 24)} dia${Math.floor(h / 24) === 1 ? "" : "s"}` });
    }
    if (acordos.sle && ["fatia", "bug", "sustentação"].includes(l?.tipo) && l?.status === "em-andamento" && l.iniciada_em && dias(l.iniciada_em) > acordos.sle.dias)
      avisos.push({ tipo: "sle", mensagem: `idade ${dias(l.iniciada_em)} dias, acima do SLE de ${acordos.sle.dias} dias` });
    return {
      id: x.Item,
      titulo: l?.["título"] ?? null,
      tipo: l?.tipo ?? null,
      responsavel: semValor(x["Responsável"]) ? null : x["Responsável"],
      trabalho: x.Trabalho ?? null,
      tarefas: semValor(x.Tarefas) ? null : x.Tarefas,
      status: statusColuna(l?.status) ?? "sem-dados",
      status_efetivo: efetivo,
      iniciada_em: l?.iniciada_em || null,
      idade_dias: l?.iniciada_em ? dias(l.iniciada_em) : null,
      fase: md?.fase ?? null,
      trilha: md?.trilha ?? null,
      autonomia: md?.autonomia ?? null,
      mr: mrG ? { iid: mrG.iid, url: mrG.url } : (md?.mr ?? null),
      revisao: emAndamento ? revisaoDe(x.Item) : null,
      adiada_ate: l?.status?.match(/^adiada até (\d{4}-\d{2}-\d{2})$/)?.[1] ?? null,
      avisos,
    };
  });

  return {
    versao: 2,
    gerado_em: agora.toISOString(),
    sprint: sprint && { chave: sprint.chave, inicio: sprint.inicio, fim: sprint.fim, meta: sprint.meta, aberta: sprint.aberta },
    por_status: porStatus,
    sem_responsavel: itens.filter((x) => semValor(x["Responsável"])).map((x) => ({ id: x.Item, titulo: x.linha["título"], trabalho: x.Trabalho, status: x.linha.status })),
    nao_iniciados: itens.filter((x) => x.Trabalho === "desenvolvimento" && NAO_INICIADO.includes(x.linha.status)).map((x) => ({ id: x.Item, titulo: x.linha["título"], status: x.linha.status })),
    em_andamento: backlog.filter((l) => l.status === "em-andamento").map((l) => ({ id: l.id, titulo: l["título"], responsavel: semValor(l["responsável"]) ? null : l["responsável"],
      iniciada_em: l.iniciada_em || null, idade_dias: l.iniciada_em ? dias(l.iniciada_em) : null })),
    mrs_aguardando: mrs,
    quadro: { colunas: colunasDoQuadro(tipos, cards.map((c) => c.status_efetivo), acordos.wip), itens: cards, wip, sle: acordos.sle },
  };
}
