---
name: sa-setup
description: "Wizard that installs or updates the Sabiá flow in a project, in the default session (it writes the harness the sa-* agents deny). configurar is one sequence for first setup and updates: detects targets (Kiro, opencode), project, build and test commands, git base, GitLab and the read-only database tool; decides formato_spec (Kiro or OpenSpec); asks 'usa ELM?' and applies what sa-elm.setup returns; writes .sabia/sabia.md (Projeto and Comandos merged), .sabia/config/agentes.json, the product folder, backlog.md and the MR template, and generates the 5 agents (sa-desenvolvedor, sa-especificador, sa-pesquisador, sa-revisor, sa-verificador) for opencode and Kiro. customizar swaps, inserts or removes a step or swaps a template in .sabia/fluxo and .sabia/template, shows what changed and undoes it. Use when the user says \"configurar o Sabiá\", \"atualizar a configuração do Sabiá\", \"regenerar os agentes\", \"ligar o toolkit\", \"customizar o passo …\", \"trocar o template …\", \"o que este projeto mudou?\", \"descustomizar …\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.1.19"
---

# sa-setup — Configurar o Sabiá no projeto
