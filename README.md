# reliefo-client

Reliefo Therapy App Client

## Ideen, WÃ¼nsche, ToDo

* Terminliste trennen in "Bevorstehende Termine" und "Vergangene Termine"
* Tests auf iPad und Android
* Google Termin Import
* Doku: Wartung, Angular Update, etc.
* Kundenname-Header als Component
* Quittung Detail Ansicht mit Download PDF Button
* Falsche URL -> 404 Seite mit Link zurÃ¼ck zur Startseite
* Statistiken
  * Anzahl Kunden
  * Anzahl Massagen pro Jahr
  * Anzahl Massagen pro Monat
  * Anzahl Massagen pro Kunde
  * Umsatz pro Jahr
  * Umsatz pro Monat
  * Umsatz pro Kunde

## Testfall Liste

* Kunde erstellen
* Kunde bearbeiten
* Kunde lÃ¶schen
* Termin erstellen
* Termin bearbeiten
* Termin lÃ¶schen
* Quittung erstellen
* Quittung herunterladen
* Quittung lÃ¶schen
* Massage erstellen
* Massage bearbeiten
* Massage lÃ¶schen
* Krankengeschichte Eintrag erstellen
* Krankengeschichte Eintrag bearbeiten
* Krankengeschichte Eintrag lÃ¶schen
* Statistik anzeigen

## Bezeichnungen

* Die App wird allgemein fÃ¼r Therapien entwickelt.
* Im konkreten Anwendungsfall sind das Massagen.
* Aus Gewohnheit werden Rechnungen als Quittungen bezeichnet, da sie dem Kunden nach der sofortigen Bezahlung ausgehÃ¤ndigt werden.
* FÃ¼r den Benutzer sichtbar wird Ã¼berall Massagen und Quittungen statt Therapien und Rechnungen verwendet. Im Hintergrund (Code, API) bleiben die neutraleren Begriffe Therapien und Rechnungen bestehen.

| Tabelle | NG Klasse | NG Interface | Bezeichnung (deutsch, fÃ¼r Benutzer sichtbar) |
| --- | --- | --- | --- |
| appointments | AppointmentsXy | Appointment | Termine |
| customers | CustomersXy | Customer | Kunden |
| medical_histories | MedicalHistoriesXy | MedicalHistory | Krankengeschichte |
| bills | BillsXy | Bill | Quittungen |
| therapies | TherapiesXy | Therapy | Massagen |

## App Struktur

* Kunden
  * Termine
    * Neuer Termin
    * Termin bearbeiten
    * Termin lÃ¶schen
  * Quittungen
    * Neue Quittung
    * Quittung lÃ¶schen
  * Krankengeschichte
    * Neuer KG Eintrag
    * KG Eintrag bearbeiten
    * KG Eintrag lÃ¶schen
* Termine
  * Termin bearbeiten
  * Termin lÃ¶schen
* Quittungen
  * Quittung lÃ¶schen
* Massagen
  * Neue Massage
  * Neue Version
  * Massage bearbeiten
  * Massage lÃ¶schen

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
| PrimÃ¤r | Kupfer-Gold | #C28E58 | Hauptfarbe fÃ¼r Buttons, das Logo und wichtige Highlights. |
| SekundÃ¤r | Salbei-GrÃ¼n | #A8C2B0 | FÃ¼r die flieÃŸenden Linien, Statusanzeigen oder sanfte Akzente. |
| Hintergrund | Creme-WeiÃŸ | #F9F7F2 | Haupt-Hintergrund der App (wirkt weicher und edler als ReinweiÃŸ). |
| OberflÃ¤chen | Leinen-Beige | #E5DCD0 | FÃ¼r Karten-Elemente (Cards), Trennlinien oder Eingabefelder. |
| Text | Dunkles Taupe | #4A433D | FÃ¼r Texte; bietet hohen Kontrast bei natÃ¼rlicherer Anmutung als Schwarz. |

Design-Empfehlungen fÃ¼r die Umsetzung:

* **PrimÃ¤rfarbe (Brand):** Ich empfehle den Kupfer-Gold-Ton (#C59467) deines Logos als PrimÃ¤rfarbe fÃ¼r wichtige SchaltflÃ¤chen zu verwenden.
* **WeiÃŸraum:** Nutze das Warme Elfenbein groÃŸzÃ¼gig. Es spiegelt die hellen HandtÃ¼cher und das Licht im Bild wider und lÃ¤sst die App â€žatmen".
* **Abgerundete Ecken:** Passend zum verspielten Logo und der weichen Polsterung der Liege sollten alle UI-Elemente (Buttons, Bilder) stark abgerundete Ecken (z. B. 16px oder mehr) haben.
* **Schriftart:** Eine serifenlose, leicht â€žpuffy" wirkende Schriftart wÃ¼rde den verspielten Charakter des Logos im Interface fortfÃ¼hren.

## Angular CLI

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.2.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Troubleshooting

If `ng serve` produces a page with broken layout or styling, it's likely a cache issue. Try these steps:

1. **Hard refresh the browser:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Clear Angular CLI cache:**

   ```bash
   rm -rf .angular
   ```

3. **Restart `ng serve`**

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

## App Build und zu Server kopieren

```bash
ng build --configuration production
rm -rf ../reliefo-api/wwwroot/*
cp -r dist/reliefo-client/browser/* ../reliefo-api/wwwroot/
```

## PrimeNG DatePicker DateFormat

âš ï¸ **Important:** In PrimeNG's `dateFormat` attribute, the format specifier `yy` actually means a **4-digit year** (e.g., `2026`), not a 2-digit year as might be expected from other frameworks. This is counterintuitive but confirmed in PrimeNG's implementation.

* `dd.mm.yy` â†’ `27.06.2026` (4-digit year)
* Input masks are also added to all datepickers for better UX:
  * Date: `pInputMask="99.99.9999"` (dd.mm.yyyy format)
  * Time: `pInputMask="99:99"` (HH:mm format)

---

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

## Vergleich der Lade-AnsÃ¤tze

### Ãœbersicht

| Ansatz | Wo | Lifecycle | Angular-Stil | Empfehlung |
| --- | --- | --- | --- | --- |
| `constructor()` | Klassen-Konstruktor | Vor der Initialisierung | Klassisch | âš ï¸ Vermeiden fÃ¼r async |
| `implements OnInit` + `ngOnInit()` | Lifecycle-Hook | Nach der Initialisierung | Klassisch | âœ… OK, aber veraltet |
| `toSignal()` | Klassenfeld | Reaktiv / deklarativ | Modern | âœ…âœ… Bevorzugt |
| `signal<T>([])` + `ngOnInit()` | Hybrid | Nach der Initialisierung | Teilweise modern | âš ï¸ Mischform |

---

### 1. `constructor()` â€” Laden im Konstruktor

```typescript
constructor() {
  this.customerService.getAll().pipe(takeUntilDestroyed()).subscribe(...);
}
```

**Was passiert:** Der Konstruktor wird aufgerufen, sobald Angular die Klasse instanziiert â€” noch bevor Inputs oder der DOM verfÃ¼gbar sind.

**`takeUntilDestroyed()`** wird benÃ¶tigt, weil das Observable sonst nach der ZerstÃ¶rung der Komponente weiter feuern wÃ¼rde (Memory Leak). Im `constructor()` ist `DestroyRef` automatisch verfÃ¼gbar.

**Vorteile:**

* Kein Interface (`OnInit`) nÃ¶tig
* `takeUntilDestroyed()` funktioniert ohne expliziten `DestroyRef`

**Nachteile:**

* Konstruktoren sollten keine Seiteneffekte haben (Best Practice)
* Inputs sind noch nicht gesetzt â€” gefÃ¤hrlich bei parameterabhÃ¤ngigem Laden

---

### 2. `implements OnInit` + `ngOnInit()` â€” Klassischer Lifecycle-Hook

```typescript
export class CustomersForm implements OnInit {
  ngOnInit(): void {
    this.customerService.getById(id).subscribe(...);
  }
}
```

**Was passiert:** `ngOnInit()` ist ein Angular Lifecycle-Hook, der **nach** dem Setzen der Inputs ausgefÃ¼hrt wird. `implements OnInit` ist ein TypeScript-Interface, das sicherstellt, dass die Methode korrekt implementiert ist.

**`implements OnInit`** ist rein ein TypeScript-Vertrag (Interface). Angular ruft `ngOnInit()` unabhÃ¤ngig davon auf â€” aber das Interface hilft dem Compiler, Tippfehler (`ngOniNit`) zu erkennen.

**Vorteile:**

* Inputs sind verfÃ¼gbar
* Klar strukturiert und verstÃ¤ndlich

**Nachteile:**

* Imperativ: man muss manuell abonnieren und den State setzen
* Erfordert manuelle Cleanup-Logik (`takeUntilDestroyed()` oder `unsubscribe`)

---

### 3. `toSignal()` â€” Moderner, reaktiver Ansatz âœ… Empfohlen

```typescript
export class CustomersDetail {
  customer = toSignal(
    this.route.params.pipe(
      switchMap(params => this.customerService.getById(+params['id']))
    )
  );
}
```

**Was passiert:** `toSignal()` konvertiert ein Observable direkt in ein Signal. Angular verwaltet das Abonnement automatisch â€” kein manuelles `subscribe()`, kein `unsubscribe()`, kein Lifecycle-Hook nÃ¶tig.

**Vorteile:**

* VollstÃ¤ndig deklarativ â€” kein Boilerplate
* Automatisches Cleanup durch Angular
* Reaktiv: aktualisiert sich automatisch bei Route-Ã„nderungen
* Kompatibel mit `ChangeDetectionStrategy.OnPush`

**Nachteile:**

* Muss im Injection-Kontext aufgerufen werden (Klassenfeld oder `constructor`)
* Returntyp ist `Signal<T | undefined>` (sofern kein `initialValue` angegeben)

---

### 4. `signal<Appointment[]>([])` + `ngOnInit()` â€” Hybridansatz

```typescript
protected readonly appointments = signal<Appointment[]>([]);

ngOnInit(): void {
  this.appointmentService.getAll().subscribe((data) => this.appointments.set(data));
}
```

**Was passiert:** Ein Signal wird manuell mit einem leeren Array initialisiert. In `ngOnInit()` wird das Observable abonniert und das Signal mit den Daten befÃ¼llt.

**`signal<Appointment[]>([])`** erstellt ein beschreibbares Signal mit dem Typ `Appointment[]` und dem Startwert `[]`. Der Typ wird explizit angegeben, weil TypeScript `[]` allein nicht als `Appointment[]` inferieren kann.

**Vorteile:**

* Template rendert sofort mit leerem Array (kein `undefined`)
* Vertraut fÃ¼r Entwickler, die Signals kennen aber Observables vermeiden wollen

**Nachteile:**

* Mischform: imperatives `subscribe()` mit reaktivem Signal
* Kein automatisches Cleanup â€” erfordert `takeUntilDestroyed()`
* `toSignal()` macht dasselbe eleganter

---

### Fazit: Welchen Ansatz verwenden?

In modernem Angular (v17+) ist **`toSignal()`** der bevorzugte Ansatz:

```typescript
// Empfohlen: deklarativ, kein Boilerplate, automatisches Cleanup
readonly data = toSignal(this.myService.getAll(), { initialValue: [] });
```

`ngOnInit()` bleibt sinnvoll, wenn Inputs vor dem Laden benÃ¶tigt werden und `toSignal()` nicht passt. `constructor()` sollte fÃ¼r Datenladen vermieden werden.

