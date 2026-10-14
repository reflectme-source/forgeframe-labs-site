import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const page = readFileSync(join(root, 'services/websites/index.html'), 'utf8');
const contact = readFileSync(join(root, 'contact/index.html'), 'utf8');
const script = readFileSync(join(root, 'assets/contact-form.js'), 'utf8');
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');

test('websites service page has validated SEO and safe public claims', () => {
  assert.match(page, /<html lang="en">/);
  assert.match(page, /<title>Professional, editable business websites/);
  assert.match(page, /rel="canonical" href="https:\/\/forgeframelabs\.app\/services\/websites\/"/);
  assert.match(page, /name="robots" content="index,follow"/);
  assert.match(page, /fictional design concept, not a customer case study/i);
  assert.doesNotMatch(page, /guaranteed (sales|conversion|rankings)/i);
});

test('contact CTA preselects the actual website-service option', () => {
  assert.match(page, /contact\/\?product=websites&amp;source=services\/websites#contact-form/);
  assert.match(contact, /<option value="websites">Website Design &amp; Delivery<\/option>/);
  assert.ok(script.includes('["websites","Website Design & Delivery"]'));
  assert.ok(script.includes('params.get("product")'));
});

test('page references existing first-party assets and is listed in sitemap', () => {
  for (const p of ['assets/forgeframe-avatar.png','assets/forgeframe-nav.css','assets/forgeframe-approved.css','assets/forgeframe-global.css']) {
    assert.ok(existsSync(join(root, p)), p);
  }
  assert.match(sitemap, /https:\/\/forgeframelabs\.app\/services\/websites\//);
});
