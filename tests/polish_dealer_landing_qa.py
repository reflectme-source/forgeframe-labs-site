from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
path=root/'integrations'/'otomoto-dealer-api.html'
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    try:
        for width,height in ((1440,900),(768,1024),(390,844),(320,720)):
            page=browser.new_page(viewport={'width':width,'height':height})
            response=page.goto(path.as_uri(),wait_until='load',timeout=12000)
            assert page.locator('h1').count()==1
            assert 'Sprawdzaj zmiany cen' in page.locator('h1').inner_text()
            assert page.locator('.skip').count()==1
            assert page.locator('a[href^="mailto:forgeframe.lab@gmail.com"]').count()>=2
            assert page.locator('a[href^="https://apify.com/"]').count()>=2
            assert page.locator('details').count()>=5
            width_actual=page.evaluate('document.documentElement.scrollWidth')
            assert width_actual<=width+2,(width,width_actual)
            page.keyboard.press('Tab')
            assert page.evaluate("document.activeElement.classList.contains('skip')"),'Missing skip focus'
            assert page.locator('a[href="#integracja"]').count()>=1
            assert page.locator('a[href="#wspolpraca"]').count()>=1
            page.close()
            print('PL_DEALER_LANDING_QA_PASS',width,flush=True)
        print('PL_DEALER_BROWSER_QA_PASS',flush=True)
    finally:browser.close()
