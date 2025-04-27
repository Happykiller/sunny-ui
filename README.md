# Sunny UI

**Package:** [`@happykiller/sunny-ui`](https://www.npmjs.com/package/@happykiller/sunny-ui)

Sunny UI is an open-source front-end library providing modular, reusable React + TypeScript components, directly integrated with Material UI.  
It is designed to accelerate your front-end development while ensuring strong UI/UX consistency.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Usage Example](#quick-usage-example)
- [Code Examples](#code-examples)
- [Core Concepts (Stores, Layout)](#core-concepts-stores-layout)
- [Available Components](#available-components)
- [Available Hooks](#available-hooks)
- [Development & Publishing](#development--publishing)
- [Contributing](#contributing)
- [License](#license)
- [About](#about)

---

## Features

✅ Reusable and customizable React components  
🎨 Native integration with [Material UI (MUI)](https://mui.com/)  
🔒 Strict TypeScript typing + runtime validation  
🚀 Automatic management of Flash Messages and Passkeys  
🛡️ Secure Layout with session authentication (`Guard` included)  
📦 Optimized build for CJS + ESM + Typings

---

## Installation

```bash
npm install @happykiller/sunny-ui
```

### Peer Dependencies

You must manually install:

- `react@^19.0.0`
- `react-dom@^19.0.0`
- `@mui/material@^6.0.0`
- `zustand@^5.0.0`
- `@emotion/react@^11.0.0`
- `@emotion/styled@^11.0.0`
- `@passwordless-id/webauthn@^2.3.0`
- `framer-motion@^12.0.0`

---

## Quick Usage Example

**Secure Layout + Header + Footer**

```tsx
import { LayoutProtected, Footer, FlashMessage } from '@happykiller/sunny-ui';

function App() {
  return (
    <>
      <LayoutProtected
        header={<MyCustomHeader />}
        sessionInfoUsecase={sessionInfoUsecase}
        loggerService={loggerService}
        contextStore={contextStore}
      >
        {/* Your app content here */}
      </LayoutProtected>

      <Footer
        systemInfoUsecase={systemInfoUsecase}
        frontVersion="1.4.0"
        brandName="MyApp"
        issuesUrl="https://github.com/myorg/myrepo/issues"
        projectUrl="https://github.com/myorg/myrepo"
      />

      <FlashMessage />
    </>
  );
}
```

## Code Examples

### 🔥 Input Component Example

```tsx
import React from 'react';
import { Input } from '@happykiller/sunny-ui';

function UsernameInput() {
  const [username, setUsername] = React.useState({ value: '', valid: false });

  return (
    <Input
      label="Username"
      tooltip="Username must be at least 3 characters."
      regex="^[a-zA-Z0-9._-]{3,}$"
      entity={username}
      onChange={(newEntity) => setUsername(newEntity)}
      require
      virgin
    />
  );
}

export default UsernameInput;
```

✅ Features:
- Live validation based on regex
- Tooltip display
- MUI error helper if invalid
- Two-way controlled state `{ value, valid }`
- Optional required flag (`require`)

---

### ⚡ FlashMessage Example

```tsx
import React from 'react';
import { FlashMessage, useFlashStore } from '@happykiller/sunny-ui';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function FlashExample() {
  const flash = useFlashStore();

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => flash.open('Saved successfully!', 'success')}
      >
        Show Success
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={() => flash.open('An error occurred.', 'error')}
      >
        Show Error
      </Button>

      <FlashMessage
        icons={{ close: <CloseIcon fontSize="small" /> }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
}

export default FlashExample;
```

✅ Features:
- Easy message dispatch `flash.open(message, severity?)`
- Severity levels (`info`, `success`, `warning`, `error`)
- MUI Alert with custom close button
- Multiple visible flash messages stacked

---

## Core Concepts

### LayoutProtected

- Automatically checks the user's session (via injected usecase)
- Redirects to `/login` if session is invalid
- Dynamically injects a customizable `Header`
- Integrates a Material UI `Container`

```tsx
import { LayoutProtected } from '@happykiller/sunny-ui';
```

| Prop                | Type            | Description                          |
|:--------------------|:----------------|:-------------------------------------|
| `header`             | `ReactNode`     | The header component to render       |
| `sessionInfoUsecase` | `Usecase`        | Usecase to validate session          |
| `loggerService`      | `Service`        | Logger service for session errors    |
| `contextStore`       | `Zustand store`  | User context store                   |

---

### Built-in Global Stores

Sunny UI directly provides:

- `useFlashStore()` → To trigger global flash messages (`success`, `error`, etc.)
- `usePasskeyStore()` → To persist WebAuthn passkeys locally

✅ **No need to inject them manually**  
✅ **Fully persisted via `localStorage`**

---

## Available Components

| Component         | Description                               |
|:------------------|:------------------------------------------|
| `Guard`           | Route protection with session checking   |
| `Input`           | Flexible input field with validation, tooltip, password toggle |
| `Footer`          | Versioned footer + useful links           |
| `Header`          | Fully responsive top navigation bar      |
| `FlashMessage`    | Global notifications (info, success, error, warning) |
| `LayoutProtected` | Full secure page layout                   |

---

## Available Pages

| Page            | Description                                |
|:----------------|:-------------------------------------------|
| `Login`         | Standard authentication + WebAuthn passkey support |
| `Profile`       | User account management + password update + passkeys |
| `CGU`           | Terms and Conditions (CGU) page            |
| `NotFound`      | Customizable 404 page                      |

---

## Available Hooks

| Hook               | Description                      |
|:-------------------|:----------------------------------|
| `useFlashStore()`   | Global flash message management   |
| `usePasskeyStore()` | Local passkey storage management  |

---

## Development & Publishing

```bash
# Install dependencies
npm install

# Clean previous builds
npm run clean

# Build the package
npm run build

# Publish (after bumping version)
npm publish
```

🔖 Follow [Semantic Versioning](https://semver.org/) when updating package versions.

---

## Contributing

We welcome contributions!

1. Fork the repository
2. Create a new branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push your branch: `git push origin feat/my-feature`
5. Open a Pull Request 🚀

---

## License

Sunny UI is licensed under the **ISC License**.

---

## About

Developed by [Fabrice Rosito](mailto:fabrice.rosito@gmail.com).  
Goal: to provide a modern, scalable, open-source front-end library for professional React applications.