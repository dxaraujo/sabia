// Testes do lote de ações do backlog (`reordenar` e `prepararLote`), que a página da review usa no Publicar. As ações
// uma a uma do quadro Kanban são testadas no sabia.test.mjs.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { preparar, prepararLote } from "./acoes.mjs";

const raiz = fs.mkdtempSync(path.join(os.tmpdir(), "sabia-acoes-"));
after(() => fs.rmSync(raiz, { recursive: true, force: true }));
const BACKLOG = ".sabia/planejamento/backlog.md", agora = new Date("2026-11-21T12:00:00Z");
const ana = { usuario: "ana", nome: "Ana", produto: true }, bia = { usuario: "bia", nome: "Bia", produto: false };
const linha = (id, tipo, status, pai = "") => `| ${id} | ${id} | ${tipo} | ${status} |  | M |  | ${pai} |  |  |  | 2026-11-09 |  |  |\n`;
function projeto(nome) {
  const p = path.join(raiz, nome);
  fs.mkdirSync(path.join(p, ".sabia/planejamento"), { recursive: true });
  fs.mkdirSync(path.join(p, ".kiro/specs/ft-003-exportar"), { recursive: true });
  fs.writeFileSync(path.join(p, BACKLOG), "# Backlog\n| id | título | tipo | status | prioridade | tamanho | responsável | pai | relator | ib | obs | entrou_em | concluida_em | motivo |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n"
    + linha("EP-01", "épico", "fatiado") + linha("FT-001", "fatia", "concluida", "EP-01") + linha("FT-002", "fatia", "elegivel") + linha("FT-003", "fatia", "aceita", "EP-01") + linha("FT-004", "fatia", "aceita") + linha("FT-005", "bug", "nova"));
  return p;
}
const ordem = (texto) => texto.split("\n").filter((l) => /^\| [A-Z]+-\d+ /.test(l)).map((l) => l.split("|")[1].trim());

test("reordenar: os itens citados trocam de lugar entre as posições deles; é de quem tem produto", () => {
  const p = projeto("ordem");
  const m = preparar(p, { tipo: "reordenar", ids: ["FT-005", "FT-002", "FT-004"] }, { usuario: ana, agora });
  assert.deepEqual(ordem(m.arquivos[BACKLOG]), ["EP-01", "FT-001", "FT-005", "FT-003", "FT-002", "FT-004"]);  // FT-003 e os terminais ficam onde estavam
  assert.deepEqual([m.commit, m.remover, fs.readFileSync(path.join(p, BACKLOG), "utf8") === m.arquivos[BACKLOG]], ["backlog: ordem", [], false]);  // não grava
  assert.throws(() => preparar(p, { tipo: "reordenar", ids: ["FT-002", "FT-004", "FT-005"] }, { usuario: ana, agora }), /nada mudou/);
  assert.throws(() => preparar(p, { tipo: "reordenar", ids: ["FT-002", "FT-099"] }, { usuario: ana, agora }), /FT-099 não está no backlog/);
  assert.throws(() => preparar(p, { tipo: "reordenar", ids: ["FT-002", "FT-002"] }, { usuario: ana, agora }), /repete item/);
  assert.throws(() => preparar(p, { tipo: "reordenar", ids: ["FT-005", "FT-002"] }, { usuario: bia, agora }), /de quem tem produto/);
  assert.throws(() => preparar(p, { tipo: "reordenar", ids: ["FT-005", "FT-002"] }, { usuario: null, agora }), /equipe\.json/);
});

test("lote: a ordem e os cancelamentos saem num backlog.md só, cada ação sobre a anterior; a recusada derruba tudo", () => {
  const p = projeto("lote"), antes = fs.readFileSync(path.join(p, BACKLOG), "utf8");
  const m = prepararLote(p, [{ tipo: "reordenar", ids: ["FT-005", "FT-002", "FT-004"] }, { tipo: "reordenar", ids: ["FT-005"] }, { tipo: "cancelar", id: "FT-004", motivo: "fora do escopo" }, { tipo: "cancelar", id: "FT-003", motivo: "duplicada" }], { usuario: ana, agora });
  const texto = m.arquivos[BACKLOG];
  assert.deepEqual(ordem(texto), ["EP-01", "FT-001", "FT-005", "FT-003", "FT-002", "FT-004"]);
  assert.match(texto, /\| FT-004 \| FT-004 \| fatia \| cancelada \|.*\| fora do escopo · desde 2026-11-21 \|/);
  assert.match(texto, /\| FT-003 \| FT-003 \| fatia \| cancelada \|/);
  // a última fatia aberta do épico cancelada fecha o épico (uma irmã foi concluída), e a pasta da spec sai
  assert.match(texto, /\| EP-01 \| EP-01 \| épico \| concluido \|.*\| 2026-11-21 \|/);
  assert.deepEqual([m.commits, m.remover, m.avisos], [["backlog: ordem", "FT-004 cancelar", "FT-003 cancelar"], [path.join(".kiro/specs", "ft-003-exportar")], ["o épico EP-01 ficou concluido"]]);
  assert.equal(fs.readFileSync(path.join(p, BACKLOG), "utf8"), antes);  // nada foi gravado
  assert.throws(() => prepararLote(p, [{ tipo: "reordenar", ids: ["FT-005", "FT-002"] }, { tipo: "cancelar", id: "FT-001", motivo: "x" }], { usuario: ana, agora }), /FT-001 está concluida/);
  assert.deepEqual(prepararLote(p, [], { usuario: ana, agora }).arquivos, {});
});
