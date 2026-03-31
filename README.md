# reliefo-client

Reliefo Therapy App Client

## App Struktur und Pfade

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
