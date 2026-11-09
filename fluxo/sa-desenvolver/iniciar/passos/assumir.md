---
{"resumo": "Assumir a tarefa num passo só: quem pega confirma o tamanho, a trilha e a autonomia da codificação."}
---
## Entrada

O item conferido, a ficha (Regras, Cenários `CT-nn`, artefatos afetados) e o código do trecho tocado.

## Faça

**Volta da virada** (branch `<id>` publicada): tamanho, trilha e autonomia são os já escolhidos (Trilha e Autonomia do
`status.md`; no trivial, sem `status.md`, confirme só a autonomia): mostre e siga.

Senão, leia o código do trecho tocado e mostre, de uma vez, as três escolhas com a recomendação; quem pega confirma ou
corrige:

1. **Tamanho**: o triado (`P` = horas · `M` ≈ 1 dia · `G` = 2–3 dias, linha Tamanhos do `acordos.md`). O corrigido
   vai à linha do `backlog.md` no commit da posse.
   - **Maior que G** → vira épico, sem branch: pelo passo `gravar`, nasce a linha `EP-nn` (tipo `épico`, status
     `a-moldar`, `obs` `veio de FT-nnn`) e a FT fica `cancelada` com `obs` `virou EP-nn`, num commit só. Com ELM,
     ofereça cancelar a tarefa (`sa-elm.finalizar`). Ofereça "seguir para o pitch?" e termine.
2. **Trilha**:
   - `trivial` — mudança pequena sem artefatos afetados: nenhum arquivo de spec, tudo no MR;
   - `rapida` — mudança média, ou com artefatos afetados;
   - `completo` — desenho novo ou risco.
   Com artefatos afetados a trilha nunca é `trivial`: o delta é obrigatório.
3. **Autonomia** (quem codifica), gravada com o mesmo nome:
   - `IA supervisionada` — o `sa-desenvolvedor` na sessão da pessoa;
   - `IA autopilot` — o `sa-desenvolvedor` como subagente na worktree `.sabia/local/wt/<id>`;
   - `manual` — só a geração do código-fonte é da pessoa; `status.md`, branch e plano seguem como sempre.
   A autonomia vale até o fim da tarefa: não troca no meio.

## Saída

Tamanho, trilha e autonomia confirmados → passo `posse`.

## Pare se

- Maior que G: vira épico (a saída passa ao pitch).
- Quem pega não confirma as escolhas → pare sem gravar nada.
