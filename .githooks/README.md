# Git Hooks for HERO Project

This directory contains custom Git hooks to help manage the development workflow.

## Available Hooks

### pre-commit

Runs before each commit to check for uncommitted changes and provide helpful guidance. This hook will notify you about:
- Unstaged changes in the working directory
- Untracked files

The hook is informative and will not block commits - it always exits with success.

### check-uncommitted.sh

A utility script to check the current state of your working directory. Run it anytime to see:
- Unstaged changes
- Staged changes ready to commit
- Untracked files

## Setup

To enable these hooks in your local repository:

```bash
# Make hooks executable
chmod +x .githooks/*

# Configure git to use this hooks directory
git config core.hooksPath .githooks
```

## Usage

### Automatic Usage

The `pre-commit` hook runs automatically whenever you make a commit.

### Manual Usage

Run the check script anytime:

```bash
bash .githooks/check-uncommitted.sh
```

## Customization

Feel free to modify these hooks to suit your workflow. If you make improvements, please share them with the team!

## Troubleshooting

### Hooks not running

Ensure hooks are executable:
```bash
chmod +x .githooks/*
```

Verify git is configured to use the hooks directory:
```bash
git config --get core.hooksPath
# Should output: .githooks
```

### Disabling hooks temporarily

To commit without running hooks:
```bash
git commit --no-verify
```

## Learn More

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Project Contributing Guide](../CONTRIBUTING.md)
