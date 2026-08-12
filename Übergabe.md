# Übergabe – coachunited.de

Stand: 2026-08-12. Dieses Dokument ist der Einstiegspunkt für alle, die künftig an coachunited.de weiterarbeiten (Entwickler, Freelancer, Nachfolger).

## 1. Was ist das für ein Projekt?

Trotz des Ordnernamens `coachunited-next` ist das **kein Next.js-Projekt**. Es gibt kein `package.json`, kein Framework, keinen Build-Client-Code. Es handelt sich um eine **statische HTML/CSS/Vanilla-JS-Website**, die als Static-Site über Vercel ausgeliefert wird. Jede Seite ist eine eigenständige `.html`-Datei mit eingebettetem `<style>` und `<script>`.

Zielgruppe der Seite: Trainer:innen im Kinderfußball (G-/F-/E-/D-Jugend), die kostenlose Übungen, fertige Trainingseinheiten und Fachartikel suchen.

## 2. Verzeichnisstruktur

```
coachunited-next/
├── public/                  ← alles, was ausgeliefert wird (= Vercel outputDirectory)
│   ├── home.html             Startseite (/home) – enthält Marker für build-home.js, s. Abschnitt 11
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
│   ├── build-home.js             setzt Übungs-Anzahl und die 3 neuesten Artikel in home.html ein
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

- **`desktop-nav.js`**: das einzige Script, das wirklich auf **allen** Seiten eingebunden ist (auch auf den generierten Detailseiten). Baut ab 768px Breite die Desktop-Navigation und den Footer per JavaScript in `.container` ein (auf Mobile bleibt das Markup unverändert). Dieselbe Datei injiziert zusätzlich den **Störer für den WhatsApp-Kanal** (Funktion `injectWhatsAppPromo()`, seit 08/2026). Der frühere Ferienkalender-Störer wurde dabei ersatzlos entfernt — es gibt bewusst nur **einen** Störer-Slot, zwei gleichzeitige Einblendungen wirken wie Werbung.

  **Scharfschalten:** Ganz oben in der Funktion steht
  ```js
  var WA_PROMO_LIVE = false;   // auf true, sobald Google Ad Grants freigegeben ist
  ```
  Solange das `false` ist, erscheint der Störer **nur auf Vorschau-Deployments und lokal** (`hostname !== 'coachunited.de'`), nicht auf der Live-Seite. So lässt er sich testen, ohne live zu gehen, und niemand kann vergessen, ihn vor einem Merge auszuschalten.

  **Testhilfen:** `?wa=1` erzwingt die Anzeige (auch auf der Live-Domain), `?wa=reset` löscht den gemerkten Zustand.

  **Auslöser:** ab der zweiten Seite einer Sitzung sofort; auf der ersten Seite erst nach 20 Sekunden *und* mehr als halb gescrollt. Wer gerade erst gelandet ist, hat den Nutzen des Kanals noch nicht erlebt.

  **Drei Aktionen mit unterschiedlich langem Gedächtnis** (alles `localStorage`):

  | Aktion | Schlüssel | Wirkung |
  |---|---|---|
  | Kanal ansehen | `cu_wa_status = subscribed` | nie wieder |
  | Hab ich schon | `cu_wa_status = has` | nie wieder |
  | ✕ | `cu_wa_snooze` | 30 Tage Ruhe |
  | dreimal ignoriert | `cu_wa_shown >= 3` | dauerhaft Ruhe |

  Auf `/whatsapp-info` erscheint er nie. Mobil sitzt er **über** der Bottom-Nav — deren Höhe wird zur Laufzeit gemessen, weil sie von der Zeilenzahl der Beschriftungen abhängt. GA4-Ereignisse `wa_promo_shown`, `wa_promo_click`, `wa_promo_has`, `wa_promo_dismiss` werden nur gefeuert, wenn `gtag` existiert, also nach erteilter Cookie-Einwilligung.
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
  node scripts/build-exercise-pages.js && node scripts/build-einheit-pages.js && node scripts/build-artikel-pages.js && node scripts/build-home.js && node scripts/build-sitemap.js
  ```
  Es gibt kein `npm install`-Schritt/`package.json` – die Scripts nutzen nur Node-Bordmittel (`fs`, `path`, `https`), daher reicht die von Vercel bereitgestellte Node-Runtime.
- **Output-Directory**: `public/` (in `vercel.json` als `outputDirectory` gesetzt).
- **Lokale Vorschau**: Da es sich um reines Static-HTML handelt, reicht ein einfacher statischer Server, z. B. `python -m http.server 3000 --directory public` oder `npx serve public`. Danach die Build-Scripts einmal manuell mit `node scripts/build-...js` laufen lassen, wenn generierte Seiten (Übung/Einheit/Artikel) getestet werden sollen.
- **Ohne Node lokal**: `home.html`, `uebungen.html`, `wissen.html` und alle statischen Seiten funktionieren im lokalen Server auch ohne Build-Lauf. Nur die generierten Detailseiten unter `/uebung/`, `/einheit/` und `/artikel/` fehlen dann. Achtung: Der einfache Python-Server kennt die Rewrites aus `vercel.json` nicht – Links wie `/uebungen` laufen ins Leere, man muss `/uebungen.html` aufrufen. Zum Durchklicken eignet sich das Vorschau-Deployment des Branches besser.

⚠️ **Sicherheitshinweise** (beide am 2026-08-07 erneut geprüft und weiterhin offen):

1. Die lokale Git-Remote-URL (`git remote -v`) enthält ein GitHub Personal Access Token im Klartext (`https://ghp_...@github.com/...`). Das Token liegt damit unverschlüsselt in `.git/config` auf diesem Rechner. Empfehlung: Token in den GitHub-Einstellungen rotieren/löschen und stattdessen den Windows-Credential-Manager, GitHub CLI (`gh auth login`) oder SSH-Keys nutzen.
2. Die Zugangsdaten in `.env` (`WP_USER`/`WP_APP_PASSWORD`) gehören zu einem WordPress-Konto mit **Administrator-Rechten** auf `archiv.coachunited.de`, nicht zu einem reinen Medien-Konto. Für den Bild-Upload der Build-Scripts würde eine Rolle mit Upload-Rechten genügen.

## 8. Bekannte Baustellen / offene Punkte

- `Archiv/` enthält alte, nicht mehr verwendete Entwürfe (u. a. ein angefangener echter Next.js-Versuch unter `Archiv/app/`) – rein zur Referenz, nicht Teil des Live-Betriebs.
- Es gibt keine automatisierten Tests. Änderungen an Templates sollten nach dem Edit immer stichprobenartig über einen lokalen Static-Server in Mobile- und Desktop-Ansicht geprüft werden (siehe Abschnitt 7, „Lokale Vorschau").
- `feedback-widget.js` ist nicht überall eingebunden (s. o.) – falls es reaktiviert werden soll, vorher prüfen, ob es auf allen relevanten Seiten verlinkt ist.
- ⚠️ **CSS und JS tragen keine Versionsnummer im Dateinamen.** `/desktop.css`, `/sektionen.css`, `/desktop-nav.js` heißen nach jedem Deploy gleich. Deshalb steht ihr `Cache-Control` in `vercel.json` auf `max-age=0, must-revalidate` – der Browser fragt bei jedem Aufruf nach und bekommt meist ein 304. Vorher stand dort `max-age=86400`: Eine CSS-Änderung erreichte wiederkehrende Besucher bis zu 24 Stunden lang nicht, und beim Testen sah man auf dem Handy hartnäckig die alte Version. Wer die Regel wieder verschärfen will, muss vorher die Dateinamen versionieren (`sektionen.abc123.css`) – sonst kommt das Problem zurück.
- **Vorgemerkt: Foto für die Merkliste.** Im Projektstammverzeichnis liegt `younes-karami-ne-ft_5zDTY-unsplash.jpg` – gedacht für einen künftigen Umbau von `/merkliste` im Stil der Startseite. Aufbereitung wie in Abschnitt 11.4 beschrieben (Pillow, WebP, `ImageOps.exif_transpose()`).

## 9. Google Ad Grants (Stand 2026-08-12)

**Am 2026-08-12 wurde der Antrag erneut eingereicht.** Alle acht Maßnahmen aus 9.3 sind umgesetzt; was dabei gemessen und geändert wurde, steht in Abschnitt 14. Kommt erneut eine Ablehnung, sind die naheliegenden Stellschrauben: die Registernummer auf „Über uns" (13.2) und die 20 Base64-Bilder in `exercises.json`, die den Generator und die 227 Detailseiten weiterhin ausbremsen (14.7).

Der **erste** Antrag wurde abgelehnt. Begründung von Google:

> Die Website sollte schnell laden und die Navigation eindeutig sein. Achten Sie auf relevante Inhalte und Calls-to-Action.

Maßgeblich sind die [Ad Grants-Website-Richtlinien](https://support.google.com/grants/answer/1657899). Die folgenden Punkte wurden am 2026-08-07 an der Live-Seite gemessen und sind die Grundlage für einen erneuten Antrag.

### 9.1 Bereits erledigt

- **Spendenseite entfernt.** Ein nicht funktionierender Spendenweg ist ein ausdrücklicher Ablehnungsgrund. Auf `/spenden` stand nur die PayPal-Adresse `spende@coachunited.de` als reiner Text, ohne Link oder Button – und Spenden sind mangels Vereinskonto ohnehin noch nicht möglich. `public/spenden.html` wurde gelöscht, `/spenden` leitet per 301 auf `/ueber-uns`, der Eintrag ist aus `STATIC_PAGES` in `build-sitemap.js` raus. **Sobald ein Vereinskonto existiert**, kann die Seite aus der Git-Historie zurückgeholt werden – dann aber mit funktionierendem Spenden-Button (z. B. `paypal.me`-Link) statt einer abzutippenden Adresse.
- Sämtliche 404-Fehler aus der Search Console wurden behoben (siehe Abschnitt 10).
- **Punkte 1–3 der Maßnahmenliste umgesetzt (2026-08-07).** Die Startseite überträgt jetzt **1,88 MB statt 6,77 MB** (–72 %):
  - `Cache-Control` gestaffelt statt `no-store` für alles: HTML `max-age=0, must-revalidate`, CSS/JS 1 Tag, JSON 1 Stunde, Bilder/Fonts 7 Tage, jeweils mit `stale-while-revalidate`. **Wichtig:** Bei gleichem Header-Schlüssel gewinnt bei Vercel die *zuletzt* passende Regel – die Auffangregel `/(.*)` muss deshalb als erste stehen, die spezifischen danach.
  - `hero-photo.jpg` 3712×5568 → 1400×2100 (1.589 KB → 219 KB) — die Datei wurde später ersetzt, siehe 11.4
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
| 4 | Startseite um Inhaltssektionen und Calls-to-Action erweitern (Struktur s. u.) | mehrere Std. | sehr hoch | **erledigt** |
| 5 | „Über uns" ausbauen: Verein, Gemeinnützigkeit, VR 42714 B, Wirkung/Zahlen | 1–2 Std. | hoch | **erledigt** (ohne VR-Nummer, s. 13.2) |
| 6 | „Über uns" in die Hauptnavigation aufnehmen | 30 Min | mittel | **erledigt** (nur Desktop, s. 14.4) |
| 7 | `exercises.json` auf der Startseite nicht mehr laden (das Dropdown braucht es nicht) | 1 Std. | mittel | **erledigt** |
| 8 | `/wissen` und `/uebungen` mit statischem Einleitungstext versehen | 1 Std. | mittel | **erledigt** |

### 9.5 Entwicklung des Seitengewichts

| Zeitpunkt | Beim Seitenaufruf |
|---|---|
| Bei der Ad-Grants-Ablehnung | 6.770 KB |
| Nach Punkt 1–3 (Caching, Bilder) | 1.880 KB |
| Nach Punkt 4 und 7 (Startseite, Skill-Index) | ~260 KB |
| Nach dem Fotowechsel im Hero | 221 KB mobil / 284 KB Desktop |
| **Live gemessen nach dem Merge** | **207 KB** (unkomprimiert, mit gzip weniger) |

Rund **97 % weniger** als zum Zeitpunkt der Prüfung. Die Werte ab 1.880 KB sind aus echten Dateigrößen gerechnet (Textdateien mit gzip wie auf Vercel), nicht im Browser gemessen – die Vorschau-Deployments sind durch **Deployment Protection** gesperrt und liefern eine Vercel-Login-Seite aus. Das betrifft auch den Test am Handy: ohne Vercel-Anmeldung kommt man dort nicht auf die Vorschau.

Größter verbliebener Posten ist `hero-photo.webp` mit 180 KB, also gut 80 % des mobilen Aufrufgewichts. Wer weiter runter will, setzt dort an – etwa mit einem kleineren Zuschnitt für Mobil per `<picture>`.

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

## 11. Startseite (Umbau 08/2026)

### 11.1 Die Seite scrollt jetzt

Bis 08/2026 war die Startseite eine **starre, bildschirmfüllende Ansicht**: `.container` war auf Desktop ein Raster mit `height: 100vh` und `overflow: hidden`. Inhalte unterhalb des Heros waren damit technisch nicht erreichbar.

Jetzt gilt:

- `.container` ist eine normale Flex-Spalte. Reihenfolge: Topnav → `.home-hero` → `.home-sections` → Footer. Genau die Reihenfolge, in der `desktop-nav.js` Nav und Footer einhängt.
- Das Zwei-Spalten-Raster (Foto links, Formular rechts) sitzt auf dem neuen Wrapper **`.home-hero`**, nicht mehr auf dem Container. Die zugehörigen Regeln stehen in `desktop.css` unter `body:has(.crest-panel)`.
- Der Hero füllt **92 %** der Bildschirmhöhe, nicht 100 %: mobil `min-height: 92dvh`, auf Desktop `calc(92vh - 64px)` für die Topnav. Dadurch schaut die Oberkante der nächsten Sektion ins Bild und zeigt ohne Text oder Pfeil, dass es weitergeht. Ein früherer „Mehr entdecken"-Hinweis wurde zugunsten dieser Lösung wieder entfernt.

**Wer den Hero verändert**, muss beide Stellen anfassen: das Inline-CSS in `home.html` (mobil) und `desktop.css` (ab 768px).

### 11.2 Sektionen und Flächen-Rhythmus

Unter dem Hero folgen fünf Sektionen. Die Flächen wechseln bewusst ab – dadurch braucht es keine Trennlinien, und die Seite liest sich nicht wie eine Tabelle:

| Sektion | Klasse | Fläche | Form |
|---|---|---|---|
| Übungen (inkl. Merkliste) | `.hs.hs--hell` | weiß | zwei kurze Absätze, ein CTA, Foto rechts |
| Wissen | `.hs.hs--dunkel` | Marine | Artikel-Band mit zwei Pfeilen |
| Übung einreichen | `.hs.hs--hell` | weiß | kurz, ein CTA |
| Über uns | `.hs.hs--dunkel` | Marine | Text links, Portrait rechts |

Grundregel bei Änderungen: **nie zwei gleiche Flächen nebeneinander.** Der Farbwechsel ersetzt Trennlinien.

Jede Sektion hat **genau einen** Call-to-Action. Die Merkliste ist bewusst im Fließtext verlinkt (`.hs-textlink`) statt als zweiter Button – ebenso sind die Alters-Chips wieder entfallen. Beides war einmal da und wirkte überladen.

Zwei Sektionen mit Zweispalter nutzen `.hs-split`: Übungen mit Querformat-Foto, „Über uns" zusätzlich mit `.hs-split--portrait` für das Hochformat-Portrait.

Ein WhatsApp-Band als eigene Sektion gab es zwischenzeitlich, es wurde wieder entfernt. Der Kanal wird jetzt ausschließlich über den Menüpunkt „Nichts verpassen" und den Störer beworben.

### 11.2a Hero: Foto frei, Überschrift rechts

Die Überschrift stand früher **auf** dem Foto, das dafür unter einem Verlauf von 72 % auf 28 % Marineblau lag und entsprechend dunkel wirkte. Zwischenzeitlich gab es statt des Verlaufs eine Farbfläche als Textträger; beides ist entfernt.

Heute gilt auf Desktop:

- Das Foto ist **völlig frei** – keine Abdunkelung (`.crest-panel::before { content: none }`), keine Farbfläche, kein Text. `.crest-inner` ist ausgeblendet, das Logo steht ohnehin in der Topnav.
- Die Überschrift steht **rechts über der Jugend-Auswahl**, im selben Panel wie das Formular.

Der Vorteil: Die Lesbarkeit hängt nicht mehr vom Bild ab. Wer das Hero-Foto austauscht, muss nichts nachjustieren – das ist bei einem Foto, das gelegentlich wechselt, den kleinen Kontrastverlust wert.

Die Überschrift lag früher **doppelt** im Markup (`.home-intro` für mobil, `.home-hero-headline` fürs Foto auf Desktop). Jetzt steht sie einmal in `.home-intro` und wird auf beiden Breiten angezeigt – die Seite hat damit eindeutig eine einzige `h1`.

Auf **mobil** ist die Behandlung eine andere: Dort liegt das Foto mit `opacity: 0.38` und eigenem Verlauf hinter dem Formular (`.hero-photo-panel`) – eine getrennte Stelle in `home.html`.

### 11.2b Das Artikel-Band

Auf Desktop laufen **alle veröffentlichten Artikel** in einem waagerecht scrollbaren Band (`.hs-tiles` mit `overflow-x: auto` und `scroll-snap`), drei davon sichtbar. Zwei runde Pfeile scrollen um genau eine Kachelbreite:

- `#artikel-pfeil` rechts, verschwindet am Ende des Bandes
- `#artikel-pfeil-zurueck` links, erscheint erst, sobald gescrollt wurde

Beide sind nötig: Mit nur einem Pfeil ist das Band eine Sackgasse – wer sich durchgeklickt hat, kommt nicht zurück.

**Auf Mobil ist es dieselbe Galerie, nur zum Wischen** statt mit Pfeilen. Die Kacheln sind 82 % breit, dadurch steht die erste ganz im Bild und von der zweiten schauen rund 70 px herein – das ersetzt den Pfeil als Hinweis. `scroll-snap` lässt jede Kachel dort einrasten, wo vorher die vorherige stand.

Damit die angeschnittene Kachel nicht mitten im Sektionsrand abbricht, läuft das Band bis an den Bildschirmrand: negative `margin-inline` in Höhe des Sektionsabstands, dazu ein gleich großes `padding-inline` und `scroll-padding-inline`. Ohne diesen Kniff sieht der Anschnitt nach Fehler aus statt nach Galerie.

Die Kacheln zeigen **Bild und Titel, kein Datum**. Wer das Datum zurück will, braucht es an zwei Stellen: die Ausgabe in `build-home.js` und eine CSS-Regel für `.hs-tile-date`.

Da alle Kacheln `loading="lazy"` tragen, laden nur die sichtbaren beim Seitenaufruf – die übrigen acht erst beim Blättern.

### 11.3 `build-home.js`

Setzt beim Deploy die **Anzahl veröffentlichter Übungen** und **alle veröffentlichten Artikel** in `home.html` ein – und schreibt zusätzlich `public/skills-index.json` (siehe 11.3a).

Beides steht zwischen HTML-Kommentar-Markern, die stehen bleiben:

```html
<!--cu:count-->177<!--/cu:count-->
<!--cu:artikel--> … drei Kacheln … <!--/cu:artikel-->
```

Das hat zwei Gründe: Das Script ist **beliebig oft wiederholbar**, und `home.html` enthält auch ohne Build-Lauf gültiges Markup – wichtig für die lokale Vorschau, weil auf dem Entwicklungsrechner kein Node installiert sein muss.

Fehlt ein Marker, bricht das Script mit einer klaren Meldung ab, statt stillschweigend nichts zu tun.

**Ein neuer Artikel erscheint automatisch** auf der Startseite, sobald er in `articles.json` steht. Zusätzlich sollte ein Thumbnail erzeugt werden – siehe 11.4.

**Reihenfolge der Kacheln:** zuerst alle mit `"hervorheben": true`, danach nach `erstellt_am` absteigend. Das Feld ist optional und existiert, weil auf Mobil die erste Kachel die prominenteste ist – so lässt sich ohne Code-Änderung steuern, welcher Artikel dort steht. Aktuell trägt es der Einwurf-Artikel.

Bewusst *nicht* gelöst über ein zurückdatiertes `erstellt_am`: Das Feld speist auch die `lastmod`-Angabe der Sitemap, dort wäre ein erfundenes Datum ein falsches Signal an Google.

### 11.3a `skills-index.json` – warum es die Datei gibt

Wählt jemand im Hero eine Altersstufe, erscheinen darunter die Skill-Knöpfe. Für die F-Jugend sind das elf Stück.

Bis 08/2026 lud die Startseite dafür **`exercises.json` mit 1.622 KB** – die komplette Übungsdatenbank – und rechnete im Browser jedes einzelnen Besuchers aus, welche Skills in allen drei Trainingsphasen vorkommen. Das war der mit Abstand größte Posten der Seite: 86 % ihres Gewichts, um vier mal gut zehn Wörter zu gewinnen.

`build-home.js` macht diese Rechnung jetzt einmal pro Deploy (`baueSkillIndex()`) und legt das Ergebnis in `public/skills-index.json` ab – **0,56 KB**. Die Startseite lädt nur noch diese Datei.

⚠️ **Die Logik steht an zwei Stellen** und muss zusammenpassen: `baueSkillIndex()` in `scripts/build-home.js` bestimmt, *welche* Skills es gibt; `buildSkillPills()` in `home.html` zeigt sie nur noch an. Ändert sich die Regel (etwa: Skill muss nicht mehr in allen drei Phasen vorkommen), gehört die Änderung ins Build-Script.

Auf `/uebungen` und im Einheiten-Generator wird `exercises.json` weiterhin vollständig geladen – dort werden ja Übungen angezeigt.

### 11.4 Bilder der Startseite

| Datei | Zweck | Größe |
|---|---|---|
| `public/images/hero-reihe-baelle.webp` | Hero (Ballreihe), 1600×1067 | 130 KB (Original 2.938 KB) |
| `public/images/robert-greve.webp` | Portrait in „Über uns", 640×576 | 26 KB (Original 2.733 KB) |
| `public/images/kanal-handy.webp` | „Nichts verpassen", 800×800 | 67 KB (Original 1.092 KB) |
| `public/images/uebungen-spiel.webp` | Übungen-Sektion der Startseite, 960×640 | 46 KB (Original 1.830 KB) |
| `public/images/einheiten-taktiktafel.webp` | „Und so funktioniert's" auf `/einheiten`, 960×640 | 26 KB (Original 2.531 KB) |
| `public/images/artikel/thumbs/*.webp` | Artikel-Kacheln, 480×320 | je 8–41 KB |

⚠️ **Beim Austausch eines Fotos den Dateinamen ändern**, nicht die bestehende Datei überschreiben. Bilder tragen `max-age=604800` – wiederkehrende Besucher würden sonst eine Woche lang das alte Bild sehen. Das Hero-Foto hieß bis 08/2026 `public/hero-photo.webp` und liegt jetzt unter neuem Namen im `images/`-Ordner.

Die Originale der drei Einzelfotos liegen unaufbereitet im Projektstammverzeichnis (`vikram-tkv-…jpg`, `pedram-raz-…jpg`, `IMG_4685.jpeg`) und sind nicht versioniert. Bei einem Fotowechsel: neue Datei ablegen, mit Pillow auf die Zielgröße bringen, als WebP unter demselben Namen speichern.

⚠️ **Bei Handyfotos `ImageOps.exif_transpose()` nicht vergessen** – sonst liegt das Bild quer. Das Portrait aus dem iPhone war so ein Fall.

Die Thumbnails **können nicht Teil des Vercel-Builds sein**: Das Projekt kommt bewusst ohne `npm install` aus, damit steht dort keine Bildbibliothek zur Verfügung. Sie werden deshalb lokal erzeugt und mitcommittet:

```
pip install Pillow
python scripts/artikel-thumbnails.py
```

Das Script liest `articles.json` und legt für **jeden veröffentlichten Artikel** ein 480×320-WebP unter `public/images/artikel/thumbs/` ab. Bereits vorhandene Thumbnails überspringt es, es ist also gefahrlos wiederholbar.

Liegt das Originalbild nicht lokal, **lädt das Script es von der `foto_url`** und wirft es danach weg. Das ist Absicht: Die Originale sind je 1,6 bis 2,7 MB groß und gehören nicht ins Repo – gebraucht werden sie nur auf den Artikel-Detailseiten.

**Fehlt ein Thumbnail, bricht nichts** – `build-home.js` fällt dann auf `foto_url` zurück, lädt damit aber das mehrere MB große Original.

⚠️ Acht der elf `foto_url`-Einträge zeigen noch auf **`coachunited.de/wp-content/…`** und werden per 301 aufs Archiv umgeleitet, zwei weitere auf **raw.githubusercontent.com**. Für die Startseite ist das dank der Thumbnails egal, für die Artikel-Detailseiten nicht: Dort wird das mehrere MB große Original vom alten WordPress geladen. Das wäre der nächste sinnvolle Aufräumschritt.

### 11.4a Mobile Navigation auf der Startseite

Solange die Startseite eine einzige Bildschirmseite mit genau einem Weg nach vorn war, hatte sie bewusst **keine** Navigation – weder Bottom-Nav noch Burger. Seit sie scrollt, ist sie eine normale Seite und trägt beides, wie alle anderen Seiten auch.

Zwei Abweichungen von den Unterseiten:

- **Der Burger sitzt nicht in einer Kopfzeile**, sondern als runder weißer Knopf fixiert oben rechts (`.burger-btn`, `position: fixed`). Eine weiße Leiste würde den Hero zerschneiden, und der Knopf muss über hellen wie dunklen Sektionen lesbar bleiben.
- **Die Bottom-Nav läuft über die volle Breite** (`left: 0; right: 0`). Die Unterseiten begrenzen ihren Container auf 375px und zentrieren die Nav darin; die Startseite ist voll breit, eine zentrierte 375px-Nav würde auf breiteren Handys links und rechts Lücken lassen.

`desktop.css` blendet `.burger-btn` und `.bottom-nav` ab 768px global aus – auf Desktop ändert sich dadurch nichts.

⚠️ `#ueber-uns` trägt **zwei verschiedene** `padding-bottom`-Werte: 104px im Desktop-Block (Platz für die herausgelöste Bildunterschrift) und 127px im Mobil-Block (dieselbe Bildunterschrift plus 81px Bottom-Nav). Wer einen davon anfasst, prüft den anderen mit.

**Nebenwirkung auf den WhatsApp-Störer:** `injectWhatsAppPromo()` misst zur Laufzeit, ob eine `.bottom-nav` da ist, und setzt sich darüber (Abschnitt 5). Auf der Startseite gab es vorher keine – der Störer saß am unteren Rand. Jetzt rutscht er automatisch über die Nav. Kein Eingriff nötig, aber beim Scharfschalten von `WA_PROMO_LIVE` mit anschauen.

### 11.5 Fallstricke

- **`aspect-ratio` verliert gegen das `height`-Attribut.** Bilder im Markup tragen `width`/`height` gegen Layout-Sprünge. Ohne zusätzliches `height: auto` im CSS gewinnt das Attribut, und `aspect-ratio` bleibt wirkungslos – das Bild wird verzerrt. Betrifft `.hs-foto` und `.hs-tile img`.
- **Die Bottom-Nav gibt es in zwei Markup-Varianten.** Die meisten Seiten nutzen `<span>Label</span>`, drei (`artikel-detail.html`, `detail.html`, `einheit-detail.html`) nutzen `<span class="nav-label">Label</span>`. Wer per Skript ersetzt, muss beide abdecken – sonst bleiben genau diese drei Seiten zurück.
- **Der Menüpunkt zum WhatsApp-Kanal heißt „Nichts verpassen"** (mit Glocken-Icon) und steht in **43 Dateien**: einmal in der Desktop-Topnav in `desktop-nav.js`, sonst in der mobilen Bottom-Nav jeder Seite. Das Wort „WhatsApp" wurde bewusst aus der Navigation entfernt, bleibt aber in Fließtexten stehen – dort ist es ein Argument (kein neuer Account, keine E-Mail-Adresse), in der Navigation nur ein Etikett.

---

## 12. Einheiten-Seite (Umbau 08/2026)

`/einheiten` bestand aus Überschrift, einem Satz und der Jugend-Auswahl. Wer nicht schon wusste, was der Generator macht, bekam keine Antwort und hatte nach der Auswahl auch keinen Grund weiterzuscrollen. Die Seite hat jetzt denselben Aufbau wie die Startseite: Auswahlbereich oben, darunter Inhaltssektionen im Wechsel hell/dunkel.

### 12.1 Aufbau

| Bereich | Fläche | Inhalt |
|---|---|---|
| `.selection-section` | dunkel `#0E1430` | H1, Untertitel, Jugend- und Skill-Auswahl, blauer CTA |
| `#so-gehts` (`.hs--hell`) | weiß | „In 10 Sekunden zur fertigen Einheit." – drei nummerierte Schritte plus Foto (auf Mobil ausgeblendet) |
| `#direkt-zu-den-uebungen` (`.hs--dunkel`) | dunkel | Für alle, die selbst suchen: CTA in die Bibliothek, Verweis auf die Merkliste |
| Footer | weiß | – |

Die Schritt-Texte beschreiben bewusst genau das, was der Generator kann. Insbesondere: **„Neu würfeln" stellt die ganze Einheit neu zusammen**, nicht einzelne Übungen (`reroll()` in `einheit-generator.html`). Wer das im Text anders verspricht, erzeugt eine Erwartung, die die Seite nicht einlöst.

### 12.2 `public/sektionen.css`

Das Sektions-System (`.hs`, `.hs-title`, `.hs-cta`, `.hs-split`, `.hs-schritte` …) lag ursprünglich nur im `<style>`-Block von `home.html`. Für diese Seite ist es in eine eigene Datei herausgelöst und um die nummerierten Schritte ergänzt.

⚠️ **`home.html` trägt seine eigene Kopie weiterhin.** Es gibt also zwei Quellen – Änderungen in `sektionen.css` wirken sich **nicht** auf die Startseite aus. Das Zusammenführen steht als Aufräumschritt aus und ist im Kopf der Datei vermerkt. Bewusst nicht gleich mitgemacht: `home.html` ist live und abgenommen.

Wer eine weitere Seite mit Sektionen ausstattet, bindet `sektionen.css` **vor** `desktop.css` ein.

⚠️ **Die letzte Sektion braucht auf Mobil Platz für die Bottom-Nav.** Die Nav ist fixiert und 81px hoch; ohne Polster endet die Seite genau hinter ihr und der letzte CTA liegt zu einem Drittel darunter – antippen unmöglich, weil man zum Hochziehen den Finger braucht und die Seite danach zurückfedert. `.home-sections .hs:last-child` bekommt deshalb `padding-bottom: 127px` (46px normales Sektionspolster + 81px Nav). Wer eine neue Sektion **hinten anhängt**, muss nichts tun – die Regel wandert mit `:last-child` mit.

**`.hs-foto` ist auf Mobil generell ausgeblendet.** Unterhalb von 768px rutscht das Bild unter den Text, trägt dort nichts mehr bei und schiebt nur den nächsten Abschnitt nach unten. Die Startseite hält es in ihrer Übungen-Sektion genauso. Wer auf einer künftigen Seite ein Foto auch mobil zeigen will, muss die Regel dort gezielt zurücknehmen.

Das Foto der Schritte-Sektion: `public/images/einheiten-taktiktafel.webp`, 960×640, **26 KB** (Original `nguyen-thu-hoai-v0H-vn0BixI-unsplash.jpg` im Projektstamm, 2.531 KB). Aufbereitung wie in Abschnitt 11.4.

### 12.3 Der Auswahlbereich auf Desktop

Mobil war der Bereich schon immer dunkel. Auf Desktop lag darüber ein eigener Entwurf (heller Grund `#F7F6F2`, weiße Formularkarte mit Rahmen und Schatten, dunkelblauer CTA in der Kartenunterkante). Mit den neuen hellen Sektionen darunter wären zwei helle Flächen aneinandergestoßen; außerdem sah die Seite dadurch nach einem anderen Produkt aus als die Startseite.

Der Desktop-Block in `desktop.css` (`body:has(.selection-section)`, ab dem Kommentar „EINHEITEN — Desktop") spiegelt jetzt den Startseiten-Hero:

| | vorher | jetzt |
|---|---|---|
| Fläche | `#F7F6F2` | `#0E1430` |
| H1 | 44px / 700 / dunkel, mit Strich-Eyebrow | 40px / 800 / weiß |
| Felder | Karte, 6px Radius, Rahmen `#E6E8EF` | frei stehend, 12px Radius (Mobilwert) |
| CTA | `#0E1430`, eckig oben, Kartenbreite | `#1E6BFF`, 10px Radius |
| Spaltenbreite | 720px | 560px |

Weil die Mobilwerte für Felder und CTA schon stimmen, überschreibt der Desktop-Block sie nicht mehr – er entfernt nur die alten Overrides. Der Footer bleibt **weiß**: Die letzte Sektion ist dunkel, ein dunkler Footer würde damit verschmelzen.

⚠️ Der ganze Block hängt an `body:has(.selection-section)`. Dieselbe Klasse gibt es **nur** auf `/einheiten` – wer sie auf einer anderen Seite verwendet, erbt das komplette Layout.

---

## 13. Textausbau der Unterseiten (08/2026)

Vier Seiten trugen nur eine Überschrift und ein bis drei Sätze. Für Google Ad Grants ist das zu dünn („relevante Inhalte"), und für Besucher beantwortete keine davon die Frage, was sie hier eigentlich haben.

| Seite | Was dazugekommen ist |
|---|---|
| `/merkliste` | Zwei Sätze unter dem Titel, statt „Deine gespeicherten Einheiten und Übungen." Der zweite nennt den Haken: gespeichert wird im `localStorage`, also **nur in diesem Browser auf diesem Gerät**. Wer zu Hause speichert, findet auf dem Handy am Platz nichts – das stand vorher nirgends. **Bewusst kein Foto**: Die Merkliste ist ein Arbeitswerkzeug, die gespeicherten Einträge sollen sofort sichtbar sein. |
| `/wissen` | Einführungstext im dunklen Kopfbereich (`.page-intro`), aufgehängt an den tatsächlichen Artikelthemen – Elternarbeit, Umbaupause, Kopfbälle. |
| `/whatsapp-info` | Vier Absätze statt einem, zweispaltig mit Foto (`.wa-split`). Kernargument ist jetzt, dass in einem WhatsApp-Kanal **nur der Betreiber schreiben kann** – kein Gruppenchat, kein brummendes Handy. Auf Mobil steht das Foto oben (`order: -1`), auf Desktop rechts. |
| `/ueber-uns` | Von drei Sätzen auf vier Abschnitte mit Zwischenüberschriften, Portrait und CTA „Übung einreichen". Nennt Verein, Gemeinnützigkeit, Gründungsjahr 2025 und dass niemand daran verdient. |

### 13.1 Die Übungszahl in „Über uns"

Der Abschnitt „Was wir machen" nennt den Umfang der Bibliothek. Damit die Zahl nicht nach der nächsten Übung falsch ist, schreibt `build-home.js` sie bei jedem Deploy auch dorthin – derselbe Marker wie auf der Startseite:

```html
Inzwischen stehen hier <!--cu:count-->177<!--/cu:count--> Übungen …
```

⚠️ `ersetzeBlock()` **wirft**, wenn der Marker fehlt. Wer ihn beim Umformulieren aus `ueber-uns.html` entfernt, bringt den Vercel-Build zum Scheitern – nicht nur diese Seite, den ganzen Deploy.

### 13.2 Bewusst nicht drin

Die Registernummer (Amtsgericht Charlottenburg, VR 42714 B) steht **nicht** auf „Über uns", auf ausdrücklichen Wunsch. Sie steht damit nur im Impressum, und das trägt `noindex` – für Google ist sie unsichtbar. Falls die Ad-Grants-Bewerbung erneut an der Gemeinnützigkeit hängt, wäre das die erste Stellschraube.

---

## 14. Ad-Grants-Prüfung und Tempo-Korrekturen (08/2026)

Vor dem zweiten Anlauf auf Google Ad Grants durchgemessen. Die Startseite war in Ordnung, zwei Seiten nicht – und die Ursache lag woanders als vermutet.

### 14.1 Gemessene Werte (live, vor der Korrektur)

| Seite | Anfragen | Gewicht | Ladezeit |
|---|---|---|---|
| `/home` | 12 | 156 KB | 342 ms |
| `/ueber-uns` | wenige | ~30 KB | 108 ms |
| `/uebungen` | 7 sichtbar | **~1,6 MB** | — |
| `/einheiten` | — | **~1,6 MB** | — |

`exercises.json` ist auf **2,64 MB** gewachsen (gzip 1,66 MB). Diese eine Datei war das gesamte Problem.

⚠️ **Die 1,6 MB tauchen in der Performance-API der Seite gar nicht auf.** `raw.githubusercontent.com` sendet kein `Timing-Allow-Origin`, deshalb meldet `transferSize` dort **0**. Wer nur `performance.getEntriesByType('resource')` summiert, misst 31 KB und hält die Seite für schlank. Beim nächsten Tempo-Check also immer gegenprüfen, welche Hosts beteiligt sind.

### 14.2 Datendateien kamen von GitHub statt von der eigenen Domain

**Fünf** Dateien luden ihre Daten von `raw.githubusercontent.com/roberttgreve-web/coachunited-test/main/public/…`:

| Datei | Wirkung |
|---|---|
| `uebungen.html` | die Übungsübersicht |
| `wissen.html` | die Artikelübersicht |
| `uebung-detail.html` | **Template** → alle 177 Übungsseiten |
| `einheit-detail.html` | **Template** → alle 50 Einheitenseiten |
| `artikel-detail.html` | **Template** → alle 11 Artikelseiten |

Über die Templates betraf das also fast die ganze Seite. Nachteile: fremder Host ohne unsere `Cache-Control`-Regeln, im Test 831 ms statt 412 ms von Vercel, und eine Verfügbarkeit, über die wir nicht bestimmen. Die Dateien liegen ohnehin identisch unter `/exercises.json`, `/einheiten.json`, `/articles.json` – jetzt zeigen alle fünf dorthin.

### 14.3 `/einheiten` lud 2,64 MB für 0,6 KB Ergebnis

Die Seite brauchte aus `exercises.json` nur die Liste der Skills je Altersstufe und filterte sie im Browser heraus – dieselbe Rechnung, die `build-home.js` seit dem Startseiten-Umbau einmal pro Deploy erledigt und als `skills-index.json` (0,6 KB) ablegt. Die Startseite nutzte den Index, `/einheiten` nicht. Jetzt beide. Die Seite lädt nun **6 KB** statt 1,6 MB.

### 14.4 Navigation und Einstiegstexte

- **`/uebungen` hatte keine `<h1>`** – nur das Label „Bibliothek" über der Filterleiste. Jetzt Kopfbereich mit H1 und zwei Sätzen, wie auf `/wissen`.
- **„Über uns" steht jetzt in der Desktop-Topnav** (`desktop-nav.js`). ⚠️ **Nicht** in der mobilen Bottom-Nav: Die hat vier Plätze, die mit den Arbeitsseiten belegt sind. Auf Mobil bleibt „Über uns" im Burger-Menü.

### 14.5 Startseite: Wappen-Schwingung entfernt

Der mobile Kopfbereich war eine weiße Wappenform mit geschwungener Unterkante (`.crest-shape`, ein SVG-Pfad), die 280px Höhe für reine Dekoration brauchte. Jetzt ein gerader weißer Streifen mit dem Logo, `height: 25dvh` bei `min-height: 178px` – also rund ein Viertel der ersten Bildschirmseite, damit das Logo oben und unten Luft hat. Bewusst als `dvh` statt fester Höhe: Sonst stimmt das Verhältnis nur auf einem Gerätemodell. Das SVG ist aus dem Markup entfernt, die zugehörige Regel aus `desktop.css` ebenfalls – auf Desktop war die Form ohnehin ausgeblendet, dort wird `.crest-panel` zum Foto-Panel.

### 14.6 `uebungen-index.json` – die Übersicht lädt nicht mehr die Datenbank

Die Kartenansicht auf `/uebungen` zeigt **kein Bild** und genau sechs Textfelder. Geladen wurde trotzdem `exercises.json` mit 2,65 MB – darin stecken Aufbau, Durchführung, Varianten, FAQ und die Grafiken, von denen auf der Übersicht nichts sichtbar wird.

`build-home.js` schreibt jetzt zusätzlich `public/uebungen-index.json` mit nur diesen Feldern:

```js
const KARTEN_FELDER = ['id', 'titel', 'url_slug', 'kurzbeschreibung', 'jugend', 'skills', 'trainingsphase'];
```

**64 KB statt 2.653 KB.** Die Seite lädt insgesamt 28 KB.

⚠️ **`id` zeigt die Karte nicht an**, die Seite sortiert aber danach (neueste zuerst). Ohne das Feld wäre die Reihenfolge stillschweigend die der Datei – ein Fehler, den man nicht sieht. Wer die Kartenansicht in `uebungen.html` um ein Feld erweitert, muss es in `KARTEN_FELDER` ergänzen, sonst bleibt es leer.

Geprüft: 177 Karten, Reihenfolge identisch zur vollen Datei, Filterkombination E-Jugend → Passen → Hauptteil liefert 149 / 109 / 50 – dieselben Zahlen wie eine unabhängige Auswertung von `exercises.json`.

### 14.7 Offen: 20 Übungen tragen ihr Bild als Base64 im JSON

Beim Messen aufgefallen: `grafik_url` macht **2.015 der 2.653 KB** von `exercises.json` aus. Ursache sind **20 Einträge**, deren Grafik als `data:image/png;base64,…` direkt in der Datei steht – zusammen 2.005 KB für 11 % der Einträge. Die übrigen 157 tragen eine URL.

Laut Abschnitt 3 soll `build-exercise-pages.js` solche Base64-Bilder in die WordPress-Mediathek hochladen und durch die permanente URL ersetzen. Bei diesen 20 ist das offenbar nie passiert.

Das trifft alle Seiten, die weiterhin die volle Datei laden:

| Seite | lädt |
|---|---|
| `/einheit-generator` | `exercises.json` |
| `/uebung/<slug>` (177 Seiten) | `exercises.json` |
| `/einheit/<slug>` (50 Seiten) | `exercises.json` + `einheiten.json` |

Sinnvollster nächster Schritt: die 20 Bilder aus dem JSON in echte WebP-Dateien unter `public/images/uebungen/` auslagern und `grafik_url` auf den lokalen Pfad umschreiben. Dann fällt die Datei auf rund 640 KB – ohne dass eine einzige Seite ihre Logik ändern muss.

⚠️ Nebenbefund: Die 157 URLs zeigen auf `coachunited.de/wp-content/uploads/…` und werden per **308 auf `archiv.coachunited.de`** umgeleitet. Jede Übungsgrafik kostet also einen zusätzlichen Umleitungs-Sprung auf das alte WordPress. Beim Auslagern der 20 könnte man die 157 gleich mitnehmen.
