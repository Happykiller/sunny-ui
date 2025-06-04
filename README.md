# Sunny UI

**Package:** [`@happykiller/sunny-ui`](https://www.npmjs.com/package/@happykiller/sunny-ui)

Sunny UI is an open-source library of React components written in TypeScript and styled with Material UI. It provides reusable building blocks and ready‑made pages to speed up front‑end development.

## Documentation

Full documentation is available in the [docs](./docs) directory.

## Features

- Reusable and fully typed React components
- Seamless Material UI integration
- Flash message and passkey helpers
- Layout components with session protection

## Installation

```bash
npm install @happykiller/sunny-ui
```

You must also install the library's peer dependencies (`react`, `@mui/material`, `zustand`, etc.). See the [User Guide](docs/user-guide.md) for the complete list.

## Quick Example

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

## Components

Sunny UI includes components such as `Header`, `Footer`, `Guard`, `LayoutProtected`, `LayoutPublic`, `Input` and `FlashMessage`. Detailed usage and props are documented under [docs/components](docs/components).

## License

Sunny UI is released under the ISC License.
