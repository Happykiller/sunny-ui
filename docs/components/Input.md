# `Input` Component

A flexible, styled text input with live validation, password support, tooltip, and full MUI integration.

---

## ✨ Features

- ✅ Validation via regex + required flag
- 👁️ Password toggle (with visibility icons)
- 🧠 Tooltip with info/help icon
- 🎨 Full MUI styling and theming
- 🔁 Two-way entity binding `{ value, valid }`

---

## 📦 Import

```tsx
import { Input } from '@happykiller/sunny-ui';
````

---

## 🧠 Usage

```tsx
const [email, setEmail] = React.useState({ value: '', valid: false });

<Input
  label="Email"
  tooltip="Enter a valid email address"
  regex="^[^@]+@[^@]+\.[^@]+$"
  entity={email}
  onChange={setEmail}
  require
  virgin
/>;
```

---

## ⚙️ Props

| Prop                  | Type                                | Default  | Description                                               |
| --------------------- | ----------------------------------- | -------- | --------------------------------------------------------- |
| `label`               | `ReactNode`                         | —        | Label displayed above the field                           |
| `tooltip`             | `ReactNode`                         | —        | Help tooltip shown on hover                               |
| `regex`               | `string`                            | —        | Regex to validate input                                   |
| `require`             | `boolean`                           | `false`  | If true, field is required                                |
| `virgin`              | `boolean`                           | `false`  | Used to control initial untouched state                   |
| `startIcon`           | `ReactNode`                         | —        | Optional icon on the left                                 |
| `icons.help`          | `ReactNode`                         | —        | Custom help icon (default: none)                          |
| `icons.visibility`    | `ReactNode`                         | —        | Icon shown to toggle password visibility                  |
| `icons.visibilityOff` | `ReactNode`                         | —        | Alternate icon for hidden password state                  |
| `onChange`            | `(entity) => void`                  | —        | Callback when value changes (entity = `{ value, valid }`) |
| `type`                | `'text'` \| `'password'` \| etc.    | `'text'` | Input type                                                |
| `entity`              | `{ value: string; valid: boolean }` | —        | Controlled entity                                         |
| `...rest`             | MUI `TextFieldProps`                | —        | All native props passed to `TextField`                    |

---

## 🧪 Tips & Validation

* Regex only triggers if input is not empty
* If `require` is true and field is empty, `valid` will be `false`
* `helperText` shows error only after virgin state is broken

---

## 📁 Source

* [`src/components/Input.tsx`](../../src/components/Input.tsx)