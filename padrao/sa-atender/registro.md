---
{"resumo": "Registro do item de Sustentação (AT-nnn e as demais categorias), em <produto>/sustentacao/<pasta>/<ID>-<slug>.md."}
---
`<produto>/sustentacao/<pasta>/<ID>-<slug>.md` (pasta da categoria na tabela **Sustentação** do `sabia.md`) — o mesmo formato para toda categoria; fora do Atendimento, `## Consultas`,
`## Pesquisa de código` e `## Resposta enviada` dão lugar a `## O que foi feito` (passos e evidência, sem dado de cliente).

```markdown
# AT-012 · Extração de contas bloqueadas em setembro

**Categoria:** Atendimento · **Origem:** chamado 4521 · **Pedido por:** área de segurança · **Prazo:** 2026-10-16
**Responsável:** joao.lima · **Situação:** aberto | em-andamento | concluido | cancelado (<motivo>)
**Critério de pronto:** planilha com as contas bloqueadas por tentativas, por dia · **Estimativa:** 3 h

## Pedido
<o que o cliente precisa receber, nas palavras dele, sem dado pessoal>

## Consultas
| # | Consulta (SQL) | Resultado |
|---|---|---|
| 1 | `select count(*) from conta where situacao = 'B' and dt_bloqueio between …` | 1.284 contas |

Arquivo: `.sabia/local/sustentacao/atendimento/AT-012/contas-bloqueadas-2026-09.csv` (fora do git)

## Pesquisa de código
- `BloqueioService.java:88` — bloqueia na 3ª tentativa e grava `dt_bloqueio`

## Resposta enviada
<texto, sem dado que identifique pessoas>

## Horas
| Data | Horas |
|---|---|
| 2026-10-14 | 2 |

## Créditos
| Data | Papel | Login | Sessão Kiro | Power sabia | Créditos |
|---|---|---|---|---|---|
| 2026-10-14T16:20:05 | ATD | joao.lima | 5753e516 | 2.0.0 | 3.12 |

**ELM:** —
ELM pendente [IB AT-012 concluir]: concluir o IB [AT-012]
**Saída:** —
```

`**Saída:**` `—` (1 · nada) · `triagem: <o que vai à sa-triar> (origem <ID>)` (2 · alteração ou regra) · `lição: <o que
registrar> (sa-aprender)` (3, fora do Atendimento); mais de uma → separadas por ` · `. O id que nasce depois (FT-nnn, L-nnn) não volta ao
registro.

`**ELM:** —` sem pendência; logo abaixo, uma linha por pendência: `ELM pendente [<chave>]: <o que falta>`. Resolvida,
acrescente `ELM feito [<mesma chave>]: <o que foi feito> (<AAAA-MM-DD>)` sem apagar a pendência (chaves em
[elm.md](~/.sabia/framework/skills/sabia/references/elm.md#pendências), Pendências).

| Campo | Formato | Obrigatório | Quem grava |
|---|---|---|---|
| Categoria | o nome na tabela **Sustentação** do `sabia.md` | sim | `sa-triar` |
| Origem | como a coluna `origem` da Sustentação no `backlog.md` | sim | `sa-triar` |
| Pedido por | área ou papel, sem nome de pessoa | sim | `sa-triar` |
| Prazo | `AAAA-MM-DD` ou `—` | não | `sa-triar` |
| Critério de pronto | uma frase | sim | `sa-triar` |
| Estimativa | `<n> h` (decimal com ponto) | sim | `sa-triar` |
| Responsável | login ou `—` | sim | `sa-triar`, ou o passo `assumir` |
| Situação | `aberto` · `em-andamento` · `concluido` · `cancelado`, com o significado em [backlog.md](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações), Situações (Item de Sustentação) | sim | quem causa |
| Pesquisa de código | só com o `sa-pesquisar` (passo `sa-atender.atender.executar`): um resumo dos fatos, `arquivo:linha` — o fato, sem dado de cliente; sem pesquisa, a seção não entra | não | `sa-atender` |
| Horas | uma linha por `elm_lancar_horas`: Data `AAAA-MM-DD`, Horas decimais | — | `sa-atender` · `sa-executar` |
| Créditos | uma linha por sessão (item 4 do [Fechar a sessão](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão) da `sa-status`); Papel = a sigla da tarefa (`ATD`, `IMPL`, `BD`…) | — | quem fecha a sessão |
| O que foi feito (outras categorias) | lista numerada `<n>. <o que foi executado> · <onde> · <resultado> · <link do chamado ou da mudança>` | — | `sa-executar` |
