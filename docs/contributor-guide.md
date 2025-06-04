# Contributor Guide

Thank you for helping improve **Sunny UI**. This document describes the development workflow and release process.

## Local Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Build the library
   ```bash
   npm run build
   ```
3. Optionally link it locally
   ```bash
   npm run build:link
   ```
4. Remove previous builds using `npm run clean`.

## Release Process

Sunny UI follows [Semantic Versioning](https://semver.org/). Use one of the scripts depending on the version bump:

- `npm run release:patch`
- `npm run release:minor`
- `npm run release:major`

Each script cleans, builds and publishes the package to npm.

## Contribution Workflow

1. Fork this repository and create a feature branch.
2. Make your changes and commit with clear messages.
3. Open a Pull Request targeting the `main` branch.
4. The project maintainers will review and merge after checks pass.

Please open issues for bugs or feature suggestions.
