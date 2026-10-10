from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
page_path = root / "index.html"
assert page_path.exists()

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    try:
        for width,height,label in ((1440,900,"DESKTOP"),(768,1024,"TABLET"),(390,844,"MOBILE"),(320,720,"SMALL_MOBILE")):
            page = browser.new_page(viewport={"width":width,"height":height},device_scale_factor=1)
            page.goto(page_path.as_uri(),wait_until="load",timeout=12000)
            assert page.locator("h1").count() == 1
            assert page.locator('a.skip[href="#main"]').count() == 1
            assert page.locator("article.project").count() == 6
            assert page.locator("article.project:visible").count() == 6
            assert page.locator('.state.live').count() == 2
            assert page.locator('.state.preview').count() == 3
            assert page.locator('a[href="./solutions/otomoto-vehicle-monitoring.html"]').count() >= 2
            assert page.locator('a[href="./products/localization-qa.html"]').count() >= 1
            assert page.locator('a[href="./tools/localization-qa.html"]').count() >= 1
            assert page.locator('a[href^="mailto:forgeframe.lab@gmail.com"]').count() >= 4
            assert "AcqPath" not in page.content()
            assert "ExtensionOps" not in page.content()
            scroll = page.evaluate("document.documentElement.scrollWidth")
            assert scroll <= width + 2, (label,width,scroll)
            for key in ("apify","web","unity","roblox","jetbrains","integrations"):
                page.locator('button[data-filter="'+key+'"]').click()
                assert page.locator("article.project:visible").count() == 1, (label,key)
                assert page.locator('button[data-filter="'+key+'"]').get_attribute("aria-pressed") == "true"
            page.locator('button[data-filter="all"]').click()
            assert page.locator("article.project:visible").count() == 6
            if width <= 760:
                assert page.locator(".mobile-nav summary").is_visible()
                page.locator(".mobile-nav summary").click()
                assert page.locator(".mobile-nav .menu a").first.is_visible()
                page.locator(".mobile-nav summary").click()
            if width in (1440,390):
                page.evaluate("window.scrollTo(0,0)")
                page.screenshot(path=str(root / ("brand-qa-"+label.lower()+".png")),full_page=True)
            print("FORGEFRAME_"+label+"_UX_ACCEPTANCE_PASS",scroll,flush=True)
            page.close()
        page = browser.new_page(viewport={"width":1440,"height":900})
        page.goto(page_path.as_uri(),wait_until="load")
        page.keyboard.press("Tab")
        assert page.evaluate("document.activeElement.classList.contains('skip')"), "Skip link not first keyboard target"
        page.close()
        print("BRAND_HUB_BROWSERS_QA_PASS",flush=True)
    finally:
        browser.close()
