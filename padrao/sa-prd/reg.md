---
{"resumo": "Corpo da regra (REG): um enunciado testável, com valores e a fonte; com REG com dados técnicos = sim, a seção Dados."}
---
# Regra (REG)

Um enunciado testável, com valores. O mesmo corpo serve ao bloco do `prd.md` e ao arquivo de `elm/`.

```markdown
Após **3** tentativas inválidas em **15 minutos**, a conta fica **Bloqueada** por **30 minutos**.

**Fonte:** D-<nn> | ATA-<nn> [mm:ss] | <sigla>-<id>

## Dados   <!-- só com REG com dados técnicos = sim no sabia.md -->

| Entidade · tabela | Campo | Leitura ou gravação | Origem |
|---|---|---|---|
| <CONTA> | <SITUACAO> | gravação | D-<nn> |
```

- Uma regra por bloco, com a fonte. Sem fonte, a regra não entra: vai ao Em aberto.
- A seção Dados só existe com a linha REG com dados técnicos = `sim` na seção Especificação do `.sabia/sabia.md`;
  só nela os nomes técnicos entram, na forma original.
