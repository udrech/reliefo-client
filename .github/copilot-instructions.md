
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- **Sort import statements in this order (keep on single lines):**
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

import { Appointment } from '../../models/appointment';
import { AppointmentService } from '../../services/appointment.service';
```

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
- Use `styleUrl` (singular) for single stylesheets, not `styleUrls` (plural). Only use `styleUrls` when you have multiple stylesheets.
- Format `imports: []` in `@Component` decorator as a multiline array, alphabetically sorted by import name

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

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Data Loading

- **Always use `toSignal()`** to load data — never use `subscribe()` in components.
- Do NOT use `ngOnInit()`, `constructor()`, or manual `subscribe()` calls to fetch data.
- Do NOT use `signal<T>([])` combined with `subscribe()` — this is an anti-pattern.
- When data depends on route params, pipe through `ActivatedRoute` reactively so the data reloads automatically on param changes.
- Always provide `{ initialValue: [] }` (or a sensible typed default) to avoid `undefined` in templates.

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
