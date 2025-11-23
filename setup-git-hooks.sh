#!/bin/bash
# Setup script to configure git hooks for the HERO project

echo "🔧 Setting up Git hooks for HERO project..."
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Make hooks executable
echo "📝 Making hooks executable..."
chmod +x .githooks/pre-commit
chmod +x .githooks/check-uncommitted.sh

# Configure git to use our hooks directory
echo "⚙️  Configuring git to use .githooks directory..."
git config core.hooksPath .githooks

# Verify configuration
hooks_path=$(git config --get core.hooksPath)
if [ "$hooks_path" = ".githooks" ]; then
    echo "✅ Git hooks configured successfully!"
    echo ""
    echo "Available hooks:"
    echo "  - pre-commit: Checks for uncommitted changes before each commit"
    echo "  - check-uncommitted.sh: Manual script to check working directory status"
    echo ""
    echo "To test the uncommitted changes checker, run:"
    echo "  bash .githooks/check-uncommitted.sh"
else
    echo "⚠️  Warning: Git hooks configuration may have failed"
    echo "Expected core.hooksPath to be '.githooks' but got '$hooks_path'"
    exit 1
fi

echo ""
echo "🎉 Setup complete! You're ready to start developing."
