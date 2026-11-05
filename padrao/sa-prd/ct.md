---
{"resumo": "Corpo do caso de teste planejado (CT): o que comprova, a história e o cenário de origem, pré-condições, passos e resultado esperado, nascido da HF no lote do PRD ou da [ESP] FT e aprovado com ele (o envelope OKF fica no okf-elm.md da sa-prd)."}
---
# Caso de teste planejado (CT)

**Caso de teste planejado (CT)** — como se prova um cenário de uma história, escrito antes do código. Nasce da HF
no lote do PRD (`sa-prd.prd.escrever`) ou, da HF que a fatia altera ou inclui, no da `[ESP] FT`
(`sa-especificar.fatia.escrever`), um por cenário da HF, e é aprovado com os demais (GATE do PRD ou aprovação da
`[ESP] FT`). Pela linha **Casos de teste** da seção ELM do `sabia.md`: `ETM` → sobe ao ETM na publicação, na
conclusão da `[ESP]` (a do épico ou a da fatia), ligado à história; `CSV` → fica no repositório. A execução é da verificação da fatia, que grava no
`CT.csv` (padrão `sa-verificar/ct-csv.md`) a evidência de cada CT planejado que a fatia cobre.

```markdown
**Objetivo:** <o que o caso comprova> · **História:** [HF-01 <nome>](HF-01-<slug>.md) · cenário 1.2 ·
**Regras:** [REG-01 <nome>](REG-01-<slug>.md)

## Pré-condições
- <estado antes: a massa que o cenário pede, só com dado fictício>

## Passos
1. <executar: ação na tela, chamada, job> com <entradas>
2. <verificar em: resposta, consulta, log, tela>

## Resultado esperado
- <o "Então" do cenário, com valores>

## Relações
- <verifica, com link — só local>
```

- **Um cenário, um CT:** o cenário da HF que ele prova, pelo número; a HF não muda por causa do CT. Cenário que
  muda (mudança do PRD ou `[ESP] FT`) → o CT dele volta a `draft` no mesmo lote.
- **Resultado esperado igual ao "Então"** do cenário, com os mesmos valores; nada que o cenário não diga.
- **Sem caminho de arquivo, classe nem SQL:** como chegar ao estado e onde ver o resultado vêm do plano da fatia; aqui,
  o comportamento.
- **Só dado fictício** nos exemplos e na massa descrita.
- **Envelope:** `type` = o tipo de artefato de teste do ETM (coluna Tipo da linha `CT.csv` da seção ELM do
  `sabia.md`; padrão `Caso de Teste`); `title: CT<nn> - <título do cenário>`; `sources` com o PRD e a HF; sem `tags`
  (não vai ao DOORS Next).
- Seção sem conteúdo → `não se aplica` (não apague a seção).
