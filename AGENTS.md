# Agent Instructions for Reliefo Client

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

### Type Safety
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

### Import Organization
**Sort import statements in this order (keep on single lines):**
1. `@angular/core`
2. `@angular/common`
3. `@angular/router`
4. `@angular/core/rxjs-interop`
5. `rxjs`
6. All `primeng/*` modules
7. Local model imports
8. Local service imports

```typescript
// ✅ Correct import order (single line imports)
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TabsModule } from 'primeng/tabs';

import { Appointment } from '@/models/appointment';
import { AppointmentService } from '@/services/appointment.service';
```

## Angular Best Practices

### Components & Architecture
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images (does not work for inline base64 images)

### Component Structure
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file
- Use `styleUrl` (singular) for single stylesheets, not `styleUrls` (plural). Only use `styleUrls` when you have multiple stylesheets

### Component Imports Format
Format `imports: []` in `@Component` decorator as a multiline array, alphabetically sorted by import name:

```typescript
// ✅ Correct
@Component({
  selector: 'app-my-component',
  imports: [
    ButtonModule,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './my-component.html',
})

// ❌ Wrong
@Component({
  selector: 'app-my-component',
  imports: [RouterLink, ButtonModule, DatePipe],
  templateUrl: './my-component.html',
})
```

### State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available
- Do not write arrow functions in templates (they are not supported)

### Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

### Data Loading (CRITICAL)
- **Always use `toSignal()`** to load data — never use `subscribe()` in components
- Do NOT use `ngOnInit()`, `constructor()`, or manual `subscribe()` calls to fetch data
- Do NOT use `signal<T>([])` combined with `subscribe()` — this is an anti-pattern
- When data depends on route params, pipe through `ActivatedRoute` reactively so the data reloads automatically on param changes
- Always provide `{ initialValue: [] }` (or a sensible typed default) to avoid `undefined` in templates

```typescript
// ✅ Simple list — reloads when service changes
readonly items = toSignal(this.myService.getAll(), { initialValue: [] });

// ✅ Route-param dependent — reloads on every param change
readonly item = toSignal(
  inject(ActivatedRoute).params.pipe(
    switchMap(params => this.myService.getById(+params['id']))
  )
);

// ❌ Wrong — manual subscription
ngOnInit(): void {
  this.myService.getAll().subscribe(data => this.items.set(data));
}
```

## Accessibility Requirements

- It MUST pass all AXE checks
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes

## Project Structure

### Views (Pages)
Place all **page-level components** in `src/app/views/`. This includes:
- Full-page route views
- Layout (app layout, auth layout, etc.)
- Sidebars and navigation wrappers

Each view gets its own subfolder mirroring the route hierarchy:

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
      import('./views/layout/layout').then(m => m.Layout),
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
- Be scoped with `providedIn: 'root'` unless intentionally scoped to a feature
- Use `inject()` for dependencies, not constructor injection
- Encapsulate all HTTP calls — components and views must never call `HttpClient` directly

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

**Model Guidelines:**
- Use `interface` for object shapes; use `type` for unions, intersections, or aliases
- Do **not** define models inline inside service or component files
- For every model that has `Date` fields, define a corresponding `Raw` type in the same file where all `Date` fields are replaced with `string`. Name it `<ModelName>Raw` (e.g. `CustomerRaw`). Nested model references must also use their `Raw` counterpart

```typescript
// ✅ Correct
export interface Appointment {
  id: number;
  appointmentTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  therapy: Therapy;
}

export interface AppointmentRaw {
  id: number;
  appointmentTimestamp: string;
  createdAt: string;
  updatedAt: string;
  therapy: TherapyRaw;
}
```

- Use the `Raw` type as the generic argument when calling `HttpClient` methods, then convert with `map()` in the service using `convertFromApi()` / `convertToApi()` helpers
- Never let `Date`↔`string` conversion happen inside components or templates

## Styling

### Tailwind CSS
- Use **only** Tailwind utility classes for layout, spacing, color, typography, and responsive design
- Keep component `.css` files **empty** unless absolutely necessary (e.g., a third-party override that Tailwind cannot express)
- Do **not** write custom CSS class names or BEM selectors

```html
<!-- ✅ Correct -->
<nav class="flex items-center gap-4 bg-surface-900 px-6 py-3 shadow-md">

<!-- ❌ Wrong -->
<nav class="app-nav">
```

### Tailwind v4 Specifics
This project uses **Tailwind CSS v4**. It is imported globally via `@import 'tailwindcss'` in `styles.css` — do not add a `tailwind.config.ts` and do not use the `@tailwind` directive syntax from v3.

### PrimeNG & Tailwind Integration
**Always prefer PrimeNG components** over native HTML equivalents whenever a PrimeNG component exists. This includes buttons (`p-button`), text inputs (`pInputText`), dropdowns, checkboxes, dialogs, data tables, overlays, and more. Only fall back to plain HTML elements when no suitable PrimeNG component is available.

- Use `p-button` instead of `<button>` or `<a>` for all actions and navigation triggers
- Use `pInputText` directive on `<input>` elements for text fields
- Use `[text]="true"` and `[rounded]="true"` on `p-button` for icon-only action buttons
- Use `severity` (`secondary`, `danger`, etc.) on `p-button` to express intent

Style PrimeNG component wrappers and surrounding layout with Tailwind classes. Avoid writing CSS overrides for PrimeNG internals.

## Confirmation Dialogs

Use `ConfirmationService` from `primeng/api` for all delete confirmations. Place `<p-confirmdialog />` and `<p-toast />` **once in the layout** component — never in individual views.

- Provide `ConfirmationService` and `MessageService` in the layout's `providers` array
- In child views, inject both services and call `confirmationService.confirm()` directly — no local `providers`, no local `<p-confirmdialog />`
- Always use the compact inline style for `rejectButtonProps` and `acceptButtonProps`
- Do **not** add a `reject` callback — silently closing the dialog on cancel is the expected behavior

```typescript
// ✅ Correct
protected deleteItem(id: number): void {
  this.confirmationService.confirm({
    message: 'Möchten sie den Eintrag wirklich löschen?',
    header: 'Eintrag löschen',
    rejectButtonProps: { label: 'Abbrechen', severity: 'secondary', outlined: true },
    acceptButtonProps: { label: 'Löschen', severity: 'danger' },
    accept: () => {
      this.myService.delete(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Eintrag gelöscht', life: 3000 });
        this.refresh$.next();
      });
    }
  });
}

// ❌ Wrong — multi-line button props, local providers, reject callback
rejectButtonProps: {
  label: 'Abbrechen',
  severity: 'secondary',
  outlined: true
},
```

## Icons

### Material Symbols Outlined
- Use **only** [Material Symbols Outlined](https://fonts.google.com/icons) for icons. The font is loaded globally via `index.html`
- Render icons with a `<span>` using the `material-symbols-outlined` class and the icon ligature as text content
- Do **not** use any other icon library (e.g. Font Awesome, Heroicons, PrimeIcons)

```html
<!-- ✅ Correct -->
<span class="material-symbols-outlined">home</span>
<span class="material-symbols-outlined">settings</span>

<!-- ❌ Wrong -->
<i class="pi pi-home"></i>
<i class="fa fa-home"></i>
```

- Size and color with Tailwind: `text-xl`, `text-primary-500`, etc.
- For accessibility, add `aria-hidden="true"` on decorative icons and pair with a visually-hidden label when the icon conveys meaning
