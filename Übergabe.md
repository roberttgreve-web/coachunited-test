# Übergabe – coachunited.de

Stand: 2026-07-07. Dieses Dokument ist der Einstiegspunkt für alle, die künftig an coachunited.de weiterarbeiten (Entwickler, Freelancer, Nachfolger).

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
│   │   impressum.html, spenden.html, uebung-einreichen.html, umgang-mit-ki.html, danke.html
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
- **Altseite/Assets**: Alte WordPress-Inhalte (`/wp-content`, `/wp-includes`, `/minitt`) werden per Rewrite auf `archiv.coachunited.de` weitergeleitet, die alte Seite bleibt dort als Archiv erreichbar.
- **Google Search Console**: Coverage-Exporte werden manuell im Ordner `Indexierung/` abgelegt (kein automatischer Sync).
- **Analytics**: Google Analytics 4 via `gtag.js`, Property-ID `G-5D2HZBJESR`, eingebunden im `<head>` jeder Seite.

## 5. Sitewide-Bausteine (auf praktisch jeder Seite aktiv)

- **`desktop-nav.js`**: das einzige Script, das wirklich auf **allen** Seiten eingebunden ist (auch auf den generierten Detailseiten). Baut ab 768px Breite die Desktop-Navigation und den Footer per JavaScript in `.container` ein (auf Mobile bleibt das Markup unverändert). Seit 07/2026 injiziert dieselbe Datei zusätzlich den **Störer/Hinweis auf den Ferienkalender-Artikel** (Funktion `injectFerienPromo()`), unabhängig von der Bildschirmbreite:
  - Mobile: schmaler, vertikaler Tab am rechten Bildschirmrand.
  - Desktop: Karte unten rechts, fliegt nach ~0,9 s sanft ein.
  - Beide verlinken auf `/artikel/der-fussball-ferienkalender`, haben ein „✕“ zum Schließen (Dismiss wird 14 Tage in `localStorage` gemerkt) und werden auf der Artikelseite selbst nicht angezeigt.
  - Titel/Bild/Link sind aktuell hart codiert in der Funktion – für eine neue Kampagne dort die Variablen `slug`, `tabText`, `cardTitle`, `img` anpassen.
- **`feedback-widget.js`**: aktuell nur ein Kommentar ("Beta-Phase beendet"), ist NICHT auf allen Seiten eingebunden (fehlt z. B. auf `merkliste.html`, `spenden.html`, `detail.html`, `einheit-detail.html`, `artikel-detail.html`). Für neue sitewide Funktionen `desktop-nav.js` verwenden, nicht dieses.
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

⚠️ **Sicherheitshinweis**: Die lokale Git-Remote-URL (`git remote -v`) enthält aktuell ein GitHub Personal Access Token im Klartext (`https://ghp_...@github.com/...`). Das Token liegt damit unverschlüsselt in `.git/config` auf diesem Rechner. Empfehlung: Token in den GitHub-Einstellungen rotieren/löschen und stattdessen den Windows-Credential-Manager, GitHub CLI (`gh auth login`) oder SSH-Keys für die Authentifizierung nutzen, statt es in der Remote-URL zu speichern.

## 8. Bekannte Baustellen / offene Punkte

- `Archiv/` enthält alte, nicht mehr verwendete Entwürfe (u. a. ein angefangener echter Next.js-Versuch unter `Archiv/app/`) – rein zur Referenz, nicht Teil des Live-Betriebs.
- Es gibt keine automatisierten Tests. Änderungen an Templates sollten nach dem Edit immer stichprobenartig über einen lokalen Static-Server in Mobile- und Desktop-Ansicht geprüft werden (siehe Abschnitt 7, „Lokale Vorschau").
- `feedback-widget.js` ist nicht überall eingebunden (s. o.) – falls es reaktiviert werden soll, vorher prüfen, ob es auf allen relevanten Seiten verlinkt ist.
