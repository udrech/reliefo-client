---
applyTo: "src/app/**"
---

## Project Structure

### Views (Pages)

Place all **page-level components** in `src/app/views/`. This includes:
- Full-page route views
- Layout (app layout, auth layout, etc.)
- Sidebars and navigation wrappers

Each view gets its own subfolder mirror the route hierarchy:

```
src/app/views/
  layout/
    layout.ts          ← app layout (top nav + sidebar + router-outlet)
    layout.html
  start/
    start.ts
    start.html
  users/
    users.ts
    users.html
```

Wire up views in `app.routes.ts` using **lazy-loaded routes**:

```ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/layout/layout').then(m => m.Layout)
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./views/users/users').then(m => m.Users)
      }
    ]
  }
];
```

### Components

Place reusable, non-routed UI components in `src/app/components/`. These are pieces consumed by views, not standalone pages.

### Services

Place all **data-fetching and business logic** in `src/app/services/`. Each service should:
- Be scoped with `providedIn: 'root'` unless intentionally scoped to a feature.
- Use `inject()` for dependencies, not constructor injection.
- Encapsulate all HTTP calls — components and views must never call `HttpClient` directly.

```ts
// src/app/services/relief.service.ts
@Injectable({ providedIn: 'root' })
export class ReliefService {
  private http = inject(HttpClient);

  getItems() {
    return this.http.get<ReliefItem[]>('/api/items');
  }
}
```

### Models

Place all **TypeScript interfaces, types, and enums** in `src/app/models/`. One concept per file, named after the type:

```
src/app/models/
  relief-item.ts      ← export interface ReliefItem { ... }
  user.ts             ← export interface User { ... }
  api-response.ts     ← export type ApiResponse<T> = { data: T; ... }
```

- Use `interface` for object shapes; use `type` for unions, intersections, or aliases.
- Do **not** define models inline inside service or component files.

---

## Styling

### Always use Tailwind CSS classes

- Use **only** Tailwind utility classes for layout, spacing, color, typography, and responsive design.
- Keep component `.css` files **empty** unless absolutely necessary (e.g., a third-party override that Tailwind cannot express).
- Do **not** write custom CSS class names or BEM selectors.

```html
<!-- ✅ Correct -->
<nav class="flex items-center gap-4 bg-surface-900 px-6 py-3 shadow-md">

<!-- ❌ Wrong -->
<nav class="app-nav">
```

### Tailwind v4 specifics

This project uses **Tailwind CSS v4**. It is imported globally via `@import 'tailwindcss'` in `styles.css` — do not add a `tailwind.config.ts` and do not use the `@tailwind` directive syntax from v3.

### PrimeNG & Tailwind

**Always prefer PrimeNG components** over native HTML equivalents whenever a PrimeNG component exists. This includes buttons (`p-button`), text inputs (`pInputText`), dropdowns, checkboxes, dialogs, data tables, overlays, and more. Only fall back to plain HTML elements when no suitable PrimeNG component is available.

- Use `p-button` instead of `<button>` or `<a>` for all actions and navigation triggers.
- Use `pInputText` directive on `<input>` elements for text fields.
- Use `[text]="true"` and `[rounded]="true"` on `p-button` for icon-only action buttons.
- Use `severity` (`secondary`, `danger`, etc.) on `p-button` to express intent.

Style PrimeNG component wrappers and surrounding layout with Tailwind classes. Avoid writing CSS overrides for PrimeNG internals.

---

## Icons

### Always use Material Symbols Outlined

- Use **only** [Material Symbols Outlined](https://fonts.google.com/icons) for icons. The font is loaded globally via `index.html`.
- Render icons with a `<span>` using the `material-symbols-outlined` class and the icon ligature as text content.
- Do **not** use any other icon library (e.g. Font Awesome, Heroicons, PrimeIcons).

```html
<!-- ✅ Correct -->
<span class="material-symbols-outlined">home</span>
<span class="material-symbols-outlined">settings</span>

<!-- ❌ Wrong -->
<i class="pi pi-home"></i>
<i class="fa fa-home"></i>
```

- Size and color with Tailwind: `text-xl`, `text-primary-500`, etc.
- For accessibility, add `aria-hidden="true"` on decorative icons and pair with a visually-hidden label when the icon conveys meaning.
