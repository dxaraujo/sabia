---
{"resumo": "Copia para o delta, sem reescrever, o texto completo de cada requisito tocado, com id, ação e versão lida."}
---
## Entrada

O Cobre da ficha (`<sigla>-<id>` · inclui | altera | exclui · versão lida), os arquivos aprovados de `elm/` (com
ELM) ou a spec viva com as regras aprovadas da ficha (sem ELM).

## Faça

1. Para cada requisito tocado, copie o texto completo, sem reescrever, com `<sigla>-<id>`, a ação e a versão lida.
   Fonte: com ELM, o arquivo aprovado em `elm/`; sem ELM, o vigente da spec viva com as regras aprovadas da ficha,
   sem mudar o sentido.
2. OpenSpec: `specs/<cap>/spec.md` com `## ADDED Requirements` (inclui), `## MODIFIED Requirements` (altera) e
   `## REMOVED Requirements` (exclui, com Reason e Migration).
3. Kiro: `requirements.md` (no bug da quick, `bugfix.md`, seção Requisitos tocados) com o bloco completo de cada
   requisito e a linha `**Ação:**`.
4. O formato de cada um está no padrão `sa-plano/plano.md`.
5. Delta já existe (sincronização da especificação manual) → mantenha o texto e só o ponha no arquivo da rota.
6. Quem desenvolve acha que o texto precisa mudar → Em aberto ao especificador; não edite.

## Saída

Delta com o texto aprovado → passo `escrever`.

## Pare se

- Cobre com requisito sem texto aprovado (volta ao passo `texto-aprovado`).
