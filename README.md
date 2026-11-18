# Gesundheit

Private Web-App (PWA) für Eriks Whoop-Daten, Tagesempfehlung, Tagebuch, Morgen-Check und Laborwerte.
Statische Dateien, gehostet über GitHub Pages. Daten liegen ausschließlich in Supabase
(Lesen und Schreiben nur für Eriks Konto per Row Level Security) – im Repo sind keine Gesundheitsdaten.

Bereiche: Erholung mit HRV-Trend (7 Tage vs. 60-Tage-Bereich), Körperfigur, Tagesempfehlung, Schlaf, Verläufe
(mit markierten Reisetagen), Hinweise (Arzt-Schwellen, Infekt-Frühwarnung, Reisemodus), Morgen-Check,
Belastung 7/28 Tage mit Zone-2-Wochenziel, Schlafrhythmus, „Wann zum Arzt?“, Laborwerte, Tagebuch mit Diktat
bzw. Sprachnotiz. Fehlen die v2-Tabellen in der Datenbank, blendet die App die betroffenen Bereiche aus.

Installation auf dem iPhone: Seite in Safari öffnen → Teilen → „Zum Home-Bildschirm“.


## Ernährung und Profile (lokaler Stand, Branch `ernaehrung-profile`)

Noch nicht online. SQL (`sql/gesundheit_setup_ernaehrung.sql`) darf erst nach Eriks Ja in Supabase ausgeführt werden.
Danach spielt `tools/ernaehrung_upload.py` Sanjis CSV auf Eriks Konto (siehe `tools/ERNAEHRUNG_SYNC.md`).
Lokale Vorschau nur auf diesem Rechner: `?demo=erik`, `?demo=eren`, `?demo=login`, `?demo=signup`.
