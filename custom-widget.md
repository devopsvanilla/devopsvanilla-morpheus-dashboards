# Custom Widget - Guia de Configuração

## Visão Geral

O **Custom Widget** é um componente de dashboard do Morpheus que permite incorporar conteúdo de URLs externas diretamente no seu dashboard. Este widget oferece flexibilidade total para integrar painéis externos, gráficos, relatórios ou qualquer conteúdo web que suporte incorporação via iframe.

## Características

- ✅ Incorporação de URLs externas via iframe
- ✅ Título personalizável do widget
- ✅ Altura ajustável do conteúdo
- ✅ Auto-refresh configurável
- ✅ Intervalo de atualização personalizável
- ✅ Opção de mostrar/ocultar borda
- ✅ Tratamento de erros e validação de URL
- ✅ Suporte a sandbox de segurança

## Pré-requisitos

1. Morpheus Appliance versão 6.0 ou superior
2. Plugin de Dashboard compilado e instalado
3. Permissões apropriadas no Morpheus (provisioning ou superior)
4. URL externa que suporte incorporação via iframe

## Instalação do Plugin

### 1. Compilar o Plugin

```bash
cd /workspaces/devopsvanilla-morpheus-dashboards
./gradlew morpheus-home-dashboard-plugin:shadowJar
```

O arquivo JAR será gerado em:
```
morpheus-home-dashboard-plugin/build/libs/morpheus-home-dashboard-plugin-x.x.x-all.jar
```

### 2. Instalar no Morpheus

1. Acesse o Morpheus UI
2. Navegue até **Administration → Integrations → Plugins**
3. Clique em **UPLOAD PLUGIN**
4. Selecione o arquivo JAR compilado
5. Aguarde a instalação completar
6. Reinicie o Morpheus Appliance se necessário

## Adicionar o Widget ao Dashboard

### Via Interface Gráfica

**IMPORTANTE**: No Morpheus, os widgets são adicionados através da **personalização de dashboards pelo usuário**, não diretamente no dashboard padrão.

### Passo 1: Verificar Instalação do Plugin

1. **Confirme que o plugin está instalado**
   - Acesse: **Administração → Integrations → Plugins**
   - Verifique se **"Morpheus Home Dashboard"** (versão 1.1.4) está na lista
   - Status deve estar **"Loaded"** ou **"Running"**

### Passo 2: Acessar Configurações do Usuário

O widget customizado estará disponível para cada usuário configurar em seu dashboard pessoal:

1. **Acesse o Dashboard Home**
   - Clique em **Operações → Painel de Controle** (ou **Dashboard** no menu superior)

2. **Abrir Configurações de Dashboard**
   - Procure por um ícone de **engrenagem** (⚙️) ou **configurações** no canto superior direito do dashboard
   - Ou clique no **ícone de edição/personalização** do dashboard
   - Pode estar em **User Settings → Dashboard Preferences**

3. **Adicionar Widget**
   - Na interface de personalização, você verá uma lista de **Available Dashboard Items**
   - Procure por **"Custom External Content"** na categoria **"custom"**
   - Arraste ou clique para adicionar ao seu dashboard

4. **Configurar o Widget**
   - Após adicionar, clique no ícone de **configurações** (⚙️) do widget
   - Preencha os parâmetros conforme descrito abaixo
   - Clique em **Save** ou **Apply**

### Passo 3: Adicionar via API (Alternativa Avançada)

Se a interface não estiver disponível, você pode adicionar o widget via API REST do Morpheus:

```bash
# Obter lista de dashboard items disponíveis
curl -X GET "https://morpheus.example.com/api/dashboard-items" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Adicionar o widget ao dashboard do usuário
curl -X POST "https://morpheus.example.com/api/user-settings/dashboard" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dashboardItem": {
      "type": "dashboard-item-custom-widget",
      "config": {
        "externalUrl": "https://grafana.example.com/dashboard",
        "widgetTitle": "My Dashboard",
        "widgetHeight": "500",
        "autoRefresh": "on",
        "refreshInterval": "300",
        "showBorder": "off"
      }
    }
  }'
```

## Parâmetros de Configuração

### 1. External URL (Obrigatório)
- **Nome do Campo**: `externalUrl`
- **Tipo**: Text
- **Descrição**: URL completa do conteúdo externo a ser incorporado
- **Exemplo**: `https://grafana.example.com/d/dashboard-id?orgId=1&refresh=30s`
- **Observações**: 
  - Deve começar com `http://` ou `https://`
  - A URL deve permitir incorporação via iframe
  - Algumas URLs podem bloquear incorporação por políticas de segurança (X-Frame-Options)

### 2. Widget Title (Opcional)
- **Nome do Campo**: `widgetTitle`
- **Tipo**: Text
- **Padrão**: "Custom Content"
- **Descrição**: Título customizado exibido no cabeçalho do widget
- **Exemplo**: "Grafana Metrics", "External Dashboard", "Analytics Panel"

### 3. Widget Height (Opcional)
- **Nome do Campo**: `widgetHeight`
- **Tipo**: Number
- **Padrão**: 400
- **Unidade**: Pixels
- **Descrição**: Altura do conteúdo incorporado em pixels
- **Exemplo**: 300, 500, 600
- **Observações**: Ajuste conforme o conteúdo a ser exibido

### 4. Auto Refresh (Opcional)
- **Nome do Campo**: `autoRefresh`
- **Tipo**: Checkbox
- **Padrão**: Habilitado (on)
- **Descrição**: Ativa atualização automática do conteúdo
- **Observações**: 
  - Quando ativado, o iframe será recarregado automaticamente
  - Respeita eventos de refresh global do Morpheus

### 5. Refresh Interval (Opcional)
- **Nome do Campo**: `refreshInterval`
- **Tipo**: Number
- **Padrão**: 300
- **Unidade**: Segundos
- **Descrição**: Intervalo entre atualizações automáticas
- **Exemplo**: 60 (1 minuto), 300 (5 minutos), 600 (10 minutos)
- **Observações**: 
  - Só é aplicado se Auto Refresh estiver ativado
  - Valores muito baixos podem impactar performance

### 6. Show Border (Opcional)
- **Nome do Campo**: `showBorder`
- **Tipo**: Checkbox
- **Padrão**: Desabilitado (off)
- **Descrição**: Mostra uma borda ao redor do conteúdo incorporado
- **Observações**: Útil para delimitar visualmente o conteúdo

## Exemplos de Configuração

### Exemplo 1: Grafana Dashboard

```
External URL: https://grafana.example.com/d/abc123/server-metrics?orgId=1&refresh=30s&kiosk
Widget Title: Server Metrics
Widget Height: 500
Auto Refresh: ON
Refresh Interval: 300
Show Border: OFF
```

### Exemplo 2: Kibana Dashboard

```
External URL: https://kibana.example.com/app/dashboards#/view/dashboard-id?embed=true
Widget Title: Log Analytics
Widget Height: 600
Auto Refresh: ON
Refresh Interval: 120
Show Border: OFF
```

### Exemplo 3: Custom Application

```
External URL: https://myapp.example.com/dashboard?view=summary
Widget Title: Application Dashboard
Widget Height: 400
Auto Refresh: ON
Refresh Interval: 600
Show Border: ON
```

### Exemplo 4: Power BI Embedded

```
External URL: https://app.powerbi.com/view?r=<report-id>
Widget Title: BI Reports
Widget Height: 700
Auto Refresh: OFF
Refresh Interval: 300
Show Border: OFF
```

## Considerações de Segurança

### Sandbox de Segurança

O widget implementa as seguintes proteções de segurança no iframe:

- `allow-scripts`: Permite execução de JavaScript no conteúdo incorporado
- `allow-same-origin`: Permite que o conteúdo seja tratado como mesma origem
- `allow-forms`: Permite submissão de formulários
- `allow-popups`: Permite popups do conteúdo incorporado
- `allow-popups-to-escape-sandbox`: Permite que popups não herdem as restrições

### X-Frame-Options

Algumas URLs podem não funcionar devido a políticas de segurança do servidor:

- **X-Frame-Options: DENY** - Bloqueia completamente a incorporação
- **X-Frame-Options: SAMEORIGIN** - Permite apenas na mesma origem
- **Content-Security-Policy: frame-ancestors** - Controla quem pode incorporar

**Solução**: Configure o servidor externo para permitir incorporação ou use URLs específicas para embedding.

### HTTPS

- Recomenda-se usar sempre URLs HTTPS para conteúdo externo
- Conteúdo HTTP pode ser bloqueado em aplicações HTTPS (Mixed Content)

## Troubleshooting

### Problema: Não encontro a opção "Add Widget" no dashboard

**Causa**: O Morpheus não usa um botão "Add Widget" no dashboard padrão. Os widgets são configurados por usuário.

**Soluções**:

1. **Verifique se o plugin está carregado**:
  ```bash
  # Via API
  curl -X GET "https://morpheus.example.com/api/plugins" \
    -H "Authorization: Bearer YOUR_TOKEN" | grep -i dashboard
  ```

2. **Acesse as preferências do usuário**:
  - Clique no seu **nome de usuário** no canto superior direito
  - Procure por **"User Settings"** ou **"Preferences"**
  - Vá para a seção **"Dashboard"** ou **"Dashboard Items"**

3. **Verifique permissões**:
  - Certifique-se de que seu usuário tem permissão de **"provisioning"** ou superior
  - Administradores podem configurar permissões em: **Administration → Users → [Seu Usuário] → Permissions**

4. **Reinicie o Morpheus após instalar o plugin**:
  ```bash
  # Via SSH no servidor Morpheus
  sudo morpheus-ctl restart morpheus-ui
  ```

5. **Limpe o cache do navegador**:
  - Pressione `Ctrl + Shift + Delete` (Windows/Linux) ou `Cmd + Shift + Delete` (Mac)
  - Limpe cache e cookies do Morpheus
  - Faça login novamente

6. **Verifique logs do Morpheus**:
  ```bash
  # No servidor Morpheus
  tail -f /var/log/morpheus/morpheus-ui/current
  ```
  Procure por erros relacionados a plugins ou dashboard items.

### Problema: Widget mostra "Configuration Required"

**Causa**: URL externa não foi configurada

**Solução**: 
1. Clique no ícone de configurações do widget
2. Preencha o campo "External URL" com uma URL válida
3. Salve as configurações

### Problema: Conteúdo não carrega (tela em branco)

**Causas Possíveis**:
1. URL bloqueada por X-Frame-Options
2. URL inválida ou inacessível
3. Problemas de rede/firewall

**Soluções**:
1. Verifique se a URL permite incorporação
2. Teste a URL em um navegador separado
3. Verifique logs do console do navegador (F12)
4. Configure o servidor externo para permitir frames

### Problema: Widget não atualiza automaticamente

**Causa**: Auto Refresh desabilitado ou intervalo muito longo

**Solução**:
1. Verifique se "Auto Refresh" está marcado
2. Ajuste o "Refresh Interval" para um valor menor
3. Certifique-se de que o refresh global do Morpheus está funcionando

### Problema: Conteúdo cortado ou scroll desnecessário

**Causa**: Altura do widget inadequada

**Solução**:
1. Ajuste o parâmetro "Widget Height" para um valor maior
2. Teste diferentes valores até encontrar a altura ideal
3. Considere usar parâmetros de URL do serviço externo para ajustar o tamanho

## Casos de Uso

### 1. Monitoramento de Infraestrutura
- Incorporar dashboards do Grafana, Prometheus, Datadog
- Visualizar métricas em tempo real junto com dados do Morpheus

### 2. Análise de Logs
- Integrar Kibana, Splunk, ELK dashboards
- Correlacionar logs com eventos do Morpheus

### 3. Business Intelligence
- Incorporar relatórios do Power BI, Tableau, Looker
- Centralizar visualizações de negócio no Morpheus

### 4. Aplicações Customizadas
- Mostrar dashboards de aplicações internas
- Integrar ferramentas de terceiros
- Criar experiência unificada de monitoramento

### 5. Status Pages
- Exibir status de serviços externos
- Monitorar SLAs de provedores
- Integrar health checks de APIs

## Arquitetura do Widget

### Estrutura de Arquivos

```
morpheus-home-dashboard-plugin/
├── src/main/groovy/com/morpheusdata/dashboard/custom/
│   └── CustomWidgetItemProvider.groovy          # Provider do widget
├── src/assets/js/custom/
│   └── custom-widget.jsx                        # Componente React
└── src/main/resources/renderer/hbs/custom/
    └── custom-widget.hbs                        # Template Handlebars
```

### Fluxo de Funcionamento

1. **Registro**: Provider registrado no `MorpheusHomeDashboardPlugin.groovy`
2. **Renderização**: Template HBS cria container com data attributes
3. **Inicialização**: React component lê configurações e monta iframe
4. **Atualização**: Timer ou evento Morpheus dispara reload do iframe
5. **Segurança**: Sandbox attributes limitam capacidades do iframe

## Customizações Avançadas

### Modificar Permissões

Edite `CustomWidgetItemProvider.groovy`:

```groovy
rtn.permission = morpheusContext.getPermission().getByCode('admin').blockingGet()
```

Códigos de permissão disponíveis: `provisioning`, `infrastructure`, `admin`, `logs`, etc.

### Adicionar Novos Parâmetros

Adicione novos `OptionType` no método `getDashboardItemType()`:

```groovy
new OptionType(
    name: 'customParam',
    code: 'dashboard-custom-widget-custom-param',
    fieldName: 'customParam',
    fieldLabel: 'Custom Parameter',
    fieldContext: 'config',
    fieldGroup: 'Custom Widget Settings',
    inputType: OptionType.InputType.TEXT,
    displayOrder: 10,
    required: false,
    helpText: 'Description of custom parameter'
)
```

### Alterar Tamanho do Widget

Modifique a propriedade `uiSize` no Provider:

- `sm` - Pequeno (1 coluna)
- `md` - Médio (2 colunas)
- `lg` - Grande (3 colunas) - **Padrão**
- `xl` - Extra grande (largura total)

## Suporte e Contribuições

Para reportar problemas ou sugerir melhorias:

1. Abra uma issue no repositório do projeto
2. Descreva o problema ou sugestão detalhadamente
3. Inclua exemplos de configuração e logs quando aplicável

## Changelog

### Versão 1.0.0
- Implementação inicial do Custom Widget
- Suporte a incorporação de URLs externas
- Parâmetros configuráveis (URL, título, altura, refresh)
- Sandbox de segurança
- Tratamento de erros e validação
- Auto-refresh com intervalo configurável
- Opção de borda customizável

## Licença

Este widget faz parte do Morpheus Dashboard Plugin e está sujeito aos mesmos termos de licença do projeto principal.
