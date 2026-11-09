---
{"resumo": "Grava a ficha pelo template, confere a DoR e muda a linha para elegível quando ela fecha; senão o item fica aceita."}
---
## Entrada

O que os passos anteriores levantaram: regras, cenários, Não muda, artefatos afetados, Especificação, Em aberto e Decisões.

## Faça

1. **Ficha** `.sabia/planejamento/fatias/FT-nnn-<slug>.md`, pelo template `sa-refinar/ficha.md`: título, a linha
   Aprovado, o cabeçalho (Tipo · Pai · Especificação) e as seções Entrada · Objetivo · Regras · Cenários · Não
   muda · Artefatos afetados · Em aberto · Decisões · DoR. Seção vazia fica só com o título.
2. **DoR** (avisa, não trava): marque cada item do checklist do template. Requisito que Regras, Decisões ou Não muda
   dizem mudar não convive com `nenhum requisito`: deixe o item sem marcar e mostre a divergência.
3. **Aprovação**: mostre a ficha e peça o "sim" de quem tem `produto` → `**Aprovado:** <usuario> · AAAA-MM-DD`. Quem não
   tem a booleana grava com a anuência de quem tem: pergunte o nome, que precisa ter `produto` no `equipe.json`, e nunca
   presuma → `**Aprovado:** <usuario> · AAAA-MM-DD · anuência de <usuario com produto>`. Sem nenhum dos dois: mostre os
   nomes com `produto`. Mudança em Objetivo, Regras, Cenários, Não muda ou Decisões, ou artefato afetado novo, volta a linha
   para `**Aprovado:** —` até a nova aprovação. DoR, linha Especificação, versão de referência e Em aberto resolvido sem
   mudar regra não tiram o Aprovado.
4. **Linha**: DoR completa → status `elegivel`. Senão, fica `aceita`; a `elegivel` que perde um item da DoR volta a
   `aceita`. O tamanho se atualiza se mudou.
5. Ficha e linha vão num commit: `backlog: refinamento FT-nnn`.

## Saída

A ficha e a linha elegíveis para gravar → passo `commit-na-branch-base`.

## Pare se

Nenhuma condição própria: DoR incompleta só deixa o item `aceita`.
