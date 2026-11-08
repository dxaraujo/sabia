---
{"resumo": "ET as-built (ET): as seções Components and Interfaces · Data Models · Decisões técnicas do design.md (OpenSpec: Decisions), escritas a partir do código, com Atende, queries, operações, validações, integrações, JOBs, tabelas e campos da tela."}
---
# Especificação técnica (ET)

Só onde o projeto mantém ET (`ET as-built: sim` na seção ELM do `.sabia/sabia.md`). Não tem arquivo em `elm/`: são
seções do `design.md` da fatia, que formam a ET publicada.

Onde o projeto mantém ET, o as-built escreve essas seções a partir do código, nesta forma (no OpenSpec, tudo dentro
de Decisions, cada parte num `###`). Na divergência com o plano, vale o código.

````markdown
## Components and Interfaces
**Atende:** [HF-<id> <título>](<id>-HF-<slug>.md) · [UC-<id> <título>](<id>-UC-<slug>.md)
**Módulo:** <módulo> · **Schema:** <schema> · **Tipo:** Consulta | Cadastro | Processamento | Integração
`<Componente.operacao(parâmetros)>`: <o que faz>

### Q01 - <consulta>
**Objetivo:** <o que retorna> · **Usada em:** <componente> · **Parâmetros:** <…>
```sql
SELECT …
```
**Filtros por perfil:** <perfil>: `AND <condição>`

### <INSERT | UPDATE | DELETE> - <operação>
| Campo | Tipo | Valor vem de | Observação |
|---|---|---|---|
| <ID_INSCRICAO> | NUMBER | Sequence | <SQ_INSCRICAO.NEXTVAL> |
**Conforme** REG-<id>

### Validações
| V-nn | Validação | Lógica | Mensagem | Regra |
|---|---|---|---|---|
| V01 | <o que confere> | <consulta ou expressão> | MSG-<id> | REG-<id> |

### Integrações   <!-- só se houver -->
**<sistema>:** <síncrona | assíncrona | lote> · <REST | fila | arquivo | tabela de comunicação> · <campos e valores>

### JOBs   <!-- só se houver -->
**<job>:** <gatilho e frequência> · <tabela de controle> · <situações e valores>

## Data Models
| Tabela | Alias | Descrição | Operação |
|---|---|---|---|
| <TB_TURMA> | t | <turma do evento> | SELECT |
Relacionamentos: <TB_INSCRICAO> → <TB_TURMA> · N:1 · <ID_TURMA>

### Campos da tela → colunas   <!-- só com tela -->
| Campo da tela | Coluna | Informações adicionais |
|---|---|---|
| <Vagas> | <QT_VAGAS> | <livres = QT_VAGAS − inscritos> |

## Decisões técnicas
- <decisão> — <motivo>; <consequência> (<ADR NNNN | local>)
````

- **Atende:** o link normal para cada HF e UC do Cobre da fatia (a HF não cita a ET). Na fatia, a HF nova ainda tem
  o id provisório (só texto); o `trocar-ids` põe o link no `design.md` quando ela ganha o id do DOORS. Cita REG e MSG
  da mesma forma; a validação cita a REG que aplica.
- Permissão e abrangência ficam na HF e na REG, não aqui. A DDL nova é um item BD do `tasks.md`; aqui entra a tabela
  como ficou.
- Nomes de tabela e coluna na forma original, com a convenção do steering do projeto.
