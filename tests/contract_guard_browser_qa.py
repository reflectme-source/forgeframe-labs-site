from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
landing = (root / "products" / "contract-guard.html").as_uri()

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(channel="chrome", headless=True)
    try:
        for width, height in ((1440, 900), (768, 1024), (390, 844), (320, 720)):
            page = browser.new_page(viewport={"width":width, "height":height}, device_scale_factor=1)
            console_errors = []
            page.on("pageerror", lambda error: console_errors.append(str(error)))
            page.goto(landing, wait_until="load", timeout=15000)
            assert page.title().startswith("Contract Guard")
            assert page.locator("h1").count() == 1
            assert page.locator("a[href='#main']").count() == 1
            assert page.locator('a[href="mailto:forgeframe.lab@gmail.com?subject=Contract%20Guard%20Setup%20%24149&body=Hello%20ForgeFrame%2C%0A%0AWe%20would%20like%20Contract%20Guard%20Setup.%0ARepository%20host%3A%0ANumber%20of%20repositories%3A%0AOpenAPI%20version%20and%20spec%20format%3A%0A%0A"]').count() == 1
            assert page.locator("a.button.primary").count() == 2
            assert page.locator("script[src]").count() == 0
            scroll = page.evaluate("document.documentElement.scrollWidth")
            assert scroll <= width + 2, f"Horizontal overflow at {width}px: scroll={scroll}"
            assert not console_errors, console_errors
            page.keyboard.press("Tab")
            assert page.evaluate("document.activeElement.classList.contains('skip')"), "Skip link must be first focus target"
            page.locator("a[href='#setup']").click()
            assert page.url.endswith("#setup"), f"CTA anchor not working at {width}"
            print(f"CONTRACT_GUARD_UX_{width}_PASS", flush=True)
            page.close()
    finally:
        browser.close()
