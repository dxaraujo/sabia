---
{"resumo": "Escreve o pitch.md de uma página na pasta do épico, com as perguntas pela sa-entrevistar e o vigente do bundle; regra sem fonte fica em aberto."}
---
## Entrada

O épico `a-moldar` (linha e `obs`; o `veio de FT-nnn` traz a ficha de origem) e o `pitch.md`, se já existe.

## Faça

1. **Pasta.** `.sabia/planejamento/epicos/EP-nn-<slug>/` nasce aqui, com o `pitch.md` pelo padrão
   `sa-refinar/pitch.md` e a linha `**Aprovado:** —` no topo. Na retomada, siga do que já está escrito.
2. **Seções**, em uma página: Problema · Limite de investimento (`<n> semanas`) · Solução em traços · Riscos · Não objetivos ·
   Decisões (as tomadas antes do go) · Em aberto (pergunta · para quem · bloqueia) · Decisão (vazia até o passo
   `decisao`).
3. **Perguntas** pela `sa-entrevistar.entrevistar`: até 5 por rodada, cada uma com a recomendação; os fatos do código
   ela busca pela `sa-pesquisar`. Regra sem fonte fica em Em aberto.
4. **Vigente**: specs arquivadas, depois o bundle (`docs/elm/<pa>/`). Sem bundle, ofereça a `sa-elm.baixar`. Bundle
   desatualizado (`sincronizado_em` anterior à última `Publicação: publicada`): mostre a data e pergunte se baixa. A
   resposta não trava o pitch.
5. **Dúvida que só o cliente resolve**: ofereça a `sa-especificar.prototipo`, que devolve aqui.

## Saída

O `pitch.md` escrito → passo `decisao`. A gravação vem depois da decisão, num commit só; sem decisão nesta sessão,
o pitch grava sozinho (`EP-nn pitch`).

## Pare se

Nenhuma condição própria: pergunta sem resposta fica em Em aberto.
