# `Footer` Component

Provides a versioned footer with optional links and theme toggle.

---

## ✨ Features

- Displays brand name and contact email
- Shows front and back-end versions
- Links to issues, roadmap and CGU page
- Optional theme toggle button

---

## 📦 Import

```tsx
import { Footer } from '@happykiller/sunny-ui';
```

---

## 🧠 Usage

```tsx
<Footer
  systemInfoUsecase={systemInfoUsecase}
  frontVersion="1.4.0"
  brandName="MyApp"
  issuesUrl="https://github.com/myorg/myrepo/issues"
  projectUrl="https://github.com/myorg/myrepo"
  mailto="support@myapp.com"
  onToggleTheme={toggleTheme}
  iconThemeToggle={<DarkModeIcon />}
/>
```

---

## ⚙️ Props

| Prop                | Type                | Default | Description                            |
| ------------------- | ------------------- | ------- | -------------------------------------- |
| `systemInfoUsecase` | `Usecase`           | —       | Fetches back-end version               |
| `frontVersion`      | `string`            | —       | Front-end version label                |
| `issuesUrl`         | `string`            | —       | Link to issue tracker                  |
| `projectUrl`        | `string`            | —       | Link to project/roadmap                |
| `mailto`            | `string`            | —       | Contact email                          |
| `brandName`         | `string`            | —       | Displayed brand name                   |
| `icons`             | `Record<string, ReactNode>` | — | Icons for email/issues/etc.           |
| `onToggleTheme`     | `() => void`        | —       | Callback when theme toggle is clicked  |
| `iconThemeToggle`   | `ReactNode`         | —       | Icon for the theme toggle              |

---

## 📁 Source

[`src/components/Footer.tsx`](../../src/components/Footer.tsx)
