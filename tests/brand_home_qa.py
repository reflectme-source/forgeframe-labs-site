from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
with sync_playwright() as pw:
    browser=pw.chromium.launch(channel="chrome",headless=True)
    try:
        for rel,lang in (("index.html","pl"),("en/index.html","en")):
            for width,height in ((1440,900),(768,1024),(390,844),(320,720)):
                page=browser.new_page(viewport={"width":width,"height":height})
                errors=[]
                page.on("pageerror",lambda error:errors.append(str(error)))
                page.goto((root/rel).as_uri(),wait_until="load",timeout=15000)
                assert page.locator("html").get_attribute("lang")==lang
                assert page.locator("h1").count()==1
                assert page.locator("article.product").count()==4
                assert page.locator("article.product").first.is_visible()
                assert page.locator("details.roadmap").get_attribute("open") is None
                assert page.locator("details.roadmap summary").is_visible()
                page.locator("details.roadmap summary").click()
                assert page.locator("details.roadmap").get_attribute("open") is not None
                page.locator("details.roadmap summary").click()
                assert page.locator("details.roadmap").get_attribute("open") is None
                assert page.locator('a[href*="apify.com/green_amazement/otomoto-change-intelligence"]').count()>=2
                assert page.locator('a[href*="tools/localization-qa.html"]').count()>=2
                assert page.locator('a[href*="products/contract-guard.html"]').count()>=1
                assert page.evaluate("document.documentElement.scrollWidth")<=width+2,(rel,width)
                assert not errors,(rel,errors)
                if width<=390:
                    assert page.locator("details.menu-mobile summary").is_visible()
                    page.locator("details.menu-mobile summary").click()
                    assert page.locator("details.menu-mobile").get_attribute("open") is not None
                    page.locator("details.menu-mobile summary").click()
                if width in (1440,390):
                    out=root/("brand-"+lang+"-"+str(width)+".png")
                    page.screenshot(path=str(out),full_page=True)
                print("BILINGUAL_BROWSER_PASS",lang,width,flush=True)
                page.close()
        page=browser.new_page(viewport={"width":390,"height":844})
        page.goto((root/"index.html").as_uri(),wait_until="load")
        page.locator('.locale a[lang="en"]').last.click()
        assert page.locator("html").get_attribute("lang")=="en"
        page.close()
        print("BILINGUAL_LANGUAGE_SWITCH_PASS",flush=True)
    finally:
        browser.close()
