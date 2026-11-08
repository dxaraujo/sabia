---
{"resumo": "Regras comuns aos fluxos da sa-refinar: tudo direto na base, aprovação no documento, decisões de pessoas e o id estável."}
---
# Regras comuns da `sa-refinar`

Valem em todos os fluxos da skill.

Leia antes o `.sabia/sabia.md`. Sem ele, ofereça a `sa-setup` ("configurar o Sabiá") e pare. Formato do
`backlog.md`, status por tipo e convenções da `obs`: [backlog.md](~/.sabia/framework/skills/sa-triar/references/backlog.md).
Ficha da fatia e do bug: o padrão `sa-refinar/ficha.md`. Pitch do épico: o padrão `sa-refinar/pitch.md`.

- Qualquer pessoa conduz. Quem tem `produto` no `equipe.json` decide o go/kill, ordena e aprova pitch, ficha e
  fatias; quem tem `especificador` aprova os arquivos de `elm/`. Sem essa pessoa na sessão, mostre os nomes com a
  booleana e não grave a decisão.
- Linhas do `backlog.md`, pitch, ficha e arquivos de `elm/` vão direto na base, pela gravação comum, com a
  aprovação no topo do próprio documento: `**Aprovado:** <usuario> · AAAA-MM-DD`. Qualquer mudança depois do
  Aprovado volta a linha para `**Aprovado:** —` até a nova aprovação.
- Decisões vão na seção Decisões do documento (pitch antes do go, PRD depois, ficha na fatia), sempre em tabela
  `D-nn | Decisão | Por quê | Quem | Quando | Fonte`.
- O id nunca muda: vira épico, dividir e juntar criam linha nova pela captura comum, com `veio de <id>`, e a antiga
  fica `cancelada` com `virou <id>` quando sai.
- Item refinado segue editável até alguém puxar (status `em-andamento`). Dúvida grande vira spike, protótipo ou
  reunião, nunca épico; só o que passa de G vira épico.
