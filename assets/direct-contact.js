(function(){"use strict";
  if(document.querySelector("[data-forgeframe-direct-contact]"))return;
  const path=location.pathname.toLowerCase();
  if(path.includes("/privacy")||path.includes("/prywatnosc")||path.includes("/thanks")||path.includes("/dziekujemy")||path.includes("/contact/")||path.includes("/pl/kontakt"))return;
  const pl=document.documentElement.lang==="pl";
  const product=
    path.includes("merchant-issue-desk")?"Merchant Issue Desk":
    path.includes("contract-guard")||path.includes("openapi-breaking-changes")?"Contract Guard":
    path.includes("connect-to-forge")?"Connect to Forge":
    path.includes("otomoto")?"OTOMOTO Change Intelligence":
    path.includes("localization")||path.includes("lokalizacja")?"Localization QA":
    "ForgeFrame Labs";
  const subject="ForgeFrame Labs - "+product+" - "+(pl?"zapytanie":"inquiry");
  const inbox="forgeframe.lab@gmail.com";
  // Derive the site root from this first-party script URL.
  // Works with GitHub's /forgeframe-labs-site/ project path and a future apex domain /.
  const scriptUrl=document.currentScript?.src || document.querySelector('script[src*="assets/direct-contact.js"]')?.src;
  if(!scriptUrl)return;
  const siteRoot=new URL("../",scriptUrl);
  const contactBase=new URL(pl?"pl/kontakt.html":"contact/",siteRoot).pathname;
  const sku=path.includes("merchant-issue-desk")?"merchant-issue-desk":path.includes("contract-guard")||path.includes("openapi-breaking-changes")?"contract-guard":path.includes("connect-to-forge")?"connect-to-forge":path.includes("otomoto")?"otomoto":path.includes("localization")||path.includes("lokalizacja")?"localization-qa":"general";
  const formURL=contactBase+"?product="+encodeURIComponent(sku);
  const mailto="mailto:"+inbox+"?subject="+encodeURIComponent(subject);
  const section=document.createElement("section");
  section.setAttribute("data-forgeframe-direct-contact","");
  section.setAttribute("aria-label",pl?"Bezpośredni kontakt":"Direct contact");
  section.style.cssText="background:#102b40;color:#edf7ff;border-top:1px solid #45627a;border-bottom:1px solid #45627a;padding:32px 0;font:14px/1.55 Inter,system-ui,sans-serif";
  const box=document.createElement("div");
  box.style.cssText="max-width:1160px;margin:0 auto;padding:0 22px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap";
  const intro=document.createElement("div");
  const heading=document.createElement("strong");
  heading.style.cssText="display:block;font-size:20px;letter-spacing:-.02em;margin-bottom:6px";
  heading.textContent=pl?"Masz konkretne zapytanie?":"Have a specific request?";
  const message=document.createElement("p");
  message.style.cssText="font-size:13px;color:#c5d9e8;margin:0";
  message.textContent=pl?"Wyślij zapytanie przez formularz. Bez telefonu.":"Send an inquiry through the form. No phone call required.";
  intro.append(heading,message);
  const actions=document.createElement("div");
  actions.style.cssText="display:flex;align-items:center;gap:10px;flex-wrap:wrap";
  const gmailLink=document.createElement("a");
  gmailLink.href=formURL;
  gmailLink.textContent=pl?"Wyślij zapytanie ↗":"Send an inquiry ↗";
  gmailLink.style.cssText="display:inline-flex;align-items:center;min-height:46px;padding:10px 17px;background:#d4edff;border-radius:9px;color:#10283c;font-weight:800;text-decoration:none";
  const appLink=document.createElement("a");
  appLink.href=mailto;appLink.textContent=pl?"Inna poczta ↗":"Other email app ↗";
  appLink.style.cssText="display:inline-flex;align-items:center;min-height:44px;padding:9px 14px;border:1px solid #7897ae;border-radius:9px;color:#eff8ff;font-weight:750;text-decoration:none";
  const address=document.createElement("span");
  address.textContent=inbox;address.style.cssText="font-size:12px;color:#bfd6e6;user-select:all;overflow-wrap:anywhere";
  actions.append(gmailLink,appLink,address);box.append(intro,actions);section.append(box);
  const footer=document.querySelector("footer");
  if(footer)footer.parentNode.insertBefore(section,footer);
  else document.body.append(section);
})();