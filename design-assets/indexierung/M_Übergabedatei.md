# Übergabe: Google-Indexierung coachunited.de

Stand: 2026-07-05
Commits: `018c71d` (SEO Fix), `caac309` (Merge nach Publisher-Commits), `67a01f8` (wp-includes-Redirect) – bereits gepusht auf `main`, Vercel-Deploy sollte automatisch gelaufen sein.

## Ausgangslage

In der Google Search Console (Seitenindexierung-Report) lagen mehrere Fehlerklassen vor:

- **Nicht gefunden (404):** 22 Seiten
- **Seite mit Weiterleitung:** 83
- **Alternative Seite mit richtigem kanonischen Tag:** 60
- **Duplikat – Google hat andere Seite als kanonisch bestimmt:** 10
- **Wegen Zugriffsverbot (403) blockiert:** 1 (neu aufgetreten, per Mail gemeldet)
- **Gefunden – zurzeit nicht indexiert:** 155
- **Gecrawlt – zurzeit nicht indexiert:** 135

Der Vorbericht (`Indexierung/coachunited.de-Coverage-2026-06-01.xlsx`) sowie die Screenshots aus der Search Console vom 05.07. waren Grundlage der Analyse.

## Projektaufbau (wichtig für künftige Arbeit)

`coachunited-next` ist **keine echte Next.js-App**, sondern eine statische Website: `public/*.html` + `vercel.json` (Redirects/Rewrites/Build-Command). Es gibt drei Content-Typen mit je eigener JSON-Datenquelle und Detail-Template:

| Typ | Datenquelle | Template | URL-Schema |
|---|---|---|---|
| Übung | `public/exercises.json` | `public/uebung-detail.html` | `/uebung/:slug` |
| Einheit | `public/einheiten.json` | `public/einheit-detail.html` | `/einheit/:slug` |
| Artikel | `public/articles.json` | `public/artikel-detail.html` | `/artikel/:slug` |

Ein separater, automatisierter **"Publisher"-Prozess** (eigenes Tool, `coachunited-publisher`) committet laufend neue Übungen/Artikel und alte sitemap.xml-Versionen direkt auf `main` – das ist normal und kein Fehler, nur beim nächsten Arbeiten an diesem Repo mit `git pull` rechnen.

## Root Causes und Fixes

### 1. Fehlende/unvollständige Redirects (404-Fehler)

`vercel.json` hatte Lücken:
- `/author/*` (alte WordPress-Autorenseiten) – kein Redirect vorhanden
- `/trainingseinheiten` – Redirect ohne Wildcard, `/trainingseinheiten/page/2/` etc. liefen ins Leere
- Einzelne alte Artikel-Slugs fehlten in der Redirect-Liste: `/ideen-fur-ein-tolles-hallenturnier/`, `/zweikampfe-und-sprints/`, `/vom-pass-direkt-in-die-torchance/`, `/mit-hohen-ballen-umgehen/`, `/wissen-rund-um-das-training-im-kinderfussball-fur-die-e-jugend-und-f-jugend/`, `/contact-page/`

**Fix:** Redirects in `vercel.json` ergänzt (siehe Commit `018c71d`).

### 2. Hauptursache für die ~290 "nicht indexiert"-Seiten: Content nur clientseitig

Übungs-, Einheiten- und Artikelseiten luden ihren **kompletten sichtbaren Inhalt erst per JavaScript** von `raw.githubusercontent.com`. Googlebot bekam beim Crawlen zunächst nur ein leeres Gerüst ("Übung wird geladen…") zu sehen; echter Text kam erst nach einem externen Fetch. Bei `/einheit/:slug` und `/artikel/:slug` kam erschwerend hinzu: **es gab überhaupt keinen Build-Schritt** – jede URL lieferte dieselbe generische Datei mit leerem `canonical`-Tag, und beide Typen standen **nicht in der sitemap.xml**.

Ein früherer Fix (Commit `6c070aa`, 01.06.) hatte nur die `<head>`-Metadaten (Title/Description/Canonical) für Übungsseiten gebackt, nicht aber den sichtbaren Seiteninhalt – daher bestand das Problem trotz "vermeintlich schon gefixt" weiter.

**Fix:**
- `scripts/build-exercise-pages.js` erweitert: backt jetzt zusätzlich H1, Beschreibung, Aufbau, Durchführung direkt in die generierte HTML.
- `scripts/build-einheit-pages.js` (neu): erzeugt pro Einheit eine eigene statische Seite mit echtem Titel/Canonical/JSON-LD und der vollständigen Übungsliste.
- `scripts/build-artikel-pages.js` (neu): erzeugt pro Artikel eine eigene statische Seite mit echtem Titel/Canonical/Artikeltext/Hero-Bild.
- `scripts/build-sitemap.js` (neu): generiert `sitemap.xml` automatisch aus allen drei Datenquellen bei jedem Deploy (vorher manuell/unvollständig gepflegt).
- In allen drei Detail-Templates: Inhalt ist jetzt standardmäßig sichtbar (nicht mehr hinter `display:none`, bis der JS-Fetch durchgelaufen ist). Das bestehende Client-JS bleibt als Enhancement (Bilder, Tags, verwandte Übungen) erhalten, überschreibt aber nur identische Werte – keine Doppelungen.
- `vercel.json`: Rewrites für `/einheit/:slug` und `/artikel/:slug` zeigen jetzt auf die generierten Dateien statt auf die generische leere Vorlage.

### 3. Nebenbefund: kaputte interne Links auf allen Einheiten-Seiten (live verifiziert)

`einheiten.json` referenziert die enthaltenen Übungen über **alte, titelbasierte Slugs ohne Skill-Prefix** (z. B. `farben-tor-wettkampf`). Seit der Umstellung auf generierte Übungsseiten (Slug-Schema mit Skill-Prefix, z. B. `dribbeln-farben-slalom-mit-torschuss`) führte jede "Zur Übung"-Karte auf jeder Einheiten-Seite ins Leere. Verifiziert per Live-Abruf: `https://coachunited.de/uebung/farben-tor-wettkampf` lieferte einen echten 404.

**Fix:** Slug-Auflösung über Titel-Matching (`toSlug()`-Funktion, analog zum bereits bestehenden Backwards-Compat-Mechanismus in `uebung-detail.html`) in `build-einheit-pages.js` und im Client-JS von `einheit-detail.html` ergänzt. Ergebnis: 157 von 183 referenzierten Übungs-Karten lösen sich jetzt korrekt zur aktuellen URL auf; die übrigen 26 gehören zu Übungen, die im aktuellen Bestand nicht mehr existieren – diese werden als nicht-klickbare Karte angezeigt statt auf einen toten Link zu führen.

Nebenbei gefixt:
- Bild-Mapping-Bug (`e.slug` → `e.url_slug`) – dadurch fehlten bisher alle Vorschaubilder auf Einheiten-Karten.
- Falscher Trailing-Slash im Canonical von Einheiten-Seiten (widersprach `trailingSlash:false` in `vercel.json`).

### 4. 403-Fehler ("Wegen Zugriffsverbot blockiert")

Betraf laut Search Console nur **1 Seite**: `https://coachunited.de/wp-includes/js/dist/script-modules/interactivity/index.min.js?ver=...` – ein Überbleibsel der alten WordPress-Installation, keine echte Inhaltsseite. Für `/wp-content/*` gab es bereits einen Redirect auf `archiv.coachunited.de`, für `/wp-includes/*` fehlte die analoge Regel, daher lief der Pfad auf 403.

**Fix (Commit `67a01f8`):** `/wp-includes/:path*` → `https://archiv.coachunited.de/wp-includes/:path*` (permanent) in `vercel.json` ergänzt.

### 5. Umleitungsfehler (Domain-Ebene: www ↔ non-www)

Beispiel-URL: `https://coachunited.de/uebung/dribbeln-farben-slalom-mit-torschuss` (zuletzt gecrawlt 01.06.2026). Betraf nicht nur diese eine Seite, sondern **die komplette Domain**: `coachunited.de` (ohne www) leitete mit **307 (temporär)** auf `www.coachunited.de` weiter – obwohl **alle** SEO-Signale (sitemap.xml, alle Canonical-Tags, `Sitemap:`-Zeile in robots.txt, interne Links) konsequent die Non-www-Version als kanonisch deklarieren. Live verifiziert per `curl`:

```
coachunited.de/...     → 307 → www.coachunited.de/...
www.coachunited.de/... → 200 OK
```

Das ist keine Code-Einstellung (nicht in `vercel.json`), sondern eine Domain-Konfiguration im Vercel-Dashboard (Project "coachunited-test" → Settings → Domains).

**Fix (im Vercel-Dashboard, nicht im Code):** Domain-Redirect umgedreht.
- `coachunited.de` → jetzt "Connect to an environment" → Production (liefert direkt aus, keine Weiterleitung mehr)
- `www.coachunited.de` → jetzt "Redirect to Another Domain" → `coachunited.de`, Typ **308 Permanent Redirect** (vorher 307 Temporary, und in die falsche Richtung)

Live erneut verifiziert nach der Umstellung:
```
coachunited.de/...     → 200 OK
www.coachunited.de/...  → 308 → coachunited.de/...
```

## Was sicher behoben ist vs. was nur wahrscheinlich ist

**Mechanisch verifiziert (hohe Erfolgswahrscheinlichkeit):**
- 404-Fehler, Redirects, 403-Fehler: eindeutige, mechanische Fixes. Build-Erfolg live geprüft am 05.07. – `https://coachunited.de/einheit/paesse-aktiv-anfordern` liefert echten Inhalt (H1, Übungsliste, Bilder), kein Loading-Zustand mehr.
- www/non-www-Redirect: live per `curl` verifiziert, funktioniert wie vorgesehen.

**Nicht sicher gelöst – hier bin ich zurückhaltender, als frühere Formulierungen in dieser Datei suggeriert haben:**

1. **"Gecrawlt – zurzeit nicht indexiert" (135):** Das serverseitige Backen des Inhalts war *notwendig*, ist aber **nicht zwangsläufig ausreichend**. 177 Übungsseiten mit identischem Template, identischer Struktur (Aufbau/Durchführung-Akkordeon, ähnliche Textlänge) können bei Google trotz jetzt sichtbarem Content weiterhin als "zu wenig eigenständiger Mehrwert" bei stark templated Massenseiten eingestuft werden. Das ist im Fix nicht adressiert und lässt sich nur durch Beobachtung nach Neu-Crawl beurteilen. Falls sich die Zahl nach 4–6 Wochen nicht deutlich reduziert, ist der nächste Schritt vermutlich, den Content pro Übung inhaltlich stärker zu differenzieren (mehr einzigartiger Text, weniger Boilerplate).

2. **"Gefunden – zurzeit nicht indexiert" (155):** Die vollständige Sitemap hilft bei der *Priorisierung*, ist aber kein Garant für Indexierung – viele dieser Seiten waren vermutlich schon vorher über interne Links auffindbar, die fehlende Sitemap war also nicht zwangsläufig der Grund, warum Google sie nicht crawlen wollte. Vermutlich derselbe Content-Qualitäts-Faktor wie bei Punkt 1.

3. **"Alternative Seite mit richtigem kanonischen Tag" (60) – ✅ geklärt (08.07.):** Beispiel-URLs aus der Search Console geprüft – alle 10 Beispiele sind `www.coachunited.de/...`-Adressen (`/artikel/...`, `/uebung/...`, Startseite `/` bzw. `/home`). Bestätigt das www/non-www-Muster: Google hat korrekt erkannt, dass der Canonical-Tag auf die Non-www-Version zeigt. **Kein zusätzlicher Fix nötig** – bereits durch den www→non-www-Domain-Redirect (308) vom 05.07. gelöst. Die Liste sollte kleiner werden, sobald Google die www-URLs neu crawlt und dort den 308-Redirect statt Inhalt sieht.

4. **"Duplikat – Google hat andere Seite als kanonisch bestimmt" (10) – ✅ geklärt (08.07.):** Alle 10 Beispiel-URLs sind alte `/tag/...?query-1-page=N`-URLs (WordPress-Tag-Archive mit Pagination), gecrawlt zwischen Dezember 2025 und April 2026 – also vor allen Fixes. Diese redirecten schon länger (unabhängig von unseren Änderungen) per 301 über die bereits bestehende Regel `/tag/:path*` → `/uebungen` in `vercel.json`. Google hatte die stark ähnlichen Paginierungs-Seiten untereinander als Duplikate erkannt und selbst eine kanonische Version gewählt – erwartetes Verhalten. Sobald neu gecrawlt, wandern diese URLs in die unkritische Kategorie "Seite mit Weiterleitung". **Kein zusätzlicher Fix nötig.**

## Nächste Schritte

1. ~~Prüfen, dass der Vercel-Build durchgelaufen ist~~ – erledigt, live verifiziert (08.07.).
2. ~~"Validierung anfordern" für 404-, 403- und Redirect-Fehler~~ – erledigt (08.07.).
3. ~~sitemap.xml in der Search Console neu einreichen~~ – erledigt (08.07.).
4. ~~Beispiel-URLs für beide Duplikat-/Kanonisch-Kategorien abgleichen~~ – erledigt, beide erklärt (08.07., siehe oben).
5. **Einziger noch offener Punkt:** Nach 4–6 Wochen die Zahlen für "Gecrawlt/Gefunden – nicht indexiert" (135/155) erneut prüfen. Falls kaum Besserung: Content-Differenzierung der Übungsseiten als nächsten Schritt einplanen (siehe oben, Punkt 1 unter "Nicht sicher gelöst").
