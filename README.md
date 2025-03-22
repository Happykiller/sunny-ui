# Sunny UI

**Version:** 1.0.1  
**Package:** [`@happykiller/sunny-ui`](https://www.npmjs.com/package/@happykiller/sunny-ui)

Sunny UI is an open-source library of reusable React components and TypeScript utilities designed to accelerate UI development across multiple front-end projects. It offers consistency, customization, and full integration with the Material UI (MUI) design system.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage Example](#usage-example)
- [Available Components](#available-components)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)
- [About](#about)

---

## Features

✅ Reusable and customizable React components  
🎨 Native integration with [Material UI (MUI)](https://mui.com/)  
🔒 Strong typing with TypeScript  
📦 Optimized build with CommonJS + ESModule outputs  
🧪 Ready to integrate with tests, Storybook, or documentation tools

---

## Installation

```bash
npm install @happykiller/sunny-ui
```

### Peer Dependencies

Make sure your project also includes:

- `react`: `^18.0.0` or `^19.0.0`
- `react-dom`: `^18.0.0` or `^19.0.0`
- `@mui/material`: `^5.0.0` or `^6.0.0`
- `@emotion/react`: `^11.0.0`
- `@emotion/styled`: `^11.0.0`

These are listed as `peerDependencies` in the package manifest and must be installed manually.

---

## Usage Example

```tsx
import React from 'react';
import { Input } from '@happykiller/sunny-ui';

function App() {
  const [value, setValue] = React.useState('');

  return (
    <Input
      label="Username"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required
      tooltip="Enter your username"
    />
  );
}
```

---

## Available Components

- **Input**: A versatile text input field with validation, password visibility toggle, tooltip support, and full MUI integration.

> *More components will be added and documented as the library evolves.*

---

## Development Workflow

The following commands cover common tasks in the package development lifecycle.

### 1. Setup

```bash
# Install project dependencies
npm install

# Log in to npm (once)
npm login
```

---

### 2. Develop

Work inside the `src/` folder (`components`, `services`, etc.). The project is TypeScript-ready with strict mode enabled. Consider integrating tools like Storybook or Vitest if needed.

---

### 3. Build & Clean

```bash
# Clean previous builds
npm run clean

# Build the package (uses Rollup + TypeScript)
npm run build
```

This produces output in `dist/`, including `.js`, `.es.js`, and `.d.ts` files.

---

### 4. Publish

Once you’ve bumped the version number (`package.json`) and committed your changes:

```bash
# Publish to npm
npm publish
```

📌 **Reminder:** Follow [Semantic Versioning](https://semver.org/) when updating the version.

---

## Contributing

We welcome contributions!

1. Fork this repository
2. Create a new branch: `git checkout -b feat/my-feature`
3. Make your changes and commit: `git commit -m "Add my feature"`
4. Push your branch: `git push origin feat/my-feature`
5. Open a pull request

Please refer to `CONTRIBUTING.md` for guidelines and best practices.

---

## License

Sunny UI is licensed under the **ISC License**. See the [LICENSE](./LICENSE) file for details.

---

## About

This project was initiated by [Fabrice Rosito](mailto:fabrice.rosito@gmail.com) as a reusable, scalable front-end library for internal and open-source projects.  
For questions, suggestions or collaborations, feel free to get in touch!