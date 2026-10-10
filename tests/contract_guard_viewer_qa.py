from pathlib import Path
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]

class QuietHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".mjs": "text/javascript"}
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(root), **kwargs)
    def log_message(self, *args):
        pass

server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
url = f"http://127.0.0.1:{server.server_port}/tools/contract-guard-report.html"

try:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            for width, height in ((1440, 900), (768, 1024), (390, 844), (320, 720)):
                page = browser.new_page(viewport={"width": width, "height": height}, accept_downloads=True)
                errors = []
                outside = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on("request", lambda request: outside.append(request.url) if not request.url.startswith(f"http://127.0.0.1:{server.server_port}/") else None)
                page.goto(url, wait_until="load", timeout=18000)
                assert page.locator("h1").count() == 1
                assert page.locator("script[src]").count() == 1
                assert page.locator("input#report-file").count() == 1
                page.keyboard.press("Tab")
                assert page.evaluate("document.activeElement.classList.contains('skip')"), "No keyboard skip navigation"
                page.locator("#demo").click()
                assert page.locator("#status").inner_text() == "BLOCKED"
                assert page.locator("#blocking").inner_text() == "2"
                assert page.locator("#findings-body tr").count() == 2
                page.locator("#search").fill("enum")
                assert page.locator("#findings-body tr").count() == 1
                page.locator("#search").fill("")
                page.locator("#visibility").select_option("exceptions")
                assert page.locator("#findings-body tr").count() == 0
                assert page.locator("#export").is_disabled()
                page.locator("#visibility").select_option("all")
                assert page.locator("#findings-body tr").count() == 2
                with page.expect_download() as dl:
                    page.locator("#export").click()
                assert dl.value.suggested_filename == "contract-guard-findings.csv"
                scroll = page.evaluate("document.documentElement.scrollWidth")
                assert scroll <= width + 2, (width,scroll)
                assert not errors, errors
                assert not outside, outside
                print(f"CONTRACT_GUARD_VIEWER_{width}_PASS", flush=True)
                page.close()
            page = browser.new_page(viewport={"width":390,"height":844})
            page.goto(url,wait_until="load")
            page.locator("#report-file").set_input_files({
                "name": "report.json",
                "mimeType": "application/json",
                "buffer": b'{"bad":"schema"}'
            })
            assert page.locator("#validation-error").is_visible()
            assert page.locator("#result").is_hidden()
            clean_report = {
                "schema":"urn:forgeframe:contract-guard:evidence:v1",
                "generator":{"name":"ForgeFrame Contract Guard","version":"0.1.0"},
                "generatedAt":"2026-10-10T12:00:00Z","status":"blocked","blockingCount":1,
                "inputs":{"base":{"sha256":"a"*64},"head":{"sha256":"b"*64}},
                "policy":{"sha256":"c"*64,"failOn":"ERR"},
                "findings":[{"severity":"ERR","id":"test-rule","path":"/payload","operation":"POST",
                  "text":"<img src=x onerror=alert(1)>",
                  "excepted":False,"fingerprint":"a1b2c3d4e5f6"}]
            }
            page.locator("#report-file").set_input_files({
                "name":"report.json",
                "mimeType":"application/json",
                "buffer":json.dumps(clean_report).encode("utf-8")
            })
            assert page.locator("#result").is_visible()
            assert page.locator("#findings-body tr").count()==1
            assert page.locator("#findings-body img").count()==0, "Untrusted finding HTML injected into DOM"
            assert "<img src=x onerror=alert(1)>" in page.locator("#findings-body").inner_text()
            assert page.locator("#validation-error").is_hidden()
            print("CONTRACT_GUARD_VIEWER_UNTRUSTED_JSON_PASS", flush=True)
            page.close()
        finally:
            browser.close()
finally:
    server.shutdown()
    server.server_close()
