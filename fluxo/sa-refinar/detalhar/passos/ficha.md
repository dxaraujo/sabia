---
{"resumo": "Grava a ficha pelo padrão, confere a DoR e muda a linha para pronta quando ela fecha; senão o item fica aceita."}
---
## Entrada

O que os passos anteriores levantaram: regras, cenários, Não muda, artefatos afetados, Especificação, Em aberto e Decisões.

## Faça

1. **Ficha** `.sabia/planejamento/fatias/FT-nnn-<slug>.md`, pelo padrão `sa-refinar/ficha.md`: título, a linha
   Aprovado, o cabeçalho (Tipo · Pai · Especificação) e as seções Entrada · Objetivo · Regras · Cenários · Não
   muda · Artefatos afetados · Em aberto · Decisões · DoR. Seção vazia fica só com o título.
2. **DoR** (avisa, não trava): marque cada item do checklist do padrão.
3. **Aprovação**: só quem tem `produto` aprova; mostre a ficha e peça o "sim". Aprovado →
   `**Aprovado:** <usuario> · AAAA-MM-DD`. Qualquer mudança depois do Aprovado volta a linha para `**Aprovado:** —`
   até a nova aprovação. Sem essa pessoa na sessão: mostre os nomes com `produto`.
4. **Linha**: DoR completa → status `pronta`. Senão, fica `aceita`; a `pronta` que perde um item da DoR volta a
   `aceita`. O tamanho se atualiza se mudou.
5. Ficha e linha vão num commit: `backlog: refinamento FT-nnn`.

## Saída

A ficha e a linha prontas para gravar → passo `commit-na-branch-base`.

## Pare se

Nenhuma condição própria: DoR incompleta só deixa o item `aceita`.
