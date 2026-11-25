// Testes da cerimônia (`sabia retrospective` e `sabia review`): o estado, as linhas do sprint-<nn>.md e o servidor.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { abrirCerimonia, aplicar, cerimoniaDoProjeto, importarSecao, juntarLicoes, lerPropostas, linhasDaSecao, numerosDaSprint, publicar, trocarSecao } from "./cerimonia.mjs";

const raiz = fs.mkdtempSync(path.join(os.tmpdir(), "sabia-cerimonia-"));
after(() => fs.rmSync(raiz, { recursive: true, force: true }));
const SPRINT = ".sabia/planejamento/sprints/2026/sprint-02.md";
const agora = new Date("2026-11-21T12:00:00Z");
// o git da máquina: o usuário é a ana (da equipe), na branch base
const git = (mais = {}) => (cmd, args) => {
  const a = args.slice(2).join(" ");
  if (a === "config user.email") return { status: 0, stdout: "ana@exemplo\n" };
  if (a === "config user.name") return { status: 0, stdout: "Ana\n" };
  if (a.startsWith("rev-parse")) return { status: 0, stdout: "main\n" };
  if (a.startsWith("status")) return { status: 0, stdout: mais.limpo ? "" : " M sprint-02.md\n" };
  if (a.startsWith("push")) return mais.push ?? { status: 0, stdout: "" };
  if (a.startsWith("commit") && mais.commit) return mais.commit;
  (mais.chamadas ?? []).push(a);
  return { status: 0, stdout: "" };
};
function projeto(nome) {
  const p = path.join(raiz, nome), arquivos = {
    ".sabia/planejamento/backlog.md": "# Backlog\n| id | título | tipo | status | prioridade | tamanho | responsável | pai | relator | ib | obs | entrou_em | concluida_em |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n"
      + "| FT-001 | Extrato | fatia | concluida |  | M | ana |  |  |  |  | 2026-11-09 | 2026-11-12 |\n| FT-002 | Filtro | fatia | em-andamento |  | M | bia |  |  |  |  | 2026-11-09 |  |\n| AT-001 | Contas | sustentação | concluida |  |  | bia |  |  |  |  | 2026-11-09 | 2026-11-24 |\n",
    ".sabia/planejamento/equipe.json": JSON.stringify({ membros: [{ nome: "Ana Souza", usuario: "ana", produto: true }, { nome: "Bia Lima", usuario: "bia" }] }),
    [SPRINT]: "# 2026/Sprint 02 · 2026-11-09 → 2026-11-20\n**Meta:** Entregar o extrato\n## Itens\n| Item | Trabalho | Responsável | Tarefas | iniciada_em | concluida_em |\n|---|---|---|---|---|---|\n"
      + "| FT-001 | especificação | bia | | 2026-11-09 | 2026-11-10 |\n| FT-001 | desenvolvimento | ana | | 2026-11-10 | 2026-11-12 |\n| FT-002 | desenvolvimento | bia | | 2026-11-12 | |\n| AT-001 | atendimento | bia | | 2026-11-10 | 2026-11-24 |\n## Review\n## Retro\n",
  };
  for (const [f, c] of Object.entries(arquivos)) { fs.mkdirSync(path.dirname(path.join(p, f)), { recursive: true }); fs.writeFileSync(path.join(p, f), c); }
  return p;
}
const ler = (p) => fs.readFileSync(path.join(p, SPRINT), "utf8");

test("cerimônia: os números da sprint, os grupos da retro e os itens entregues da review", () => {
  const p = projeto("dados"), retro = cerimoniaDoProjeto({ projeto: p, modo: "retrospective", exec: git(), agora });
  assert.deepEqual(retro.grupos.map((g) => `${g.id} ${g.tag}`), ["positivo Positivo", "negativo Negativo", "melhoria Melhoria", "licao Lição", "acao Ação"]);
  assert.deepEqual(retro.numeros, [
    { trabalho: "especificação", linhas: 1, no_prazo: 1, depois: 0, abertas: 0, lead_medio: 1 },
    { trabalho: "desenvolvimento", linhas: 2, no_prazo: 1, depois: 0, abertas: 1, lead_medio: 2 },
    { trabalho: "atendimento", linhas: 1, no_prazo: 0, depois: 1, abertas: 0, lead_medio: 14 },
  ]);
  assert.deepEqual(numerosDaSprint({ fim: "2026-11-20", itens: [] }), []);
  // o resumo do painel: 3 de 4 linhas concluídas, 2 até o fim; sem acordos, sem SLE nem reserva
  const r = retro.resumo;
  assert.deepEqual([r.linhas, r.itens, r.concluidas, r.no_prazo, r.depois, r.abertas, r.pct_conclusao, r.pct_no_prazo], [4, 3, 3, 2, 1, 1, 75, 50]);
  assert.deepEqual(r.vazao, { desenvolvimento: 1, atendimento: 1, "especificação": 1 });
  assert.deepEqual([r.ultima_conclusao, r.dias_alem, r.sle, r.atendimento], ["2026-11-24", 4, null, { linhas: 1, pct: 25, reserva_pct: null }]);
  fs.writeFileSync(path.join(p, ".sabia/planejamento/acordos.json"), JSON.stringify({ sle: { percentual: 85, dias: 7 }, reserva_capacidade_pct: 20 }));
  const r2 = cerimoniaDoProjeto({ projeto: p, modo: "retrospective", exec: git(), agora }).resumo;
  assert.deepEqual(r2.sle, { dias: 7, alvo: 85, medidos: 2, dentro: 1, pct: 50 });
  assert.equal(r2.atendimento.reserva_pct, 20);
  // a review: um grupo por item cujo trabalho principal foi concluído na sprint, e o dos pedidos novos
  const review = cerimoniaDoProjeto({ projeto: p, modo: "review", exec: git(), agora });
  assert.deepEqual(review.grupos.map((g) => g.id), ["AT-001", "FT-001", "pedido"]);
  assert.equal(review.grupos[1].nome, "FT-001 · Extrato");
  assert.equal(review.grupos[1].sub, "fatia · Ana Souza · concluída em 12/11");
  assert.throws(() => cerimoniaDoProjeto({ projeto: p, modo: "daily", exec: git(), agora }), /cerimônia desconhecida/);
});

test("cerimônia: incluir, votar e remover; as linhas da Retro e da Review pela ordem dos votos; importar o que já está no .md", () => {
  const p = projeto("linhas"), dados = cerimoniaDoProjeto({ projeto: p, modo: "retrospective", exec: git(), agora }), estado = { itens: [] };
  assert.throws(() => aplicar(estado, { tipo: "incluir", grupo: "positivo", texto: "x" }, dados), /diga o seu nome/);
  assert.throws(() => aplicar(estado, { tipo: "incluir", nome: "Ana", grupo: "nada", texto: "x" }, dados), /grupo desconhecido/);
  assert.throws(() => aplicar(estado, { tipo: "incluir", nome: "Ana", grupo: "positivo", texto: "  " }, dados), /escreva o ponto/);
  assert.throws(() => aplicar(estado, { tipo: "incluir", nome: "Ana", grupo: "acao", texto: "x", dono: "zé" }, dados), /não está no equipe\.json/);
  aplicar(estado, { tipo: "incluir", nome: "Ana", grupo: "positivo", texto: "Entrega | no prazo\n · sem susto" }, dados, 1);
  aplicar(estado, { tipo: "incluir", nome: "Bia", grupo: "positivo", texto: "Pareamento" }, dados, 2);
  aplicar(estado, { tipo: "incluir", nome: "Bia", grupo: "negativo", texto: "MR parado" }, dados, 3);
  aplicar(estado, { tipo: "incluir", nome: "Ana", grupo: "acao", texto: "Revisar em 1 dia", dono: "bia" }, dados, 4);
  const [a, b, , d] = estado.itens;
  assert.equal(a.texto, "Entrega no prazo - sem susto");  // sem barra, quebra nem o separador das partes
  aplicar(estado, { tipo: "votar", nome: "Ana", id: b.id }, dados);
  aplicar(estado, { tipo: "votar", nome: "Bía", id: b.id }, dados);
  aplicar(estado, { tipo: "votar", nome: "ana", id: b.id }, dados);  // a mesma pessoa de novo: tira o voto
  aplicar(estado, { tipo: "votar", nome: "Ana", id: d.id }, dados);
  assert.deepEqual(b.votos.map((v) => v.chave), ["bia"]);
  const linhas = linhasDaSecao(dados, estado);
  assert.deepEqual(linhas, ["- Positivo: Pareamento · por Bia · 1 voto (Bía)", "- Positivo: Entrega no prazo - sem susto · por Ana", "- Negativo: MR parado · por Bia", "- Ação: Revisar em 1 dia · por Ana · dono bia · 1 voto (Ana)"]);
  // a seção troca de corpo e a linha Números (do passo fechar) fica
  const md = trocarSecao(ler(p).replace("## Retro\n", "## Retro\n- Positivo: velho\n- Números: concluídas 1\n"), "Retro", linhas, /^- Números:/);
  assert.ok(md.endsWith("## Review\n## Retro\n" + linhas.join("\n") + "\n- Números: concluídas 1\n"));
  assert.equal(trocarSecao("# S\n\n## Itens\n\nx\n", "Retro", ["- Positivo: a"]), "# S\n\n## Itens\n\nx\n\n## Retro\n\n- Positivo: a\n");  // a seção que falta, no .md arejado
  // de volta: a linha do .md traz o ponto com quem levantou e quem votou
  const lidos = importarSecao(dados, md);
  assert.deepEqual(lidos.map((i) => [i.grupo, i.texto, i.autor, i.dono ?? null, i.votos.map((v) => v.chave).join()]), [["positivo", "Pareamento", "Bia", null, "bia"], ["positivo", "Entrega no prazo - sem susto", "Ana", null, ""], ["negativo", "MR parado", "Bia", null, ""], ["acao", "Revisar em 1 dia", "Ana", "bia", "ana"]]);
  assert.deepEqual(linhasDaSecao(dados, { itens: lidos }), linhas);
  // o formato anterior (bom · melhorar · ações) ainda é lido
  assert.deepEqual(importarSecao(dados, "## Retro\n- Bom: a\n- Melhorar: b · 2 votos\n").map((i) => [i.grupo, i.texto, i.base ?? 0]), [["positivo", "a", 0], ["melhoria", "b", 2]]);
  aplicar(estado, { tipo: "remover", nome: "Bia", id: a.id }, dados);
  assert.equal(estado.itens.length, 3);
  assert.throws(() => aplicar(estado, { tipo: "votar", nome: "Bia", id: a.id }, dados), /não existe mais/);

  // a review: uma linha por item entregue, os retornos juntos, e os pedidos novos
  const rv = cerimoniaDoProjeto({ projeto: p, modo: "review", exec: git(), agora }), er = { itens: [] };
  aplicar(er, { tipo: "incluir", nome: "Cliente", grupo: "FT-001", texto: "Aprovado; faltou o filtro" }, rv, 1);
  aplicar(er, { tipo: "incluir", nome: "Cliente", grupo: "FT-001", texto: "Tela clara" }, rv, 2);
  aplicar(er, { tipo: "incluir", nome: "Cliente", grupo: "pedido", texto: "Filtro por data" }, rv, 3);
  assert.throws(() => aplicar(er, { tipo: "votar", nome: "Ana", id: er.itens[1].id }, rv), /a review não tem votação/);
  const lr = linhasDaSecao(rv, er);
  assert.deepEqual(lr, ["- AT-001 · sem retorno", "- FT-001 · Aprovado, faltou o filtro — por Cliente; Tela clara — por Cliente", "- pedido novo · Filtro por data — por Cliente"]);
  assert.deepEqual(importarSecao(rv, trocarSecao(ler(p), "Review", lr)).map((i) => [i.grupo, i.texto, i.autor]), [["FT-001", "Aprovado, faltou o filtro", "Cliente"], ["FT-001", "Tela clara", "Cliente"], ["pedido", "Filtro por data", "Cliente"]]);
});

test("cerimônia: as lições do ciclo entram na retro para a escolha; só as marcadas vão para o sprint-<nn>.md", () => {
  const p = projeto("licoes");
  const arquivos = {
    ".kiro/specs/ft-001-extrato/status.md": "# FT-001\n## Lições aprendidas\n| Lição | Origem | Regra proposta |\n|---|---|---|\n| L-1 · teste criou a coluna errada | tarefa 2 | Conferir as colunas no banco antes do DDL de teste |\n| L-2 · JaCoCo não rodou | revisão 1 | — (descartada: ambiente) |\n## Retomar\n",
    ".kiro/specs/ft-002-filtro/status.md": "## Lições aprendidas\n| Lição | Origem | Regra proposta |\n|---|---|---|\n| item em andamento não entra | t | fora |\n",
    ".sabia/planejamento/sustentacao/AT-001-contas.md": "# AT-001\n## Lições aprendidas\n| Lição | Regra proposta |\n|---|---|\n| extração grande trava a sprint | Quebrar a extração grande em lotes |\n",
    ".sabia/sabia.md": "# Sabiá\n## Regras aprendidas\n- Quebrar a extração grande em lotes · origem AT-001 · 2026-11-20\n",
  };
  for (const [f, c] of Object.entries(arquivos)) { fs.mkdirSync(path.dirname(path.join(p, f)), { recursive: true }); fs.writeFileSync(path.join(p, f), c); }
  const dados = cerimoniaDoProjeto({ projeto: p, modo: "retrospective", exec: git(), agora });
  // só dos itens concluídos; o texto é a regra proposta ou, sem ela, a lição; a que já é regra vem marcada
  assert.deepEqual(dados.licoes, [
    { origem: "FT-001", texto: "Conferir as colunas no banco antes do DDL de teste", detalhe: "L-1 - teste criou a coluna errada", ja_esta: false },
    { origem: "FT-001", texto: "L-2 - JaCoCo não rodou", detalhe: null, ja_esta: false },
    { origem: "AT-001", texto: "Quebrar a extração grande em lotes", detalhe: "extração grande trava a sprint", ja_esta: true },
  ]);
  const estado = juntarLicoes({ itens: [] }, dados.licoes), [a, b, c] = estado.itens;
  assert.deepEqual(linhasDaSecao(dados, estado), []);  // sem marca, nada é gravado
  aplicar(estado, { tipo: "votar", nome: "Ana", id: a.id }, dados);
  aplicar(estado, { tipo: "incluir", nome: "Bia", grupo: "licao", texto: "Combinar a massa antes" }, dados, 9);
  aplicar(estado, { tipo: "incluir", nome: "Bia", grupo: "acao", texto: "Rever a massa" }, dados, 10);
  assert.throws(() => aplicar(estado, { tipo: "votar", nome: "Ana", id: c.id }, dados), /já é Regra aprendida/);
  assert.throws(() => aplicar(estado, { tipo: "remover", nome: "Ana", id: b.id }, dados), /não se remove/);
  // as lições vêm antes das ações
  const linhas = linhasDaSecao(dados, estado);
  assert.deepEqual(linhas, ["- Lição: Conferir as colunas no banco antes do DDL de teste · origem FT-001 · 1 voto (Ana)", "- Lição: Combinar a massa antes · por Bia", "- Ação: Rever a massa · por Bia"]);
  // de volta do .md: a marcada casa com a do ciclo (sem duplicar) e as outras duas voltam para a escolha
  const lido = juntarLicoes({ itens: importarSecao(dados, trocarSecao(ler(p), "Retro", linhas)) }, dados.licoes);
  assert.deepEqual(lido.itens.filter((i) => i.grupo === "licao").map((i) => `${i.texto} | ${i.origem ?? "-"} | ${i.votos.length} | ${!!i.do_ciclo}`), [
    "Conferir as colunas no banco antes do DDL de teste | FT-001 | 1 | true", "Combinar a massa antes | - | 0 | false", "L-2 - JaCoCo não rodou | FT-001 | 0 | true", "Quebrar a extração grande em lotes | AT-001 | 0 | true"]);
  assert.deepEqual(linhasDaSecao(dados, lido), linhas);
});

test("cerimônia: o servidor leva a página no tema do quadro, avisa quem está nela a cada mudança e só grava o sprint-<nn>.md no Publicar", async () => {
  const p = projeto("servidor"), logs = [], propostas = path.join(p, "propostas.json");
  fs.writeFileSync(propostas, JSON.stringify({ retrospective: [{ tipo: "positivo", texto: "Vazão de 5", autor: "Ana Souza" }, { tipo: "nada", texto: "fora" }, { tipo: "acao", texto: "Fechar no timebox", dono: "ana", autor: "Bia" }] }));
  const q = await abrirCerimonia({ projeto: p, modo: "retrospective", exec: git(), log: (x) => logs.push(String(x)), porta: 0, host: "127.0.0.1", propostas, agora });
  try {
    assert.match(logs.at(-1), /^Retrospectiva da 2026\/Sprint 02 do projeto servidor \(Ctrl\+C encerra\):\n\n {2}http:\/\/127\.0\.0\.1:\d+\/\n$/);
    const html = await (await fetch(q.url)).text();
    assert.match(html, /<title>Retrospectiva · 2026\/Sprint 02 · servidor<\/title>/);
    assert.match(html, /data-sobria="sobria-sabia"/);  // o tema do quadro
    assert.match(html, /id="publicar"/);  // quem abriu é da equipe e está na máquina
    assert.match(html, /<code>## Retro<\/code> do <code>sprint-02\.md<\/code>/);
    const embutido = JSON.parse(html.match(/<script id="dados" type="application\/json">([\s\S]*?)<\/script>/)[1]);
    assert.deepEqual(embutido.estado.itens.map((i) => `${i.grupo} ${i.texto} ${i.autor} ${i.dono ?? ""}`.trim()), ["positivo Vazão de 5 Ana Souza", "acao Fechar no timebox Bia ana"]);
    assert.equal(ler(p).endsWith("## Retro\n"), true);  // abrir a página não grava nada
    // gravar exige o token da página
    const post = (corpo, cab = { "x-sabia-token": q.token }) => fetch(q.url + "acao", { method: "POST", headers: cab, body: JSON.stringify(corpo) });
    assert.equal((await post({}, {})).status, 403);
    assert.equal((await post({}, { "x-sabia-token": q.token, origin: "http://outro.exemplo" })).status, 403);
    assert.match((await (await post({ tipo: "incluir", grupo: "positivo", texto: "x" })).json()).erro, /diga o seu nome/);
    // o /vivo entrega o estado ao abrir e a cada mudança
    const vivo = await fetch(q.url + "vivo"), leitor = vivo.body.getReader(), dec = new TextDecoder();
    const proximo = async () => JSON.parse(dec.decode((await leitor.read()).value).replace(/^data: /, ""));
    assert.equal((await proximo()).itens.length, 2);
    const r = await (await post({ tipo: "incluir", nome: "Bia", grupo: "melhoria", texto: "Review sem retorno" })).json();
    assert.equal(r.estado.itens.length, 3);
    assert.equal((await proximo()).itens.at(-1).texto, "Review sem retorno");
    await post({ tipo: "votar", nome: "Bia", id: r.estado.itens[2].id });
    assert.equal(ler(p).endsWith("## Retro\n"), true);  // incluir e votar não mexem no sprint-<nn>.md: só o Publicar
    assert.equal((await (await fetch(q.url + "dados.json")).json()).estado.nao_publicado, true);
    assert.equal(fs.existsSync(path.join(p, ".sabia/local")), false);  // e nada fora dele
    assert.match((await (await post({ tipo: "incluir", nome: "Ana", grupo: "melhoria", texto: "Review sem retorno" })).json()).erro, /já está na lista/);
    assert.match(html, /<input type="text" id="mensagem" maxlength="300" value="2026\/Sprint 02: retrospectiva"/);  // o popup já traz a mensagem
    const pub = await (await post({ tipo: "publicar", mensagem: "Task 42 - retro da Sprint 02" })).json();
    assert.deepEqual([pub.ok, pub.commit, pub.estado.nao_publicado], [true, "Task 42 - retro da Sprint 02", false]);
    // o Publicar grava a seção, com quem levantou e quem votou
    assert.ok(ler(p).endsWith("## Retro\n- Positivo: Vazão de 5 · por Ana Souza\n- Melhoria: Review sem retorno · por Bia · 1 voto (Bia)\n- Ação: Fechar no timebox · por Bia · dono ana\n"));
    assert.equal((await fetch(q.url + "outro")).status, 404);
    await leitor.cancel();
  } finally { q.fechar(); await q.fechou; }
  // de novo: os pontos voltam do sprint-<nn>.md, com o autor e os votos
  const q2 = await abrirCerimonia({ projeto: p, modo: "retrospective", exec: git(), log: () => {}, porta: 0, host: "127.0.0.1", agora });
  try { assert.deepEqual((await (await fetch(q2.url + "dados.json")).json()).estado.itens.map((i) => `${i.autor} ${i.votos.map((v) => v.nome).join()}`), ["Ana Souza ", "Bia Bia", "Bia "]); } finally { q2.fechar(); await q2.fechou; }
});

test("cerimônia: publicar faz o commit só do sprint-<nn>.md, com a mensagem do fluxo, e diz quando o push falha", () => {
  const p = projeto("publicar"), dados = cerimoniaDoProjeto({ projeto: p, modo: "review", exec: git(), agora }), ana = { usuario: "ana", nome: "Ana Souza", produto: true };
  // a proposta sem autor não entra: o Sabiá não assina ponto
  fs.writeFileSync(path.join(p, "sem-autor.json"), JSON.stringify({ review: [{ item: "pedido", texto: "Filtro" }] }));
  assert.throws(() => lerPropostas(path.join(p, "sem-autor.json"), dados), /a proposta 1 de sem-autor\.json não tem "autor"/);
  const chamadas = [];
  const estado = { itens: [] }, antes = ler(p);
  assert.throws(() => publicar(p, dados, estado, { exec: git({ commit: { status: 1, stderr: "hook recusou" } }), usuario: ana }), /git commit: hook recusou/);
  assert.equal(ler(p), antes);  // o commit falhou: o arquivo volta ao que era
  assert.deepEqual(publicar(p, dados, estado, { exec: git({ chamadas }), usuario: ana }), { commit: "2026/Sprint 02: review" });
  assert.ok(ler(p).endsWith("## Review\n- AT-001 · sem retorno\n- FT-001 · sem retorno\n## Retro\n"));
  assert.deepEqual(chamadas, ["pull --ff-only", `add -- ${SPRINT}`, `commit --quiet -m 2026/Sprint 02: review -- ${SPRINT}`]);
  assert.throws(() => publicar(p, dados, estado, { exec: git({ limpo: true }), usuario: ana }), /nada a publicar/);
  assert.throws(() => publicar(p, dados, estado, { exec: git({ push: { status: 1, stderr: "rejected" } }), usuario: ana, mensagem: "Task 7 - review\n" }), /o commit "Task 7 - review" ficou só nesta máquina; o push falhou: rejected/);
  assert.throws(() => publicar(p, dados, estado, { exec: git(), usuario: null }), /não está no equipe\.json/);
});

test("portas e rede: 4781 é a review e 4782 a retrospective; o quadro com --rede escuta na rede e dá o link local", async () => {
  const fonte = fs.readFileSync(new URL("./cerimonia.mjs", import.meta.url), "utf8");
  assert.match(fonte, /review: \{[^}]*porta: 4781 \}/);
  assert.match(fonte, /retrospective: \{[^}]*porta: 4782 \}/);
  const { abrirQuadro } = await import("./kanban.mjs");
  const p = projeto("quadro-rede"), logs = [];
  const q = await abrirQuadro({ projeto: p, exec: git(), log: (x) => logs.push(String(x)), rede: true, agora });
  try {
    assert.equal(q.host, "0.0.0.0");
    assert.match(q.url, /^http:\/\/127\.0\.0\.1:\d+\/$/);  // o link de quem abriu
    assert.ok(Array.isArray(q.urls) && q.urls.every((u) => /^http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/$/.test(u)));  // os da rede
    assert.match(logs.at(-1), /^Quadro Kanban do projeto quadro-rede \(Ctrl\+C encerra\):\n\n {2}http:\/\/127\.0\.0\.1:\d+\/\n/);
    // quem abriu, na máquina dela, não cai na regra da rede (só o pedido de fora fica "só mostra")
    assert.notEqual((await (await fetch(q.url + "dados.json")).json()).quadro.gravacao.motivo, "pela rede, o quadro só mostra");
  } finally { q.fechar(); await q.fechou; }
});
