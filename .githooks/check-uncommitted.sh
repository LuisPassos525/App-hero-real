#!/bin/bash
# Script to check for uncommitted changes and provide guidance

echo "🔍 Checking for uncommitted changes..."
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not a git repository"
    exit 1
fi

# Check for unstaged changes
unstaged=$(git diff --name-only)
if [ -n "$unstaged" ]; then
    echo "⚠️  Unstaged changes detected:"
    echo "$unstaged"
    echo ""
fi

# Check for staged but uncommitted changes
staged=$(git diff --cached --name-only)
if [ -n "$staged" ]; then
    echo "✓ Staged changes ready to commit:"
    echo "$staged"
    echo ""
fi

# Check for untracked files
untracked=$(git ls-files --others --exclude-standard)
if [ -n "$untracked" ]; then
    echo "ℹ️  Untracked files:"
    echo "$untracked"
    echo ""
fi

# Provide summary
if [ -z "$unstaged" ] && [ -z "$staged" ] && [ -z "$untracked" ]; then
    echo "✅ Working directory is clean - no uncommitted changes"
    exit 0
else
    echo "📋 Summary:"
    [ -n "$unstaged" ] && echo "  - Unstaged changes: $(echo "$unstaged" | wc -l) file(s)"
    [ -n "$staged" ] && echo "  - Staged changes: $(echo "$staged" | wc -l) file(s)"
    [ -n "$untracked" ] && echo "  - Untracked files: $(echo "$untracked" | wc -l) file(s)"
    echo ""
    echo "To proceed with these changes:"
    echo "  1. Review changes: git status"
    echo "  2. Stage changes: git add <files>"
    echo "  3. Commit changes: git commit -m 'your message'"
    echo "  4. Push changes: git push"
    exit 1
fi
