---
{"resumo": "Escreve, antes de executar, o roteiro de cada cenário CT-nn da ficha e da spec, conforme a rota e o formato: pré-condição · passos · esperado · CT-nn, com a repetição e o erro em um item."}
---
## Entrada

A branch `<id>`, a ficha `.sabia/planejamento/fatias/FT-<nnn>-<slug>.md` e a pasta da spec pelo `formato_spec` do
`agentes.json`. Quem chama a `sa-verificar.revisao-humana` passa os cenários escolhidos pela pessoa.

## Faça

1. Os cenários vêm da ficha e da spec, conforme a rota (no `status.md`; sem ele, trivial) e o formato:

| Rota | Kiro | OpenSpec |
|---|---|---|
| trivial | os cenários da ficha e o teste que acompanha a mudança | o mesmo |
| quick fatia | `requirements.md` da Quick Spec | o delta |
| quick bug | `bugfix.md` | o delta MODIFIED |
| completo | `requirements.md` e `design.md` | o delta e o `design.md` |

2. O delta já traz o texto aprovado dos requisitos: não leia o ELM.
3. Para cada cenário: pré-condição · passos · esperado (o "Então", com valores) · CT-nn. Não afrouxe o "Então".
   Entram também a repetição (rodar duas vezes) e o erro em um item, quando se aplicam.
4. Cenário sem CT-nn recebe o próximo CT-nn livre da fatia, citado no 🔎 para o autor levar à spec e ao teste.

## Saída

O roteiro de todos os cenários → passo `ambiente`.

## Pare se

- Sem cenário na ficha nem na spec → devolva "sem cenários: a ficha é da `sa-refinar.detalhar`" e pare.
