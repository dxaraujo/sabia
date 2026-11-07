---
{"resumo": "Inventário de skills e toolkits; liga desvios de passo e de tipo aos agentes pelo papel."}
---
## Entrada

Os tipos do projeto.

## Faça

Siga o [toolkits.md](~/.sabia/framework/skills/sa-setup/references/toolkits.md): procure toolkits e skills
avulsas (exceto `sabia` e `sa-*`) e mostre o cartão W5 com nome, para quê, origem, toolkit e papéis.

1. `skills[].papeis` e `steering[].papeis` mapeiam 1:1 para os agentes: desenvolvedor → `sa-desenvolvedor`,
   especificador e produto → `sa-especificador`, pesquisador → `sa-pesquisador`, revisor → `sa-revisor`, verificador
   → `sa-verificador`.
2. Tipos HF, REG, EL e GL vão ao `sa-especificador`; a ET as-built, ao `sa-desenvolvedor`; as rubricas, ao
   `sa-revisor`; o texto `verificacao`, ao `sa-verificador`.
3. Os desvios usam ids de passo (ex.: `sa-desenvolver.codificar.tarefa`) e vão ao prompt do agente que roda a skill
   do passo. `passo` num passo sem desvio → ❌, e a skill não é ligada.
4. Liste também os agentes do projeto (fora os `sa-*`) com o "para quê": são oferecidos no passo `perfis`.
5. Mostre o bloco Fluxos (W5-F): o que o projeto customizou em `.sabia/fluxo/` e `.sabia/padrao/`.

## Saída

→ passo `perfis`.

## Pare se

- Toolkit nunca é ligado sem o "sim" da pessoa.
