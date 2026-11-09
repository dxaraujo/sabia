---
{"resumo": "Registro do item de Sustentação (AT · IM · BD · IN · OP · EX) em .sabia/planejamento/sustentacao/<ID>-<slug>.md: cabeçalho, Pedido, Critério de pronto, Atividade, Resposta, Horas e Lições, sem status e sem dado de cliente."}
---
# Registro de Sustentação

`.sabia/planejamento/sustentacao/<ID>-<slug>.md`, o mesmo formato para as seis categorias. Gravado por commit direto na branch base. Não tem status: a situação está no `backlog.md`. Dado de cliente nunca entra: fica em
`.sabia/local/sustentacao/<ID>/`, fora do git.

```markdown
# AT-012 · Extração de contas bloqueadas em setembro

**Categoria:** AT (Atendimento) · **Origem:** chamado 4521 · **Pedido por:** área de segurança · **Prazo:** 2026-10-16 · **Responsável:** joao.lima

## Pedido
<o que o cliente precisa, sem dado pessoal>

## Critério de pronto
Planilha com as contas bloqueadas por tentativas, por dia.

## Atividade
- 2026-10-14 · `select count(*) from conta where situacao = 'B' and dt_bloqueio between …` → 1.284 contas; arquivo em `.sabia/local/sustentacao/AT-012/` · próximo: rascunho da resposta
- 2026-10-14 · `BloqueioService.java:88` bloqueia na 3ª tentativa e grava `dt_bloqueio` · próximo: —

## Resposta
<texto enviado, sem dado que identifique pessoas>

## Horas
| Data | Horas |
|---|---|
| 2026-10-14 | 2 |

## Lições
| Lição | Regra proposta |
|---|---|
```

Seção sem conteúdo fica só com o título.

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| Categoria | Confirmada antes de gravar; define a série do id e não muda | AT (Atendimento) · IM (Implantação) · BD (Banco de dados) · IN (Infra) · OP (Operação) · EX (Apoio a outros times) | captura comum, pela `sa-atender.atender` ou pela `sa-triar.triar` |
| Origem | De onde veio o pedido | `chamado <n>` · `EWM <n>` · `pedido` · `origem <id>` (desdobramento ou DDL de fatia) | captura comum |
| Pedido por | Área ou papel, sem nome de pessoa | texto | captura comum |
| Prazo | Data-limite | `AAAA-MM-DD` · `—` | captura comum · `sa-atender.atender` |
| Responsável | Quem atende | `usuario` do `equipe.json` · `—` | `sa-atender.atender` |
| Pedido | O que o cliente precisa, sem dado pessoal | texto | captura comum |
| Critério de pronto | Quando se considera resolvido | uma frase | `sa-atender.atender` |
| Atividade | O que foi feito: consultas, pesquisa de código (`arquivo:linha`), passos em ambiente (o que · onde · resultado), troca de responsável, regra em aberto ao P.O. | linhas `AAAA-MM-DD · feito · próximo` | `sa-atender.atender` · fechar a sessão da `sa-status` |
| Resposta | Texto enviado, sem dado que identifique pessoas | texto | `sa-atender.atender` |
| Horas | Horas informadas pela pessoa (opcional; nunca bloqueia) | tabela Data \| Horas (`AAAA-MM-DD` \| decimal) | `sa-atender.atender` |
| Lições | Candidatas às Regras aprendidas, para a curadoria na review | tabela Lição \| Regra proposta | `sa-atender.atender` |
