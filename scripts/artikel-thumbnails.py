# -*- coding: utf-8 -*-
"""Erzeugt die WebP-Thumbnails fuer die Artikel-Kacheln auf der Startseite.

Ausfuehren nach jedem neuen Artikel:

    pip install Pillow
    python scripts/artikel-thumbnails.py

Liegt das Originalbild nicht lokal unter public/images/artikel/, wird es
einmalig von der in articles.json hinterlegten foto_url geladen. Die grossen
Originale wandern bewusst NICHT ins Repo - sie sind teils ueber 2 MB gross und
werden nur fuer die Detailseiten gebraucht. Committet wird ausschliesslich das
Thumbnail.

Warum kein Node und kein Teil des Vercel-Builds:
Das Projekt kommt bewusst ohne "npm install" aus (siehe Uebergabe.md,
Abschnitt 7). Auf Vercel steht damit keine Bildbibliothek zur Verfuegung, die
Thumbnails muessen deshalb lokal erzeugt und mitcommittet werden.

Fehlt ein Thumbnail, bricht nichts: build-home.js faellt dann auf die foto_url
zurueck - laedt damit aber das mehrere MB grosse Original.
"""
import json
import os
import ssl
import tempfile
import urllib.request
from PIL import Image

HIER = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HIER, "..", "public")
ARTIKEL_DIR = os.path.join(PUBLIC, "images", "artikel")
THUMB_DIR = os.path.join(ARTIKEL_DIR, "thumbs")

# 480x320 (3:2) deckt die rund 380px breiten Kacheln inkl. Retina ab.
BREITE, HOEHE = 480, 320
QUALITAET = 80


def zuschneiden_und_skalieren(img):
    """Mittig auf 3:2 beschneiden, dann skalieren - entspricht object-fit: cover."""
    ziel = BREITE / float(HOEHE)
    ist = img.width / float(img.height)
    if ist > ziel:
        neue_breite = int(img.height * ziel)
        links = (img.width - neue_breite) // 2
        img = img.crop((links, 0, links + neue_breite, img.height))
    elif ist < ziel:
        neue_hoehe = int(img.width / ziel)
        oben = (img.height - neue_hoehe) // 2
        img = img.crop((0, oben, img.width, oben + neue_hoehe))
    return img.resize((BREITE, HOEHE), Image.LANCZOS)


def hole_original(url, ziel):
    """Laedt das Originalbild herunter. Folgt Weiterleitungen (wp-content -> Archiv)."""
    ctx = ssl.create_default_context()
    anfrage = urllib.request.Request(url, headers={"User-Agent": "coachunited-thumbs"})
    with urllib.request.urlopen(anfrage, timeout=60, context=ctx) as antwort:
        with open(ziel, "wb") as f:
            f.write(antwort.read())


def main():
    with open(os.path.join(PUBLIC, "articles.json"), encoding="utf-8") as f:
        artikel = json.load(f)

    veroeffentlicht = [
        a for a in artikel
        if a.get("status") == "veroeffentlicht" and a.get("url_slug")
    ]
    veroeffentlicht.sort(key=lambda a: a.get("erstellt_am") or "", reverse=True)

    if not os.path.isdir(THUMB_DIR):
        os.makedirs(THUMB_DIR)

    print(u"=== Artikel-Thumbnails ({} Artikel) ===".format(len(veroeffentlicht)))
    fehler = []

    for a in veroeffentlicht:
        url = str(a.get("foto_url") or "")
        dateiname = os.path.basename(url.split("?")[0])
        if not dateiname:
            fehler.append((a["url_slug"], "kein foto_url gesetzt"))
            continue

        ziel = os.path.join(THUMB_DIR, os.path.splitext(dateiname)[0] + ".webp")
        if os.path.exists(ziel):
            print(u"  vorhanden: {}".format(os.path.basename(ziel)))
            continue

        quelle = os.path.join(ARTIKEL_DIR, dateiname)
        temporaer = None
        try:
            if not os.path.exists(quelle):
                temporaer = os.path.join(tempfile.gettempdir(), dateiname)
                hole_original(url, temporaer)
                quelle = temporaer

            img = zuschneiden_und_skalieren(Image.open(quelle).convert("RGB"))
            img.save(ziel, "WEBP", quality=QUALITAET, method=6)

            vorher = os.path.getsize(quelle) / 1024.0
            nachher = os.path.getsize(ziel) / 1024.0
            herkunft = "geladen" if temporaer else "lokal  "
            print(u"  {} {:<48} {:>7.0f} KB -> {:>5.0f} KB".format(
                herkunft, dateiname[:48], vorher, nachher))
        except Exception as e:
            fehler.append((a["url_slug"], str(e)))
        finally:
            if temporaer and os.path.exists(temporaer):
                os.remove(temporaer)

    if fehler:
        print(u"\n  Ohne Thumbnail (build-home.js nutzt dann foto_url):")
        for slug, grund in fehler:
            print(u"    {} - {}".format(slug, grund))

    print("=== fertig ===")


if __name__ == "__main__":
    main()
