# Guia de Debug - Morpheus Dashboard Plugins

Este guia explica como debugar plugins do Morpheus Dashboard durante o desenvolvimento.

## Índice

1. [Preparação do Ambiente](#preparação-do-ambiente)
2. [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
3. [Debug Backend (Groovy)](#debug-backend-groovy)
4. [Debug Frontend (React/JavaScript)](#debug-frontend-reactjavascript)
5. [Problemas Comuns](#problemas-comuns)
6. [Ferramentas e Scripts](#ferramentas-e-scripts)

---

## Preparação do Ambiente

### Requisitos

- Java 17+
- Gradle 7.3+
- Acesso ao Morpheus Appliance
- Permissões de Admin no Morpheus

### Build Inicial

```bash
# Build de todos os plugins
./gradlew shadowJar

# Build de um plugin específico
./gradlew morpheus-home-dashboard-plugin:shadowJar
```

O JAR será gerado em:
```
morpheus-home-dashboard-plugin/build/libs/morpheus-home-dashboard-plugin-*-all.jar
```

---

## Workflow de Desenvolvimento

### Script de Build Rápido

Use o script `debug-build.sh` para builds rápidos durante desenvolvimento:

```bash
./debug-build.sh
```

Este script:
1. ✅ Compila o plugin
2. 📦 Mostra localização do JAR
3. 📋 Lista próximos passos
4. 🐛 Exibe dicas de debug

### Ciclo de Desenvolvimento

1. **Faça alterações no código**
   - Groovy: `src/main/groovy/com/morpheusdata/dashboard/`
   - React: `src/assets/js/`
   - Templates: `src/main/resources/renderer/hbs/`

2. **Rebuild**
   ```bash
   ./debug-build.sh
   ```

3. **Upload no Morpheus**
   - Administration → Integrations → Plugins
   - Upload File → selecione o JAR
   - Aguarde reload automático

4. **Teste**
   - Acesse o dashboard
   - Hard reload: `Ctrl+Shift+R` (limpa cache do browser)

5. **Debug** (veja seções abaixo)

---

## Debug Backend (Groovy)

### 1. Adicionar Logging

Sempre use `@Slf4j` nas classes Groovy:

```groovy
package com.morpheusdata.dashboard

import groovy.util.logging.Slf4j

@Slf4j
class MyWidgetProvider extends AbstractDashboardItemTypeProvider {
    
    MyWidgetProvider(Plugin plugin, MorpheusContext context) {
        this.plugin = plugin
        this.morpheusContext = context
        log.info("Initializing MyWidgetProvider")
    }

    @Override
    DashboardItemType getDashboardItemType() {
        log.debug("Creating dashboard item type: ${getCode()}")
        def rtn = new DashboardItemType()
        // ... configuração
        log.debug("Dashboard item configured: ${rtn.code}")
        return rtn
    }
}
```

### 2. Níveis de Log

- `log.error()` - Erros críticos
- `log.warn()` - Avisos
- `log.info()` - Informações importantes
- `log.debug()` - Detalhes de debug

### 3. Monitorar Logs do Morpheus

**No servidor Morpheus:**

```bash
# Tail dos logs em tempo real
tail -f /var/log/morpheus/morpheus-ui/current

# Filtrar por plugin específico
tail -f /var/log/morpheus/morpheus-ui/current | grep -i "dashboard"

# Buscar erros
grep -i "error" /var/log/morpheus/morpheus-ui/current | tail -50
```

### 4. Verificar Registro do Provider

Confirme que o provider está registrado em `MorpheusHomeDashboardPlugin.groovy`:

```groovy
@Override
void initialize() {
    try {
        // ...
        MyWidgetProvider myProvider = new MyWidgetProvider(this, morpheus)
        this.pluginProviders.put(myProvider.code, myProvider)
        log.info("Registered provider: ${myProvider.code}")
    } catch(e) {
        log.error("Error initializing plugin: ${e}", e)
    }
}
```

### 5. Validar Permissões

Verifique se a permissão existe:

```groovy
@Override
DashboardItemType getDashboardItemType() {
    def rtn = new DashboardItemType()
    // ...
    def permission = morpheusContext.getPermission()
        .getByCode('provisioning')
        .blockingGet()
    
    if (permission == null) {
        log.error("Permission 'provisioning' not found!")
    } else {
        log.debug("Permission found: ${permission.code}")
        rtn.permission = permission
    }
    // ...
    return rtn
}
```

### 6. Problemas de Compilação

```bash
# Limpar build anterior
./gradlew clean

# Build com stack trace completo
./gradlew morpheus-home-dashboard-plugin:shadowJar --stacktrace

# Build com debug info
./gradlew morpheus-home-dashboard-plugin:shadowJar --debug
```

---

## Debug Frontend (React/JavaScript)

### 1. Browser DevTools

Abra as DevTools (`F12`) e use as seguintes abas:

#### **Console Tab**
- Erros JavaScript
- Outputs de `console.log()`
- Avisos React

#### **Network Tab**
- Chamadas à API Morpheus
- Status HTTP (200, 403, 500, etc.)
- Payload de request/response
- Tempo de resposta

#### **Sources Tab**
- Adicionar breakpoints
- Step through do código
- Inspecionar variáveis

### 2. Adicionar Console Logging

```javascript
class MyWidget extends React.Component {
  
  constructor(props) {
    super(props);
    console.log('MyWidget: Constructor called', props);
    this.state = {
      data: null,
      loaded: false
    };
    // Bind methods
    this.loadData = this.loadData.bind(this);
    this.setData = this.setData.bind(this);
  }

  componentDidMount() {
    console.log('MyWidget: Component mounted');
    this.loadData();
  }

  loadData() {
    console.log('MyWidget: Loading data...');
    Morpheus.api.instances.list({max: 25})
      .then(results => {
        console.log('MyWidget: API response:', results);
        this.setData(results);
      })
      .catch(error => {
        console.error('MyWidget: API error:', error);
      });
  }

  setData(results) {
    console.log('MyWidget: Setting data, count:', results?.data?.length);
    this.setState({
      data: results.data,
      loaded: true
    });
  }

  render() {
    console.log('MyWidget: Rendering, state:', this.state);
    return (
      <Widget>
        {/* ... */}
      </Widget>
    );
  }
}
```

### 3. Verificar Componente Registrado

No Console do browser:

```javascript
// Verificar se componente foi registrado
console.log(Morpheus.components);

// Verificar se Morpheus API está disponível
console.log(Morpheus.api);

// Testar API manualmente
Morpheus.api.instances.list({max: 5}).then(console.log);
```

### 4. Debug de Charts

Para widgets com gráficos C3.js:

```javascript
render() {
    const chartData = this.prepareChartData();
    console.log('Chart data:', chartData);
    console.log('Chart config:', this.chartConfig);
    
    // Verificar se C3 está disponível
    if (typeof c3 === 'undefined') {
        console.error('C3.js not loaded!');
    }
    
    return (
        <DonutChartWidget 
            data={chartData}
            config={this.chartConfig}
        />
    );
}
```

### 5. Verificar DOM Element

```javascript
componentDidMount() {
    const element = document.querySelector('#my-widget');
    if (!element) {
        console.error('Widget container not found!');
        return;
    }
    console.log('Widget container found:', element);
    this.loadData();
}
```

### 6. Debug de Event Listeners

```javascript
componentDidMount() {
    console.log('Registering morpheus:refresh listener');
    $(document).on('morpheus:refresh', this.refreshData);
}

refreshData() {
    console.log('Refresh event triggered');
    if (this.state.autoRefresh) {
        this.loadData();
    } else {
        console.log('Auto-refresh disabled');
    }
}

componentWillUnmount() {
    console.log('Removing morpheus:refresh listener');
    $(document).off('morpheus:refresh', this.refreshData);
}
```

---

## Problemas Comuns

### Widget Não Aparece

**Checklist:**

1. ✅ Provider está registrado no `MorpheusHomeDashboardPlugin.groovy`?
2. ✅ `getCode()` é único?
3. ✅ Permissão existe e está configurada?
4. ✅ `templatePath` está correto?
5. ✅ `scriptPath` está correto?
6. ✅ Template HBS existe?
7. ✅ Script JS foi compilado?

**Debug:**

```bash
# Verificar se provider está registrado
grep -r "MyWidgetProvider" morpheus-home-dashboard-plugin/src/main/groovy/

# Verificar se template existe
ls -l morpheus-home-dashboard-plugin/src/main/resources/renderer/hbs/

# Verificar se script foi compilado
ls -l morpheus-home-dashboard-plugin/build/assets/
```

### Dados Não Carregam

**Sintomas:** Widget mostra loading indefinidamente ou vazio

**Debug:**

1. **Abra Network tab** no DevTools
2. **Filtre** por XHR/Fetch
3. **Verifique**:
   - API foi chamada?
   - Status code? (200, 403, 500)
   - Response payload?
   - Headers corretos?

**Código de debug:**

```javascript
loadData() {
    console.log('API call starting...');
    const query = {max: 25, sort: 'name'};
    console.log('Query:', query);
    
    Morpheus.api.instances.list(query)
        .then(results => {
            console.log('Success:', results);
            if (!results || !results.data) {
                console.warn('Empty response!');
            }
            this.setData(results);
        })
        .catch(error => {
            console.error('API Error:', error);
            console.error('Status:', error.status);
            console.error('Message:', error.message);
        });
}
```

### Chart Não Renderiza

**Sintomas:** Dados carregam mas gráfico não aparece

**Checklist:**

1. ✅ Dados estão no formato correto?
2. ✅ Chart ID é único (use `Morpheus.utils.generateGuid()`)?
3. ✅ Chart config é válido?
4. ✅ C3.js está carregado?

**Debug:**

```javascript
prepareChartData() {
    const items = this.state.data?.items || [];
    console.log('Raw items:', items);
    
    const chartData = items.map(item => [item.name, item.value]);
    console.log('Chart data formatted:', chartData);
    
    if (chartData.length === 0) {
        console.warn('No chart data to display');
    }
    
    return chartData;
}

render() {
    if (!this.state.loaded) {
        return <LoadingWidget isLoading={true}/>;
    }
    
    const chartData = this.prepareChartData();
    const colors = Morpheus.chart.extractColors(chartData);
    
    console.log('Rendering chart:', {
        dataCount: chartData.length,
        colors: colors,
        config: this.chartConfig
    });
    
    return (
        <DonutChartWidget 
            data={chartData}
            colors={colors}
            config={this.chartConfig}
        />
    );
}
```

### Auto-Refresh Não Funciona

**Checklist:**

1. ✅ `refreshData()` está bound no constructor?
2. ✅ Event listener está registrado?
3. ✅ `autoRefresh` state está `true`?
4. ✅ Cleanup está implementado?

**Debug:**

```javascript
constructor(props) {
    super(props);
    this.state = {
        autoRefresh: true
    };
    // CRITICAL: Bind method
    this.refreshData = this.refreshData.bind(this);
    console.log('Auto-refresh enabled:', this.state.autoRefresh);
}

componentDidMount() {
    console.log('Registering refresh handler');
    $(document).on('morpheus:refresh', this.refreshData);
}

refreshData() {
    console.log('Refresh triggered, autoRefresh:', this.state.autoRefresh);
    if (this.state.autoRefresh) {
        console.log('Reloading data...');
        this.loadData();
    }
}

componentWillUnmount() {
    console.log('Cleaning up refresh handler');
    $(document).off('morpheus:refresh', this.refreshData);
}
```

### Erro de Permissão (403)

**Sintomas:** API retorna 403 Forbidden

**Causas:**

1. Usuário não tem permissão necessária
2. Permissão configurada incorretamente no provider
3. Access types não incluem a ação necessária

**Debug:**

```groovy
// No Provider
@Override
DashboardItemType getDashboardItemType() {
    def rtn = new DashboardItemType()
    // ...
    
    // Log permission lookup
    def permission = morpheusContext.getPermission()
        .getByCode('provisioning')
        .blockingGet()
    
    log.info("Permission '${permission?.code}': ${permission}")
    rtn.permission = permission
    
    // Set access types
    def accessTypes = ['read', 'full']
    rtn.setAccessTypes(accessTypes)
    log.info("Access types: ${accessTypes}")
    
    return rtn
}
```

**Solução:**

1. Teste com usuário admin primeiro
2. Verifique permissões no Morpheus: Administration → Roles
3. Use permissões existentes (veja lista abaixo)

**Permissões Comuns:**

- `provisioning` - Instances
- `infrastructure` - Clouds, Servers
- `logs` - Log viewing
- `backups` - Backup operations
- `tasks` - Task executions
- `job-executions` - Job executions
- `activity` - Activity logs
- `admin-health` - Health monitoring

### Métodos Não Bound

**Erro:** `Cannot read property 'setState' of undefined`

**Causa:** Métodos não foram bound no constructor

**Solução:**

```javascript
constructor(props) {
    super(props);
    this.state = { /* ... */ };
    
    // SEMPRE bind todos os métodos que usam 'this'
    this.loadData = this.loadData.bind(this);
    this.setData = this.setData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.handleClick = this.handleClick.bind(this);
}
```

### State Não Atualiza

**Erro:** UI não reflete mudanças de dados

**Causa:** Modificação direta do state

**ERRADO:**
```javascript
// NUNCA faça isso
this.state.data = newData;
this.state.loaded = true;
```

**CORRETO:**
```javascript
// Sempre use setState
const newState = {
    data: newData,
    loaded: true
};
this.setState(newState);
```

---

## Ferramentas e Scripts

### Build Script

```bash
# Build rápido com status
./debug-build.sh
```

### Comandos Gradle Úteis

```bash
# Clean build
./gradlew clean morpheus-home-dashboard-plugin:shadowJar

# Build com stack trace
./gradlew morpheus-home-dashboard-plugin:shadowJar --stacktrace

# Build com info detalhada
./gradlew morpheus-home-dashboard-plugin:shadowJar --info

# Build com debug completo
./gradlew morpheus-home-dashboard-plugin:shadowJar --debug

# Listar tasks disponíveis
./gradlew tasks

# Ver dependências
./gradlew morpheus-home-dashboard-plugin:dependencies
```

### Verificar Assets Compilados

```bash
# Listar assets gerados
ls -lh morpheus-home-dashboard-plugin/build/assets/

# Ver conteúdo de asset específico
cat morpheus-home-dashboard-plugin/build/assets/my-widget.js

# Comparar versões minificada vs não-minificada
diff \
  morpheus-home-dashboard-plugin/build/assets/my-widget.js \
  morpheus-home-dashboard-plugin/build/assets/my-widget.unminified.js
```

### Validar Sintaxe Groovy

```bash
# Verificar sintaxe antes de buildar
groovy -c morpheus-home-dashboard-plugin/src/main/groovy/com/morpheusdata/dashboard/MyProvider.groovy
```

### Buscar no Código

```bash
# Encontrar uso de API
grep -r "Morpheus.api" morpheus-home-dashboard-plugin/src/assets/js/

# Encontrar providers
find morpheus-home-dashboard-plugin/src/main/groovy -name "*Provider.groovy"

# Encontrar templates
find morpheus-home-dashboard-plugin/src/main/resources -name "*.hbs"

# Buscar por código de widget específico
grep -r "dashboard-item-my-widget" morpheus-home-dashboard-plugin/
```

### Watch Mode (Auto-rebuild)

Para desenvolvimento contínuo, use `entr` ou similar:

```bash
# Instalar entr (se não tiver)
# Ubuntu/Debian: apt install entr
# macOS: brew install entr

# Watch e rebuild automático
find morpheus-home-dashboard-plugin/src -type f | entr -c ./debug-build.sh
```

---

## Dicas Avançadas

### 1. Debug Performance

```javascript
componentDidMount() {
    console.time('loadData');
    this.loadData();
}

setData(results) {
    console.timeEnd('loadData');
    this.setState({data: results, loaded: true});
}
```

### 2. Debug State Changes

```javascript
setState(newState) {
    console.log('State before:', this.state);
    console.log('State update:', newState);
    super.setState(newState, () => {
        console.log('State after:', this.state);
    });
}
```

### 3. Debug com React DevTools

Instale a extensão React DevTools no browser:
- Chrome: [React Developer Tools](https://chrome.google.com/webstore)
- Firefox: [React Developer Tools](https://addons.mozilla.org/firefox)

Permite:
- Inspecionar componente hierarchy
- Ver props e state em tempo real
- Track re-renders
- Profile performance

### 4. Network Throttling

No DevTools Network tab:
- Simule conexões lentas (3G, 4G)
- Teste loading states
- Identifique chamadas redundantes

### 5. Preserve Logs

No DevTools Console:
- Enable "Preserve log"
- Mantém logs através de page reloads
- Essencial para debug de erros no load

---

## Checklist de Debug

### Antes de Fazer Upload

- [ ] Build sem erros
- [ ] Sintaxe Groovy validada
- [ ] Provider registrado
- [ ] Código único definido
- [ ] Permissão configurada
- [ ] Paths corretos (template, script)
- [ ] Métodos React bound
- [ ] Console.log adicionados
- [ ] Edge cases tratados

### Após Upload

- [ ] Plugin aparece em Plugins list
- [ ] Widget aparece em dashboard
- [ ] Dados carregam corretamente
- [ ] Charts renderizam
- [ ] Auto-refresh funciona
- [ ] Sem erros no console
- [ ] Sem erros HTTP (403, 500)
- [ ] Performance aceitável
- [ ] Funciona com diferentes permissões

---

## Recursos Adicionais

- [Morpheus Developer Docs](https://developer.morpheusdata.com)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [C3.js Documentation](https://c3js.org)
- [Groovy Documentation](https://groovy-lang.org/documentation.html)

---

**Última atualização:** 2025-11-10
