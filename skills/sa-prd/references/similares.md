# Similares no ELM (antes de criar um requisito — só leitura)

Chamado pela `sa-prd`, pela `sa-triar` (artefatos afetados da ficha de toda fatia sem épico), pela `[ESP] FT`
(`sa-especificar.fatia.artefatos`) e pela publicação de um conceito novo. Não pede confirmação. Entrada: por
artefato proposto, a sigla (todo tipo do [catálogo](../../sabia/references/tipos.md) com ELM, fora a `ATA` e os
pendentes), o título provisório e 3–6 palavras-chave do domínio (termos do glossário, sinônimos da entrevista,
atores, valores). Leiaute (`EL`, só com a linha Telas = `sim`): o título é o nome
da tela e as palavras-chave, os rótulos dos campos e das ações do protótipo aprovado.

1. **Bundle** (pasta `rm.download` do `pa`), pelo `elm_buscar_req_local`: um pelo título e um por palavra-chave
   (sem bundle baixado → erro `nao_encontrado` campo `bundle`: diga isso, ofereça a `sa-sync` e siga só no passo 2).
   A data do bundle é o `sincronizado_em` (a data) que o `elm_buscar_req_local` devolve; sem o campo, a do último
   commit da `sa-sync` na base, `git log -1 --format=%cs --grep='^ELM - Sincronizar bundle'`; sem os dois, `sem data`.
2. **Ao vivo:** `elm_buscar_req(texto)` pelo título e por palavra-chave, filtrando o resultado pelos tipos das
   siglas do `pa`. Sem o MCP `elm` → só o bundle, e a saída diz `ao vivo: pendente`.
3. **Classifique** cada acerto (corpo pelo `elm_ler_req_local` ou `elm_ler_req`): **igual** (mesmo comportamento,
   mesma regra com o mesmo valor, mesmo termo) · **sobrepõe** (parte do comportamento, mesma regra com outro valor,
   mesmo termo com outra definição) · **relacionado** (mesmo assunto, comportamento diferente). Só palavra em comum
   → descarte.
4. **Impacto** — por acerto `sobrepõe` e por existente que quem chamou já marcou `altera` ou `exclui`, quem o cita
   (`elm_ler_req_local(id).links.entrada`): a HF que embute a REG, o CT da HF, a EL da tela. Cada um vai à saída como
   `impacto` — `<id> (<sigla>) <rel>`, com `rel` = o campo `rel` da entrada, como veio; vários separados por ` · `; sem
   impacto, `—` —, para quem chamou rever se muda.
5. **Saída**, um bloco por artefato:

   ```
   🔎 Similares no ELM — <EP-nn | FT-nnn> · bundle de <data | sem data> · ao vivo: <sim | pendente>
   | Proposto | No ELM (id · título · tipo · pasta) | Relação | Recomendação | Impacto |
   |---|---|---|---|---|
   | REG-01 Limite de tentativas | 2101 · REG - Tentativas de login · Regra · 04-Regras | sobrepõe | alterar 2101 | 1890 (HF) cita |
   ```

   **igual → reutilizar** (HF embute a REG existente, cita a HF e a EL da mesma tela, linka o termo pelo id) · **sobrepõe → alterar** o
   existente (caminho "Alteração" do passo `sa-prd.prd.escrever`), ou **excluir** o que a proposta substitui (caminho
   "Exclusão") · **relacionado → criar novo**, citando o existente em `## Relações` · **nenhum → criar novo**
   (`novo (verificado <data>)`). A decisão é da pessoa.
