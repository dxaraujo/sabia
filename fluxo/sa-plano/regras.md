---
{"resumo": "Regras comuns aos fluxos da sa-plano."}
---
# Regras comuns da `sa-plano`

Leia antes: `.sabia/sabia.md` (Projeto, Especificação, Comandos, Regras aprendidas) e o `.sabia/config/agentes.json`
(`formato_spec`, `elm`). Sem o `.sabia/sabia.md` → ofereça a `sa-setup.configurar` e pare.

- O texto do requisito é do refinamento: o plano copia o aprovado para o delta e nunca o reescreve. Texto que precisa
  mudar vira Em aberto ao especificador.
- Nunca invente regra, valor ou ator. Regra sem decisão fica Em aberto ao P.O. e para só o que depende dela.
- Plano curto: quem aprova lê tudo numa sentada. Seção fixa sem conteúdo leva `Não se aplica.`.
- Tudo na branch `<id>`, no MR do código: não há MR de spec separado.
- No autopilot: sem perguntas; a decisão técnica vai pela recomendada e fica registrada; o arquitetural, o
  irreversível e a falta de aprovação devolvem à pessoa.
