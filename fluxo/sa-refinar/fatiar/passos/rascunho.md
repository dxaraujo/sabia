---
{"resumo": "Lê o PRD, pede à sa-pesquisar os fatos do código tocado e monta a tabela de fatias verticais com artefatos afetados, tamanho e dependência."}
---
## Entrada

O `prd.md` aprovado do épico (requisitos, cenários e Decisões), na base.

## Faça

1. **Fatos.** Peça à `sa-pesquisar.pesquisar` (subagente `sa-pesquisador`), com o `prd.md` e a lista provisória, duas
   respostas: onde entra o gatilho do PRD e que módulos cada fatia toca. Os fatos voltam na resposta; nada é gravado.
2. **Tabela**, com ids provisórios:

   ```
   | F | Título (comportamento) | Artefatos afetados | Tam. | Depende de |
   |---|---|---|---|---|
   | F1 | Bloquear a conta após 3 tentativas inválidas | HF-EP03-01 · inclui · REG-2101 · altera | M | — |
   | F2 | Desbloquear sozinho após 30 minutos | REG-EP03-02 · inclui | P | F1 |
   ```

   Artefatos afetados: os requisitos do PRD que a fatia toca (`<sigla>-EPnn-nn` no novo, `<sigla>-<id do ELM>` no existente), com
   `inclui` · `altera` · `exclui`.
3. **Boa fatia.**
   - Vertical: atravessa entrada → regra → dado → saída. A primeira é a mais fina que prova o caminho inteiro, do
     gatilho do PRD até o que o ator observa; as seguintes engrossam.
   - Verificável sozinha: tem cenários do PRD que passam ao fim dela.
   - Cabe em G. Nem fina demais: "o que dá para demonstrar quando ela terminar?" — nada visível → junte com a
     vizinha.
   - Independente quando der: dependência só quando uma precisa do que a outra entrega.
4. **Cobertura.** Todo requisito do PRD fica em pelo menos uma fatia; todo cenário do PRD, em exatamente uma.
5. **Mesmo artefato.** Duas fatias que alteram o mesmo artefato existente ficam em sequência (Depende de), e o mesmo
   vale contra fatia aberta de outro épico que já tem esse artefato em `elm/`.

## Saída

A tabela com cobertura completa e a fatia ponta a ponta → passo `perguntar`.

## Pare se

Nenhuma condição própria: cobertura incompleta se corrige antes de mostrar.
