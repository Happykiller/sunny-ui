# User Guide

This guide explains how to install **Sunny UI** and integrate its components in a React project.

## Features

- Reusable React components built with TypeScript
- Material UI theming out of the box
- Built-in Flash Message system and passkey helpers
- Layout components with session protection

## Installation

```bash
npm install @happykiller/sunny-ui
```

Peer dependencies you must install manually:

- react
- react-dom
- @mui/material
- zustand
- @emotion/react
- @emotion/styled
- @passwordless-id/webauthn
- framer-motion

## Quick Start

```tsx
import { LayoutProtected, Footer, FlashMessage } from '@happykiller/sunny-ui';

function App() {
  return (
    <>
      <LayoutProtected
        header={<MyHeader />}
        footer={<Footer systemInfoUsecase={systemInfoUsecase} />}
        sessionInfoUsecase={sessionInfoUsecase}
        loggerService={loggerService}
        contextStore={contextStore}
      >
        {/* application pages */}
      </LayoutProtected>

      <FlashMessage />
    </>
  );
}
```

## Theming and Customisation

Sunny UI respects your MUI theme and exposes `sx` props for style overrides. Components can be composed with your own icons and typography.

## Available Components

See detailed documentation in [docs/components](./components):

- `Header` – responsive navigation bar
- `Footer` – versioned footer with links
- `Guard` – route protection wrapper
- `LayoutProtected` and `LayoutPublic` – page layouts
- `Input` – validated form input
- `FlashMessage` – global notification stack

## Pages and Hooks

Sunny UI also provides ready-made pages (`Login`, `Profile`, `NotFound`, `CGU`) and hooks (`useFlashStore`, `usePasskeyStore`). Browse the source under `src` for implementation details.
