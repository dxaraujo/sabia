---
{"resumo": "Corpo da mensagem (MSG): só o texto, igual ao que aparece na tela; quando aparece fica na REG ou na EL que a cita."}
---
# Mensagem (MSG)

Uma mensagem que o sistema mostra. O corpo é só o texto, palavra por palavra como aparece na tela. O mesmo corpo
serve ao bloco do `prd.md` e ao arquivo de `elm/`.

```markdown
Não há vagas nesta turma. Você entrou na lista de espera e será avisado se uma vaga abrir.
```

- **Uma mensagem por MSG.** O título resume a situação (`MSG - Turma cheia`).
- **Quando aparece** fica na REG (Lógica) ou na EL (Estados, Informações adicionais) que cita a MSG; onde aparece na
  tela, na EL.
- **Reuso:** a mensagem que já existe no ELM é reusada pelo passo de similares, e não escrita de novo.
- Sem aspas: o corpo inteiro é a mensagem. Sem variável técnica; o dado variável vai entre `< >`
  (`<nome do evento>`).

## Checklist

- [ ] Diz o problema e o que fazer.
- [ ] Não culpa quem usa.
- [ ] Sem código de erro, nome de coluna ou jargão técnico.
- [ ] Igual ao texto da tela (protótipo aprovado, quando houver).
