# Setup Reverse Proxy - Configuração do Proxy Reverso para Superset

## Propósito

Este script automatiza a configuração de um proxy reverso NGINX em dois níveis para integrar o Apache Superset ao Morpheus Data Appliance:

1. **Proxy Externo (NGINX do Sistema)**: Escuta na porta 8001 (SSL) e encaminha requisições para o Superset hospedado externamente
2. **Proxy Interno (NGINX Embutido Morpheus)**: Expõe o caminho `/superset/` e encaminha para o proxy externo na porta 8001

O objetivo é permitir que dashboards do Superset sejam integrados diretamente na interface do Morpheus, mantendo autenticação, contexto de segurança e evitando problemas com headers CSP ao incorporar conteúdo externo.

## Arquivos Alterados e Criados

### Arquivos de Configuração (Modificados)

#### 1. `/etc/nginx/sites-available/superset-proxy`
**Finalidade**: Configuração do proxy reverso externo NGINX que escuta na porta 8001 e encaminha requisições para o Superset.

**O que contém**:
- Listener SSL na porta 8001
- Configuração de proxy_pass para o domínio do Superset
- Headers necessários para manter sessão e autenticação
- Ajustes de Content-Security-Policy para permitir iframes
- Configurações SSL apropriadas

**Backup**: Se o arquivo já existir, é automaticamente copiado para `./bkp/superset-proxy.YYYYMMDDHHMM.bkp` antes de ser sobrescrito.

#### 2. `/opt/morpheus/embedded/nginx/conf/sites-available/morpheus.conf`
**Finalidade**: Configuração do proxy reverso interno do NGINX embutido do Morpheus que encaminha requisições de `/superset/` para o proxy externo.

**O que contém**:
- Location block `/superset/` que aponta para `https://127.0.0.1:8001/superset/`
- Headers para manter sessão e autenticação
- Configuração para ocultar Content-Security-Policy do backend

**Backup**: Se o arquivo já existir, é automaticamente copiado para `./bkp/morpheus.conf.YYYYMMDDHHMM.bkp` antes de ser sobrescrito.

#### 3. `/etc/nginx/sites-enabled/superset-proxy` (Link Simbólico)
**Finalidade**: Ativa a configuração do proxy externo no NGINX.

**O que é**: Link simbólico apontando para `/etc/nginx/sites-available/superset-proxy`.

**Backup**: Não recebe backup (é apenas um link, pode ser recriado facilmente).

### Diretório de Backup (Criado)

#### `./bkp/`
**Finalidade**: Armazena backups automáticos dos arquivos de configuração antes de cada execução do script.

**Formato dos arquivos**: `<nome-original>.YYYYMMDDHHMM.bkp`
- Exemplo: `superset-proxy.202411161430.bkp`
- Exemplo: `morpheus.conf.202411161430.bkp`

**Criação**: O diretório é criado automaticamente se não existir.

**Observação**: Este diretório está no `.gitignore` e não deve ser versionado (contém configurações do servidor).

## O que o Script Faz

1. **Cria backup automático**: 
   - Cria o diretório `./bkp` se não existir
   - Gera timestamp no formato `YYYYMMDDHHMM`
   - Faz backup de `/etc/nginx/sites-available/superset-proxy` se já existir
   - Faz backup de `/opt/morpheus/embedded/nginx/conf/sites-available/morpheus.conf` se já existir
   - Nomeia os backups como: `<arquivo-original>.YYYYMMDDHHMM.bkp`

2. **Configura proxy reverso externo**: 
   - Cria/sobrescreve `/etc/nginx/sites-available/superset-proxy`
   - Define listener SSL na porta 8001
   - Configura proxy_pass, headers e políticas de segurança

3. **Configura proxy reverso interno**: 
   - Cria/sobrescreve `/opt/morpheus/embedded/nginx/conf/sites-available/morpheus.conf`
   - Define location block que aponta para o proxy externo

4. **Ativa a configuração**: 
   - Cria link simbólico `/etc/nginx/sites-enabled/superset-proxy` (se não existir)

5. **Valida e reinicia serviços**:
   - Testa sintaxe do NGINX externo
   - Recarrega NGINX do sistema
   - Reinicia NGINX embutido do Morpheus

## Resultados Esperados

### Durante a Execução do Script

```
Backup criado: ./bkp/superset-proxy.202411161430.bkp
Backup criado: ./bkp/morpheus.conf.202411161430.bkp
Configurando proxy reverso externo no NGINX (/etc/nginx/sites-available/superset-proxy)...
Configurando proxy reverso interno no NGINX embutido Morpheus (/opt/morpheus/embedded/nginx/conf/sites-available/morpheus.conf)...
Ativando sites e verificando sintaxe NGINX...
Configuração do proxy reverso externo e interno concluída.
```

### Após a Execução

1. **Arquivos de Backup**:
   - Criados em `./bkp/` com timestamp único
   - Formato: `<arquivo-original>.YYYYMMDDHHMM.bkp`

2. **Arquivos de Configuração**:
   - `/etc/nginx/sites-available/superset-proxy` criado/atualizado
   - `/opt/morpheus/embedded/nginx/conf/sites-available/morpheus.conf` atualizado
   - `/etc/nginx/sites-enabled/superset-proxy` (link simbólico) criado

3. **Serviços**:
   - NGINX externo recarregado (sem downtime)
   - NGINX embutido Morpheus reiniciado

### Validação de Funcionamento

✅ **Sucessos esperados**:
- Acesso a `https://<morpheus-url>/superset/` redireciona para Superset
- Dashboards Superset carregam dentro de iframes no Morpheus
- Autenticação e cookies são preservados
- Sem erros de Content-Security-Policy no console do navegador
- Headers CORS configurados corretamente

❌ **Problemas comuns**:
- **404 Not Found**: Superset não acessível ou URL incorreta
- **502 Bad Gateway**: Proxy externo não consegue alcançar o Superset
- **SSL Certificate Error**: Certificados ausentes ou inválidos
- **CSP Errors**: Configuração de headers não aplicada corretamente

## Como Executar

### Pré-requisitos Antes da Execução
- Sistema Linux com permissões sudo
- NGINX instalado e configurado
- Morpheus Data Appliance instalado
- Certificados SSL em `/etc/morpheus/ssl/`:
  - `morpheus-dev.loonar.dev.crt`
  - `morpheus-dev.loonar.dev.key`

### Passos para Execução

1. **Navegue até o diretório**:
   ```bash
   cd /caminho/para/setup/reverse-proxy
   ```

2. **Torne o script executável** (se necessário):
   ```bash
   chmod +x setup-reserveproxy.sh
   ```

3. **Execute o script**:
   ```bash
   ./setup-reserveproxy.sh
   ```

   **Nota**: O script usa `sudo` internamente para operações que requerem privilégios elevados.

4. **Verifique a saída**:
   - Confirmação de backups criados
   - Mensagens de configuração dos proxies
   - Confirmação de reload/restart dos serviços NGINX

## Testes Realizados

O script não executa testes automatizados durante a execução, mas você pode validar a configuração manualmente após a instalação.

### Testes Manuais Recomendados

#### 1. Verificar Sintaxe do NGINX
```bash
# NGINX externo do sistema
sudo nginx -t

# NGINX embutido do Morpheus
sudo /opt/morpheus/embedded/nginx/sbin/nginx -t
```

**Resultado esperado**: `syntax is ok` e `test is successful`

#### 2. Verificar Status dos Serviços
```bash
# Status NGINX externo
sudo systemctl status nginx

# Status NGINX embutido Morpheus
sudo systemctl status morpheus-embedded-nginx
```

**Resultado esperado**: Ambos os serviços ativos (`active (running)`)

#### 3. Testar Acesso ao Proxy Externo (Porta 8001)
```bash
curl -k https://localhost:8001/superset/
```

**Resultado esperado**: HTML da página do Superset ou redirecionamento

#### 4. Testar Proxy Completo via Morpheus
```bash
# Substitua <morpheus-url> pela URL do seu Morpheus
curl -k https://<morpheus-url>/superset/
```

**Resultado esperado**: Conteúdo do Superset sendo servido através do Morpheus

#### 5. Verificar Logs de Erro
```bash
# Logs NGINX externo
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Logs NGINX embutido Morpheus
sudo tail -f /opt/morpheus/log/nginx/error.log
sudo tail -f /opt/morpheus/log/nginx/access.log
```

**Resultado esperado**: Sem erros críticos; logs de acesso mostrando requisições bem-sucedidas

### Script de Teste Automatizado

Para validação automatizada, utilize o script complementar:

```bash
chmod +x test-reverseproxy.sh
./test-reverseproxy.sh
```

Este script verifica:
- Status dos serviços NGINX
- Sintaxe das configurações
- Acesso HTTP via proxy
- Headers de segurança
- Logs recentes

## Como Reverter as Alterações

### Opção 1: Restaurar do Backup Automático

Os backups são salvos em `./bkp/` com timestamp (ex: `superset-proxy.202411161430.bkp`, `morpheus.conf.202411161430.bkp`):

```bash
# Listar backups disponíveis
ls -lh ./bkp/

# Restaurar backup do superset-proxy
sudo cp ./bkp/superset-proxy.202411161430.bkp /etc/nginx/sites-available/superset-proxy

# Restaurar backup do morpheus.conf
sudo cp ./bkp/morpheus.conf.202411161430.bkp /opt/morpheus/embedded/nginx/conf/sites-available/morpheus.conf

# Testar sintaxe (externo)
sudo nginx -t

# Recarregar NGINX externo
sudo systemctl reload nginx

# Reiniciar NGINX embutido Morpheus
sudo systemctl restart morpheus-embedded-nginx || sudo morpheus-ctl restart nginx
```

### Opção 2: Remover Configuração do Proxy

```bash
# Remover link simbólico
sudo rm /etc/nginx/sites-enabled/superset-proxy

# Remover arquivo de configuração
sudo rm /etc/nginx/sites-available/superset-proxy

# Testar e recarregar
sudo nginx -t
sudo systemctl reload nginx
sudo morpheus-ctl restart nginx
```

### Opção 3: Reverter via Git (se versionado)

```bash
# Se os arquivos estavam versionados no git
cd /etc/nginx/sites-available/
sudo git checkout superset-proxy
```

## Estrutura de Arquivos

```
setup/reverse-proxy/
├── setup-reserveproxy.sh      # Este script
├── setup-reserveproxy.md      # Esta documentação
├── test-reverseproxy.sh       # Script de teste
├── .env                       # Variáveis de ambiente (não versionado)
├── .env-sample                # Exemplo de configuração
└── bkp/                       # Backups automáticos (não versionado)
    ├── superset-proxy.YYYYMMDDHHMM.bkp
    └── morpheus.conf.YYYYMMDDHHMM.bkp
```

## Troubleshooting

### Erro: "Arquivo .env não encontrado"
**Solução**: Copie `.env-sample` para `.env` e configure as variáveis

### Erro: "nginx: [emerg] cannot load certificate"
**Solução**: Verifique se os certificados SSL existem em `/etc/morpheus/ssl/`

### Erro: "nginx: configuration file /etc/nginx/nginx.conf test failed"
**Solução**: Execute `sudo nginx -t` para ver detalhes do erro de sintaxe

### Proxy não responde
**Solução**: 
1. Execute `test-reverseproxy.sh` para diagnóstico completo
2. Verifique logs: `sudo tail -f /var/log/nginx/error.log`
3. Confirme que o Superset está acessível no domínio configurado

### Headers CSP bloqueando conteúdo

**Solução**: O script já configura `more_clear_headers` e `more_set_headers` apropriados. Se persistir, verifique se o módulo `nginx-module-headers-more` está instalado.

## Notas Importantes

- ⚠️ **Sempre faça backup** antes de executar (o script já faz isso automaticamente)
- 🔒 **Use HTTPS** - O script requer certificados SSL válidos
- 📝 **Logs são seus amigos** - Em caso de erro, sempre consulte `/var/log/nginx/error.log`
- 🔄 **Backups são datados** - Cada execução cria um novo backup com timestamp único
