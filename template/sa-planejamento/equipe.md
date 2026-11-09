---
{"resumo": "Exemplo do .sabia/planejamento/equipe.json, validado pelo equipe.schema.json da sa-planejamento."}
---
```json
{
  "$schema": "https://dxaraujo.github.io/json-schemas/sabia/equipe.schema.json",
  "membros": [
    {"nome": "Ana Souza", "usuario": "ana.souza", "elm_login": "asouza", "desenvolvedor": true, "especificador": false,
     "produto": false, "horas_semana": 40, "ausencias": [{"inicio": "2026-12-22", "fim": "2026-12-31"}], "ativo": true},
    {"nome": "Bia Lima", "usuario": "bia.lima", "desenvolvedor": false, "especificador": true, "produto": true,
     "horas_semana": 30, "ausencias": [], "ativo": true}
  ]
}
```

- `usuario` = usuário do GitLab: autor do MR, `@dono` no CODEOWNERS, `<usuario>` do CSV de créditos, e o valor de
  responsável, relator e `Aprovado:`.
- `elm_login` é opcional e só a `sa-elm` lê.
- Booleanas: `desenvolvedor` (puxa para desenvolvimento, revisa MR de outro autor) · `especificador` (aprova `elm/`,
  publica no ELM) · `produto` (decisão de investimento, ordena, aprova pitch, PRD e ficha). Cadastro, triagem e revisão humana: qualquer pessoa.
- `ativo: false` = saiu do time; a pessoa nunca é apagada.
