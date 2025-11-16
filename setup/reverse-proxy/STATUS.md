# STATUS

Essa solução ainda não surtiu o efeito esperado mas dá indícios que terá sucesso.

❌A atual execução dos testes por meio do script falou com o resultado:

```text
root@Morpheus-dev:~/devopsvanilla-morpheus-dashboards/setup/reverse-proxy# ./test-reverseproxy.sh
Digite o usuário: sandro.cicero
Digite a senha:
==== Autenticando no Morpheus para obter token ====
Token obtido com sucesso.
==== Verificando status do serviço NGINX externo ====
NGINX está ativo
==== Testando sintaxe e configuração do NGINX ====
nginx: [warn] conflicting server name "localhost" on 0.0.0.0:8001, ignored
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
==== Verificando configuração proxy_pass no superset-proxy ====
    location /superset/ {
        proxy_pass https://superset-morpheus-container-poc.loonar.dev/;

        proxy_set_header Host superset-morpheus-container-poc.loonar.dev;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header Cookie $http_cookie;
        proxy_set_header Authorization $http_authorization;
        proxy_set_header Referer "https://superset-morpheus-container-poc.loonar.dev/";
==== Testando acesso via proxy reverso usando token (URL externa Morpheus) ====
HTTP/2 302
date: Sun, 16 Nov 2025 19:04:16 GMT
content-length: 0
vary: Origin
vary: Access-Control-Request-Method
vary: Access-Control-Request-Headers
set-cookie: XSRF-TOKEN=7b5ce375-8274-4f49-b2fd-a19b7a0b2291; Path=/; Secure; HttpOnly
set-cookie: JSESSIONID=ZDA3ODIzMGEtMTlhMS00M2M3LTlmODMtYzY3ZmNkODI3YmQ4; Path=/; Secure; HttpOnly; SameSite=Lax
location: https://morpheus-dev.loonar.dev/login/auth
content-security-policy: default-src 'self' https://superset-morpheus-container-poc.loonar.dev; frame-src 'self' https://superset-morpheus-container-poc.loonar.dev;

==== Verificando headers Content-Security-Policy e Feature-Policy na resposta ====
content-security-policy: default-src 'self' https://superset-morpheus-container-poc.loonar.dev; frame-src 'self' https://superset-morpheus-container-poc.loonar.dev;
Header Content-Security-Policy presente.
Header Feature-Policy ausente.
==== Exibindo últimas 20 linhas do log de erro do NGINX ====
2025/11/16 12:06:57 [notice] 42982#42982: signal process started
2025/11/16 12:07:15 [info] 43003#43003: Using 131072KiB of shared memory for nchan in /etc/nginx/nginx.conf:63
2025/11/16 12:07:15 [warn] 43003#43003: conflicting server name "localhost" on 0.0.0.0:8001, ignored
2025/11/16 12:09:16 [info] 43076#43076: Using 131072KiB of shared memory for nchan in /etc/nginx/nginx.conf:63
2025/11/16 12:09:16 [warn] 43076#43076: conflicting server name "localhost" on 0.0.0.0:8001, ignored
2025/11/16 12:18:20 [info] 43373#43373: Using 131072KiB of shared memory for nchan in /etc/nginx/nginx.conf:63
2025/11/16 12:18:20 [warn] 43373#43373: conflicting server name "localhost" on 0.0.0.0:8001, ignored
2025/11/16 12:18:28 [warn] 43380#43380: conflicting server name "localhost" on 0.0.0.0:8001, ignored
2025/11/16 12:18:28 [notice] 43380#43380: signal process started
2025/11/16 16:31:01 [info] 50044#50044: Using 131072KiB of shared memory for nchan in /etc/nginx/nginx.conf:63
2025/11/16 16:31:01 [warn] 50044#50044: conflicting server name "localhost" on 0.0.0.0:8001, ignored
2025/11/16 16:31:01 [info] 50048#50048: Using 131072KiB of shared memory for nchan in /etc/nginx/nginx.conf:63
2025/11/16 16:31:01 [warn] 50048#50048: conflicting server name "localhost" on 0.0.0.0:8001, ignored
2025/11/16 16:31:01 [warn] 50051#50051: conflicting server name "localhost" on 0.0.0.0:8001, ignored
2025/11/16 16:35:35 [info] 50138#50138: Using 131072KiB of shared memory for nchan in /etc/nginx/nginx.conf:63
2025/11/16 16:35:35 [warn] 50138#50138: conflicting server name "localhost" on 0.0.0.0:8001, ignored
2025/11/16 16:42:18 [info] 50439#50439: Using 131072KiB of shared memory for nchan in /etc/nginx/nginx.conf:63
2025/11/16 16:42:18 [warn] 50439#50439: conflicting server name "localhost" on 0.0.0.0:8001, ignored
2025/11/16 19:04:16 [info] 53899#53899: Using 131072KiB of shared memory for nchan in /etc/nginx/nginx.conf:63
2025/11/16 19:04:16 [warn] 53899#53899: conflicting server name "localhost" on 0.0.0.0:8001, ignored
==== Teste completo finalizado. Analise a saída para diagnóstico. ====
```


## Interpretação do Resultado

- A configuração via script de setup foi aplicada com sucesso (NGINX ativo e `nginx -t` ok), e o bloco `location /superset/` no proxy externo está corretamente definido.
- O teste de acesso retornou `HTTP/2 302` com `location: https://morpheus-dev.loonar.dev/login/auth`.
  
    Isso indica que a requisição feita para `https://<morpheus>/superset/` foi interceptada pelo NGINX embutido do Morpheus e redirecionada para a página de login do Morpheus (fluxo de UI), pois não havia sessão de usuário válida (cookies `JSESSIONID`/`XSRF-TOKEN`).
  
    O header `content-security-policy` observado pertence à resposta do próprio Morpheus (página de login), e não ao conteúdo proxied do Superset. Portanto, a presença de CSP aqui é esperada e não comprova falha do proxy.
- O aviso `conflicting server name "localhost" on 0.0.0.0:8001, ignored` é um warning do NGINX (existem múltiplos server blocks com o mesmo `server_name`/porta). Não impede funcionamento, mas é recomendável ajustar para limpar o alerta.
- O header `Feature-Policy` não apareceu. Observação: esta diretiva foi substituída por `Permissions-Policy` nas versões modernas dos navegadores; a ausência de `Feature-Policy` por si só não é problema.

Em resumo: o 302 de login mostra que o teste exercitou a camada de UI do Morpheus (que exige sessão), e não chegou a validar o caminho proxied até o Superset. O proxy pode estar correto, mas o teste precisa simular uma sessão autenticada (cookies) ou validar diretamente o proxy externo (porta 8001).

## Possíveis Causas (raiz do 302 e dos sintomas)

1. Sessão de UI ausente: o teste usa `Authorization: Bearer <token>` (válido para API), mas o endpoint `/superset/` trafega pela UI do Morpheus e requer sessão baseada em cookies (`JSESSIONID` e `XSRF-TOKEN`). Sem cookies, a UI redireciona para `/login/auth` (302).
2. Verificação nos headers incorreta para este cenário: como a resposta veio da UI (login), a presença de `Content-Security-Policy` é da página do Morpheus e não mede o comportamento do proxy do Superset.
3. Módulo headers-more não relacionado nesta resposta: a remoção/ajuste de CSP/CORS no proxy externo só se aplica quando a resposta vem do Superset via proxy. Como houve redirecionamento para a UI, essa etapa não foi exercitada.
4. Warning de `server_name` duplicado: existe outro bloco NGINX escutando `:8001` com `server_name localhost`. É apenas alerta, mas convém ajustar para evitar ambiguidades futuras.
5. Ordem/carregamento de `location` no NGINX embutido: pouco provável pelo log atual, mas se o `/superset/` não estiver sendo tratado pelo arquivo certo, a UI pode aplicar regras próprias antes do proxy. Vale confirmar inclusão e precedência.
6. SNI/destino externo: já configurado (`proxy_ssl_server_name on` no proxy externo). Não aparenta ser a causa do 302.

## Ações Recomendadas (próximos passos)

Valide o proxy de forma incremental para isolar a causa:

1. Validar diretamente o Proxy Externo (bypassa o Morpheus)

- Objetivo: comprovar que `https://localhost:8001/superset/` retorna conteúdo do Superset com headers ajustados.
- Exemplo:

    ```bash
    curl -kI https://localhost:8001/superset/
    curl -k https://localhost:8001/superset/ | head -50
    ```

- Resultado esperado: status 200/3xx do Superset e ausência dos CSP restritivos (de acordo com as diretivas `more_clear_headers` e `more_set_headers`).

1. Simular sessão de UI do Morpheus no teste automatizado

- Objetivo: acessar `https://<morpheus>/superset/` já autenticado na UI.
- Abordagem:
  - Realizar login na UI para obter cookies (ex.: fluxo de login que popula `JSESSIONID`/`XSRF-TOKEN`) e armazenar com `curl -c cookiejar.txt -b cookiejar.txt`.
  - Reutilizar o cookiejar ao chamar `PROXY_TEST_URL`: 

        ```bash
        curl -k -i -c cookiejar.txt -b cookiejar.txt "https://<morpheus>/superset/"
        ```

- Observação: o token de API (Bearer) não substitui a sessão de UI para rotas da interface.

1. Higienizar o warning de server_name duplicado

- Editar o `server_name` do proxy externo para algo único (ex.: `server_name superset-proxy.local;`) ou remover o `server_name` se não for necessário. Alternativamente, marcar `listen 8001 ssl default_server;` caso apropriado.

1. (Opcional) Conferir módulo headers-more

- Garantir que `libnginx-mod-http-headers-more-filter` esteja instalado no NGINX externo para que `more_clear_headers`/`more_set_headers` sejam efetivos.

1. (Opcional) Confirmar precedência do `location /superset/` no Morpheus

- Verificar se o arquivo `morpheus.conf` com o `location /superset/` está realmente incluído e ativo no NGINX embutido (ordem das includes, nenhum outro `location` mais específico colidindo).

## Conclusão

O comportamento observado (302 para `/login/auth` e presença de CSP) aponta para falta de sessão de UI durante o teste – não para falha do proxy. Após validar o proxy externo diretamente e/ou ajustar o teste para usar cookies de sessão, a tendência é que o conteúdo do Superset seja servido corretamente em `/superset/` dentro do Morpheus.

