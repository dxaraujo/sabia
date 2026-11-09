// `sabia status`: o estado do fluxo em JSON estável, para bots e scripts. Só lê: o backlog e a sprint aberta do repositório
// e, com as variáveis do GitLab, os MRs abertos. O campo `versao` muda se o formato mudar.
import fs from "node:fs";
import path from "node:path";

const TERMINAIS = ["concluida", "concluido", "cancelada", "cancelado"];
const NAO_INICIADO = ["aceita", "elegivel"];
const celulas = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
const semValor = (x) => !x || x === "—";

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
      url: m.web_url, criado_em: m.created_at, rascunho: Boolean(m.draft) })) };
  } catch (e) {
    return sem(`GitLab: resposta inválida (${e.message})`);
  }
}

/** O estado do fluxo. `agora` e `exec` são parâmetros para o teste. */
export function statusDoProjeto({ projeto = ".", exec, agora = new Date() }) {
  const raiz = path.resolve(projeto), f = path.join(raiz, ".sabia/planejamento/backlog.md");
  if (!fs.existsSync(f)) throw new Error(`${f} não existe: rode na raiz de um projeto com o Sabiá configurado`);
  const backlog = tabela(fs.readFileSync(f, "utf8"), "id"), porId = Object.fromEntries(backlog.map((l) => [l.id, l]));
  const hoje = agora.toISOString().slice(0, 10), sprint = sprintAberta(raiz, hoje);
  const porStatus = {};
  for (const l of backlog) porStatus[l.status] = (porStatus[l.status] ?? 0) + 1;
  const itens = sprint?.aberta ? sprint.itens.map((x) => ({ ...x, linha: porId[x.Item] })).filter((x) => x.linha && !TERMINAIS.includes(x.linha.status)) : [];
  const dias = (d) => Math.floor((Date.parse(hoje) - Date.parse(d)) / 86400000);
  return {
    versao: 1,
    gerado_em: agora.toISOString(),
    sprint: sprint && { chave: sprint.chave, inicio: sprint.inicio, fim: sprint.fim, meta: sprint.meta, aberta: sprint.aberta },
    por_status: porStatus,
    sem_responsavel: itens.filter((x) => semValor(x["Responsável"])).map((x) => ({ id: x.Item, titulo: x.linha["título"], trabalho: x.Trabalho, status: x.linha.status })),
    nao_iniciados: itens.filter((x) => x.Trabalho === "desenvolvimento" && NAO_INICIADO.includes(x.linha.status)).map((x) => ({ id: x.Item, titulo: x.linha["título"], status: x.linha.status })),
    em_andamento: backlog.filter((l) => l.status === "em-andamento").map((l) => ({ id: l.id, titulo: l["título"], responsavel: semValor(l["responsável"]) ? null : l["responsável"],
      iniciada_em: l.iniciada_em || null, idade_dias: l.iniciada_em ? dias(l.iniciada_em) : null })),
    mrs_aguardando: mrsAbertos(raiz, exec),
  };
}
