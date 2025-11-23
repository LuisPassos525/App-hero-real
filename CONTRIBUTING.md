# Contributing to HERO

## Working with Git and Uncommitted Changes

### Overview

This project uses Git for version control. It's important to understand how to handle uncommitted changes to maintain a clean and organized development workflow.

### Understanding Uncommitted Changes

**Uncommitted changes** are modifications to files in your working directory that haven't been saved to the Git repository yet. There are three states:

1. **Untracked**: New files that Git isn't tracking yet
2. **Modified (Unstaged)**: Changes to tracked files that haven't been staged
3. **Staged**: Changes that are ready to be committed

### Checking for Uncommitted Changes

To check the status of your working directory:

```bash
git status
```

Or use our helper script:

```bash
bash .githooks/check-uncommitted.sh
```

### How to Proceed When Uncommitted Changes Are Detected

#### Option 1: Commit the Changes

If the changes are ready to be saved:

```bash
# Stage specific files
git add <file1> <file2>

# Or stage all changes
git add .

# Commit with a descriptive message
git commit -m "Description of changes"

# Push to remote
git push
```

#### Option 2: Stash the Changes

If you want to temporarily save changes but not commit them:

```bash
# Stash changes
git stash save "Description of what you're stashing"

# View stashed changes
git stash list

# Restore stashed changes later
git stash pop
```

#### Option 3: Discard the Changes

If the changes are not needed (⚠️ This is permanent!):

```bash
# Discard changes to specific file
git checkout -- <file>

# Discard all changes
git reset --hard HEAD
```

### Best Practices

1. **Commit Often**: Make small, logical commits with clear messages
2. **Check Before Switching**: Always check for uncommitted changes before switching branches
3. **Use .gitignore**: Add files that shouldn't be tracked (node_modules, .env, etc.)
4. **Pull Before Push**: Always pull latest changes before pushing

### Setting Up Git Hooks

To enable the git hooks in this repository:

```bash
# Configure git to use our hooks directory
git config core.hooksPath .githooks

# Make hooks executable
chmod +x .githooks/*
```

### Common Scenarios

#### Scenario: "I have uncommitted changes but need to switch branches"

```bash
# Option 1: Commit your changes
git add .
git commit -m "WIP: description"

# Option 2: Stash your changes
git stash save "Work in progress on feature X"

# Switch branches
git checkout other-branch
```

#### Scenario: "I made changes but they're not ready to commit"

```bash
# Stash them temporarily
git stash save "Experimental changes"

# Or create a new branch for them
git checkout -b feature/experimental
git add .
git commit -m "Experimental changes"
```

#### Scenario: "I need to proceed despite uncommitted changes"

This depends on what you're trying to do:

- **To switch branches**: Commit or stash first
- **To pull changes**: Commit or stash first
- **To continue working**: Just keep working, commit when ready
- **To run tests**: Usually safe to proceed with uncommitted changes

### Getting Help

If you're unsure about uncommitted changes:

```bash
# See what's changed
git status
git diff

# See what's staged
git diff --cached

# See full history
git log --oneline
```

For more information, refer to the [Git documentation](https://git-scm.com/doc).
