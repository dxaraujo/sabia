---
{"resumo": "Formato do rascunho.md do épico, o caderno do levantamento: o pedido, o levantamento por sessão, as dúvidas para a próxima reunião, as versões do protótipo e as pendências do ELM até o PRD ir à base (a triagem cria; a sa-especificar completa)."}
---
```markdown
# Rascunho — EP-<nn> <título>

## Pedido

<o pedido original, nas palavras de quem pediu, sem dado inventado>
Origem: <EWM <id> | chamado <n> | texto livre>

## Levantamento

### <AAAA-MM-DD>
- <o que o cliente contou; exemplo real só como resumo anônimo>

## Dúvidas

- <AAAA-MM-DD> · <pergunta para a próxima reunião> · <sessão | ATA-<nn> | D-<nn>>

## Protótipo

- Protótipo v<N> — <arquivos da versão> · <AAAA-MM-DD> · <o que muda | primeira versão> · aguardando o cliente

## ELM pendente

- ELM pendente [<chave>]: <o que falta>
- ELM feito [<chave>]: <o que foi feito> (<AAAA-MM-DD>)
```

- **Pedido** — da triagem (`sa-triar`), na pasta antecipada.
- **Levantamento** — uma subseção por sessão, com a data: o que o cliente contou e os exemplos. Decisão vai para o `decisoes.md` (`D-nn`), nunca só para cá. A sessão
  mais recente desta máquina não se lê daqui: é a última linha da seção Créditos do `status.md` do épico.
- **Dúvidas** — uma linha por dúvida para a próxima reunião, com a data e a origem (a sessão ou o passo
  `sa-especificar.reuniao.decisoes`).
- **Protótipo** — só com a linha Telas = `sim`: uma linha por versão registrada (passo `sa-especificar.prototipo.registrar`).
  Situação, fechada: `aguardando o cliente` · `ajuste` (a `v<N+1>` já registrada) · `ajuste — aguardando a v<N+1>` ·
  `aprovado — D-<nn>`.
- **ELM pendente** — as [pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências) do épico até o PRD ir
  à base; depois, no rodapé do `prd.md`. A pendência nunca é apagada: o `ELM feito` da mesma chave entra no mesmo lugar.
- Seção sem conteúdo → só o título.
