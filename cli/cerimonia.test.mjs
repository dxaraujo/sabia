// Testes da cerimônia (`sabia retrospective` e `sabia review`): o estado, as etapas da retrospectiva e a visão de cada
// pessoa, as linhas do sprint-<nn>.md e o servidor.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { abrirCerimonia, aplicar, cerimoniaDoProjeto, importarSecao, juntarLicoes, linhasDaSecao, numerosDaSprint, paginaCerimonia, publicar, trocarSecao, visaoDe } from "./cerimonia.mjs";

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
  // a review: um grupo por entrega (o trabalho principal concluído na sprint) e o das novas ideias e necessidades
  const review = cerimoniaDoProjeto({ projeto: p, modo: "review", exec: git(), agora });
  assert.deepEqual(review.grupos.map((g) => g.id), ["AT-001", "FT-001", "ideia"]);
  assert.deepEqual([review.grupos[1].nome, review.grupos[1].tag, review.grupos[1].sub], ["FT-001 · Extrato", "Feedback", "fatia · Ana Souza · concluída em 12/11"]);
  assert.deepEqual(review.etapas.map((e) => e.id), ["feedback", "ideias"]);
  // o épico é entrega quando teve fatia entregue na sprint (ou foi concluído, ou a especificação dele fechou nela): vem antes das fatias dele
  const pe = projeto("epico"), bl = path.join(pe, ".sabia/planejamento/backlog.md");
  fs.writeFileSync(bl, fs.readFileSync(bl, "utf8").replace("| FT-001 | Extrato | fatia | concluida |  | M | ana |  |", "| FT-001 | Extrato | fatia | concluida |  | M | ana | EP-01 |")
    + "| EP-01 | Extratos | épico | fatiado |  |  |  |  |  |  |  | 2026-11-01 |  |\n| FT-003 | Exportar | fatia | aceita |  | P |  | EP-01 |  |  |  | 2026-11-09 |  |\n| FT-004 | Fora | fatia | cancelada |  | P |  | EP-01 |  |  |  | 2026-11-09 |  |\n| EP-02 | Sem entrega | épico | fatiado |  |  |  |  |  |  |  | 2026-11-01 |  |\n");
  const ge = cerimoniaDoProjeto({ projeto: pe, modo: "review", exec: git(), agora }).grupos;
  assert.deepEqual(ge.map((g) => `${g.id}${g.filho ? " (filho)" : ""} | ${g.sub}`), ["AT-001 | sustentação · Bia Lima · concluída em 24/11", "EP-01 | épico · em andamento · 1 de 2 fatias", "FT-001 (filho) | fatia · Ana Souza · concluída em 12/11 · do EP-01", "ideia | cada uma entra no backlog como item novo, para a triagem"]);
  assert.throws(() => cerimoniaDoProjeto({ projeto: p, modo: "daily", exec: git(), agora }), /cerimônia desconhecida/);
});

test("retrospectiva: as etapas — pontos ocultos, agrupamento, votação oculta e ações por item; as linhas da Retro e a volta do .md; a review em duas etapas, em que só quem apresenta registra", () => {
  const p = projeto("linhas"), dados = cerimoniaDoProjeto({ projeto: p, modo: "retrospective", exec: git(), agora }), estado = { etapa: "pontos", itens: [] };
  const AP = { apresentador: true }, faz = (acao, quando, papel) => aplicar(estado, acao, dados, quando, papel), textos = (v) => v.itens.map((i) => i.texto);
  assert.deepEqual(dados.etapas.map((e) => e.id), ["pontos", "agrupar", "votar", "acoes", "licoes"]);
  assert.throws(() => faz({ tipo: "incluir", grupo: "positivo", texto: "x" }), /diga o seu nome/);
  assert.throws(() => faz({ tipo: "incluir", nome: "Ana", grupo: "nada", texto: "x" }), /grupo desconhecido/);
  assert.throws(() => faz({ tipo: "incluir", nome: "Ana", grupo: "positivo", texto: "  " }), /escreva o ponto/);
  assert.throws(() => faz({ tipo: "incluir", nome: "Ana", grupo: "acao", texto: "x" }), /as ações entram depois da votação/);
  assert.throws(() => faz({ tipo: "incluir", nome: "Ana", grupo: "licao", texto: "x" }, 0, AP), /vêm dos itens concluídos do ciclo/);

  // etapa 1, os pontos: cada um inclui, altera e remove os seus, e só vê os seus; quem apresenta vê todos
  faz({ tipo: "incluir", nome: "Ana", grupo: "positivo", texto: "Entrega | no prazo\n · sem susto" }, 1);
  faz({ tipo: "incluir", nome: "Bia", grupo: "positivo", texto: "Pareamento" }, 2);
  faz({ tipo: "incluir", nome: "Bia", grupo: "negativo", texto: "MR parado" }, 3);
  faz({ tipo: "incluir", nome: "Ana", grupo: "negativo", texto: "MR parado" }, 4);  // o mesmo ponto, de outra pessoa: ela não vê o da Bia
  faz({ tipo: "incluir", nome: "Ana", grupo: "negativo", texto: "Revisão demorou" }, 5);
  assert.throws(() => faz({ tipo: "incluir", nome: "ana", grupo: "negativo", texto: "MR parado" }), /já está na lista/);
  const [a, b, c, d, e] = estado.itens;
  assert.equal(a.texto, "Entrega no prazo - sem susto");  // sem barra, quebra nem o separador das partes
  assert.deepEqual(textos(visaoDe(estado, { chave: "bia" })), ["Pareamento", "MR parado"]);
  assert.deepEqual(textos(visaoDe(estado, {})), []);  // sem nome, nada
  assert.equal(visaoDe(estado, { chave: "bia", apresentador: true }).itens.length, 5);
  assert.throws(() => faz({ tipo: "editar", nome: "Bia", id: a.id, texto: "y" }), /só quem criou/);
  assert.throws(() => faz({ tipo: "remover", nome: "Bia", id: a.id }, 0, AP), /só quem criou/);  // nem quem apresenta mexe no ponto alheio
  faz({ tipo: "editar", nome: "Ana", id: e.id, texto: "Revisão demorou 3 dias" });
  assert.equal(e.texto, "Revisão demorou 3 dias");
  assert.throws(() => faz({ tipo: "votar", nome: "Ana", id: b.id }), /ainda não foi liberada/);
  assert.throws(() => faz({ tipo: "avancar", nome: "Bia", de: "pontos" }), /de quem apresenta/);
  assert.throws(() => faz({ tipo: "avancar", nome: "Ana", de: "votar" }, 0, AP), /a etapa já mudou/);
  faz({ tipo: "avancar", nome: "Ana", de: "pontos" }, 0, AP);

  // etapa 2, o agrupamento: todos veem tudo, só texto; quem apresenta ainda inclui e junta os pontos da mesma categoria
  assert.equal(estado.etapa, "agrupar");
  assert.equal(visaoDe(estado, { chave: "bia" }).itens.length, 5);
  assert.throws(() => faz({ tipo: "editar", nome: "Ana", id: e.id, texto: "z" }), /terminou: nada mais se altera/);
  assert.throws(() => faz({ tipo: "remover", nome: "Ana", id: e.id }, 0, AP), /terminou: nada mais se altera/);
  assert.throws(() => faz({ tipo: "incluir", nome: "Bia", grupo: "positivo", texto: "Tarde" }), /só quem apresenta inclui/);
  faz({ tipo: "incluir", nome: "Ana", grupo: "melhoria", texto: "Fila de revisão" }, 6, AP);
  assert.throws(() => faz({ tipo: "agrupar", nome: "Bia", ids: [c.id, d.id], titulo: "MR" }), /de quem apresenta/);
  assert.throws(() => faz({ tipo: "agrupar", nome: "Ana", ids: [c.id], titulo: "MR" }, 0, AP), /pelo menos dois/);
  assert.throws(() => faz({ tipo: "agrupar", nome: "Ana", ids: [a.id, c.id], titulo: "MR" }, 0, AP), /mesma categoria/);
  assert.throws(() => faz({ tipo: "agrupar", nome: "Ana", ids: [c.id, d.id], titulo: " " }, 0, AP), /escolha o título/);
  assert.throws(() => faz({ tipo: "agrupar", nome: "Ana", ids: [c.id, d.id], titulo: "Revisão demorou 3 dias" }, 0, AP), /já existe um item com esse título/);
  faz({ tipo: "agrupar", nome: "Ana", ids: [c.id, d.id], titulo: "MR parado" }, 0, AP);  // o título de um dos pontos serve
  const g = estado.itens.find((i) => i.agrupa);
  assert.deepEqual([g.grupo, g.texto, g.em, c.em_grupo, d.em_grupo], ["negativo", "MR parado", 3, g.id, g.id]);
  assert.throws(() => faz({ tipo: "agrupar", nome: "Ana", ids: [d.id, e.id], titulo: "x" }, 0, AP), /ponto que está solto/);
  faz({ tipo: "editar-grupo", nome: "Ana", id: g.id, ids: [c.id, d.id, e.id], titulo: "Revisão de MR lenta" }, 0, AP);
  assert.deepEqual([g.texto, e.em_grupo], ["Revisão de MR lenta", g.id]);
  faz({ tipo: "editar-grupo", nome: "Ana", id: g.id, ids: [c.id, d.id], titulo: "Revisão de MR lenta" }, 0, AP);
  assert.equal(e.em_grupo, undefined);  // o ponto que saiu do grupo volta a ser item
  faz({ tipo: "desagrupar", nome: "Ana", id: g.id }, 0, AP);
  assert.deepEqual([estado.itens.includes(g), c.em_grupo], [false, undefined]);
  faz({ tipo: "agrupar", nome: "Ana", ids: [c.id, d.id], titulo: "Revisão de MR lenta" }, 0, AP);
  const gr = estado.itens.find((i) => i.agrupa);
  faz({ tipo: "avancar", nome: "Ana", de: "agrupar" }, 0, AP);

  // etapa 3, a votação: no ponto solto ou no grupo (que conta como um item); cada um vê só o próprio voto
  assert.throws(() => faz({ tipo: "desagrupar", nome: "Ana", id: gr.id }, 0, AP), /etapa Agrupamento/);
  assert.throws(() => faz({ tipo: "votar", nome: "Ana", id: c.id }), /vota-se no ponto ou no grupo/);
  faz({ tipo: "votar", nome: "Ana", id: gr.id });
  faz({ tipo: "votar", nome: "Bía", id: gr.id });
  faz({ tipo: "votar", nome: "Bia", id: b.id });
  faz({ tipo: "votar", nome: "Ana", id: b.id });
  faz({ tipo: "votar", nome: "ana", id: b.id });  // a mesma pessoa de novo: tira o voto
  const votosNaVisao = (quem) => visaoDe(estado, quem).itens.filter((i) => i.votos.length).map((i) => `${i.texto}: ${i.votos.map((v) => v.chave).join()}`);
  assert.deepEqual(votosNaVisao({ chave: "ana" }), ["Revisão de MR lenta: ana"]);
  assert.deepEqual(votosNaVisao({ chave: "bia" }), ["Pareamento: bia", "Revisão de MR lenta: bia"]);
  assert.deepEqual(votosNaVisao({}), []);
  assert.deepEqual(votosNaVisao({ chave: "ana", apresentador: true }), ["Pareamento: bia", "Revisão de MR lenta: ana,bia"]);
  assert.equal(gr.votos.length, 2);  // a visão não mexe no estado
  faz({ tipo: "avancar", nome: "Ana", de: "votar" }, 0, AP);

  // etapa 4, as ações: o resultado à vista; a ação é de um item (ou grupo) ou geral, e o autor a altera
  assert.deepEqual(votosNaVisao({ chave: "ana" }), ["Pareamento: bia", "Revisão de MR lenta: ana,bia"]);
  assert.throws(() => faz({ tipo: "votar", nome: "Ana", id: b.id }), /a votação terminou/);
  assert.throws(() => faz({ tipo: "incluir", nome: "Ana", grupo: "acao", texto: "x", dono: "zé" }), /não está no equipe\.json/);
  assert.throws(() => faz({ tipo: "incluir", nome: "Ana", grupo: "acao", texto: "x", sobre: c.id }), /atrelada a um item ou a um grupo/);
  faz({ tipo: "incluir", nome: "Ana", grupo: "acao", texto: "Revisar em 1 dia", dono: "bia", sobre: gr.id }, 7);
  faz({ tipo: "incluir", nome: "Bia", grupo: "acao", texto: "Rever o quadro toda segunda" }, 8);
  faz({ tipo: "incluir", nome: "Bia", grupo: "acao", texto: "Engano" }, 9);
  const [x, y, z] = estado.itens.slice(-3);
  assert.equal(x.sobre, gr.id);
  faz({ tipo: "editar", nome: "Ana", id: x.id, texto: "Revisar o MR em 1 dia", dono: "ana" });
  assert.deepEqual([x.texto, x.dono], ["Revisar o MR em 1 dia", "ana"]);
  faz({ tipo: "remover", nome: "Bia", id: z.id });
  assert.throws(() => faz({ tipo: "remover", nome: "Bia", id: z.id }), /não existe mais/);
  const linhas = linhasDaSecao(dados, estado);
  assert.deepEqual(linhas, [
    "- Positivo: Pareamento · por Bia · 1 voto (Bia)", "- Positivo: Entrega no prazo - sem susto · por Ana",
    "- Negativo: Revisão de MR lenta · 2 votos (Ana, Bía)", "  - MR parado · por Bia", "  - MR parado · por Ana", "- Negativo: Revisão demorou 3 dias · por Ana",
    "- Melhoria: Fila de revisão · por Ana",
    "- Ação: Revisar o MR em 1 dia · sobre Negativo: Revisão de MR lenta · por Ana · dono ana", "- Ação: Rever o quadro toda segunda · por Bia"]);
  // a seção troca de corpo e a linha Números (do passo fechar) fica
  const md = trocarSecao(ler(p).replace("## Retro\n", "## Retro\n- Positivo: velho\n- Números: concluídas 1\n"), "Retro", linhas, /^- Números:/);
  assert.ok(md.endsWith("## Review\n## Retro\n" + linhas.join("\n") + "\n- Números: concluídas 1\n"));
  assert.equal(trocarSecao("# S\n\n## Itens\n\nx\n", "Retro", ["- Positivo: a"]), "# S\n\n## Itens\n\nx\n\n## Retro\n\n- Positivo: a\n");  // a seção que falta, no .md arejado
  // de volta: o grupo com os pontos dele, quem levantou, quem votou e a ação apontando o item
  const lidos = importarSecao(dados, md), grupoLido = lidos.find((i) => i.agrupa);
  assert.deepEqual(lidos.map((i) => [i.grupo, i.texto, i.autor, i.em_grupo ? "no grupo" : i.dono ?? null, i.votos.map((v) => v.chave).join()]), [
    ["positivo", "Pareamento", "Bia", null, "bia"], ["positivo", "Entrega no prazo - sem susto", "Ana", null, ""],
    ["negativo", "Revisão de MR lenta", null, null, "ana,bia"], ["negativo", "MR parado", "Bia", "no grupo", ""], ["negativo", "MR parado", "Ana", "no grupo", ""], ["negativo", "Revisão demorou 3 dias", "Ana", null, ""],
    ["melhoria", "Fila de revisão", "Ana", null, ""], ["acao", "Revisar o MR em 1 dia", "Ana", "ana", ""], ["acao", "Rever o quadro toda segunda", "Bia", null, ""]]);
  assert.equal(lidos.find((i) => i.grupo === "acao").sobre, grupoLido.id);
  assert.deepEqual(linhasDaSecao(dados, { itens: lidos }), linhas);
  // a linha escrita à mão: o voto sem nome conta como base; o `sobre` sem o item volta ao texto da ação
  assert.deepEqual(importarSecao(dados, "## Retro\n- Positivo: a\n- Melhoria: b · 2 votos\n- Ação: c · sobre Negativo: sumiu\n").map((i) => [i.grupo, i.texto, i.base ?? 0]), [["positivo", "a", 0], ["melhoria", "b", 2], ["acao", "c - sobre Negativo: sumiu", 0]]);
  faz({ tipo: "avancar", nome: "Ana", de: "acoes" }, 0, AP);

  // etapa 5: as ações ficam só texto; quem apresenta ainda inclui; não há etapa depois
  assert.throws(() => faz({ tipo: "remover", nome: "Bia", id: y.id }), /terminou: nada mais se altera/);
  assert.throws(() => faz({ tipo: "incluir", nome: "Bia", grupo: "acao", texto: "Tarde" }), /só quem apresenta inclui/);
  faz({ tipo: "incluir", nome: "Ana", grupo: "acao", texto: "Avisar o time", sobre: b.id }, 10, AP);
  assert.throws(() => faz({ tipo: "avancar", nome: "Ana", de: "licoes" }, 0, AP), /última etapa/);

  // a review: o feedback de cada entrega e, liberada a etapa, as novas ideias e necessidades; tudo à vista, sem votos,
  // e só quem apresenta registra (inclui, dizendo de quem é, altera e remove): os demais acompanham
  const rv = cerimoniaDoProjeto({ projeto: p, modo: "review", exec: git(), agora }), er = { etapa: "feedback", itens: [] }, rf = (acao, quando, papel = AP) => aplicar(er, { nome: "Ana", ...acao }, rv, quando, papel);
  rf({ tipo: "incluir", grupo: "FT-001", texto: "Aprovado; faltou o filtro", autor: "Cliente" }, 1);
  rf({ tipo: "incluir", grupo: "FT-001", texto: "Tela clara", autor: "Cliente" }, 2);
  for (const acao of [{ tipo: "incluir", grupo: "FT-001", texto: "Meu" }, { tipo: "editar", id: er.itens[1].id, texto: "x" }, { tipo: "remover", id: er.itens[1].id }, { tipo: "avancar", de: "feedback" }])
    assert.throws(() => rf({ ...acao, nome: "Cliente" }, 0, {}), /só quem apresenta registra/);
  assert.throws(() => rf({ tipo: "incluir", grupo: "FT-001", texto: "Tela clara" }), /já está na lista/);
  assert.throws(() => rf({ tipo: "incluir", grupo: "ideia", texto: "Filtro por data" }), /vêm depois do feedback/);
  rf({ tipo: "editar", id: er.itens[1].id, texto: "Tela clara — e rápida" });
  assert.deepEqual([er.itens[1].texto, er.itens[1].autor], ["Tela clara - e rápida", "Cliente"]);  // o texto muda, de quem é fica
  rf({ tipo: "avancar", de: "feedback" });
  rf({ tipo: "incluir", grupo: "AT-001", texto: "Resolveu no mesmo dia" }, 3);  // o feedback ainda entra depois da etapa; sem `autor`, é de quem apresenta
  rf({ tipo: "incluir", grupo: "ideia", texto: "Filtro por data", autor: "Cliente" }, 4);
  rf({ tipo: "incluir", grupo: "ideia", texto: "Engano", autor: "Rui" }, 5);
  rf({ tipo: "remover", id: er.itens.at(-1).id });
  assert.throws(() => rf({ tipo: "votar", nome: "Ana", id: er.itens[1].id }, 0, AP), /a review não tem votação/);
  assert.throws(() => rf({ tipo: "avancar", nome: "Ana", de: "ideias" }, 0, AP), /última etapa/);
  assert.equal(visaoDe(er, {}), er);  // a review mostra tudo a todos
  const lr = linhasDaSecao(rv, er);
  assert.deepEqual(lr, ["- AT-001 · Resolveu no mesmo dia — por Ana", "- FT-001 · Aprovado, faltou o filtro — por Cliente; Tela clara - e rápida — por Cliente", "- ideia ou necessidade · Filtro por data — por Cliente"]);
  assert.deepEqual(importarSecao(rv, trocarSecao(ler(p), "Review", lr)).map((i) => [i.grupo, i.texto, i.autor]), [["AT-001", "Resolveu no mesmo dia", "Ana"], ["FT-001", "Aprovado, faltou o filtro", "Cliente"], ["FT-001", "Tela clara - e rápida", "Cliente"], ["ideia", "Filtro por data", "Cliente"]]);
  // o id que o cadastro pôs no fim da linha não vira nome de quem levantou, e volta ao republicar
  const cadastrada = importarSecao(rv, "## Review\n- AT-001 · sem feedback\n- FT-001 · bom — por Rui\n- ideia ou necessidade · Filtro — por Rui Prado (FT-040)\n");
  assert.deepEqual(cadastrada.map((i) => [i.grupo, i.texto, i.autor, i.cadastrado ?? null]), [["FT-001", "bom", "Rui", null], ["ideia", "Filtro", "Rui Prado", "FT-040"]]);
  assert.deepEqual(linhasDaSecao(rv, { itens: cadastrada }), ["- AT-001 · sem feedback", "- FT-001 · bom — por Rui", "- ideia ou necessidade · Filtro — por Rui Prado (FT-040)"]);
});

test("retrospectiva: as lições do ciclo aparecem na última etapa; quem apresenta marca Sim ou Não e só as marcadas Sim vão para o sprint-<nn>.md", () => {
  const p = projeto("licoes");
  const arquivos = {
    ".kiro/specs/ft-001-extrato/status.md": "# FT-001\n## Lições aprendidas\n| Lição | Origem | Regra proposta |\n|---|---|---|\n| L-1 · teste criou a coluna errada | tarefa 2 | Conferir as colunas no banco antes do DDL de teste |\n| L-2 · JaCoCo não rodou | revisão 1 | — (descartada: ambiente) |\n## Retomar\n",
    ".kiro/specs/ft-002-filtro/status.md": "## Lições aprendidas\n| Lição | Origem | Regra proposta |\n|---|---|---|\n| item em andamento não entra | t | fora |\n",
    ".sabia/planejamento/sustentacao/AT-001-contas.md": "# AT-001\n## Lições aprendidas\n| Lição | Regra proposta |\n|---|---|\n| extração grande trava a sprint | Quebrar a extração grande em lotes |\n",
    ".sabia/sabia.md": "# Sabiá\n## Regras aprendidas\n- Quebrar a extração grande em lotes · origem AT-001 · 2026-11-20\n",
  };
  for (const [f, c] of Object.entries(arquivos)) { fs.mkdirSync(path.dirname(path.join(p, f)), { recursive: true }); fs.writeFileSync(path.join(p, f), c); }
  const dados = cerimoniaDoProjeto({ projeto: p, modo: "retrospective", exec: git(), agora }), AP = { apresentador: true };
  // só dos itens concluídos; o texto é a regra proposta ou, sem ela, a lição; a que já é regra vem marcada
  assert.deepEqual(dados.licoes, [
    { origem: "FT-001", texto: "Conferir as colunas no banco antes do DDL de teste", detalhe: "L-1 - teste criou a coluna errada", ja_esta: false },
    { origem: "FT-001", texto: "L-2 - JaCoCo não rodou", detalhe: null, ja_esta: false },
    { origem: "AT-001", texto: "Quebrar a extração grande em lotes", detalhe: "extração grande trava a sprint", ja_esta: true },
  ]);
  const estado = juntarLicoes({ etapa: "acoes", itens: [] }, dados.licoes), [a, b, c] = estado.itens;
  // antes da etapa delas, as lições não saem do servidor para quem não apresenta, e ninguém responde
  assert.deepEqual([visaoDe(estado, { chave: "bia" }).itens.length, visaoDe(estado, { apresentador: true }).itens.length], [0, 3]);
  assert.throws(() => aplicar(estado, { tipo: "manter", nome: "Ana", id: a.id, valor: true }, dados, 0, AP), /na última etapa/);
  estado.etapa = "licoes";
  assert.equal(visaoDe(estado, { chave: "bia" }).itens.length, 3);
  assert.deepEqual(linhasDaSecao(dados, estado), []);  // sem resposta, nada é gravado
  assert.throws(() => aplicar(estado, { tipo: "manter", nome: "Bia", id: a.id, valor: true }, dados), /de quem apresenta/);
  aplicar(estado, { tipo: "manter", nome: "Ana", id: a.id, valor: true }, dados, 0, AP);
  aplicar(estado, { tipo: "manter", nome: "Ana", id: b.id, valor: true }, dados, 0, AP);
  aplicar(estado, { tipo: "manter", nome: "Ana", id: b.id, valor: false }, dados, 0, AP);  // mudou de ideia: Não
  // ninguém cria lição na página, nem quem apresenta: só as dos itens concluídos, para não poluir as Regras aprendidas
  assert.throws(() => aplicar(estado, { tipo: "incluir", nome: "Ana", grupo: "licao", texto: "Combinar a massa antes" }, dados, 9, AP), /vêm dos itens concluídos do ciclo/);
  aplicar(estado, { tipo: "incluir", nome: "Ana", grupo: "acao", texto: "Rever a massa" }, dados, 11, AP);
  assert.deepEqual(estado.itens.slice(0, 3).map((i) => i.manter), [true, false, null]);
  assert.throws(() => aplicar(estado, { tipo: "manter", nome: "Ana", id: c.id, valor: true }, dados, 0, AP), /já é Regra aprendida/);
  assert.throws(() => aplicar(estado, { tipo: "remover", nome: "Ana", id: b.id }, dados, 0, AP), /não se altera nem se remove/);
  // só as marcadas Sim, antes das ações
  const linhas = linhasDaSecao(dados, estado);
  assert.deepEqual(linhas, ["- Lição: Conferir as colunas no banco antes do DDL de teste · origem FT-001", "- Ação: Rever a massa · por Ana"]);
  // de volta do .md: a marcada casa com a do ciclo (sem duplicar) e volta Sim; as outras do ciclo voltam sem resposta
  const lido = juntarLicoes({ itens: importarSecao(dados, trocarSecao(ler(p), "Retro", linhas)) }, dados.licoes);
  assert.deepEqual(lido.itens.filter((i) => i.grupo === "licao").map((i) => `${i.texto} | ${i.origem ?? "-"} | ${i.manter} | ${!!i.do_ciclo}`), [
    "Conferir as colunas no banco antes do DDL de teste | FT-001 | true | true", "L-2 - JaCoCo não rodou | FT-001 | null | true", "Quebrar a extração grande em lotes | AT-001 | null | true"]);
  assert.deepEqual(linhasDaSecao(dados, lido), linhas);
});

test("cerimônia: o servidor leva a página no tema do quadro, dá a cada pessoa a visão dela, anda pelas etapas com quem abriu e só grava o sprint-<nn>.md no Publicar", async () => {
  const p = projeto("servidor"), logs = [];
  const q = await abrirCerimonia({ projeto: p, modo: "retrospective", exec: git(), log: (x) => logs.push(String(x)), porta: 0, host: "127.0.0.1", agora });
  const embutidoDe = (html) => JSON.parse(html.match(/<script id="dados" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  try {
    assert.match(logs.at(-1), /^Retrospectiva da 2026\/Sprint 02 do projeto servidor \(Ctrl\+C encerra\):\n\n {2}http:\/\/127\.0\.0\.1:\d+\/\n$/);
    const html = await (await fetch(q.url)).text();
    assert.match(html, /<title>Retrospectiva · 2026\/Sprint 02 · servidor<\/title>/);
    assert.match(html, /data-sobria="sobria-sabia"/);  // o tema do quadro
    assert.match(html, /id="publicar"/);  // quem abriu é da equipe e está na máquina
    assert.match(html, /<nav class="etapas" id="etapas"/);
    assert.match(html, /<code>## Retro<\/code> do <code>sprint-02\.md<\/code>/);
    // quem abriu, na máquina dele, é o apresentador; a retro começa vazia, na etapa dos pontos: só quem está na página inclui
    const embutido = embutidoDe(html);
    assert.deepEqual([embutido.apresentador, embutido.estado.etapa], [true, "pontos"]);
    assert.deepEqual(embutido.estado.itens, []);
    assert.equal(ler(p).endsWith("## Retro\n"), true);  // abrir a página não grava nada
    // a página de quem vem pela rede: sem o Publicar, sem ser apresentador, e com a visão de quem ainda não disse o nome
    const dados = cerimoniaDoProjeto({ projeto: p, modo: "retrospective", exec: git(), agora }), deFora = paginaCerimonia(dados, visaoDe({ etapa: "pontos", itens: [{ id: "a", grupo: "positivo", texto: "Vazão de 5", autor: "Ana Souza", votos: [] }] }, {}), "t");
    assert.doesNotMatch(deFora, /id="publicar"/);
    assert.deepEqual([embutidoDe(deFora).apresentador, embutidoDe(deFora).estado.itens], [false, []]);
    // gravar exige o token da página
    const post = (corpo, cab = { "x-sabia-token": q.token }) => fetch(q.url + "acao", { method: "POST", headers: cab, body: JSON.stringify(corpo) });
    const faz = async (corpo) => (await post(corpo)).json();
    assert.equal((await post({}, {})).status, 403);
    assert.equal((await post({}, { "x-sabia-token": q.token, origin: "http://outro.exemplo" })).status, 403);
    assert.match((await faz({ tipo: "incluir", grupo: "positivo", texto: "x" })).erro, /diga o seu nome/);
    await faz({ tipo: "incluir", nome: "Ana Souza", grupo: "positivo", texto: "Vazão de 5" });
    // o /vivo entrega a visão ao abrir e a cada mudança
    const vivo = await fetch(q.url + "vivo?nome=Ana%20Souza"), leitor = vivo.body.getReader(), dec = new TextDecoder();
    const proximo = async () => JSON.parse(dec.decode((await leitor.read()).value).replace(/^data: /, ""));
    assert.equal((await proximo()).itens.length, 1);
    const r = await faz({ tipo: "incluir", nome: "Bia", grupo: "melhoria", texto: "Review sem retorno" });
    assert.equal(r.estado.itens.length, 2);
    assert.equal((await proximo()).itens.at(-1).texto, "Review sem retorno");
    await leitor.cancel();
    assert.match((await faz({ tipo: "incluir", nome: "Bia", grupo: "melhoria", texto: "Review sem retorno" })).erro, /já está na lista/);
    // publica-se só na última etapa; quem abriu libera uma a uma
    assert.match((await faz({ tipo: "publicar", mensagem: "cedo" })).erro, /publicada na última etapa/);
    assert.equal((await faz({ tipo: "avancar", nome: "Ana Souza", de: "pontos" })).estado.etapa, "agrupar");
    assert.equal((await faz({ tipo: "avancar", nome: "Ana Souza", de: "agrupar" })).estado.etapa, "votar");
    assert.match((await faz({ tipo: "avancar", nome: "Ana Souza", de: "agrupar" })).erro, /a etapa já mudou/);  // o clique dobrado não pula etapa
    await faz({ tipo: "votar", nome: "Bia", id: r.estado.itens[1].id });
    await faz({ tipo: "avancar", nome: "Ana Souza", de: "votar" });
    await faz({ tipo: "incluir", nome: "Bia", grupo: "acao", texto: "Fechar no timebox", dono: "ana" });
    assert.equal((await faz({ tipo: "avancar", nome: "Ana Souza", de: "acoes" })).estado.etapa, "licoes");
    assert.equal(ler(p).endsWith("## Retro\n"), true);  // nada disso mexe no sprint-<nn>.md: só o Publicar
    assert.equal((await (await fetch(q.url + "dados.json")).json()).estado.nao_publicado, true);
    assert.equal(fs.existsSync(path.join(p, ".sabia/local")), false);  // e nada fora dele
    assert.match(html, /<input type="text" id="mensagem" maxlength="300" value="2026\/Sprint 02: retrospectiva"/);  // o popup já traz a mensagem
    const pub = await faz({ tipo: "publicar", mensagem: "Task 42 - retro da Sprint 02" });
    assert.deepEqual([pub.ok, pub.commit, pub.estado.nao_publicado], [true, "Task 42 - retro da Sprint 02", false]);
    // o Publicar grava a seção, com quem levantou e quem votou
    assert.ok(ler(p).endsWith("## Retro\n- Positivo: Vazão de 5 · por Ana Souza\n- Melhoria: Review sem retorno · por Bia · 1 voto (Bia)\n- Ação: Fechar no timebox · por Bia · dono ana\n"));
    assert.equal((await fetch(q.url + "outro")).status, 404);
  } finally { q.fechar(); await q.fechou; }
  // de novo: a retro já publicada abre na última etapa, com os pontos, o autor e os votos de volta do sprint-<nn>.md
  const q2 = await abrirCerimonia({ projeto: p, modo: "retrospective", exec: git(), log: () => {}, porta: 0, host: "127.0.0.1", agora });
  try {
    const e2 = (await (await fetch(q2.url + "dados.json")).json()).estado;
    assert.deepEqual([e2.etapa, e2.itens.map((i) => `${i.autor} ${i.votos.map((v) => v.nome).join()}`)], ["licoes", ["Ana Souza ", "Bia Bia", "Bia "]]);
  } finally { q2.fechar(); await q2.fechou; }
  // a review também tem etapas e apresentador, sem o agrupamento; começa no feedback e publica na última
  const q3 = await abrirCerimonia({ projeto: p, modo: "review", exec: git(), log: () => {}, porta: 0, host: "127.0.0.1", agora });
  try {
    const h3 = await (await fetch(q3.url)).text(), post3 = async (corpo) => (await fetch(q3.url + "acao", { method: "POST", headers: { "x-sabia-token": q3.token }, body: JSON.stringify(corpo) })).json();
    assert.match(h3, /<nav class="etapas" id="etapas" aria-label="Etapas da review"/);
    assert.match(h3, /id="modal-etapa"/);
    assert.doesNotMatch(h3, /id="modal-grupo"/);
    assert.deepEqual([embutidoDe(h3).apresentador, embutidoDe(h3).estado.etapa], [true, "feedback"]);
    assert.match((await post3({ tipo: "publicar" })).erro, /a review é publicada na última etapa \(Novas ideias e necessidades\)/);
    await post3({ tipo: "incluir", nome: "Ana Souza", autor: "Rui", grupo: "FT-001", texto: "Aprovado" });
    assert.equal((await post3({ tipo: "avancar", nome: "Ana Souza", de: "feedback" })).estado.etapa, "ideias");
    await post3({ tipo: "incluir", nome: "Ana Souza", autor: "Rui", grupo: "ideia", texto: "Filtro por data" });
    assert.equal((await post3({ tipo: "publicar" })).ok, true);
    assert.match(ler(p), /## Review\n- AT-001 · sem feedback\n- FT-001 · Aprovado — por Rui\n- ideia ou necessidade · Filtro por data — por Rui\n## Retro\n/);
  } finally { q3.fechar(); await q3.fechou; }
  // a review já publicada abre na última etapa
  const q4 = await abrirCerimonia({ projeto: p, modo: "review", exec: git(), log: () => {}, porta: 0, host: "127.0.0.1", agora });
  try { assert.equal((await (await fetch(q4.url + "dados.json")).json()).estado.etapa, "ideias"); } finally { q4.fechar(); await q4.fechou; }
});

test("cerimônia: publicar faz o commit só do sprint-<nn>.md, com a mensagem do fluxo, e diz quando o push falha", () => {
  const p = projeto("publicar"), dados = cerimoniaDoProjeto({ projeto: p, modo: "review", exec: git(), agora }), ana = { usuario: "ana", nome: "Ana Souza", produto: true };
  const chamadas = [];
  const estado = { itens: [] }, antes = ler(p);
  assert.throws(() => publicar(p, dados, estado, { exec: git({ commit: { status: 1, stderr: "hook recusou" } }), usuario: ana }), /git commit: hook recusou/);
  assert.equal(ler(p), antes);  // o commit falhou: o arquivo volta ao que era
  assert.deepEqual(publicar(p, dados, estado, { exec: git({ chamadas }), usuario: ana }), { commit: "2026/Sprint 02: review" });
  assert.ok(ler(p).endsWith("## Review\n- AT-001 · sem feedback\n- FT-001 · sem feedback\n## Retro\n"));
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
