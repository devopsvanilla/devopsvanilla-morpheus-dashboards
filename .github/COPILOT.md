# GitHub Copilot Configuration Guide

This repository is configured with custom GitHub Copilot instructions and chat modes to enhance AI-assisted development for Morpheus Dashboard Plugins.

## 📋 Table of Contents

- [Overview](#overview)
- [Custom Instructions](#custom-instructions)
- [Custom Chat Modes](#custom-chat-modes)
- [How to Use](#how-to-use)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [References](#references)

---

## 🎯 Overview

This repository includes two types of GitHub Copilot customizations:

1. **Custom Instructions** (`.github/copilot-instructions.md`) - Provides global context about project patterns, architecture, and conventions
2. **Custom Chat Modes** (`.github/chatmodes/*.chatmode.md`) - Specialized workflows for specific development tasks

### Benefits

✅ **Context-Aware Suggestions** - Copilot understands Morpheus plugin patterns  
✅ **Faster Development** - Pre-configured workflows for common tasks  
✅ **Consistent Code** - Follows project conventions automatically  
✅ **Reduced Errors** - Best practices built into suggestions  
✅ **Better Collaboration** - Shared knowledge encoded in configuration  

---

## 📚 Custom Instructions

**File**: `.github/copilot-instructions.md`

### What It Does

Provides **always-active** context to GitHub Copilot about:
- Project structure and architecture
- Groovy provider patterns
- React component patterns
- Morpheus API usage
- Chart configurations
- File organization conventions
- Common patterns and utilities
- Build commands
- Dependencies

### When It's Used

**Automatically** applied to:
- ✅ Code completions (inline suggestions)
- ✅ Chat conversations
- ✅ Code explanations
- ✅ Refactoring suggestions
- ✅ All Copilot interactions

### Example Impact

When you type:
```javascript
class MyWidget
```

Copilot will automatically suggest:
```javascript
class MyWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      autoRefresh: true,
      data: null,
      chartId: Morpheus.utils.generateGuid()
    };
    this.loadData = this.loadData.bind(this);
    this.setData = this.setData.bind(this);
    // ... following project patterns
  }
}
```

---

## 🎛️ Custom Chat Modes

**Location**: `.github/chatmodes/`

Custom chat modes are **manually invoked** workflows for specific tasks. Each mode has specialized instructions and focuses on a particular development activity.

### Available Chat Modes

#### 1. 🆕 `/morpheus-new-widget` - Widget Creation

**Purpose**: Create complete new dashboard widgets with all required files

**Use When**:
- Starting a new widget from scratch
- Need guidance on file structure
- Want to follow project patterns exactly

**What It Does**:
- Creates Groovy provider extending `AbstractDashboardItemTypeProvider`
- Creates React component with proper lifecycle
- Creates Handlebars template
- Updates plugin registration in `MorpheusHomeDashboardPlugin`
- Follows all naming conventions

**Example Usage**:
```
@workspace /morpheus-new-widget Create a widget showing VM count by status with a donut chart
```

**Expected Output**:
- `src/main/groovy/com/morpheusdata/dashboard/[feature]/[Name]ItemProvider.groovy`
- `src/assets/js/[feature]/[name]-widget.jsx`
- `src/main/resources/renderer/hbs/[feature]/[name]-widget.hbs`
- Updated `MorpheusHomeDashboardPlugin.groovy`

---

#### 2. 🔨 `/morpheus-build-plugin` - Plugin Build

**Purpose**: Compile and package the plugin into a JAR file

**Use When**:
- Ready to test changes
- Preparing for deployment
- Need to verify build succeeds

**What It Does**:
- Runs Gradle shadowJar task
- Shows build output location
- Provides installation instructions
- Offers clean build options

**Example Usage**:
```
@workspace /morpheus-build-plugin
```

**Expected Output**:
```bash
./gradlew shadowJar
# Output: morpheus-home-dashboard-plugin/build/libs/morpheus-home-dashboard-plugin-[version].jar
```

---

#### 3. 🔍 `/morpheus-review-widget` - Code Review

**Purpose**: Analyze existing widgets for best practices and potential issues

**Use When**:
- Reviewing code before commit
- Learning from existing widgets
- Identifying improvement opportunities
- Debugging subtle issues

**What It Does**:
- Checks architecture patterns
- Validates code quality
- Reviews Morpheus API usage
- Analyzes React lifecycle
- Evaluates UI/UX
- Assesses performance
- Provides structured recommendations

**Example Usage**:
```
@workspace /morpheus-review-widget Review the instance-count-widget for best practices
```

**Expected Output**:
- Summary of code quality
- List of strengths
- Issues found with severity
- Specific recommendations with code examples
- Best practices alignment

---

#### 4. 📋 `/morpheus-plan` - Implementation Planning

**Purpose**: Generate detailed implementation plans WITHOUT writing code

**Use When**:
- Planning new features
- Scoping refactoring work
- Need architecture design
- Want to estimate effort
- Require approval before coding

**What It Does**:
- Analyzes requirements
- Designs architecture
- Creates step-by-step implementation plan
- Identifies risks and challenges
- Defines testing strategy
- Produces detailed documentation

**Example Usage**:
```
@workspace /morpheus-plan Plan a new widget showing backup success rates over the last 30 days
```

**Expected Output**:
```markdown
# Implementation Plan: Backup Success Rate Widget

## Overview
...

## Requirements
- Display backup success/failure rates
- Show trend over 30 days
- Use stacked area chart
...

## Architecture
...

## Implementation Steps
1. Create BackupSuccessRateItemProvider
2. Create backup-success-rate-widget.jsx
...

## Testing Strategy
...
```

---

#### 5. 🐛 `/morpheus-debug-widget` - Widget Debugging

**Purpose**: Diagnose and fix issues with existing widgets

**Use When**:
- Widget not appearing
- Data not loading
- Charts not rendering
- Auto-refresh broken
- Permission errors
- Memory leaks
- State update issues
- Build failures

**What It Does**:
- Identifies common issues
- Provides diagnostic steps
- Suggests fixes with code examples
- Offers debugging tools
- Lists preventive measures

**Example Usage**:
```
@workspace /morpheus-debug-widget The cloud-count-type widget loads but the chart doesn't render
```

**Expected Output**:
- Issue diagnosis
- Step-by-step debugging workflow
- Code fixes
- Console logging suggestions
- Browser DevTools tips

---

## 🚀 How to Use

### Setup (Automatic)

✅ **Already configured!** The custom instructions and chat modes are automatically detected by VS Code when you open this workspace.

### Using Custom Instructions

**No action needed** - Custom instructions work automatically in all Copilot interactions.

### Using Custom Chat Modes

#### In VS Code Chat View

1. Open the Chat view (`Ctrl+Alt+I` or click chat icon)
2. Type `@workspace /` to see available modes
3. Select a mode from the dropdown
4. Provide your request after the mode name

**Examples**:

```
@workspace /new-widget Create a widget for task execution statistics
```

```
@workspace /plan Plan refactoring the instance-count-widget to use new API
```

```
@workspace /review-widget Review health/current-health-widget.jsx
```

```
@workspace /debug-widget Widget shows loading spinner forever
```

```
@workspace /build-plugin
```

#### Mode Selection

You can also select modes from the Chat view UI:
1. Click the mode selector dropdown (shows current mode)
2. Choose from available custom modes
3. Enter your prompt

---

## 💡 Best Practices

### When to Use Custom Chat Modes

| Task | Recommended Mode |
|------|-----------------|
| Creating new widget | `/morpheus-new-widget` |
| Building JAR | `/morpheus-build-plugin` |
| Code review | `/morpheus-review-widget` |
| Feature planning | `/morpheus-plan` |
| Fixing bugs | `/morpheus-debug-widget` |
| General questions | Default chat (no mode) |

### Workflow Recommendations

#### 1. New Feature Workflow

```
1. @workspace /morpheus-plan [describe feature]
   → Review and refine the plan

2. @workspace /morpheus-new-widget [create based on plan]
   → Implement the widget files

3. @workspace /morpheus-review-widget [widget-name]
   → Check for issues

4. @workspace /morpheus-build-plugin
   → Compile and test

5. @workspace /morpheus-debug-widget [if issues found]
   → Fix any problems
```

#### 2. Refactoring Workflow

```
1. @workspace /morpheus-review-widget [existing-widget]
   → Identify improvements

2. @workspace /morpheus-plan [refactoring changes]
   → Create refactoring plan

3. Make changes with Copilot assistance
   → Custom instructions guide implementation

4. @workspace /morpheus-review-widget [widget-name]
   → Verify improvements

5. @workspace /morpheus-build-plugin
   → Build and test
```

#### 3. Bug Fix Workflow

```
1. @workspace /morpheus-debug-widget [describe issue]
   → Get diagnostic steps

2. Apply suggested fixes
   → Custom instructions help with code

3. @workspace /morpheus-build-plugin
   → Test the fix

4. @workspace /morpheus-review-widget [widget-name]
   → Ensure quality
```

### Tips for Effective Usage

✅ **Be Specific** - Provide clear, detailed descriptions
```
❌ Create a widget
✅ Create a widget showing backup success rate over 30 days using a stacked area chart
```

✅ **Provide Context** - Mention feature category, APIs, permissions
```
@workspace /morpheus-new-widget Create a clusters widget using Morpheus.api.clusters.count()
```

✅ **Use Correct Mode** - Planning vs Implementation
```
Planning → Use /morpheus-plan (no code)
Implementation → Use /morpheus-new-widget (creates code)
```

✅ **Review Before Committing** - Always review generated code
```
@workspace /morpheus-review-widget [newly-created-widget]
```

✅ **Iterate** - Use multiple modes in sequence
```
/morpheus-plan → /morpheus-new-widget → /morpheus-review-widget → /morpheus-debug-widget → /morpheus-build-plugin
```

---

## 🔧 Troubleshooting

### Chat Modes Not Appearing

**Problem**: Custom chat modes don't show in dropdown

**Solutions**:
1. Ensure files are in `.github/chatmodes/` directory
2. Files must have `.chatmode.md` extension
3. Reload VS Code window (`Ctrl+Shift+P` → "Reload Window")
4. Update to latest VS Code version (1.101+)

### Custom Instructions Not Working

**Problem**: Copilot not following project patterns

**Solutions**:
1. Verify `.github/copilot-instructions.md` exists
2. Check file format (must be valid Markdown)
3. Reload VS Code window
4. Clear Copilot cache: `Ctrl+Shift+P` → "Clear Chat History"

### Mode Shows Error

**Problem**: Chat mode fails when invoked

**Solutions**:
1. Check frontmatter syntax (YAML must be valid)
2. Ensure description is present
3. Remove invalid tool references
4. Check for syntax errors in mode file

### Generated Code Doesn't Match Patterns

**Problem**: Code doesn't follow project conventions

**Solutions**:
1. Use specific chat mode instead of general chat
2. Provide more context in prompt
3. Reference existing widgets in prompt: "Follow pattern from instance-count-widget"
4. Use `/morpheus-review-widget` to check compliance

---

## 📖 References

### Official Documentation

- **Custom Chat Modes**: [code.visualstudio.com/docs/copilot/customization/custom-chat-modes](https://code.visualstudio.com/docs/copilot/customization/custom-chat-modes)
- **Custom Instructions**: [code.visualstudio.com/docs/copilot/customization/custom-instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- **Awesome Copilot Customizations**: [developer.microsoft.com/blog/introducing-awesome-github-copilot-customizations-repo](https://developer.microsoft.com/blog/introducing-awesome-github-copilot-customizations-repo)

### Morpheus Documentation

- **Plugin Development**: [developer.morpheusdata.com](https://developer.morpheusdata.com)
- **API Documentation**: Available in your Morpheus appliance at `/api-doc`

### Project Files

- **Custom Instructions**: [`.github/copilot-instructions.md`](.github/copilot-instructions.md)
- **Chat Modes Directory**: [`.github/chatmodes/`](.github/chatmodes/)
- **Widget Examples**: [`morpheus-home-dashboard-plugin/src/assets/js/`](../morpheus-home-dashboard-plugin/src/assets/js/)

---

## 🤝 Contributing

### Improving Chat Modes

To enhance or add new chat modes:

1. Create new `.chatmode.md` file in `.github/chatmodes/`
2. Follow the structure:
   ```markdown
   ---
   description: Brief description of what this mode does
   ---
   
   # Mode Name
   
   Detailed instructions for the AI...
   ```
3. Test the mode thoroughly
4. Update this documentation

### Updating Custom Instructions

To improve custom instructions:

1. Edit `.github/copilot-instructions.md`
2. Add new patterns or update existing ones
3. Keep examples concise and accurate
4. Test with actual development tasks
5. Update this guide if needed

---

## 📝 Summary

This repository provides:

- ✅ **1 Custom Instruction file** - Global project context
- ✅ **5 Custom Chat Modes** - Specialized workflows
- ✅ **Complete documentation** - This guide
- ✅ **Best practices** - Proven patterns
- ✅ **Troubleshooting** - Common issues solved

**Result**: Faster, more accurate, and more consistent Morpheus plugin development with AI assistance!

---

*Last updated: November 9, 2025*
