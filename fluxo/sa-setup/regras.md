---
{"resumo": "Regras comuns aos fluxos da sa-setup."}
---
# Regras comuns da `sa-setup`

Roda na **sessão sem agente** da ferramenta (Kiro ou opencode, sem agente `sa-*`): grava o harness que os agentes negam
(`.kiro/agents`, `.kiro/settings`, `.kiro/steering/sabia.md`, `.opencode`, `opencode.json`, `.sabia/config`,
`.sabia/fluxo`, `.sabia/padrao`). Dentro de um agente `sa-*` → diga para abrir a sessão sem agente e pare.

- **Voz do wizard:** português do Brasil em tudo que a pessoa lê, qualquer que seja o idioma da ferramenta. Entre
  uma ferramenta e outra, no máximo uma linha `🔎 <o que está fazendo>…`. Toda mensagem é um cartão de
  [wizard.md](~/.sabia/framework/skills/sa-setup/references/wizard.md), copiado como está; sem o `wizard.md` → diga
  que a instalação está incompleta (`npx sabia atualizar`) e pare.
- **Uma pergunta por mensagem**, no fim. Tabela que a pessoa pode mudar tem linhas numeradas: ela responde `ok` ou
  `<n>: <novo valor>`. Resposta ambígua → repita o que entendeu e pare.
- **Padrão primeiro:** o que se detecta ou tem padrão vai no cartão com a fonte (🔍 detectado · 📐 padrão · 🙋 você ·
  🧩 ELM) e uma confirmação. Pergunte só o que não tem padrão. Não achou → pergunte onde está; nunca conclua "não há".
- **Status honesto:** ✅ só com resposta real; sem rede, sem credencial ou não rodado → ⏸️ com o motivo. Não suponha
  rede: teste cada serviço e diga qual respondeu.
- **Shell da pessoa** (`echo $SHELL`): em `fish`, comando composto vai em `bash -c '<comando>'`.
- **Caminhos nos arquivos gerados**, sempre relativos: do projeto, à raiz; do usuário, ao home (`~/…`); separador `/`.
- Nunca leia nem mostre credencial (conferir se o arquivo existe é permitido).
- **Onde escreve:** `.sabia/sabia.md`, `.sabia/config/agentes.json`, `.sabia/fluxo/`,
  `.sabia/padrao/`, `.sabia/planejamento/` (as pastas e o `backlog.md`), `.kiro/steering/sabia.md`, `.kiro/agents/`,
  `.opencode/agents/`, as `instructions` do `opencode.json`, `.gitlab/merge_request_templates/Default.md` (só se não
  existir), `.gitignore` e `.gitattributes`.
- **Onde não escreve:** `.sabia/config/elm/` (é da `sa-elm.setup`), `.sabia/local/`, `CODEOWNERS` (só sugere),
  `equipe.json` e `acordos.md` (são da `sa-planejamento.inicial`). Nunca copie skills para o projeto: elas são
  compiladas na pasta do usuário pelo `sabia instalar`.
- Nada que a ferramenta carrega é gravado sem o "ok" do cartão que o mostra. Em atualização, mostre o diff de cada
  arquivo que muda. Recusa de uma confirmação da ferramenta → diga o que ficou de fora e ofereça regravar.
- Os agentes saem só do gerador ([agentes.md](~/.sabia/framework/skills/sa-setup/references/agentes.md)): nunca os
  edite à mão.
