# Übergabe – coachunited.de

Stand: 2026-08-07. Dieses Dokument ist der Einstiegspunkt für alle, die künftig an coachunited.de weiterarbeiten (Entwickler, Freelancer, Nachfolger).

## 1. Was ist das für ein Projekt?

Trotz des Ordnernamens `coachunited-next` ist das **kein Next.js-Projekt**. Es gibt kein `package.json`, kein Framework, keinen Build-Client-Code. Es handelt sich um eine **statische HTML/CSS/Vanilla-JS-Website**, die als Static-Site über Vercel ausgeliefert wird. Jede Seite ist eine eigenständige `.html`-Datei mit eingebettetem `<style>` und `<script>`.

Zielgruppe der Seite: Trainer:innen im Kinderfußball (G-/F-/E-/D-Jugend), die kostenlose Übungen, fertige Trainingseinheiten und Fachartikel suchen.

## 2. Verzeichnisstruktur

```
coachunited-next/
├── public/                  ← alles, was ausgeliefert wird (= Vercel outputDirectory)
│   ├── home.html             Startseite (/home)
│   ├── uebungen.html         Übungsübersicht mit Filtern (/uebungen)
│   ├── uebung-detail.html    Template für Übungs-Detailseiten
│   ├── uebung/               generiert: eine .html pro Übung (Build-Zeit)
│   ├── einheiten.html        Landingpage "Einheit erhalten" (/einheiten)
│   ├── einheit-generator.html  Interaktiver Generator + Ergebnis-Ansicht (/einheit-generator)
│   ├── einheit-detail.html   Template für statische, SEO-Einheiten-Seiten
│   ├── einheit/               generiert: eine .html pro Einheit (Build-Zeit)
│   ├── artikel-detail.html   Template für Fachartikel
│   ├── artikel/                generiert: eine .html pro Artikel (Build-Zeit)
│   ├── merkliste.html, wissen.html, whatsapp-info.html, ueber-uns.html,
│   │   impressum.html, datenschutz.html, uebung-einreichen.html, umgang-mit-ki.html, danke.html
│   ├── cookie-consent.js      Consent-Banner (Google Analytics erst nach Einwilligung)
│   ├── uebungen-nach-alter.html / -phase.html / -skill.html   (Übersichtsseiten)
│   ├── alter/{g,f,e,d}-jugend.html      Landingpages je Altersstufe
│   ├── phase/{aufwaermen,hauptteil,spielformat}.html
│   ├── skill/{ballkontrolle,dribbeln,...}.html   (15 Skill-Landingpages)
│   ├── exercises.json         Datenquelle für alle Übungen (177 Einträge)
│   ├── einheiten.json         Datenquelle für vorgefertigte Einheiten (50 Einträge)
│   ├── articles.json          Datenquelle für Fachartikel (11 Einträge)
│   ├── desktop.css            Desktop-Layout-Overrides (ab 768px), gilt zusätzlich zum Mobile-CSS
│   ├── desktop-nav.js         Wird auf ALLEN Seiten eingebunden: injiziert Desktop-Topnav/Footer
│   │                          UND den sitewide Ferienkalender-Hinweis (siehe Abschnitt 5)
│   ├── feedback-widget.js     Aktuell deaktiviert (Beta-Phase beendet), nur auf einem Teil der Seiten eingebunden
│   └── sitemap.xml, robots.txt
├── scripts/
│   ├── build-exercise-pages.js   generiert public/uebung/*.html aus exercises.json + Template
│   ├── build-einheit-pages.js    generiert public/einheit/*.html aus einheiten.json + Template
│   ├── build-artikel-pages.js    generiert public/artikel/*.html aus articles.json + Template
│   ├── build-sitemap.js          generiert public/sitemap.xml aus allen drei JSON-Quellen
│   ├── upload-grafik-images.js   Hilfsscript zum Hochladen von Übungsgrafiken
│   └── gen-landing-pages.ps1     PowerShell-Helfer zum Erzeugen der Alter/Phase/Skill-Landingpages
├── api/
│   └── consent-log.js        Serverless-Function, protokolliert Consent-Entscheidungen
├── vercel.json               Build-Command, Redirects/Rewrites (sehr lang – viele Alt-URL-Weiterleitungen)
├── Archiv/                    alte/verworfene Entwürfe, nicht live
├── Indexierung/               Exporte aus der Google Search Console (Coverage-Reports)
└── .env                       WP_USER / WP_APP_PASSWORD (siehe Abschnitt 6)
```

Wichtig: `uebung-detail.html`, `einheit-detail.html` und `artikel-detail.html` sind **Templates**. Sie werden bei jedem Deploy von den Build-Scripts gelesen, mit Daten aus der jeweiligen `.json`-Datei befüllt und als einzelne Dateien nach `public/uebung/`, `public/einheit/`, `public/artikel/` geschrieben. Wer an Layout/Funktion einer Detailseite etwas ändert, muss das **Template** anfassen, nicht eine generierte Datei (die wird beim nächsten Build überschrieben).

`einheit-generator.html` ist etwas anderes: die interaktive Seite, auf der Nutzer Kriterien wählen und live eine Einheit zusammengestellt bekommen (inkl. Merkliste/Teilen/Drucken-Aktionsleiste). Sie wird nicht generiert, sondern ist eine feste Seite unter `/einheit-generator`.

## 3. Wie eine neue Übung / Einheit / ein Artikel ins System kommt

1. Neuer Eintrag (mit `status: "veroeffentlicht"` und `url_slug`) wird in `exercises.json`, `einheiten.json` bzw. `articles.json` ergänzt.
2. Beim nächsten Deploy (Push nach `main`) läuft automatisch das jeweilige Build-Script und erzeugt/aktualisiert die statische Detailseite sowie `sitemap.xml`.
3. Übungsgrafiken können entweder eine fertige URL sein oder als Base64 in `grafik_url` hinterlegt werden – dann lädt `build-exercise-pages.js` das Bild automatisch in die WordPress-Mediathek von `archiv.coachunited.de` hoch und trägt die permanente URL ein (siehe Abschnitt 6).

## 4. SEO-Elemente

- **Meta-Tags pro Seite**: `<title>`, `meta description`, Open-Graph-Tags (`og:title`, `og:description`, `og:image`, `og:url`), `canonical` – jeweils im `<head>` der Templates/Einzelseiten, für generierte Seiten aus den `seo_*`-Feldern der JSON-Dateien befüllt.
- **JSON-LD**: `home.html` enthält ein `@graph` mit `Organization`, `WebSite` und den wichtigsten `WebPage`-Einträgen (schema.org).
- **Sitemap**: `public/sitemap.xml`, wird bei jedem Build aus `STATIC_PAGES` (hart codiert in `build-sitemap.js`) plus allen veröffentlichten Übungen/Einheiten/Artikeln neu geschrieben. Neue statische Seiten (z. B. eine neue Landingpage) müssen manuell in die `STATIC_PAGES`-Liste in `scripts/build-sitemap.js` eingetragen werden.
- **robots.txt**: erlaubt alles, verweist auf die Sitemap.
- **Redirects/Rewrites**: `vercel.json` enthält sehr viele 301-Redirects von alten WordPress-URLs (Migration von einer früheren WordPress-Seite) sowie die Rewrites, die z. B. `/uebung/:slug` auf `/uebung/:slug.html` mappen.
- **Altseite/Assets**: Alte WordPress-Inhalte (`/wp-content`, `/wp-includes`, `/minitt`) werden auf `archiv.coachunited.de` weitergeleitet – technisch als **Redirect**, nicht als Rewrite. Die alte Seite bleibt dort als Archiv erreichbar.
- **Zuordnung Alt-URL → neue Seite**: `einheiten.json` führt pro Einheit das Feld `quell_url` mit der ursprünglichen WordPress-URL. Das ist die autoritative Quelle, wenn ein alter Pfad auf die richtige neue Seite gemappt werden soll – nicht über Titelvergleich raten. Die alten WordPress-Beiträge waren **Trainingseinheiten** (mehrere Übungen je Beitrag) und wurden zu `/einheit/<slug>` migriert, nicht zu `/uebung/<slug>`.
- **Google Search Console**: Coverage-Exporte werden manuell im Ordner `Indexierung/` abgelegt (kein automatischer Sync).
- **Analytics**: Google Analytics 4 via `gtag.js`, Property-ID `G-5D2HZBJESR`, eingebunden im `<head>` jeder Seite.

## 5. Sitewide-Bausteine (auf praktisch jeder Seite aktiv)

- **`desktop-nav.js`**: das einzige Script, das wirklich auf **allen** Seiten eingebunden ist (auch auf den generierten Detailseiten). Baut ab 768px Breite die Desktop-Navigation und den Footer per JavaScript in `.container` ein (auf Mobile bleibt das Markup unverändert). Seit 07/2026 injiziert dieselbe Datei zusätzlich den **Störer/Hinweis auf den Ferienkalender-Artikel** (Funktion `injectFerienPromo()`), unabhängig von der Bildschirmbreite:
  - Mobile: schmaler, vertikaler Tab am rechten Bildschirmrand.
  - Desktop: Karte unten rechts, fliegt nach ~0,9 s sanft ein.
  - Beide verlinken auf `/artikel/der-fussball-ferienkalender`, haben ein „✕“ zum Schließen (Dismiss wird 14 Tage in `localStorage` gemerkt) und werden auf der Artikelseite selbst nicht angezeigt.
  - Titel/Bild/Link sind aktuell hart codiert in der Funktion – für eine neue Kampagne dort die Variablen `slug`, `tabText`, `cardTitle`, `img` anpassen.
- **`feedback-widget.js`**: aktuell nur ein Kommentar ("Beta-Phase beendet"), ist NICHT auf allen Seiten eingebunden (fehlt z. B. auf `merkliste.html`, `detail.html`, `einheit-detail.html`, `artikel-detail.html`). Für neue sitewide Funktionen `desktop-nav.js` verwenden, nicht dieses.
- **`desktop.css`**: Layout-Overrides für ≥768px, wird zusätzlich zum mobilen Inline-CSS jeder Seite geladen.

## 6. Externe Abhängigkeiten

- **WordPress als Bild-Backend**: `archiv.coachunited.de` ist die alte WordPress-Installation. Sie dient nur noch als Mediathek – die Build-Scripts laden Base64-Grafiken per REST-API (`/wp-json/wp/v2/media`) dorthin hoch und verwenden die zurückgegebene URL. Zugangsdaten liegen in `.env` (`WP_USER`, `WP_APP_PASSWORD`), diese Datei ist über `.gitignore` vom Git-Repo ausgeschlossen und muss auch in Vercel als Environment-Variable hinterlegt sein, damit der Build-Schritt dort funktioniert.
- **Google Fonts**: Inter Tight (Fließtext) und JetBrains Mono (Zahlen/Labels), per `<link>` geladen.
- **Google Analytics 4**.

## 7. Deployment (GitHub → Vercel)

- **Repo**: `github.com/roberttgreve-web/coachunited-test`, Branch `main`.
- **Deploy-Trigger**: Vercel ist (vermutlich über die GitHub-Integration im Vercel-Dashboard, es liegt lokal kein `.vercel/`-Ordner vor) mit dem Repo verbunden und deployed automatisch bei jedem Push nach `main`.
- **Build-Command** (`vercel.json`):
  ```
  node scripts/build-exercise-pages.js && node scripts/build-einheit-pages.js && node scripts/build-artikel-pages.js && node scripts/build-sitemap.js
  ```
  Es gibt kein `npm install`-Schritt/`package.json` – die Scripts nutzen nur Node-Bordmittel (`fs`, `path`, `https`), daher reicht die von Vercel bereitgestellte Node-Runtime.
- **Output-Directory**: `public/` (in `vercel.json` als `outputDirectory` gesetzt).
- **Lokale Vorschau**: Da es sich um reines Static-HTML handelt, reicht ein einfacher statischer Server, z. B. `python -m http.server 3000 --directory public` oder `npx serve public`. Danach die Build-Scripts einmal manuell mit `node scripts/build-...js` laufen lassen, wenn generierte Seiten (Übung/Einheit/Artikel) getestet werden sollen.

⚠️ **Sicherheitshinweise** (beide am 2026-08-07 erneut geprüft und weiterhin offen):

1. Die lokale Git-Remote-URL (`git remote -v`) enthält ein GitHub Personal Access Token im Klartext (`https://ghp_...@github.com/...`). Das Token liegt damit unverschlüsselt in `.git/config` auf diesem Rechner. Empfehlung: Token in den GitHub-Einstellungen rotieren/löschen und stattdessen den Windows-Credential-Manager, GitHub CLI (`gh auth login`) oder SSH-Keys nutzen.
2. Die Zugangsdaten in `.env` (`WP_USER`/`WP_APP_PASSWORD`) gehören zu einem WordPress-Konto mit **Administrator-Rechten** auf `archiv.coachunited.de`, nicht zu einem reinen Medien-Konto. Für den Bild-Upload der Build-Scripts würde eine Rolle mit Upload-Rechten genügen.

## 8. Bekannte Baustellen / offene Punkte

- `Archiv/` enthält alte, nicht mehr verwendete Entwürfe (u. a. ein angefangener echter Next.js-Versuch unter `Archiv/app/`) – rein zur Referenz, nicht Teil des Live-Betriebs.
- Es gibt keine automatisierten Tests. Änderungen an Templates sollten nach dem Edit immer stichprobenartig über einen lokalen Static-Server in Mobile- und Desktop-Ansicht geprüft werden (siehe Abschnitt 7, „Lokale Vorschau").
- `feedback-widget.js` ist nicht überall eingebunden (s. o.) – falls es reaktiviert werden soll, vorher prüfen, ob es auf allen relevanten Seiten verlinkt ist.

## 9. Google Ad Grants – offene Maßnahmen (Stand 2026-08-07)

Die Bewerbung um Google Ad Grants wurde abgelehnt. Begründung von Google:

> Die Website sollte schnell laden und die Navigation eindeutig sein. Achten Sie auf relevante Inhalte und Calls-to-Action.

Maßgeblich sind die [Ad Grants-Website-Richtlinien](https://support.google.com/grants/answer/1657899). Die folgenden Punkte wurden am 2026-08-07 an der Live-Seite gemessen und sind die Grundlage für einen erneuten Antrag.

### 9.1 Bereits erledigt

- **Spendenseite entfernt.** Ein nicht funktionierender Spendenweg ist ein ausdrücklicher Ablehnungsgrund. Auf `/spenden` stand nur die PayPal-Adresse `spende@coachunited.de` als reiner Text, ohne Link oder Button – und Spenden sind mangels Vereinskonto ohnehin noch nicht möglich. `public/spenden.html` wurde gelöscht, `/spenden` leitet per 301 auf `/ueber-uns`, der Eintrag ist aus `STATIC_PAGES` in `build-sitemap.js` raus. **Sobald ein Vereinskonto existiert**, kann die Seite aus der Git-Historie zurückgeholt werden – dann aber mit funktionierendem Spenden-Button (z. B. `paypal.me`-Link) statt einer abzutippenden Adresse.
- Sämtliche 404-Fehler aus der Search Console wurden behoben (siehe Abschnitt 10).
- **Punkte 1–3 der Maßnahmenliste umgesetzt (2026-08-07).** Die Startseite überträgt jetzt **1,88 MB statt 6,77 MB** (–72 %):
  - `Cache-Control` gestaffelt statt `no-store` für alles: HTML `max-age=0, must-revalidate`, CSS/JS 1 Tag, JSON 1 Stunde, Bilder/Fonts 7 Tage, jeweils mit `stale-while-revalidate`. **Wichtig:** Bei gleichem Header-Schlüssel gewinnt bei Vercel die *zuletzt* passende Regel – die Auffangregel `/(.*)` muss deshalb als erste stehen, die spezifischen danach.
  - `hero-photo.jpg` 3712×5568 → 1400×2100 (1.589 KB → 219 KB)
  - `logo-home.png` 2646×1300 → 660×324 (459 KB → 11 KB)
  - `logo.png` 3284×800 → 800×195 (201 KB → 7 KB)
  - Störer-Bild: eigenes 128px-Thumbnail `images/artikel/fussball-ferienkalender-thumb.webp` (4 KB) statt des 2,9-MB-Artikelbilds. Die Promo-Karte zeigt es mit 64×64 an; das Original wurde auf jeder Seite geladen, auf Mobilgeräten sogar für die per CSS versteckte Karte.
  - Die Logos liegen jetzt als 256-Farben-Palette-PNG vor. Das ist bei flachen Vektorgrafiken unauffällig – bei künftigen Logos mit Verläufen wäre es das nicht.

### 9.2 Messwerte, die zur Ablehnung geführt haben

**Ladezeit** – die Startseite überträgt **6,77 MB**:

| Ressource | Übertragen | Anmerkung |
|---|---|---|
| `images/artikel/fussball-ferienkalender-…png` | 2.884 KB | Störer-Bild, wird von `desktop-nav.js` auf **jeder** Seite geladen |
| `exercises.json` | 1.622 KB | 2,6 MB entpackt – auf der Startseite nur für das Jugend-Dropdown |
| `hero-photo.jpg` | 1.590 KB | ein einzelnes Hintergrundbild |
| `logo-home.png` | 459 KB | Logo |
| `logo.png` | 201 KB | dasselbe Logo, kleiner eingebunden |

Verschärfend: In `vercel.json` gilt für **alle** Pfade `Cache-Control: no-cache, no-store, must-revalidate`. Dadurch wird nichts zwischengespeichert – jeder Seitenwechsel lädt Störerbild, Logos und Übungsdaten komplett neu. Die Richtlinie verlangt ausdrücklich aktives Browser-Caching.

**Textmenge** – sichtbarer Text je Seite:

| Seite | Wörter |
|---|---|
| `/home` | ~71 |
| `/ueber-uns` | ~113 |
| `/spenden` (entfernt) | ~73 |
| `/uebungen` | ~56 |
| `/wissen` | ~42 |

Google nennt „sehr wenig Textinhalt (Inhalte ohne Mehrwert)" als Ablehnungsgrund. Der eigentliche Wert – 177 Übungen, 50 Einheiten, 11 Artikel – ist echter Originalinhalt und würde die Anforderung erfüllen, ist aber dort nicht sichtbar, wo geprüft wird. `/wissen` zeigt beim Aufruf nur „Artikel werden geladen…", was wie eine unfertige Seite wirkt.

**Navigation** – in der Hauptnavigation stehen nur *Alle Übungen, Einheit erhalten, Merkliste, Wissen, WhatsApp-Kanal*. „Über uns" liegt ausschließlich im ausklappbaren Menü. Zusätzlich erscheinen beim ersten Aufruf Cookie-Banner und Ferienkalender-Störer gleichzeitig.

**Gemeinnütziger Status** – „Über uns" erwähnt nur „ehrenamtliche Fußballtrainer aus Berlin". Dass es sich um einen eingetragenen, gemeinnützigen Verein handelt, steht nirgends; die Registernummer VR 42714 B nur im Impressum. Die Richtlinie fordert Registernummer und/oder Jahresbericht.

### 9.3 Priorisierte Maßnahmenliste

| # | Maßnahme | Aufwand | Wirkung | Status |
|---|---|---|---|---|
| 1 | `Cache-Control` in `vercel.json` differenzieren: HTML kurz, Bilder/JSON lang cachen | 5 Min | sehr hoch | **erledigt** |
| 2 | Störerbild 2,9 MB → eigenes Thumbnail | 30 Min | sehr hoch | **erledigt** |
| 3 | `hero-photo.jpg` (1,6 MB), `logo-home.png` (459 KB), `logo.png` (201 KB) verkleinern | 30 Min | hoch | **erledigt** |
| 4 | Startseite um Inhaltssektionen und Calls-to-Action erweitern (Struktur s. u.) | mehrere Std. | sehr hoch | offen |
| 5 | „Über uns" ausbauen: Verein, Gemeinnützigkeit, VR 42714 B, Wirkung/Zahlen | 1–2 Std. | hoch | offen |
| 6 | „Über uns" in die Hauptnavigation aufnehmen | 30 Min | mittel | offen |
| 7 | `exercises.json` auf der Startseite nicht mehr laden (das Dropdown braucht es nicht) | 1 Std. | mittel | offen |
| 8 | `/wissen` und `/uebungen` mit statischem Einleitungstext versehen | 1 Std. | mittel | offen |

Nach Umsetzung von 1–3 liegt die Startseite bei 1,88 MB. Der mit Abstand größte verbliebene Posten ist `exercises.json` mit 1.622 KB – das sind 86 % des restlichen Gewichts und damit Punkt 7. Die Startseite lädt die komplette Übungsdatenbank, obwohl sie davon nur das Jugend-Dropdown befüllt. Ein kleiner Index (Jugend-Stufen plus Anzahl) würde dafür genügen.

Vorgeschlagene Sektionsstruktur für die Startseite (Punkt 4):

1. Hero – Anliegen in einem Satz, sichtbar „gemeinnütziger Verein", primärer CTA
2. Was wir bereitstellen – drei Blöcke (Übungen / Einheiten / Wissen) mit je eigenem CTA und 2–3 Sätzen
3. Warum es uns gibt – das Anliegen: ehrenamtliche Trainer:innen im Kinderfußball entlasten
4. Zahlen – 177 Übungen, 50 Einheiten, 11 Artikel, kostenlos, werbefrei
5. Für wen – G- bis D-Jugend, mit Links auf die Altersseiten
6. Wer wir sind – Verein, Gemeinnützigkeit, VR-Nummer, Link auf „Über uns"
7. Mitmachen – „Übung einreichen" (Spenden-CTA erst, wenn ein Konto existiert)
8. Aktuelle Artikel – Teaser mit echtem Text, nicht nur Kacheln

### 9.4 Prüfwerkzeuge vor dem erneuten Antrag

- [PageSpeed Insights](https://pagespeed.web.dev/) – besonders den Mobilwert beachten
- [Test auf Optimierung für Mobilgeräte](https://search.google.com/test/mobile-friendly)
- Search Console → Abdeckungsbericht auf verbliebene 404er prüfen

Mobil ist die Seite unkritisch (Mobile-First-Design mit Bottom-Nav) – das ist die geringste Sorge.

## 10. SEO-Arbeiten August 2026

Am 2026-08-07 wurden folgende Punkte behoben und live verifiziert:

- **404er**: 24 alte WordPress-URLs lieferten einen 404. Ursache: Sie fehlten in der Redirect-Liste der Migration. Behoben über `quell_url` aus `einheiten.json` (siehe Abschnitt 4).
- **Pauschal-Redirects**: 74 Regeln zeigten auf `/uebungen`, obwohl die migrierte Einheit existierte. Google wertet solche Weiterleitungen wie einen Soft-404 und überträgt kein Ranking. Sie zeigen jetzt auf `/einheit/<slug>`.
- **Query-Parameter**: `?ref=`, `?from=` und `?back=` wurden aus allen internen Links entfernt – sie erzeugten pro Übung mehrere crawlbare URLs mit identischem Inhalt.
- **Sitemap**: `lastmod` wird nicht mehr pauschal auf das Build-Datum gesetzt (das entwertet das Signal), sondern nur noch für Artikel aus `erstellt_am`. `/impressum` und `/datenschutz` sind raus, da sie `noindex` tragen.
- **Archiv**: Auf `archiv.coachunited.de` wurden in Yoast SEO Tag- und Kategorie-Archive auf `noindex` gesetzt, Feeds und Autoren-Archive abgeschaltet. Damit fallen rund 220 wertlose URLs weg, die zuvor das Crawl-Budget aufgebraucht haben. **Nicht** den Schalter „Suchmaschinen abhalten" verwenden – der setzt `noindex` auf alles, auch auf die 82 Inhaltsseiten, und blockiert `/wp-content/` (Bilder).

### 10.1 Zwei Fallstricke für künftige Änderungen

- **Übungskarten werden doppelt erzeugt.** Die Karten auf den Einheiten-Seiten entstehen serverseitig in `scripts/build-einheit-pages.js` **und** clientseitig in `public/einheit-detail.html`. Wer dort etwas ändert, muss beide Stellen anfassen. Ein Grep nur über `public/*.html` übersieht die vorgerenderte Variante – und genau die crawlt Google.
- **Zurück-Button ohne Query-Parameter.** Die Herkunft liegt in `sessionStorage` unter dem Key `cu_back` als `{target, url, label}`. Sie greift nur, wenn `target` mit dem aktuellen Pfad übereinstimmt – dadurch kann kein veralteter Zurück-Link hängenbleiben. Alte Links mit `?ref=`/`?from=`/`?back=` werden weiterhin ausgewertet und dürfen nicht entfernt werden, solange sie noch indexiert sind.

### 10.2 Noch offen

- 15 alte Slugs zeigen weiter pauschal auf `/uebungen`, weil es dazu keine migrierte Einheit gibt (u. a. `/vom-dribbelstern-zum-spiel-auf-ein-tor`, `/passen-passen-passen`).
- Auf dem Archiv steht `author-sitemap.xml` noch im Sitemap-Index, obwohl Autoren-Archive deaktiviert sind. Vermutlich Object-Cache (GoDaddy Managed WordPress) – Flush über das Menü „Managed WordPress" in der Adminleiste.
