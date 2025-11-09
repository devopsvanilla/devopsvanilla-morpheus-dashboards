# Morpheus Dashboard Plugin Development Guide

## Project Context

This workspace develops **Morpheus Dashboard Plugins** for the MorpheusData Appliance UI using:
- **Backend**: Groovy (Java 17+) with Gradle
- **Frontend**: React/JSX components with C3.js charts
- **Build**: Gradle 7.3+ with Shadow JAR plugin
- **Plugin Architecture**: Extends Morpheus Plugin Core API

## Project Structure

```
morpheus-home-dashboard-plugin/
├── src/main/groovy/com/morpheusdata/dashboard/     # Dashboard providers
│   ├── [feature]/                                   # Feature-specific providers
│   ├── HomeDashboardProvider.groovy                 # Main dashboard provider
│   └── MorpheusHomeDashboardPlugin.groovy          # Plugin entry point
├── src/assets/js/                                   # React widget components
│   └── [feature]/                                   # Feature-specific widgets
└── src/main/resources/renderer/hbs/                 # Handlebars templates
    └── [feature]/                                   # Widget container templates
```

## Code Patterns

### Groovy Dashboard Item Provider Pattern

```groovy
package com.morpheusdata.dashboard

import com.morpheusdata.core.dashboard.AbstractDashboardItemTypeProvider
import com.morpheusdata.core.MorpheusContext
import com.morpheusdata.core.Plugin
import com.morpheusdata.model.DashboardItemType
import groovy.util.logging.Slf4j

@Slf4j
class MyWidgetItemProvider extends AbstractDashboardItemTypeProvider {
    Plugin plugin
    MorpheusContext morpheusContext

    MyWidgetItemProvider(Plugin plugin, MorpheusContext context) {
        this.plugin = plugin
        this.morpheusContext = context
    }

    @Override
    String getCode() {
        return 'dashboard-item-my-widget'
    }

    @Override
    String getName() {
        return 'My Widget Display Name'
    }

    @Override
    DashboardItemType getDashboardItemType() {
        def rtn = new DashboardItemType()
        rtn.name = getName()
        rtn.code = getCode()
        rtn.category = 'category-name'
        rtn.title = 'widget title'
        rtn.description = 'widget description'
        rtn.uiSize = 'md' // sm, md, lg, xl
        rtn.templatePath = 'hbs/path/to/template'
        rtn.scriptPath = 'path/to/script.js'
        rtn.permission = morpheusContext.getPermission().getByCode('permission-code').blockingGet()
        def accessTypes = ['read', 'full']
        rtn.setAccessTypes(accessTypes)
        return rtn
    }
}
```

### React Widget Component Pattern

```jsx
/**
 * Widget description
 * @author your-name
 */
class MyWidget extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loaded: false,
      autoRefresh: true
    };
    // Bind methods
    this.setData = this.setData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
    $(document).on('morpheus:refresh', this.refreshData);
  }

  refreshData() {
    if(this.state.autoRefresh == true)
      this.loadData();
  }

  loadData() {
    // Use Morpheus.api.* methods
    Morpheus.api.instances.list({max: 25}).then(this.setData);
  }

  setData(results) {
    var newState = {};
    newState.data = results;
    newState.loaded = true;
    this.setState(newState);
  }

  render() {
    return (
      <Widget>
        <WidgetHeader icon="/assets/icon.svg" title="My Widget" link="/path"/>
        <div className="dashboard-widget-content">
          {/* Content here */}
        </div>
        <EmptyWidget isEmpty={this.state.loaded && !this.state.data}/>
        <LoadingWidget isLoading={!this.state.loaded}/>
      </Widget>
    );
  }
}

// Registration
Morpheus.components.register('my-widget', MyWidget);

$(document).ready(function() {
  const root = ReactDOM.createRoot(document.querySelector('#my-widget'));
  root.render(<MyWidget/>)
});
```

## File Organization

- **Groovy Providers**: `src/main/groovy/com/morpheusdata/dashboard/[feature]/`
- **React Components**: `src/assets/js/[feature]/`
- **Templates (HBS)**: `src/main/resources/renderer/hbs/[feature]/`
- **Provider Registration**: Add to `MorpheusHomeDashboardPlugin.initialize()`

## Common APIs

### Data Loading
```javascript
Morpheus.api.instances.list(options)
Morpheus.api.instances.count(query, options)
Morpheus.api.servers.count(query, options)
Morpheus.api.activity.recent(query, options)
Morpheus.api.logs.trends(query, options)
```

### Chart Configuration
```javascript
var chartConfig = {
  size: { height: 140, width: 340 },
  legend: { show: true, position: 'inset' },
  tooltip: { 
    show: true, 
    contents: Morpheus.chart.defaultTooltip 
  }
};
```

### UI Components
- `<Widget>` - Main container
- `<WidgetHeader>` - Title with icon and link
- `<WidgetPills>` - Filter selector
- `<DonutChartWidget>` - Donut chart
- `<PieChartWidget>` - Pie chart
- `<StackedChartWidget>` - Stacked area chart
- `<EmptyWidget>` - No data state
- `<LoadingWidget>` - Loading state

## Widget Sizes

- `sm` - Small (single column)
- `md` - Medium (2 columns)
- `lg` - Large (3 columns)
- `xl` - Extra large (full width)

## Common Permission Codes

- `provisioning` - Instances/provisioning
- `infrastructure` - Clouds, servers, clusters
- `logs` - Log viewing
- `backups` - Backup operations
- `tasks` - Task executions
- `job-executions` - Job executions
- `activity` - Activity logs

## Build Commands

```bash
# Build all plugins
./gradlew shadowJar

# Build specific plugin
./gradlew morpheus-home-dashboard-plugin:shadowJar
```

## Important Conventions

1. Always use `@Slf4j` for logging in Groovy classes
2. Bind all component methods in constructor
3. Use `Morpheus.utils.message()` or `$L({code:'key'})` for i18n
4. Listen to `morpheus:refresh` event for auto-refresh
5. Use `Morpheus.chart.extractNameValueData()` for chart data extraction
6. Use `Morpheus.timeService.getMoment()` for time formatting

## When Creating New Widgets

1. Create Groovy provider extending `AbstractDashboardItemTypeProvider`
2. Create React component following the standard pattern
3. Create HBS template with div container
4. Register provider in `MorpheusHomeDashboardPlugin.initialize()`
5. Use existing permission codes when possible
6. Follow naming convention: `dashboard-item-{feature}-{widget-name}`

## Dependencies

- Morpheus Plugin Core: [developer.morpheusdata.com](https://developer.morpheusdata.com)
- React: Provided by Morpheus runtime
- C3.js: Chart library (provided)
- jQuery: Provided by Morpheus runtime
