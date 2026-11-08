---
{"resumo": "Formato do research.md da fatia, escrito pela sa-plano com os fatos devolvidos pela sa-pesquisar (curto na rápida)."}
---
```markdown
# Pesquisa — FT-<nnn> <título>

## Perguntas e respostas
1. <pergunta> → <fato> (`caminho/arquivo.ext:42`, `:88-97`)

## Fluxo atual
<ponto de entrada → … → dado, com arquivo:linha em cada passo>

## Análogos
| Funcionalidade | Arquivos | O que imitar |
|---|---|---|

## Reaproveitar
| Componente | Onde | Para quê |
|---|---|---|

## Dados
<tabelas e colunas reais, índices e chaves; só a consulta e a contagem, nunca dado real>

## Testes
<onde estão, como rodar só eles (Comandos do sabia.md), o que já cobrem, fixtures a usar>

## Documentação × código
- <sigla>-<id> × `arquivo:linha` — <divergência>

## Restrições e riscos
<concorrência, volume, transação, dependências externas, DDL necessária>

## Não encontrado
<o que foi procurado e não existe — evita que o plano invente>
```

Seção sem conteúdo leva `Não se aplica.`. Na rápida, curto: só as seções que a fatia usa têm conteúdo. Nada de
opinião nem solução: só fatos com `arquivo:linha`, como a pesquisa devolveu.
