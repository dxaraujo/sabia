---
{"fluxo": "atender", "dono": "sa-desenvolvedor",
 "quando": ["Sustentação das seis categorias (AT · IM · BD · IN · OP · EX): registrar o pedido, puxar, atender com a IA como auxílio e concluir", "atender o AT-012", "registra um pedido de sustentação", "aplicar o BD-004", "conclui o IM-007"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao", "saidas": {"id de Sustentação já registrado, nova ou em-andamento": "puxar"}},
   {"id": "registrar", "saidas": {"só registrar, sem atender agora": "fim"}},
   {"id": "puxar", "saidas": {"reserva estourada, sem quem tem produto na sessão ou com a decisão de esperar": "fim"}},
   {"id": "assumir", "chama": "sa-elm.item"},
   {"id": "executar", "chama": "sa-pesquisar.pesquisar", "saidas": {"a sessão termina antes de resolver (commit '<ID> registrar sessão')": "fim", "resolvido ou retirado, nada fora do escopo": "finalizar"}},
   {"id": "fora-do-escopo", "saidas": {"categoria errada: o item ficou 'cancelada · virou <novo id>'": "gravar-na-base"}},
   {"id": "finalizar", "chama": "sa-elm.finalizar"},
   {"id": "desdobramentos", "saidas": {"nenhum desdobramento": "gravar-na-base"}},
   {"id": "captura", "de": "captura"},
   {"id": "gravar-na-base", "de": "gravar-na-base"}
 ]}
---
# Atender — Sustentação sem perder o rastro

Um fluxo só para as seis categorias da Sustentação: AT (Atendimento) · IM (Implantação) · BD (Banco de dados) · IN
(Infra) · OP (Operação) · EX (Apoio a outros times). A categoria só muda o registro. Qualquer pessoa registra o
pedido aqui; quem atende puxa dentro da reserva, faz o trabalho com a IA só como auxílio e declara resolvido.

Entra um id (`AT-`, `IM-`, `BD-`, `IN-`, `OP-` ou `EX-nnn`) ou um pedido em texto. Pedido em texto, ou id que não
existe, vai para o passo `registrar`. O estado vai na base pela gravação comum (passo `gravar-na-base`).

Leia antes o `.sabia/sabia.md` (seção Sustentação: Categoria · Descrição · Exemplo). Sem ele, ofereça a
`sa-setup.configurar` e pare.

Aceita: item de Sustentação `nova` ou `em-andamento`.

## Entrada: vizinhos

- `EP-nn` ou `FT-nnn` → não é Sustentação: veja `sa-status <id>` ■

## Arquivos

- `.sabia/planejamento/sustentacao/<ID>-<slug>.md` — o registro, no padrão `sa-atender/registro.md`. Gravado direto
  na base.
- A linha do item no `backlog.md` e a linha `atendimento` no `sprint-<nn>.md` aberto.
- `.sabia/local/sustentacao/<ID>/` — extrações, telas e respostas com dado real. Fora do git.

## Regras

- O atendimento é da pessoa. O agente não roda script, deploy, DDL nem comando em ambiente e não responde ao cliente.
- Quem declara resolvido é sempre a pessoa que atende, nunca a IA.
- Dado de cliente nunca vai ao git. No registro ficam só a consulta, a contagem, o caminho e um resumo anônimo.
- Banco só em leitura.
- A categoria é confirmada antes de gravar e não muda depois.
- O ELM aparece só como oferta da `sa-elm`, e a resposta nunca trava o fluxo.
