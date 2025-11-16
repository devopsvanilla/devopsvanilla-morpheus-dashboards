# Test Reverse Proxy - Script de Teste do Proxy Reverso

## Propósito

Este script automatiza o processo de validação e diagnóstico da configuração do proxy reverso NGINX que integra o Apache Superset ao Morpheus Data Appliance. Ele executa uma série de testes para verificar:

1. **Autenticação**: Valida conectividade com a API do Morpheus e obtenção de token de acesso
2. **Serviços**: Verifica status do NGINX externo
3. **Configuração**: Testa sintaxe e valida configurações do proxy
4. **Conectividade**: Testa acesso real através do proxy reverso
5. **Headers de Segurança**: Valida presença de headers CSP e Feature-Policy
6. **Logs**: Exibe logs recentes para diagnóstico de problemas

O objetivo é fornecer uma ferramenta de diagnóstico rápida e abrangente para validar que o proxy reverso está funcionando corretamente após a execução do script de setup.

## Testes Realizados

O script executa os seguintes testes em sequência:

### 1. Autenticação no Morpheus
**O que faz**:
- Solicita credenciais do usuário (username e password)
- Realiza POST para endpoint de autenticação (`TOKEN_URL`)
- Extrai token de acesso da resposta JSON

**Resultado esperado**: Token obtido com sucesso (mensagem verde)

**Possíveis problemas**:
- ❌ Credenciais incorretas
- ❌ URL de autenticação inválida
- ❌ Morpheus inacessível

### 2. Status do Serviço NGINX Externo
**O que faz**:
- Verifica se o serviço NGINX está ativo usando `systemctl`

**Resultado esperado**: "NGINX está ativo" (verde)

**Possíveis problemas**:
- ❌ Serviço NGINX parado ou com falha

### 3. Teste de Sintaxe do NGINX
**O que faz**:
- Executa `sudo nginx -t` para validar configuração

**Resultado esperado**: 
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Possíveis problemas**:
- ❌ Erros de sintaxe nas configurações
- ❌ Arquivos incluídos ausentes
- ❌ Diretivas inválidas

### 4. Verificação da Configuração proxy_pass
**O que faz**:
- Exibe 10 linhas após `location /superset/` no arquivo de configuração
- Mostra a configuração atual do proxy reverso

**Resultado esperado**: Exibição da configuração do location block com proxy_pass

**Análise**: Permite verificar visualmente se a configuração está correta

### 5. Teste de Acesso via Proxy Reverso
**O que faz**:
- Realiza requisição HTTP para `PROXY_TEST_URL` usando token de autenticação
- Salva resposta em `/tmp/proxy_response.txt`
- Exibe primeiras 40 linhas da resposta (headers + início do HTML)

**Resultado esperado**: 
- Status HTTP 200 OK
- Headers de resposta corretos
- Conteúdo HTML do Superset

**Possíveis problemas**:
- ❌ 404 Not Found: Proxy não configurado ou path incorreto
- ❌ 502 Bad Gateway: Superset inacessível ou proxy externo com problema
- ❌ 401 Unauthorized: Token inválido ou expirado
- ❌ SSL/TLS errors: Certificados inválidos

### 6. Verificação de Headers de Segurança
**O que faz**:
- Busca por `Content-Security-Policy` na resposta
- Busca por `Feature-Policy` na resposta
- Valida se headers foram configurados corretamente

**Resultado esperado**: 
- Headers presentes conforme configuração do proxy

**Análise**: 
- ✅ Verde: Header presente
- ❌ Vermelho: Header ausente

### 7. Exibição de Logs de Erro
**O que faz**:
- Exibe últimas 20 linhas do `/var/log/nginx/error.log`

**Resultado esperado**: Nenhum erro crítico recente

**Análise**: Permite identificar problemas em tempo real

## Pré-requisitos

### Arquivos Necessários

#### `.env` - Variáveis de Ambiente
Deve existir no mesmo diretório do script. Copie de `.env-sample` e configure:

```bash
# URL para obter token de autenticação do Morpheus
TOKEN_URL=https://morpheus.example.com/oauth/token?grant_type=password&scope=write&client_id=morph-api

# URL do proxy reverso para teste
PROXY_TEST_URL=https://morpheus.example.com/superset/
```

### Permissões e Acesso
- Permissão para executar `sudo nginx -t`
- Permissão de leitura em `/var/log/nginx/error.log`
- Acesso de leitura a `/etc/nginx/sites-available/superset-proxy`
- Conectividade de rede com o Morpheus

### Credenciais
- Usuário e senha válidos do Morpheus
- Usuário deve ter permissões para obter token de API

## Como Executar

### 1. Preparação

```bash
# Navegue até o diretório
cd /caminho/para/setup/reverse-proxy

# Crie arquivo .env a partir do sample (se ainda não existe)
cp .env-sample .env

# Edite o .env com as URLs corretas
nano .env
```

### 2. Tornar Executável

```bash
chmod +x test-reverseproxy.sh
```

### 3. Executar o Script

```bash
./test-reverseproxy.sh
```

### 4. Durante a Execução

O script solicitará:

```
Digite o usuário: admin
Digite a senha: ********
```

**Nota**: A senha não será exibida enquanto digita (modo silencioso).

### 5. Aguardar Resultados

O script executará todos os testes sequencialmente e exibirá resultados com código de cores.

## Resultados Esperados

### Execução Bem-Sucedida

```bash
==== Autenticando no Morpheus para obter token ====
Token obtido com sucesso.

==== Verificando status do serviço NGINX externo ====
NGINX está ativo

==== Testando sintaxe e configuração do NGINX ====
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

==== Verificando configuração proxy_pass no superset-proxy ====
    location /superset/ {
        proxy_pass https://superset-morpheus-container-poc.loonar.dev/;
        proxy_set_header Host superset-morpheus-container-poc.loonar.dev;
        proxy_set_header X-Real-IP $remote_addr;
        ...
    }

==== Testando acesso via proxy reverso usando token (URL externa Morpheus) ====
HTTP/2 200
server: nginx/1.18.0
date: Sat, 16 Nov 2025 14:30:00 GMT
content-type: text/html; charset=utf-8
...

==== Verificando headers Content-Security-Policy e Feature-Policy na resposta ====
Header Content-Security-Policy presente.
Header Feature-Policy presente.

==== Exibindo últimas 20 linhas do log de erro do NGINX ====
[nenhum erro crítico]

==== Teste completo finalizado. Analise a saída para diagnóstico. ====
```

### Código de Cores

- 🟢 **VERDE**: Teste passou / Sucesso
- 🔴 **VERMELHO**: Teste falhou / Erro crítico
- 🟡 **AMARELO**: Informativo / Cabeçalhos de seção

### Arquivo Temporário Criado

- `/tmp/proxy_response.txt`: Contém resposta HTTP completa do teste de acesso

## Interpretação dos Resultados

### ✅ Todos os Testes Passaram

Se todos os testes mostrarem mensagens verdes:
- Proxy reverso está configurado corretamente
- NGINX está funcionando
- Autenticação com Morpheus está operacional
- Superset acessível através do proxy
- Headers de segurança configurados adequadamente

**Ação**: Nenhuma ação necessária. Sistema pronto para uso.

### ❌ Falha na Autenticação

```
Falha ao obter token.
Resposta: {"error":"invalid_grant"}
```

**Possíveis causas**:
- Credenciais incorretas
- URL de token incorreta no `.env`
- Morpheus inacessível

**Ação**: 
1. Verifique credenciais
2. Confirme `TOKEN_URL` no `.env`
3. Teste acesso manual ao Morpheus

### ❌ NGINX Não Ativo

```
NGINX não ativo
```

**Possíveis causas**:
- Serviço NGINX parado
- Erro de configuração impedindo inicialização

**Ação**:
```bash
sudo systemctl status nginx
sudo systemctl start nginx
sudo journalctl -u nginx -n 50
```

### ❌ Erro de Sintaxe NGINX

```
nginx: [emerg] unexpected "}" in /etc/nginx/sites-available/superset-proxy:15
nginx: configuration file /etc/nginx/nginx.conf test failed
```

**Possíveis causas**:
- Configuração malformada
- Chaves/aspas não fechadas

**Ação**:
1. Edite o arquivo indicado
2. Corrija a linha especificada
3. Execute novamente `sudo nginx -t`

### ❌ 404 Not Found no Teste de Acesso

**Possíveis causas**:
- Location block `/superset/` não configurado
- Link simbólico não criado em sites-enabled
- NGINX não recarregado após configuração

**Ação**:
```bash
# Verificar link simbólico
ls -l /etc/nginx/sites-enabled/superset-proxy

# Recarregar NGINX
sudo systemctl reload nginx
```

### ❌ 502 Bad Gateway

**Possíveis causas**:
- Superset inacessível
- Proxy externo não consegue resolver DNS
- Firewall bloqueando conexão

**Ação**:
```bash
# Testar acesso direto ao Superset
curl -I https://superset-morpheus-container-poc.loonar.dev/

# Verificar logs detalhados
sudo tail -f /var/log/nginx/error.log
```

### ⚠️ Headers Ausentes

```
Header Content-Security-Policy ausente.
```

**Possíveis causas**:
- Módulo `headers-more-nginx-module` não instalado
- Configuração não incluiu diretivas de headers

**Ação**:
1. Instale o módulo: `sudo apt-get install libnginx-mod-http-headers-more-filter`
2. Re-execute script de setup
3. Recarregue NGINX

## Troubleshooting

### Erro: "Arquivo .env não encontrado"

```bash
cp .env-sample .env
nano .env  # Configure TOKEN_URL e PROXY_TEST_URL
```

### Erro: "Permission denied" ao executar sudo

O usuário atual precisa estar no grupo sudoers ou ter permissões específicas.

```bash
# Executar como root
sudo su
./test-reverseproxy.sh
```

### Token Expira Durante Testes

Tokens Morpheus têm tempo de vida limitado. Se os testes demorarem muito, o token pode expirar.

**Solução**: Re-execute o script para obter novo token.

### Resposta Vazia no Teste de Acesso

**Possível causa**: Superset está configurado mas retorna conteúdo vazio.

**Ação**: Verifique se o Superset está realmente funcionando acessando-o diretamente.

## Arquivos Relacionados

- **Script de Setup**: `setup-reserveproxy.sh` - Configura o proxy
- **Script de Teste**: `test-reverseproxy.sh` - Este script (validação)
- **Configuração**: `.env` - Variáveis de ambiente
- **Sample**: `.env-sample` - Template de configuração
- **Resposta Temporária**: `/tmp/proxy_response.txt` - Resposta HTTP capturada

## Quando Executar Este Script

### Cenários Recomendados

1. **Após executar `setup-reserveproxy.sh`**: Validar que a configuração foi aplicada corretamente
2. **Após mudanças na configuração**: Verificar que alterações não quebraram o proxy
3. **Troubleshooting**: Diagnosticar problemas de acesso ao Superset via Morpheus
4. **Monitoramento**: Validação periódica de saúde do sistema
5. **Após atualizações**: Confirmar compatibilidade após updates do Morpheus ou NGINX

### Frequência Sugerida

- ✅ Sempre após mudanças na configuração
- ✅ Após reinicializações do servidor
- ✅ Quando usuários reportarem problemas de acesso
- ℹ️ Opcionalmente em rotinas de manutenção preventiva

## Limpeza

O script cria um arquivo temporário que pode ser removido:

```bash
rm /tmp/proxy_response.txt
```

**Nota**: Este arquivo é sobrescrito a cada execução, não causando acúmulo de dados.

## Notas Importantes

- 🔐 **Credenciais seguras**: O script usa `read -s` para ocultar senha durante digitação
- 🔍 **Diagnóstico visual**: Saídas coloridas facilitam identificação rápida de problemas
- 📋 **Histórico**: Cada execução sobrescreve `/tmp/proxy_response.txt`
- ⚡ **Execução rápida**: Todos os testes completam em poucos segundos
- 🛡️ **Não-destrutivo**: Script apenas lê e testa, não modifica configurações

## Exemplo de Uso Completo

```bash
# 1. Preparar ambiente
cd /home/devopsvanilla/_prj/devopsvanilla/devopsvanilla-morpheus-dashboards/setup/reverse-proxy
cp .env-sample .env
nano .env

# 2. Configurar proxy (se ainda não configurado)
./setup-reserveproxy.sh

# 3. Executar testes
./test-reverseproxy.sh
# Digite: admin
# Digite: sua-senha-segura

# 4. Analisar resultados
# Verificar mensagens verdes vs vermelhas
# Revisar logs se necessário

# 5. Corrigir problemas (se houver)
# Baseado na saída, aplicar correções

# 6. Re-testar
./test-reverseproxy.sh
```

## Logs e Debugging Adicional

Para debugging mais profundo além do que o script fornece:

```bash
# Logs de acesso NGINX
sudo tail -f /var/log/nginx/access.log

# Logs de erro NGINX (modo contínuo)
sudo tail -f /var/log/nginx/error.log

# Logs do NGINX embutido Morpheus
sudo tail -f /opt/morpheus/log/nginx/error.log
sudo tail -f /opt/morpheus/log/nginx/access.log

# Testar proxy manualmente com curl detalhado
curl -v -k https://morpheus.example.com/superset/ -H "Authorization: Bearer TOKEN"

# Verificar conexões ativas
sudo netstat -tulpn | grep nginx

# Verificar processos NGINX
ps aux | grep nginx
```
