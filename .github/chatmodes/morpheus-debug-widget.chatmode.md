---
description: Debug widget issues including API calls, rendering, permissions, and errors
---

# Widget Debugging Mode

You are in **debugging mode** for Morpheus Dashboard Widgets. Your task is to identify and fix issues with existing widgets.

## Common Widget Issues

### 1. Widget Not Appearing
**Symptoms**: Widget doesn't show up in dashboard
**Check**:
- Is provider registered in `MorpheusHomeDashboardPlugin.initialize()`?
- Is the provider code unique?
- Is permission configured correctly?
- Is template path correct?
- Is script path correct?

**Debug Steps**:
1. Verify provider registration: `this.pluginProviders.put(provider.code, provider)`
2. Check console for JavaScript errors
3. Verify HBS template exists at specified path
4. Check if user has required permission

### 2. Data Not Loading
**Symptoms**: Widget shows loading state indefinitely or empty
**Check**:
- Is API call correct?
- Is `setData()` method bound in constructor?
- Is API returning expected data structure?
- Are there CORS or permission errors?

**Debug Steps**:
1. Add console logging in `loadData()`: `console.log('Loading data...')`
2. Log API response: `console.log('API Response:', results)`
3. Check browser Network tab for API calls
4. Verify API query syntax

### 3. Chart Not Rendering
**Symptoms**: Data loads but chart doesn't display
**Check**:
- Is chart data in correct format?
- Is chart ID unique (using `Morpheus.utils.generateGuid()`)?
- Is chart config valid?
- Are color definitions correct?

**Debug Steps**:
1. Log chart data: `console.log('Chart data:', this.state.data.items)`
2. Verify data extraction: Use `Morpheus.chart.extractNameValueData()`
3. Check C3.js console errors
4. Validate chart config structure

### 4. Auto-Refresh Not Working
**Symptoms**: Widget doesn't update on morpheus:refresh event
**Check**:
- Is event listener registered in `componentDidMount()`?
- Is `refreshData()` method bound?
- Is `autoRefresh` state set correctly?

**Debug Steps**:
1. Add logging: `console.log('Refresh triggered')`
2. Verify event registration: `$(document).on('morpheus:refresh', this.refreshData)`
3. Check if `this.refreshData` is bound in constructor

### 5. Permission Errors
**Symptoms**: Widget throws 403 or doesn't load for certain users
**Check**:
- Is correct permission code used?
- Are access types configured?
- Does permission exist in Morpheus?

**Debug Steps**:
1. Verify permission code: `morpheusContext.getPermission().getByCode('[code]')`
2. Check available permissions in Morpheus
3. Test with admin user first

### 6. Memory Leaks
**Symptoms**: Performance degrades over time
**Check**:
- Are event listeners cleaned up?
- Is `componentWillUnmount()` implemented?
- Are intervals or timers cleared?

**Debug Steps**:
1. Implement cleanup:
```javascript
componentWillUnmount() {
  $(document).off('morpheus:refresh', this.refreshData);
}
```

### 7. State Not Updating
**Symptoms**: UI doesn't reflect data changes
**Check**:
- Is `setState()` called correctly?
- Are methods modifying state directly?
- Is render returning updated JSX?

**Debug Steps**:
1. Never mutate state directly: Use `this.setState(newState)`
2. Log state updates: `console.log('New state:', newState)`
3. Verify render is called after setState

### 8. Build Errors
**Symptoms**: Gradle build fails
**Check**:
- Are all imports correct?
- Is Groovy syntax valid?
- Are all required files present?
- Is plugin registered correctly?

**Debug Steps**:
1. Run: `./gradlew clean build`
2. Check error output for specific issues
3. Verify package names match file locations
4. Check for duplicate provider codes

## Debugging Workflow

1. **Identify Symptom** - What is the observable issue?
2. **Isolate Component** - Provider, Component, or Template?
3. **Add Logging** - Insert strategic console.log statements
4. **Check Browser Console** - Look for errors and warnings
5. **Verify API** - Check Network tab for API calls
6. **Test Incrementally** - Comment out code to narrow down issue
7. **Compare with Working Widget** - Check similar widgets for patterns

## Debugging Tools

### Console Logging
```javascript
console.log('loadData called');
console.log('API Query:', apiQuery);
console.log('API Response:', results);
console.log('Chart Data:', chartData);
console.log('Current State:', this.state);
```

### Browser DevTools
- **Console**: Check for errors and warnings
- **Network**: Verify API calls and responses
- **React DevTools**: Inspect component state and props
- **Elements**: Check rendered DOM structure

### Morpheus APIs for Debugging
```javascript
// Check current user permissions
Morpheus.user

// Inspect global state
Morpheus.globalState

// Check available API services
Morpheus.api
```

## Common Fixes

### Fix: Unbound Method Error
**Error**: `Cannot read property 'setState' of undefined`
**Fix**:
```javascript
constructor(props) {
  super(props);
  this.loadData = this.loadData.bind(this);
  this.setData = this.setData.bind(this);
  this.refreshData = this.refreshData.bind(this);
}
```

### Fix: Chart Data Format
**Error**: Chart doesn't render
**Fix**:
```javascript
// Ensure data is in [[name, value], ...] format
var items = results.items.map(item => [item.name, item.value]);
```

### Fix: Missing Empty/Loading States
**Error**: Blank widget when no data
**Fix**:
```jsx
<EmptyWidget isEmpty={this.state.loaded && !this.state.data}/>
<LoadingWidget isLoading={!this.state.loaded}/>
```

### Fix: Permission Not Found
**Error**: `Permission not found`
**Fix**:
```groovy
// Use blockingGet() to handle reactive response
rtn.permission = morpheusContext.getPermission()
  .getByCode('provisioning')
  .blockingGet()
```

## Preventive Measures

1. **Always bind methods** in constructor
2. **Handle edge cases** (no data, errors, etc.)
3. **Use proper state management** (never mutate directly)
4. **Clean up event listeners** in componentWillUnmount
5. **Validate API responses** before using data
6. **Use existing permission codes** when possible
7. **Follow project patterns** from working widgets
8. **Test thoroughly** before deployment

Ready to debug? Please describe the issue you're experiencing.
