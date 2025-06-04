# `Guard` Component

Protects routes by validating the user session.

---

## ✨ Features

- Checks session asynchronously before rendering children
- Redirects to `/login` when session is invalid
- Optional callback on invalid session

---

## 📦 Import

```tsx
import { Guard } from '@happykiller/sunny-ui';
```

---

## 🧠 Usage

```tsx
<Guard checkSession={checkSession} onInvalidSession={handleInvalid}>
  <ProtectedContent />
</Guard>
```

---

## ⚙️ Props

| Prop               | Type                                          | Description                             |
| ------------------ | --------------------------------------------- | --------------------------------------- |
| `children`         | `JSX.Element`                                 | Content to render when session is valid |
| `checkSession`     | `() => Promise<{ success: boolean }>`         | Function that returns session validity  |
| `onInvalidSession` | `() => void`                                  | Called if session is invalid            |

---

## 📁 Source

[`src/components/Guard.tsx`](../../src/components/Guard.tsx)
