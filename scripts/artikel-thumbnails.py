# -*- coding: utf-8 -*-
"""Erzeugt die WebP-Thumbnails fuer die Artikel-Kacheln auf der Startseite.

Ausfuehren nach jedem neuen Artikel:

    pip install Pillow
    python scripts/artikel-thumbnails.py

Warum kein Node und kein Teil des Vercel-Builds:
Das Projekt kommt bewusst ohne "npm install" aus (siehe Uebergabe.md,
Abschnitt 7). Auf Vercel steht damit keine Bildbibliothek zur Verfuegung,
die Thumbnails muessen deshalb lokal erzeugt und mitcommittet werden.

Fehlt ein Thumbnail, bricht nichts: build-home.js faellt dann auf die
foto_url aus articles.json zurueck. Die Originalbilder sind aber teils
mehrere MB gross, deshalb lohnt der Lauf.
"""
import json
import os
from PIL import Image

HIER = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HIER, "..", "public")
ARTIKEL_DIR = os.path.join(PUBLIC, "images", "artikel")
THUMB_DIR = os.path.join(ARTIKEL_DIR, "thumbs")

# 480x320 (3:2) deckt die rund 380px breiten Kacheln inkl. Retina ab.
BREITE, HOEHE = 480, 320
QUALITAET = 80
ANZAHL = 3  # muss zu ARTIKEL_ANZAHL in build-home.js passen


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


def main():
    with open(os.path.join(PUBLIC, "articles.json"), encoding="utf-8") as f:
        artikel = json.load(f)

    veroeffentlicht = [
        a for a in artikel
        if a.get("status") == "veroeffentlicht" and a.get("url_slug")
    ]
    neueste = sorted(
        veroeffentlicht,
        key=lambda a: a.get("erstellt_am") or "",
        reverse=True,
    )[:ANZAHL]

    if not os.path.isdir(THUMB_DIR):
        os.makedirs(THUMB_DIR)

    print("=== Artikel-Thumbnails ===")
    fehlend = []

    for a in neueste:
        dateiname = os.path.basename(str(a.get("foto_url") or "").split("?")[0])
        if not dateiname:
            fehlend.append((a["url_slug"], "kein foto_url gesetzt"))
            continue

        quelle = os.path.join(ARTIKEL_DIR, dateiname)
        if not os.path.exists(quelle):
            fehlend.append((a["url_slug"], "Originalbild liegt nicht in images/artikel/"))
            continue

        ziel = os.path.join(THUMB_DIR, os.path.splitext(dateiname)[0] + ".webp")
        img = zuschneiden_und_skalieren(Image.open(quelle).convert("RGB"))
        img.save(ziel, "WEBP", quality=QUALITAET, method=6)

        vorher = os.path.getsize(quelle) / 1024.0
        nachher = os.path.getsize(ziel) / 1024.0
        print(u"  {:<52} {:>7.0f} KB -> {:>5.0f} KB".format(dateiname, vorher, nachher))

    if fehlend:
        print(u"\n  Ohne Thumbnail (build-home.js nutzt dann foto_url):")
        for slug, grund in fehlend:
            print(u"    {} - {}".format(slug, grund))

    print("=== fertig ===")


if __name__ == "__main__":
    main()
