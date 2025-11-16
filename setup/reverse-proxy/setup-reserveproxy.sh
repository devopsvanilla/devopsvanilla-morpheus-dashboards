#!/bin/bash

# Diretório de backups local
BACKUP_DIR="./bkp"
TIMESTAMP=$(date +%Y%m%d%H%M)

# Garante diretório de backup
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
fi

# Variáveis principais
EXTERNAL_PROXY_CONF="/etc/nginx/sites-available/superset-proxy"
MORPHEUS_INTERNAL_CONF="/opt/morpheus/embedded/nginx/conf/sites-available/morpheus.conf"

# Backup dos arquivos existentes antes de sobrescrever
if [ -f "$EXTERNAL_PROXY_CONF" ]; then
  cp "$EXTERNAL_PROXY_CONF" "$BACKUP_DIR/$(basename "$EXTERNAL_PROXY_CONF").${TIMESTAMP}.bkp"
  echo "Backup criado: $BACKUP_DIR/$(basename "$EXTERNAL_PROXY_CONF").${TIMESTAMP}.bkp"
fi
if [ -f "$MORPHEUS_INTERNAL_CONF" ]; then
  cp "$MORPHEUS_INTERNAL_CONF" "$BACKUP_DIR/$(basename "$MORPHEUS_INTERNAL_CONF").${TIMESTAMP}.bkp"
  echo "Backup criado: $BACKUP_DIR/$(basename "$MORPHEUS_INTERNAL_CONF").${TIMESTAMP}.bkp"
fi

# Conteúdo para o proxy reverso externo
read -r -d '' EXTERNAL_PROXY_CONF_CONTENT << EOF
server {
    listen 8001 ssl;
    server_name localhost;

    ssl_certificate /etc/morpheus/ssl/morpheus-dev.loonar.dev.crt;
    ssl_certificate_key /etc/morpheus/ssl/morpheus-dev.loonar.dev.key;

    location /superset/ {
        proxy_pass https://superset-morpheus-container-poc.loonar.dev/;

        proxy_set_header Host superset-morpheus-container-poc.loonar.dev;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Port \$server_port;
        proxy_set_header Cookie \$http_cookie;
        proxy_set_header Authorization \$http_authorization;
        proxy_set_header Referer "https://superset-morpheus-container-poc.loonar.dev/";

        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;

        proxy_ssl_server_name on;

        more_clear_headers Content-Security-Policy;
        more_clear_headers Content-Security-Policy-Report-Only;
        more_clear_headers Feature-Policy;

        more_set_headers "Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline';";

        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    }
}
EOF

# Conteúdo para o proxy reverso interno Morpheus embutido
read -r -d '' MORPHEUS_INTERNAL_CONF_CONTENT << EOF
location /superset/ {
    proxy_pass https://127.0.0.1:8001/superset/;

    proxy_set_header Host localhost;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header X-Forwarded-Port \$server_port;
    proxy_set_header Cookie \$http_cookie;

    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_buffering off;

    proxy_hide_header Content-Security-Policy;
}
EOF

echo "Configurando proxy reverso externo no NGINX (/etc/nginx/sites-available/superset-proxy)..."
echo "$EXTERNAL_PROXY_CONF_CONTENT" | sudo tee "$EXTERNAL_PROXY_CONF" > /dev/null

echo "Configurando proxy reverso interno no NGINX embutido Morpheus (/opt/morpheus/embedded/nginx/conf/sites-available/morpheus.conf)..."
echo "$MORPHEUS_INTERNAL_CONF_CONTENT" | sudo tee "$MORPHEUS_INTERNAL_CONF" > /dev/null

echo "Ativando sites e verificando sintaxe NGINX..."

# Ativando link simbólico para o superset-proxy (se necessário)
if [ ! -L /etc/nginx/sites-enabled/superset-proxy ]; then
    sudo ln -s "$EXTERNAL_PROXY_CONF" /etc/nginx/sites-enabled/
fi

# Reiniciar ou reload NGINX externo para aplicar
sudo systemctl reload nginx

# Reiniciar ou reload NGINX embutido Morpheus
sudo systemctl restart morpheus-embedded-nginx || echo "Verifique o serviço NGINX embutido do Morpheus manualmente"

echo "Configuração do proxy reverso externo e interno concluída."
