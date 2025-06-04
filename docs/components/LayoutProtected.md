# `LayoutProtected` Component

Full page layout with authentication guard and header/footer slots.

---

## ✨ Features

- Wraps content with a session check using `Guard`
- Includes background gradient styling
- Slots for custom header and footer
- Provides responsive container for page content

---

## 📦 Import

```tsx
import { LayoutProtected } from '@happykiller/sunny-ui';
```

---

## 🧠 Usage

```tsx
<LayoutProtected
  header={<MyHeader />}
  footer={<MyFooter />}
  sessionInfoUsecase={sessionInfoUsecase}
  loggerService={loggerService}
  contextStore={contextStore}
>
  {children}
</LayoutProtected>
```

---

## ⚙️ Props

| Prop                 | Type             | Description                           |
| -------------------- | ---------------- | ------------------------------------- |
| `header`             | `ReactNode`      | Header component                      |
| `footer`             | `ReactNode`      | Footer component                      |
| `sessionInfoUsecase` | `Usecase`        | Verifies current user session         |
| `loggerService`      | `Service`        | Logs session errors                   |
| `contextStore`       | `Zustand store`  | User context for reset on invalid     |
| `children`           | `ReactNode`      | Page content                          |

---

## 📁 Source

[`src/components/layout/LayoutProtected.tsx`](../../src/components/layout/LayoutProtected.tsx)
