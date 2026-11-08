---
{"resumo": "Quem tem especificador vê a diferença de cada arquivo contra o commit de base e aprova arquivo por arquivo, com status: stable e verified no frontmatter."}
---
## Entrada

Os arquivos de `elm/` editados ou sincronizados e o `equipe.json`.

## Faça

1. **Papel.** Só quem tem `especificador` no `equipe.json` aprova.
2. **Conferir.** Antes de mostrar, confira cada arquivo pelo Checklist do padrão do tipo (o do Sabiá, ou o do toolkit
   que desvia o tipo); achado de forma, corrija; de negócio, Em aberto.
3. **Mostrar.** Para cada arquivo, `git diff <commit de base> -- <arquivo>` (o novo, inteiro) e pergunte "aprova
   `<arquivo>`? (sim | ajuste: <o quê>)".
4. **Sim.** No frontmatter, `status: stable` e `verified: {by: human:<usuario>, at: <AAAA-MM-DD>}`. Quando todos os da sessão
   responderam, o commit é o do passo `gravar` (`FT-nnn elm: aprova <ids>`).
5. **Ajuste.** O pedido volta ao passo `editar`.

## Saída

Aprovados → passo `gravar`. Ajuste → passo `editar`.

## Pare se

- Sem a booleana `especificador` → liste os especificadores do `equipe.json` e pare; os arquivos ficam editados, sem
  aprovação.
