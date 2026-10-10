from pathlib import Path
import re
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
page_path = root / "index.html"
assert page_path.exists()

def luminance(css_color):
    channels = [int(v) / 255 for v in re.findall(r'\d+', css_color)[:3]]
    assert len(channels) == 3, css_color
    linear = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in channels]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    try:
        for width,height,label in ((1440,900,"DESKTOP"),(768,1024,"TABLET"),(390,844,"MOBILE"),(320,720,"SMALL_MOBILE")):
            page = browser.new_page(viewport={"width":width,"height":height},device_scale_factor=1)
            page.goto(page_path.as_uri(),wait_until="load",timeout=12000)
            assert page.locator("h1").count() == 1
            assert page.locator('a.skip[href="#main"]').count() == 1
            assert page.locator("article.project").count() == 6
            assert page.locator("article.project:visible").count() == 3
            assert page.locator('.state.live').count() == 2
            assert page.locator('.hero .action.primary').get_attribute('href') == 'https://apify.com/green_amazement/otomoto-change-intelligence'
            assert page.locator('.hero .action.secondary').get_attribute('href') == './tools/localization-qa.html'
            assert page.locator('.hero-local-route a[lang="pl"]').get_attribute('href') == './integrations/otomoto-dealer-api.html'
            assert page.locator('.project-links a[href^="https://apify.com/"]').count() == 1
            assert page.locator('.localized-link').evaluate('(el) => getComputedStyle(el).display') == 'block'
            assert page.locator('.state.preview').count() == 3
            assert page.locator('a[href="./solutions/otomoto-vehicle-monitoring.html"]').count() >= 2
            assert page.locator('a[href="./products/localization-qa.html"]').count() >= 1
            assert page.locator('a[href="./tools/localization-qa.html"]').count() >= 1
            assert page.locator('a[href^="mailto:forgeframe.lab@gmail.com"]').count() >= 4
            assert "AcqPath" not in page.content()
            assert "ExtensionOps" not in page.content()
            scroll = page.evaluate("document.documentElement.scrollWidth")
            assert scroll <= width + 2, (label,width,scroll)
            assert page.locator('details.roadmap > summary').is_visible()
            assert page.locator('.roadmap a[href^="mailto:"]').count() == 0
            page.locator('details.roadmap > summary').click()
            assert page.locator('details.roadmap').get_attribute('open') is not None
            assert page.locator('article.project:visible').count() == 6
            for key in ('unity','roblox','jetbrains'):
                assert page.locator('article.project[data-platform="'+key+'"]:visible').count() == 1
            if width == 390:
                page.screenshot(path=str(root / 'roadmap-qa-mobile.png'),full_page=True)
            page.locator('details.roadmap > summary').click()
            assert page.locator('article.project:visible').count() == 3
            if width <= 760:
                assert page.locator(".mobile-nav summary").is_visible()
                page.locator(".mobile-nav summary").click()
                assert page.locator(".mobile-nav .menu a").first.is_visible()
                page.locator('.mobile-nav .menu a[href="#portfolio"]').click()
                assert page.locator(".mobile-nav").get_attribute("open") is None, "Mobile menu did not close on navigation"
            if width in (1440,390):
                page.evaluate("window.scrollTo(0,0)")
                page.screenshot(path=str(root / ("brand-qa-"+label.lower()+".png")),full_page=True)
            print("FORGEFRAME_"+label+"_UX_ACCEPTANCE_PASS",scroll,flush=True)
            page.close()
        page = browser.new_page(viewport={"width":1440,"height":900})
        page.goto(page_path.as_uri(),wait_until="load")
        page.keyboard.press("Tab")
        assert page.evaluate("document.activeElement.classList.contains('skip')"), "Skip link not first keyboard target"
        contrast_pairs = [
            (".project-platform", ".project"),
            (".project-foot span", ".project"),
            (".portfolio-note", ".portfolio"),
            (".section-count", ".portfolio"),
            (".research-title p", ".portfolio"),
            (".roadmap-meta", ".roadmap>summary"),
        ]
        for text_selector, background_selector in contrast_pairs:
            fg = page.locator(text_selector).first.evaluate("(e) => getComputedStyle(e).color")
            bg = page.locator(background_selector).first.evaluate("(e) => getComputedStyle(e).backgroundColor")
            a, b = luminance(fg), luminance(bg)
            ratio = (max(a, b) + 0.05) / (min(a, b) + 0.05)
            assert ratio >= 4.5, f"WCAG AA text contrast: {text_selector} = {ratio:.2f}:1"
        print("BRAND_WCAG_AA_TEXT_CONTRAST_PASS",flush=True)
        page.locator('details.roadmap > summary').focus()
        assert page.evaluate('document.activeElement.tagName') == 'SUMMARY'
        page.keyboard.press('Enter')
        assert page.locator('details.roadmap').get_attribute('open') is not None
        page.keyboard.press('Enter')
        assert page.locator('details.roadmap').get_attribute('open') is None
        page.close()
        print("BRAND_HUB_BROWSERS_QA_PASS",flush=True)
        journey = browser.new_page(viewport={"width":390,"height":844})
        journey.goto(page_path.as_uri(),wait_until="load")
        journey.locator('.hero-local-route a[lang="pl"]').click()
        assert journey.url.endswith("/integrations/otomoto-dealer-api.html")
        assert journey.locator('html[lang="pl"]').count() == 1
        journey.goto(page_path.as_uri(),wait_until="load")
        journey.locator(".hero .action.secondary").click()
        assert journey.url.endswith("/tools/localization-qa.html")
        journey.close()
        print("BRAND_CONVERSION_JOURNEYS_QA_PASS",flush=True)
        narrow = browser.new_page(viewport={"width":320,"height":720})
        narrow.goto((root / "tools" / "localization-qa.html").as_uri(),wait_until="load",timeout=12000)
        assert narrow.evaluate("document.documentElement.scrollWidth") <= 320, "Inspector overflow at 320px"
        assert narrow.locator(".nav-right a[href=\"../support.html\"]").is_visible()
        assert narrow.locator('a[href="./localization-qa-guide.html"]').count() >= 1
        narrow.close()
        print("INSPECTOR_SMALL_MOBILE_QA_PASS",flush=True)
    finally:
        browser.close()