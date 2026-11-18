#!/usr/bin/env python3
"""Sanjis Ernährungstagebuch (nur lesen) idempotent auf Eriks Konto in Supabase spielen.

Aufruf, erst nachdem das SQL in Supabase ausgeführt wurde (braucht Eriks Ja):

    python3 ernaehrung_upload.py              # CSV lesen und hochladen
    python3 ernaehrung_upload.py --dry-run    # nur prüfen, nichts senden

Die Datei /workspace/ernaehrung/tagebuch.csv wird ausschließlich gelesen, nie beschrieben.
Sanji bleibt der einzige Schreiber der CSV. Das Skript schreibt nur in public.gesundheit_ernaehrung
für Eriks Konto, über die RPC gesundheit_ernaehrung_upload (Upload-Token, wie Whoop).

Zugang: BZP_UPLOAD_TOKEN oder ~/.config/bzp/upload_token.
Projekt: SUPABASE_URL + SUPABASE_ANON_KEY oder /workspace/gs-repo/config.js bzw. /workspace/cl-repo/config.js.
Keine Zugangsdaten stehen in diesem Skript.
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

SRC = os.environ.get("TAGEBUCH_CSV", "/workspace/ernaehrung/tagebuch.csv")
COLUMNS = [
    "datum", "uhrzeit", "mahlzeit", "was", "menge_geschaetzt", "notiz",
    "kcal", "protein_g", "ballaststoffe_g", "zucker_g", "gemuese_obst_portionen",
    "nova", "frittiert", "bewertung",
]


def normalize_mahlzeit(raw: str) -> str | None:
    s = (raw or "").lower().strip()
    if re.search(r"frühstück|fruehstueck|breakfast", s):
        return "frühstück"
    if "mittag" in s:
        return "mittag"
    if "abend" in s:
        return "abend"
    if re.search(r"snack|zwisch", s):
        return "snack"
    if re.search(r"getränk|getraenk|drink", s):
        return "getränk"
    return None


def quelle_key(row: dict) -> str:
    parts = [
        row.get("datum") or "",
        row.get("mahlzeit") or "",
        row.get("was") or "",
        row.get("uhrzeit") or "",
        row.get("menge_geschaetzt") or "",
    ]
    return "|".join(parts)[:400]


def read_csv(path: str) -> list[dict]:
    p = Path(path)
    if not p.is_file():
        sys.exit(f"Tagebuch nicht gefunden: {path}")
    rows = []
    with p.open(encoding="utf-8-sig", newline="") as f:
        for raw in csv.DictReader(f):
            row = {col: (raw.get(col) or "").strip() for col in COLUMNS}
            if not row["datum"] and not row["was"]:
                continue
            mahlzeit = normalize_mahlzeit(row["mahlzeit"])
            if not mahlzeit or not row["was"] or not row["datum"]:
                print(f"Hinweis: Zeile übersprungen ({row.get('datum')} / {row.get('was')[:40]})")
                continue
            row["mahlzeit"] = mahlzeit
            if row["frittiert"] not in ("", "ja", "nein"):
                row["frittiert"] = ""
            if row["bewertung"] not in ("", "gut", "okay", "ungünstig"):
                row["bewertung"] = ""
            row["quelle_key"] = quelle_key(row)
            rows.append(row)
    return rows


def project():
    url, key = os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY")
    if not (url and key):
        for cfg in ("/workspace/gs-repo/config.js", "/workspace/cl-repo/config.js"):
            if os.path.isfile(cfg):
                t = open(cfg, encoding="utf-8").read()
                um = re.search(r'url:"([^"]+)"', t)
                km = re.search(r'anonKey:"([^"]+)"', t)
                if um:
                    url = url or um.group(1)
                if km:
                    key = key or km.group(1)
                break
    if not (url and key):
        sys.exit("Kein Projekt: SUPABASE_URL und SUPABASE_ANON_KEY fehlen.")
    return url.rstrip("/"), key


def token():
    tok = os.environ.get("BZP_UPLOAD_TOKEN")
    p = os.path.expanduser("~/.config/bzp/upload_token")
    if not tok and os.path.exists(p):
        tok = open(p, encoding="utf-8").read().strip()
    if not tok:
        sys.exit("Kein Zugang: BZP_UPLOAD_TOKEN bzw. ~/.config/bzp/upload_token fehlt.")
    return tok


def rpc(name, body):
    url, anon = project()
    req = urllib.request.Request(
        f"{url}/rest/v1/rpc/{name}",
        method="POST",
        data=json.dumps(body, ensure_ascii=False).encode(),
        headers={"Content-Type": "application/json", "apikey": anon},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as x:
            return json.loads(x.read() or b"null")
    except urllib.error.HTTPError as e:
        t = e.read().decode(errors="replace")
        try:
            msg = json.loads(t).get("message") or t
        except Exception:
            msg = t
        if e.code == 404:
            sys.exit(
                f"Funktion {name} fehlt in Supabase "
                "(sql/gesundheit_setup_ernaehrung.sql noch nicht ausgeführt?)."
            )
        sys.exit(f"{name} fehlgeschlagen (HTTP {e.code}): {msg[:300]}")
    except urllib.error.URLError as e:
        sys.exit(f"Keine Verbindung zu Supabase: {e.reason}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Ernährungstagebuch (nur lesen) auf Eriks Konto laden")
    ap.add_argument("--src", default=SRC, help="Pfad zur CSV (wird nur gelesen)")
    ap.add_argument("--dry-run", action="store_true", help="Nur zählen, nichts senden")
    args = ap.parse_args()
    rows = read_csv(args.src)
    print(f"{len(rows)} Zeilen aus {args.src}")
    if args.dry_run:
        tage = sorted({r["datum"] for r in rows})
        print("Tage:", ", ".join(tage) if tage else "keine")
        print("Dry-run – nichts gesendet.")
        return
    result = rpc("gesundheit_ernaehrung_upload", {"p_token": token(), "p_zeilen": rows}) or {}
    print(
        "Hochgeladen: {gesamt} (neu {eingefuegt}, aktualisiert {aktualisiert})".format(
            gesamt=result.get("gesamt", 0),
            eingefuegt=result.get("eingefuegt", 0),
            aktualisiert=result.get("aktualisiert", 0),
        )
    )


if __name__ == "__main__":
    main()
