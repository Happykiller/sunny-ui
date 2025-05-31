# `FlashMessage` Component

Displays global flash notifications (info, success, error, warning), stackable and automatically disappearing.

---

## ✨ Features

- ✅ Global notification stack (Zustand-based)
- 🎨 Fully themed with MUI
- ❌ Optional custom close icon
- 🕒 Auto-dismiss after 6 seconds (default)
- 📍 Position configurable via `anchorOrigin`

---

## 📦 Import

```tsx
import { FlashMessage } from '@happykiller/sunny-ui';
````

---

## 🧠 Usage

```tsx
import { FlashMessage, useFlashStore } from '@happykiller/sunny-ui';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function FlashExample() {
  const flash = useFlashStore();

  return (
    <>
      <Button
        variant="contained"
        onClick={() => flash.success('Saved successfully!')}
      >
        Show Success
      </Button>

      <FlashMessage
        icons={{ close: <CloseIcon fontSize="small" /> }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
}
```

---

## ⚙️ Props

| Prop           | Type             | Default                                       | Description                          |
| -------------- | ---------------- | --------------------------------------------- | ------------------------------------ |
| `icons.close`  | `ReactNode`      | `undefined`                                   | Optional close icon                  |
| `maxVisible`   | `number`         | `5`                                           | Max number of messages shown at once |
| `anchorOrigin` | `SnackbarOrigin` | `{ vertical: 'bottom', horizontal: 'right' }` | Position of the alert stack          |

---

## 🪝 Hook: `useFlashStore()`

```tsx
const flash = useFlashStore();

flash.success('Your message');
flash.error('Something went wrong');
flash.open('Custom severity', 'warning');
```

---

## 📌 Notes

* Flash messages auto-dismiss after 6s unless removed earlier
* Fully customizable via MUI theme overrides
* Based on Zustand global store for optimal decoupling

---

## 🧪 Tests à prévoir

* ✅ Message addition/removal
* ⏱ Auto-dismiss timeout
* 🎨 Style conformity with MUI theme
* ♿ Accessibility checks (role="alert")

---

## 📁 Source

* Component: [`src/components/FlashMessage.tsx`](../../src/components/FlashMessage.tsx)
* Store: [`src/hooks/useFlashStore.ts`](../../src/hooks/useFlashStore.ts)