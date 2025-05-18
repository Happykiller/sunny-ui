# Sunny UI

**Package:** [`@happykiller/sunny-ui`](https://www.npmjs.com/package/@happykiller/sunny-ui)

Sunny UI is an open-source front-end library providing modular, reusable React + TypeScript components, directly integrated with Material UI.  
It is designed to accelerate your front-end development while ensuring strong UI/UX consistency.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Usage Example](#quick-usage-example)
- [Available Components](#available-components)
- [Available Pages](#available-pages)
- [Available Hooks](#available-hooks)
- [Components in Depth](#components-in-depth)
  - [📥 Input Component](#-input-component)
- [Core Concepts (Stores, Layout)](#core-concepts-stores-layout)
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
````

### Peer Dependencies

You must manually install:

* `react@^19.0.0`
* `react-dom@^19.0.0`
* `@mui/material@^6.0.0`
* `zustand@^5.0.0`
* `@emotion/react@^11.0.0`
* `@emotion/styled@^11.0.0`
* `@passwordless-id/webauthn@^2.3.0`
* `framer-motion@^12.0.0`

---

## Quick Usage Example

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

---

## Available Components

| Component         | Description                                                    |
| :---------------- | :------------------------------------------------------------- |
| `Guard`           | Route protection with session checking                         |
| `Input`           | Flexible input field with validation, tooltip, password toggle |
| `Footer`          | Versioned footer + useful links                                |
| `Header`          | Fully responsive top navigation bar                            |
| `FlashMessage`    | Global notifications (info, success, error, warning)           |
| `LayoutProtected` | Full secure page layout                                        |

---

## Available Pages

| Page       | Description                                          |
| :--------- | :--------------------------------------------------- |
| `Login`    | Standard authentication + WebAuthn passkey support   |
| `Profile`  | User account management + password update + passkeys |
| `CGU`      | Terms and Conditions (CGU) page                      |
| `NotFound` | Customizable 404 page                                |

---

## Available Hooks

| Hook                | Description                      |
| :------------------ | :------------------------------- |
| `useFlashStore()`   | Global flash message management  |
| `usePasskeyStore()` | Local passkey storage management |

---

## 🔍 Components in Depth

### 📥 Input Component

The `Input` component is a flexible, styled, and typed input field built on top of Material UI's `TextField`.
It is designed to streamline form interactions, offering validation, icons, tooltips, and password visibility toggles.

---

#### ✅ Features

* 🔁 Two-way controlled state via `{ value, valid }`
* 🔒 Regex-based live validation + required check
* 🧠 Intelligent error display with `virgin` flag
* 🧰 Tooltip support with fade animation
* 🔐 Password mode with visibility toggle icons
* 🎨 MUI native theming & override support
* 🧱 Accepts all `TextFieldProps` (except `onChange`, overridden)

---

#### 📦 Import

```tsx
import { Input } from '@happykiller/sunny-ui';
```

---

#### 🔧 Props

| Prop        | Type                                                  | Required | Description                        |
| ----------- | ----------------------------------------------------- | -------- | ---------------------------------- |
| `label`     | `React.ReactNode`                                     | ✅        | Label shown on top of the field    |
| `entity`    | `{ value: string; valid: boolean }`                   | ✅        | Controlled state for the input     |
| `onChange`  | `(entity: { value: string; valid: boolean }) => void` | ❌        | Triggered on each input change     |
| `regex`     | `string`                                              | ❌        | Regex for validation               |
| `tooltip`   | `React.ReactNode`                                     | ❌        | Tooltip shown on hover             |
| `require`   | `boolean`                                             | ❌        | Marks field as required            |
| `virgin`    | `boolean`                                             | ❌        | Suppresses errors until user types |
| `type`      | `string` (e.g. `'text'`, `'password'`)                | ❌        | Input type (default: `'text'`)     |
| `startIcon` | `React.ReactNode`                                     | ❌        | Icon on the left side              |
| `icons`     | `{ visibility, visibilityOff, help }`                 | ❌        | Custom icons for password / help   |

---

#### 💡 Basic Example

```tsx
const [username, setUsername] = React.useState({ value: '', valid: false });

<Input
  label="Username"
  tooltip="Must be at least 3 characters"
  regex="^[a-zA-Z0-9._-]{3,}$"
  require
  virgin
  entity={username}
  onChange={setUsername}
/>
```

---

#### 🔐 Password Field Example

```tsx
const [password, setPassword] = React.useState({ value: '', valid: false });

<Input
  label="Password"
  type="password"
  regex="^.{8,}$"
  tooltip="Minimum 8 characters"
  require
  virgin
  entity={password}
  onChange={setPassword}
  icons={{
    visibility: <VisibilityIcon fontSize="small" />,
    visibilityOff: <VisibilityOffIcon fontSize="small" />,
    help: <HelpOutlineIcon fontSize="small" />
  }}
/>
```

---

#### 🎨 Theming & Styling

This component uses the current MUI theme:

* Borders and shadows follow `theme.palette.primary`
* Error color from `theme.palette.error`
* Background color from `theme.palette.background.paper`
* Full style override possible via `sx`

```tsx
<Input
  ...props
  sx={{
    '.MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'white',
    },
  }}
/>
```

---

#### 🧪 Validation Logic

The input is considered valid when:

* The value is **non-empty** if `require` is true
* The value **matches `regex`** if provided
* The user has typed (i.e., `virgin` is `false`) to show helperText

Displayed helper text: `common.field_incorrect` (uses i18n)

---

#### 🧼 Tip for Form Reset

```tsx
setUsername({ value: '', valid: false });
```

The component will reflect both value and validity immediately.

---

## Core Concepts (Stores, Layout)

### LayoutProtected

* Automatically checks the user's session (via injected usecase)
* Redirects to `/login` if session is invalid
* Dynamically injects a customizable `Header`
* Integrates a Material UI `Container`

```tsx
import { LayoutProtected } from '@happykiller/sunny-ui';
```

| Prop                 | Type            | Description                       |
| :------------------- | :-------------- | :-------------------------------- |
| `header`             | `ReactNode`     | The header component to render    |
| `sessionInfoUsecase` | `Usecase`       | Usecase to validate session       |
| `loggerService`      | `Service`       | Logger service for session errors |
| `contextStore`       | `Zustand store` | User context store                |

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