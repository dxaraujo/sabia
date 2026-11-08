---
{"resumo": "Assumir a tarefa num passo só: quem pega confirma o tamanho, a rota e o modo da codificação."}
---
## Entrada

O item conferido, a ficha (Regras, Cenários `CT-nn`, Cobre) e o código do trecho tocado.

## Faça

**Volta da virada** (branch `<id>` publicada): tamanho, rota e modo são os já escolhidos (Rota e Autonomia do
`status.md`; no trivial, sem `status.md`, confirme só o modo): mostre e siga.

Senão, leia o código do trecho tocado e mostre, de uma vez, as três escolhas com a recomendação; quem pega confirma ou
corrige:

1. **Tamanho**: o triado (`P` = horas · `M` ≈ 1 dia · `G` = 2–3 dias, linha Tamanhos do `acordos.md`). O corrigido
   vai à linha do `backlog.md` no commit da posse.
   - **Maior que G** → vira épico, sem branch: pelo passo `gravar`, nasce a linha `EP-nn` (tipo `épico`, status
     `a-moldar`, `obs` `veio de FT-nnn`) e a FT fica `cancelada` com `obs` `virou EP-nn`, num commit só. Com ELM,
     ofereça cancelar a tarefa (`sa-elm.finalizar`). Ofereça "seguir para o pitch?" e termine.
2. **Rota**:
   - `trivial` — mudança pequena com Cobre vazio: nenhum arquivo de spec, tudo no MR;
   - `rapida` — mudança média, ou com Cobre;
   - `completo` — desenho novo ou risco.
   Com Cobre não vazio a rota nunca é `trivial`: o delta é obrigatório.
3. **Modo** (quem codifica), gravado em Autonomia com o mesmo nome:
   - `IA supervisionada` — o `sa-desenvolvedor` na sessão da pessoa;
   - `IA autopilot` — o `sa-desenvolvedor` como subagente na worktree `.sabia/local/wt/<id>`;
   - `manual` — só a geração do código-fonte é da pessoa; `status.md`, branch e plano seguem como sempre.
   O modo vale até o fim da tarefa: não troca no meio.

## Saída

Tamanho, rota e modo confirmados → passo `posse`.

## Pare se

- Maior que G: vira épico (a saída passa ao pitch).
- Quem pega não confirma as escolhas → pare sem gravar nada.
