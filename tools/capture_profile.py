#!/usr/bin/env python3
"""Lokale Screenshots 390x844 der Oura-Umbauten. Nicht veröffentlichen."""
from __future__ import annotations

import http.server
import json
import socket
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parents[1]
SCREENS = Path("/workspace/gesundheit_app/screens_profile")
FORBIDDEN = {8765, 8840, 8901, 8910}
START_PORT = 8922


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(HERE), **kwargs)
    def log_message(self, format, *args):
        pass


class ReuseServer(socketserver.TCPServer):
    allow_reuse_address = True


def pick_port(start: int) -> int:
    for candidate in range(start, start + 40):
        if candidate in FORBIDDEN:
            continue
        sock = socket.socket()
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", candidate))
            sock.close()
            return candidate
        except OSError:
            sock.close()
    raise SystemExit("Kein freier Port")


def start_server(port: int):
    if port in FORBIDDEN:
        raise SystemExit(f"Port {port} ist gesperrt.")
    httpd = ReuseServer(("127.0.0.1", port), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def shot(page, name):
    page.wait_for_timeout(400)
    page.screenshot(path=str(SCREENS / name), type="png")
    print("wrote", name)


def main() -> None:
    SCREENS.mkdir(parents=True, exist_ok=True)
    port = pick_port(START_PORT)
    httpd = start_server(port)
    base = f"http://127.0.0.1:{port}/index.html"
    errors = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, executable_path="/usr/bin/google-chrome")
            context = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, locale="de-DE")
            page = context.new_page()
            page.on("pageerror", lambda e: errors.append(str(e)))

            page.goto(base + "?demo=login", wait_until="networkidle")
            page.wait_for_timeout(1000)
            shot(page, "01_login.png")

            page.goto(base + "?demo=signup", wait_until="networkidle")
            page.wait_for_timeout(800)
            shot(page, "02_registrierung.png")

            page.goto(base + "?demo=erik", wait_until="networkidle")
            page.wait_for_function("() => document.getElementById('gsTitle') || document.querySelector('.insight')")
            page.wait_for_timeout(1400)
            title = page.locator("#gsTitle").inner_text()
            if "Erik" not in title:
                errors.append(f"Begrüßung ohne Erik: {title!r}")
            shot(page, "03_erik_heute.png")

            # Morgen-Check / Tagebuch / Labor im Heute-Bereich
            for sel, name in [("#gsMC", "04_erik_morgencheck.png"), ("#gsDiary, #gsDiaryWrap", "05_erik_tagebuch.png"), ("#gsLab", "06_erik_labor.png")]:
                loc = page.locator(sel).first
                if loc.count():
                    loc.scroll_into_view_if_needed()
                    page.wait_for_timeout(400)
                    shot(page, name)
                else:
                    errors.append(f"Element fehlt: {sel}")

            page.click('button.tab[data-pane="ernaehrung"]')
            page.wait_for_timeout(400)
            page.evaluate("window.scrollTo(0,0)")
            page.wait_for_timeout(800)
            score = page.locator("#enScore").inner_text()
            shot(page, "07_erik_ernaehrung.png")
            if score.strip() != "5":
                errors.append(f"Erik-Score {score!r}, erwartet 5")

            page.click('button.tab[data-pane="profil"]')
            page.wait_for_timeout(200)
            page.evaluate("window.scrollTo(0,0)")
            page.wait_for_timeout(400)
            shot(page, "08_erik_profil.png")
            body = page.locator("#profilRoot").inner_text()
            if "Platzhalter" in body:
                errors.append("Platzhalter noch im Profil")
            if "73" not in body:
                errors.append("73 kg nicht im Profil sichtbar")

            page.goto(base + "?demo=eren", wait_until="networkidle")
            page.wait_for_timeout(1000)
            tabs = page.locator(".tab").all_inner_texts()
            if "Heute" in tabs:
                errors.append(f"Eren sieht Heute-Tab: {tabs}")
            if "Ernährung" not in tabs or "Profil" not in tabs:
                errors.append(f"Eren-Tabs unerwartet: {tabs}")
            shot(page, "09_eren_ernaehrung.png")
            page.click('button.tab[data-pane="profil"]')
            page.wait_for_timeout(500)
            shot(page, "10_eren_profil.png")

            browser.close()
    finally:
        httpd.shutdown(); httpd.server_close()

    (SCREENS / "verify.json").write_text(json.dumps({"errors": errors}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"errors": errors}, ensure_ascii=False, indent=2))
    if errors:
        raise SystemExit("Prüfung mit Hinweisen, Screenshots liegen trotzdem vor.")


if __name__ == "__main__":
    main()
