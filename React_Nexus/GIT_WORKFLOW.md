# Git Collaboration Workflow

## 📋 Overview
This document outlines the Git workflow and best practices for the Nexus Weather project to ensure smooth collaboration and maintain code quality.

## 🌳 Branch Strategy

### Main Branches
- **`main`** - Production-ready code only
- **`develop`** - Integration branch for features (optional)

### Feature Branches
- **`feature/weather-search`** - New search functionality
- **`feature/air-quality`** - Air quality integration
- **`bugfix/api-error-handling`** - Bug fixes
- **`hotfix/critical-bug`** - Emergency fixes

## 🔒 Branch Protection Rules

### Required Settings on GitHub:
1. **Protect main branch**
   - Require pull request reviews before merging
   - Require at least 1 approval
   - Dismiss stale reviews when new commits are pushed
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

2. **Additional Protection**
   - Restrict pushes to main
   - Include administrators in restrictions

## 🚀 Workflow Steps

### 1. Starting New Work

```bash
# Switch to main and get latest changes
git checkout main
git pull origin main

# Create new feature branch
git checkout -b feature/weather-animation
```

### 2. Development Process

```bash
# Make your changes
# Edit files, add features, fix bugs

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add weather condition animations"

# Push branch to remote
git push origin feature/weather-animation
```

### 3. Creating Pull Request

1. **Navigate to GitHub repository**
2. **Click "New Pull Request"**
3. **Select your feature branch**
4. **Fill out PR template:**
   - Clear title describing the change
   - Detailed description of what was added/changed
   - Screenshots if UI changes
   - Testing steps
   - Reference any issues

### 4. Code Review Process

**For Reviewers:**
- Check code quality and consistency
- Test functionality locally
- Verify no console errors/warnings
- Ensure proper prop destructuring
- Check for DRY principles
- Validate error handling

**For Authors:**
- Address all feedback promptly
- Make requested changes
- Re-request review after updates

### 5. Merging

```bash
# After approval, merge via GitHub UI
# Delete feature branch after merge

# Update local main
git checkout main
git pull origin main

# Delete local feature branch
git branch -d feature/weather-animation
```

## 📝 Commit Message Standards

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic changes)
- **refactor**: Code restructuring
- **test**: Adding/updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(search): add recent searches dropdown
fix(api): handle network timeout errors
docs(readme): update installation instructions
style(components): fix indentation in SearchBar
refactor(weather): extract theme logic to utility
test(api): add weather service unit tests
chore(deps): update React to v18.2.0
```

## 🔄 Daily Workflow

### Morning Routine
```bash
git checkout main
git pull origin main
git checkout feature/your-branch
git rebase main  # or git merge main
```

### Before Lunch/End of Day
```bash
git add .
git commit -m "wip: progress on weather component"
git push origin feature/your-branch
```

## 🛠️ Best Practices

### Code Quality
- ✅ No console errors or warnings before merging
- ✅ All components use prop destructuring
- ✅ Follow DRY principles
- ✅ Add proper error handling
- ✅ Use ES6+ syntax (arrow functions, destructuring, etc.)

### Git Practices
- 🔹 Make atomic commits (one logical change per commit)
- 🔹 Write clear, descriptive commit messages
- 🔹 Keep branches focused on single features
- 🔹 Rebase feature branches on main regularly
- 🔹 Delete merged branches promptly

### Pull Request Guidelines
- 📋 Use descriptive PR titles
- 📋 Include screenshots for UI changes
- 📋 Add testing instructions
- 📋 Reference related issues
- 📋 Keep PRs reasonably sized (< 500 lines when possible)

## 🚨 Emergency Procedures

### Hotfix Process
```bash
# For critical production bugs
git checkout main
git pull origin main
git checkout -b hotfix/critical-api-fix

# Make minimal fix
git add .
git commit -m "hotfix: resolve API timeout issue"
git push origin hotfix/critical-api-fix

# Create PR with "HOTFIX" label
# Get expedited review and merge
```

### Rollback Process
```bash
# If main is broken, revert to last good commit
git checkout main
git revert <bad-commit-hash>
git push origin main
```

## 📊 Tracking Progress

### Use GitHub Issues
- Create issues for features and bugs
- Use labels: `enhancement`, `bug`, `documentation`
- Assign team members
- Link PRs to issues

### Optional: Project Board
- Set up GitHub Projects
- Create columns: `To Do`, `In Progress`, `Review`, `Done`
- Move cards as work progresses

## 🔍 Code Review Checklist

### Functionality
- [ ] Feature works as described
- [ ] No console errors or warnings
- [ ] Proper error handling implemented
- [ ] All edge cases considered

### Code Quality
- [ ] Props are destructured in all components
- [ ] DRY principles followed
- [ ] ES6+ syntax used consistently
- [ ] Proper naming conventions
- [ ] Comments where necessary

### Performance
- [ ] No unnecessary re-renders
- [ ] Efficient API calls
- [ ] Proper use of React hooks
- [ ] No memory leaks

### Testing
- [ ] Manual testing completed
- [ ] All scenarios tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)

---

**Remember**: Good Git practices make for happy developers and stable code! 🎉
