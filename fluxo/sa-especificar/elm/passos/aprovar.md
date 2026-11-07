---
{"resumo": "Quem tem especificador vê a diferença de cada arquivo contra o commit de base e aprova arquivo por arquivo, com a linha Aprovado no topo."}
---
## Entrada

Os arquivos de `elm/` editados ou sincronizados e o `equipe.json`.

## Faça

1. **Papel.** Só quem tem `especificador` no `equipe.json` aprova.
2. **Mostrar.** Para cada arquivo, `git diff <commit de base> -- <arquivo>` (o novo, inteiro) e pergunte "aprova
   `<arquivo>`? (sim | ajuste: <o quê>)".
3. **Sim.** A linha `**Aprovado:** <usuario> · <AAAA-MM-DD>` logo abaixo do título. Quando todos os da sessão
   responderam, o commit é o do passo `gravar` (`FT-nnn elm: aprova <ids>`).
4. **Ajuste.** O pedido volta ao passo `editar`.

## Saída

Aprovados → passo `gravar`. Ajuste → passo `editar`.

## Pare se

- Sem a booleana `especificador` → liste os especificadores do `equipe.json` e pare; os arquivos ficam editados, sem
  aprovação.
