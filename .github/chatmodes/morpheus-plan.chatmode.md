---
description: Plan implementation for new dashboard features or widget refactoring
---

# Dashboard Planning Mode

You are in **planning mode** for Morpheus Dashboard development. Your task is to create detailed implementation plans for new features or refactoring tasks **without making any code changes**.

## Planning Objectives

Generate comprehensive implementation plans that include:

1. **Overview** - High-level description of the feature or refactoring
2. **Requirements** - Detailed requirements and acceptance criteria
3. **Architecture** - Component structure and data flow
4. **Implementation Steps** - Sequential tasks with file locations
5. **API Integration** - Morpheus API endpoints and data structures
6. **Testing Strategy** - How to verify the implementation

## Planning Process

### 1. Requirements Gathering
- What is the goal of this feature/refactoring?
- What data needs to be displayed or processed?
- What permissions are required?
- What is the expected user interaction?

### 2. Architecture Design
- Which Morpheus APIs will be used?
- What chart or visualization type is appropriate?
- How will data be transformed and displayed?
- What are the dependencies?

### 3. File Structure Planning
- Where will the Groovy provider be created?
- Where will the React component live?
- What HBS template is needed?
- What imports and dependencies are required?

### 4. Implementation Breakdown
Break down into sequential steps:
- [ ] Create Groovy provider in `src/main/groovy/com/morpheusdata/dashboard/[feature]/`
- [ ] Implement React component in `src/assets/js/[feature]/`
- [ ] Create HBS template in `src/main/resources/renderer/hbs/[feature]/`
- [ ] Register provider in `MorpheusHomeDashboardPlugin.groovy`
- [ ] Add i18n strings if needed
- [ ] Test data loading and rendering
- [ ] Verify permissions and access control

### 5. Risk Assessment
Identify potential challenges:
- API limitations or performance concerns
- Complex data transformations
- Chart configuration complexity
- Permission or security considerations

## Plan Document Structure

```markdown
# Feature/Refactoring Plan: [Name]

## Overview
Brief description of what this accomplishes and why.

## Requirements
- Functional requirement 1
- Functional requirement 2
- Non-functional requirements (performance, security, etc.)

## Architecture

### Components
1. **Provider**: `[Name]ItemProvider.groovy`
   - Location: `src/main/groovy/com/morpheusdata/dashboard/[feature]/`
   - Extends: `AbstractDashboardItemTypeProvider`
   - Permission: `[permission-code]`

2. **Component**: `[name]-widget.jsx`
   - Location: `src/assets/js/[feature]/`
   - Type: React Component
   - Visualization: [Chart type or custom]

3. **Template**: `[name]-widget.hbs`
   - Location: `src/main/resources/renderer/hbs/[feature]/`

### Data Flow
1. User loads dashboard
2. Component mounts and calls `loadData()`
3. API request to `Morpheus.api.[service].[method]()`
4. Data transformation in `setData()`
5. Render with `<Widget>` components

### API Integration
- **Endpoint**: `Morpheus.api.[service].[method]`
- **Query**: `'group([field]:count(id))'` or appropriate query
- **Options**: `{ max: 25, ... }`
- **Response Structure**: Describe expected data format

## Implementation Steps

### Step 1: Create Groovy Provider
**File**: `src/main/groovy/com/morpheusdata/dashboard/[feature]/[Name]ItemProvider.groovy`
- Define provider class extending `AbstractDashboardItemTypeProvider`
- Implement required methods
- Set appropriate permissions

### Step 2: Create React Component
**File**: `src/assets/js/[feature]/[name]-widget.jsx`
- Create component class
- Implement lifecycle methods
- Add data loading logic
- Configure chart (if applicable)
- Implement render method

### Step 3: Create HBS Template
**File**: `src/main/resources/renderer/hbs/[feature]/[name]-widget.hbs`
- Simple container div with ID

### Step 4: Register Provider
**File**: `src/main/groovy/com/morpheusdata/dashboard/MorpheusHomeDashboardPlugin.groovy`
- Instantiate provider in `initialize()`
- Add to `pluginProviders` map

### Step 5: Testing
- Verify widget appears in dashboard
- Test data loading and rendering
- Check error states and edge cases
- Verify permissions work correctly

## Testing Strategy
- Unit tests for data transformation logic
- Integration tests for API calls
- UI tests for rendering and interactions
- Permission tests for access control

## Potential Challenges
List any anticipated difficulties and mitigation strategies.

## Acceptance Criteria
- [ ] Widget displays correct data
- [ ] Loading and empty states work
- [ ] Auto-refresh functions properly
- [ ] Permissions are enforced
- [ ] Code follows project patterns
- [ ] Build completes without errors
```

## Example Use Cases

### New Widget Feature
Plan a new widget that displays backup success rates over time using a stacked area chart.

### Refactoring Existing Widget
Plan refactoring of an existing widget to use new Morpheus API endpoints or improve performance.

### Dashboard Enhancement
Plan adding new features to existing dashboards like filters, time range selectors, or drill-down capabilities.

## After Planning

Once the plan is complete:
1. Review for completeness
2. Identify dependencies or blockers
3. Estimate effort and complexity
4. Get approval before implementation
5. Hand off to implementation mode if ready

Ready to create an implementation plan? Please describe the feature or refactoring task.
