from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser=p.chromium.launch(channel="chrome",headless=True)
    try:
        for file in ("support.html","privacy.html"):
            for width,height in ((1440,900),(390,844),(320,720)):
                page=browser.new_page(viewport={"width":width,"height":height})
                result=page.goto((root/file).as_uri(),wait_until="load",timeout=10000)
                assert page.locator("h1").count()==1,(file,width)
                assert page.locator("a.skip").count()==1
                assert page.locator("a[href='./index.html']").count()>=1
                assert page.evaluate("document.documentElement.scrollWidth")<=width+2,(file,width)
                if file=="support.html":
                    assert page.locator('a[href^="mailto:forgeframe.lab@gmail.com"]').count()>=2
                    assert page.locator(".resource").count()==3
                else:
                    assert "October 10, 2026" in page.content()
                    assert page.locator("aside a").count()>=6
                page.close()
                print("BRAND_PAGE_PASS",file,width,flush=True)
        print("BRAND_SUPPORT_PRIVACY_QA_PASS",flush=True)
    finally:
        browser.close()
