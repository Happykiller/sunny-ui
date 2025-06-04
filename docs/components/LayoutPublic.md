# `LayoutPublic` Component

Simple layout wrapper for unauthenticated pages.

---

## ✨ Features

- Background styling consistent with the application
- Responsive container centered on the page
- Footer slot for shared links or branding

---

## 📦 Import

```tsx
import { LayoutPublic } from '@happykiller/sunny-ui';
```

---

## 🧠 Usage

```tsx
<LayoutPublic footer={<MyFooter />}>
  {children}
</LayoutPublic>
```

---

## ⚙️ Props

| Prop       | Type       | Description            |
| ---------- | ---------- | ---------------------- |
| `footer`   | `ReactNode`| Footer component       |
| `children` | `ReactNode`| Page content           |

---

## 📁 Source

[`src/components/layout/LayoutPublic.tsx`](../../src/components/layout/LayoutPublic.tsx)
