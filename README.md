# reliefo-client

Reliefo Therapy App Client

## ToDo

* Fehlermeldung wenn Löschen nicht möglich ist
* Therapien erstellen, bearbeiten, (löschen)
* Layout immer gleich class="card" ?
* Kundenname-Header als Component
* Quittung Detail Ansicht mit Download PDF Button
* Falsche URL -> 404 Seite mit Link zurück zur Startseite

## Bezeichnungen

* Die App wird allgemein für Therapien entwickelt.
* Im Konkreten Anwendungsfall sind das Massagen.
* Aus Gewohnheit werden Rechnungen als Quittungen bezeichnet, da sie dem Kunden ausgehändigt werden.
* Für den Benutzer sichtbar wird überall Massagen und Quittungen statt Therapien und Rechnungen verwendet. Im Hintergrund (Code, API) bleiben die neutraleren Begriffe Therapien und Rechnungen bestehen.

| Tabelle | NG Klasse | NG Interface | Bezeichnung (deutsch, für Benutzer sichtbar) |
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
    * Termin löschen
  * Quittungen
    * Neue Quittung
    * Quittung löschen
  * Krankengeschichte
    * Neuer KG Eintrag
    * KG Eintrag bearbeiten
    * KG Eintrag löschen
* Termine
  * Termin bearbeiten
  * Termin löschen
* Quittungen
  * Quittung löschen
* Massagen
  * Neue Massage
  * Neue Version
  * Massage bearbeiten
  * Massage löschen

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

## App Build und zu Server kopieren

```bash
ng build --configuration production
rm -rf ../reliefo-api/wwwroot/*
cp -r dist/reliefo-client/browser/* ../reliefo-api/wwwroot/
```

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

## Vergleich der Lade-Ansätze

### Übersicht

| Ansatz | Wo | Lifecycle | Angular-Stil | Empfehlung |
| --- | --- | --- | --- | --- |
| `constructor()` | Klassen-Konstruktor | Vor der Initialisierung | Klassisch | ⚠️ Vermeiden für async |
| `implements OnInit` + `ngOnInit()` | Lifecycle-Hook | Nach der Initialisierung | Klassisch | ✅ OK, aber veraltet |
| `toSignal()` | Klassenfeld | Reaktiv / deklarativ | Modern | ✅✅ Bevorzugt |
| `signal<T>([])` + `ngOnInit()` | Hybrid | Nach der Initialisierung | Teilweise modern | ⚠️ Mischform |

---

### 1. `constructor()` — Laden im Konstruktor

```typescript
constructor() {
  this.customerService.getAll().pipe(takeUntilDestroyed()).subscribe(...);
}
```

**Was passiert:** Der Konstruktor wird aufgerufen, sobald Angular die Klasse instanziiert — noch bevor Inputs oder der DOM verfügbar sind.

**`takeUntilDestroyed()`** wird benötigt, weil das Observable sonst nach der Zerstörung der Komponente weiter feuern würde (Memory Leak). Im `constructor()` ist `DestroyRef` automatisch verfügbar.

**Vorteile:**

* Kein Interface (`OnInit`) nötig
* `takeUntilDestroyed()` funktioniert ohne expliziten `DestroyRef`

**Nachteile:**

* Konstruktoren sollten keine Seiteneffekte haben (Best Practice)
* Inputs sind noch nicht gesetzt — gefährlich bei parameterabhängigem Laden

---

### 2. `implements OnInit` + `ngOnInit()` — Klassischer Lifecycle-Hook

```typescript
export class CustomersForm implements OnInit {
  ngOnInit(): void {
    this.customerService.getById(id).subscribe(...);
  }
}
```

**Was passiert:** `ngOnInit()` ist ein Angular Lifecycle-Hook, der **nach** dem Setzen der Inputs ausgeführt wird. `implements OnInit` ist ein TypeScript-Interface, das sicherstellt, dass die Methode korrekt implementiert ist.

**`implements OnInit`** ist rein ein TypeScript-Vertrag (Interface). Angular ruft `ngOnInit()` unabhängig davon auf — aber das Interface hilft dem Compiler, Tippfehler (`ngOniNit`) zu erkennen.

**Vorteile:**

* Inputs sind verfügbar
* Klar strukturiert und verständlich

**Nachteile:**

* Imperativ: man muss manuell abonnieren und den State setzen
* Erfordert manuelle Cleanup-Logik (`takeUntilDestroyed()` oder `unsubscribe`)

---

### 3. `toSignal()` — Moderner, reaktiver Ansatz ✅ Empfohlen

```typescript
export class CustomersDetail {
  customer = toSignal(
    this.route.params.pipe(
      switchMap(params => this.customerService.getById(+params['id']))
    )
  );
}
```

**Was passiert:** `toSignal()` konvertiert ein Observable direkt in ein Signal. Angular verwaltet das Abonnement automatisch — kein manuelles `subscribe()`, kein `unsubscribe()`, kein Lifecycle-Hook nötig.

**Vorteile:**

* Vollständig deklarativ — kein Boilerplate
* Automatisches Cleanup durch Angular
* Reaktiv: aktualisiert sich automatisch bei Route-Änderungen
* Kompatibel mit `ChangeDetectionStrategy.OnPush`

**Nachteile:**

* Muss im Injection-Kontext aufgerufen werden (Klassenfeld oder `constructor`)
* Returntyp ist `Signal<T | undefined>` (sofern kein `initialValue` angegeben)

---

### 4. `signal<Appointment[]>([])` + `ngOnInit()` — Hybridansatz

```typescript
protected readonly appointments = signal<Appointment[]>([]);

ngOnInit(): void {
  this.appointmentService.getAll().subscribe((data) => this.appointments.set(data));
}
```

**Was passiert:** Ein Signal wird manuell mit einem leeren Array initialisiert. In `ngOnInit()` wird das Observable abonniert und das Signal mit den Daten befüllt.

**`signal<Appointment[]>([])`** erstellt ein beschreibbares Signal mit dem Typ `Appointment[]` und dem Startwert `[]`. Der Typ wird explizit angegeben, weil TypeScript `[]` allein nicht als `Appointment[]` inferieren kann.

**Vorteile:**

* Template rendert sofort mit leerem Array (kein `undefined`)
* Vertraut für Entwickler, die Signals kennen aber Observables vermeiden wollen

**Nachteile:**

* Mischform: imperatives `subscribe()` mit reaktivem Signal
* Kein automatisches Cleanup — erfordert `takeUntilDestroyed()`
* `toSignal()` macht dasselbe eleganter

---

### Fazit: Welchen Ansatz verwenden?

In modernem Angular (v17+) ist **`toSignal()`** der bevorzugte Ansatz:

```typescript
// Empfohlen: deklarativ, kein Boilerplate, automatisches Cleanup
readonly data = toSignal(this.myService.getAll(), { initialValue: [] });
```

`ngOnInit()` bleibt sinnvoll, wenn Inputs vor dem Laden benötigt werden und `toSignal()` nicht passt. `constructor()` sollte für Datenladen vermieden werden.
