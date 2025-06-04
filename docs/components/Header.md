# `Header` Component

Responsive navigation bar with brand logo, routes and user menu.

---

## ✨ Features

- Mobile and desktop layouts with automatic menu collapse
- Customizable navigation routes and user menu items
- Displays user avatar from context store
- Optional logout callback and custom icons

---

## 📦 Import

```tsx
import { Header } from '@happykiller/sunny-ui';
```

---

## 🧠 Usage

```tsx
<Header
  brandName="MyApp"
  routes={["trainings", "exercices"]}
  settings={["profile", "logout"]}
  contextStore={contextStore}
  onLogout={logout}
  icons={{ menu: <MenuIcon /> }}
/>
```

---

## ⚙️ Props

| Prop            | Type                        | Default        | Description                              |
| --------------- | --------------------------- | -------------- | ---------------------------------------- |
| `brandName`     | `string`                    | `'Vergo'`      | Brand label and logo alt text            |
| `routes`        | `string[]`                  | `[...]`        | Main navigation route names              |
| `settings`      | `string[]`                  | `[...]`        | Items for the user dropdown menu         |
| `onLogout`      | `() => void`                | —              | Called when logout item is selected      |
| `icons.menu`    | `ReactNode`                 | menu icon      | Icon for mobile menu toggle              |
| `sx`            | `SxProps`                   | —              | Additional styling overrides             |
| `contextStore`  | `HeaderContextStore`        | required       | Store containing user info & reset fn    |
| `volatileStore` | `VolatileContextStore`      | optional       | Hide header when `fullscreen` is true    |

---

## 📁 Source

[`src/components/Header.tsx`](../../src/components/Header.tsx)
