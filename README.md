# reliefo-client

Reliefo Therapy App Client

## ToDo

* ...

## App Struktur

* Kunden
  * Termine
  * Quittungen
  * Krankengeschichte
  * Neuer Termin, Termin bearbeiten, Termin löschen
  * Neue Quittung, Quittung löschen
  * Neuer KG Eintrag, KG Eintrag bearbeiten, KG Eintrag löschen
* Termine
  * Neuer Termin, Termin bearbeiten, Termin löschen
* Quittungen
  * Neue Quittung, Quittung löschen
* Massagen
  * Neue Massage, Massage bearbeiten, Massage löschen

## App Navigation

/login
/kunden
/massagen
/quittungen
/start
/termine

## Farbkonzept (Gemini)

| Bereich | Farbe | HEX-Code | Beschreibung / Anwendung |
| --- | --- | --- | --- |
| Primär | Kupfer-Gold | #C28E58 | Hauptfarbe für Buttons, das Logo und wichtige Highlights. |
| Sekundär | Salbei-Grün | #A8C2B0 | Für die fließenden Linien, Statusanzeigen oder sanfte Akzente. |
| Hintergrund | Creme-Weiß | #F9F7F2 | Haupt-Hintergrund der App (wirkt weicher und edler als Reinweiß). |
| Oberflächen | Leinen-Beige | #E5DCD0 | Für Karten-Elemente (Cards), Trennlinien oder Eingabefelder. |
| Text | Dunkles Taupe | #4A433D | Für Texte; bietet hohen Kontrast bei natürlicherer Anmutung als Schwarz. |

Design-Empfehlungen für die Umsetzung:

* **Primärfarbe (Brand):** Ich empfehle den Kupfer-Gold-Ton (#C59467) deines Logos als Primärfarbe für wichtige Schaltflächen zu verwenden.
* **Weißraum:** Nutze das Warme Elfenbein großzügig. Es spiegelt die hellen Handtücher und das Licht im Bild wider und lässt die App „atmen".
* **Abgerundete Ecken:** Passend zum verspielten Logo und der weichen Polsterung der Liege sollten alle UI-Elemente (Buttons, Bilder) stark abgerundete Ecken (z. B. 16px oder mehr) haben.
* **Schriftart:** Eine serifenlose, leicht „puffy" wirkende Schriftart würde den verspielten Charakter des Logos im Interface fortführen.

## Angular CLI

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.2.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
ng generate component component-name --skip-tests
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Vergleich Lade-Logik

```typecript
export class CustomersList {
  private readonly customerService = inject(CustomerService);

  constructor() {
    this.customerService.getAll().pipe(takeUntilDestroyed()).subscribe((data) => this.customers.set(data));
  }
}
```

```typescript
export class CustomersForm implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (id) {
      this.customerId = id;
      this.isNew.set(false);
      this.customerService.getById(id).subscribe((customer) => {
        this.form.patchValue(customer);
      });
    }
  }
}
```

```typescript
export class CustomersDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly customerService = inject(CustomerService);

  customer = toSignal(
    this.route.params.pipe(
      switchMap(params => this.customerService.getById(+params['id']))
    )
  );
}
```

```typescript
export class AppointmentsList {
  private readonly appointmentService = inject(AppointmentService);

  protected readonly appointments = signal<Appointment[]>([]);

  ngOnInit(): void {
    this.appointmentService.getAll().subscribe((data) => this.appointments.set(data));
  }
}
```
