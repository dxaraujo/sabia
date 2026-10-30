#!/bin/sh
# Sabiá — backpressure do projeto: compila, testa, roda o lint e a cobertura com o gate. Sai com erro no primeiro
# que falhar. Instalado pela sa-setup em .sabia/verificar.sh, com os comandos da seção Comandos do .sabia/sabia.md
# (mudou → rode a setup; nenhum agente pode alterá-lo). A sa-codificar roda este script antes de cada commit e não
# comita com ele vermelho; o revisor roda de novo na rubrica C.
#
# Uso (da raiz do repositório ou da worktree da fatia):
#   sh .sabia/verificar.sh
set -eu

{{COMANDOS}}

echo "verificar.sh: ok"
