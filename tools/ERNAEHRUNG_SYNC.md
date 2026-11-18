# Sync-Plan: Sanjis CSV → Eriks Konto

Noch nicht aktiv. Zuerst braucht es Eriks Ja für das SQL in der Live-Datenbank.
Kein dauerhafter Wächter wird hier gestartet.

## Was passiert

Sanji schreibt ausschließlich `/workspace/ernaehrung/tagebuch.csv`.
Dieses Skript liest die Datei nur und spielt die Zeilen idempotent auf Eriks Profil
in Supabase (`gesundheit_ernaehrung_upload`). Eren und andere Nutzer sind nicht betroffen.

## Auslösen direkt nach jedem Eintrag

Nachdem das SQL ausgeführt ist, soll Sanji am Ende jedes Tagebuch-Schreibens aufrufen:

    python3 /workspace/gs-repo/tools/ernaehrung_upload.py

Das kann in Sanjis eigenem Ablauf stehen (bevorzugt: ein klarer letzter Schritt nach dem Speichern der CSV).
Franky gibt Sanji den Befehl, sobald Erik das SQL freigibt.

## Alternative, noch nicht einschalten

Ein Dateiwächter auf `tagebuch.csv` (inotify), der dasselbe Skript nach jeder Änderung startet.
Das wäre ein dauerhaft laufender Prozess und wird erst nach einem weiteren Ja eingerichtet.
Keine der gesperrten Ports (8765, 8840, 8901, 8910) verwenden.

## Prüfen ohne Upload

    python3 /workspace/gs-repo/tools/ernaehrung_upload.py --dry-run
