---
description: Create a complete new Morpheus dashboard widget with provider, component, and template
---

# New Morpheus Widget Creator Mode

You are in **widget creation mode** for Morpheus Dashboard Plugins. Your task is to create a complete, production-ready dashboard widget following the project's established patterns.

## Your Mission

Create all required files for a new dashboard widget:

1. **Groovy Provider** (`AbstractDashboardItemTypeProvider`)
2. **React Component** (JSX with proper lifecycle)
3. **Handlebars Template** (HBS container)
4. **Register in Plugin** (Update `MorpheusHomeDashboardPlugin.groovy`)

## File Creation Checklist

### 1. Groovy Provider
- **Location**: `src/main/groovy/com/morpheusdata/dashboard/[feature]/[Name]ItemProvider.groovy`
- **Pattern**: Extend `AbstractDashboardItemTypeProvider`
- **Required Methods**: `getCode()`, `getName()`, `getDashboardItemType()`, `getMorpheus()`, `getPlugin()`
- **Code Convention**: `dashboard-item-[feature]-[widget-name]`
- **Permission**: Use existing permission codes from `morpheusContext.getPermission().getByCode()`

### 2. React Component
- **Location**: `src/assets/js/[feature]/[widget-name]-widget.jsx`
- **Pattern**: Extend `React.Component`
- **Required Methods**: `constructor()`, `componentDidMount()`, `loadData()`, `setData()`, `render()`
- **Bind Methods**: All methods must be bound in constructor
- **Auto-refresh**: Listen to `morpheus:refresh` event
- **State Management**: Initialize with `loaded`, `autoRefresh`, `data`

### 3. Handlebars Template
- **Location**: `src/main/resources/renderer/hbs/[feature]/[widget-name]-widget.hbs`
- **Content**: Simple div with ID matching component registration

### 4. Plugin Registration
- **File**: `src/main/groovy/com/morpheusdata/dashboard/MorpheusHomeDashboardPlugin.groovy`
- **Action**: Add provider instantiation and registration in `initialize()` method
- **Pattern**: `this.pluginProviders.put(provider.code, provider)`

## Widget Patterns to Follow

### Data Loading Pattern
```javascript
loadData() {
  var apiQuery = 'group(status:count(id))';
  var apiOptions = { max: 25 };
  // Replace [service] and [method] with actual API calls like:
  // Morpheus.api.instances.count(apiQuery, apiOptions).then(this.setData);
}
```

### Chart Configuration Pattern
```jsx
configureChart() {
  return {
    size: { height: 180, width: 340 },
    legend: { show: true, position: 'right' },
    tooltip: { 
      show: true,
      contents: Morpheus.chart.defaultTooltip 
    }
  };
}
```

### Widget Components to Use
- `<Widget>` - Container
- `<WidgetHeader>` - Title with icon and link
- `<DonutChartWidget>` / `<PieChartWidget>` / `<StackedChartWidget>` - Charts
- `<EmptyWidget>` - No data state
- `<LoadingWidget>` - Loading state

## Required Information

Before creating files, gather:
1. **Widget Name** - What should this widget be called?
2. **Feature Category** - instances, clouds, clusters, health, tasks, jobs, backups, etc.
3. **Data Source** - Which Morpheus API to use?
4. **Visualization** - Chart type or custom display?
5. **Permission** - Which permission code applies?
6. **Size** - sm, md, lg, xl

## Step-by-Step Process

1. **Analyze Requirements** - Ask clarifying questions if needed
2. **Create Groovy Provider** - Following the established pattern
3. **Create React Component** - With proper lifecycle and data handling
4. **Create HBS Template** - Simple container div
5. **Register Provider** - Update plugin initialization
6. **Verify Structure** - Ensure all files are in correct locations

## Important Conventions

- Always use `@Slf4j` for logging in Groovy
- Bind all methods in React constructor
- Use `Morpheus.utils.generateGuid()` for chart IDs
- Apply `Morpheus.timeService.refresh()` in `componentDidUpdate()`
- Follow naming: `dashboard-item-[feature]-[name]`
- Use existing permission codes when possible
- Include proper JSDoc comments

## After Creation

Once all files are created:
1. Verify file locations match project structure
2. Confirm provider is registered in plugin
3. Check for any syntax errors
4. Suggest running the build to test

Ready to create a new widget? Please provide the widget details or ask for clarification on any requirements.
