#!/bin/bash

# Carregar variáveis de ambiente
if [ -f .env ]; then
    source .env
else
    echo "Arquivo .env não encontrado. Copie .env-sample para .env e configure."
    exit 1
fi

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Solicitar credenciais ao usuário
read -p "Digite o usuário: " USER
read -s -p "Digite a senha: " PASS
echo ""

echo -e "${YELLOW}==== Autenticando no Morpheus para obter token ====${NC}"
RESPONSE=$(curl -s -k -X POST "$TOKEN_URL" \
    -H "accept: application/json" \
    -H "content-type: application/x-www-form-urlencoded" \
    --data-urlencode "username=$USER" \
    --data-urlencode "password=$PASS")

TOKEN=$(echo "$RESPONSE" | grep -oP '(?<="access_token":")[^"]+')

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Falha ao obter token.${NC}"
    echo "Resposta:"
    echo "$RESPONSE"
    exit 1
else
    echo -e "${GREEN}Token obtido com sucesso.${NC}"
fi

echo -e "${YELLOW}==== Verificando status do serviço NGINX externo ====${NC}"
systemctl is-active --quiet nginx && echo -e "${GREEN}NGINX está ativo${NC}" || echo -e "${RED}NGINX não ativo${NC}"

echo -e "${YELLOW}==== Testando sintaxe e configuração do NGINX ====${NC}"
sudo nginx -t

echo -e "${YELLOW}==== Verificando configuração proxy_pass no superset-proxy ====${NC}"
grep -A10 "location /superset/" /etc/nginx/sites-available/superset-proxy

echo -e "${YELLOW}==== Testando acesso via proxy reverso usando token (URL externa Morpheus) ====${NC}"
curl -s -k -i "$PROXY_TEST_URL" -H "Authorization: Bearer $TOKEN" | tee /tmp/proxy_response.txt | head -40

echo -e "${YELLOW}==== Verificando headers Content-Security-Policy e Feature-Policy na resposta ====${NC}"
grep -i "content-security-policy" /tmp/proxy_response.txt && echo -e "${GREEN}Header Content-Security-Policy presente.${NC}" || echo -e "${RED}Header Content-Security-Policy ausente.${NC}"
grep -i "feature-policy" /tmp/proxy_response.txt && echo -e "${GREEN}Header Feature-Policy presente.${NC}" || echo -e "${RED}Header Feature-Policy ausente.${NC}"

echo -e "${YELLOW}==== Exibindo últimas 20 linhas do log de erro do NGINX ====${NC}"
sudo tail -20 /var/log/nginx/error.log

echo -e "${YELLOW}==== Teste completo finalizado. Analise a saída para diagnóstico. ====${NC}"
