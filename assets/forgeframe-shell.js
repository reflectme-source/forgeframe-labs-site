(()=>{"use strict";const header=document.querySelector(".ffg-header");if(!header)return;const nav=header.querySelector(".ffg-nav");const inner=header.querySelector(".ffg-inner");if(!nav||!inner)return;const activeLang=(document.documentElement.lang||"en").toLowerCase().startsWith("pl")?"pl":"en";const langs=nav.querySelectorAll(".ffg-locale");langs.forEach(a=>{if(a.getAttribute("lang")===activeLang){a.setAttribute("aria-current","page")}else a.removeAttribute("aria-current")});const language=nav.querySelector(".ffg-language");if(language&&!language.querySelector(".ffg-locale[aria-current=page]")){const current=document.createElement("a");current.className="ffg-locale";current.lang=activeLang;current.textContent=activeLang.toUpperCase();current.href=location.pathname;current.setAttribute("aria-current","page");if(activeLang==="pl")language.prepend(current);else language.append(current)}function addWebsitesLinks(){
 const path=activeLang==="pl"?"/pl/strony-internetowe.html":"/websites/";
 const label=activeLang==="pl"?"Strony WWW":"Websites";
 const link=document.createElement("a");
 link.href=path;link.textContent=label;link.dataset.ffgWebsites="true";
 if(location.pathname===path){link.setAttribute("aria-current","page");nav.querySelectorAll('a[aria-current="page"]:not(.ffg-locale)').forEach(a=>a.removeAttribute('aria-current'));}
 const before=[...nav.querySelectorAll(':scope > a')].find(a=>/^(Developers|Dla deweloperów)$/i.test(a.textContent.trim()));
 nav.insertBefore(link,before||nav.querySelector(".ffg-language")||null);
 const foot=document.querySelector(".ffg-footer-links");
 if(foot&&!foot.querySelector('[data-ffg-websites]')){
  const footerLink=document.createElement("a");
  footerLink.href=path;footerLink.textContent=label;footerLink.dataset.ffgWebsites="true";
  const fbefore=[...foot.querySelectorAll('a')].find(a=>/^(Developers|Dla deweloperów)$/i.test(a.textContent.trim()));
  foot.insertBefore(footerLink,fbefore||null);
 }
}
addWebsitesLinks();
const btn=document.createElement("button");btn.type="button";btn.className="ffg-menu-toggle";btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-controls","ffg-primary-nav");btn.setAttribute("aria-label",activeLang==="pl"?"Otwórz menu nawigacji":"Open navigation menu");btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>'+(activeLang==="pl"?"Menu":"Menu")+'</span>';nav.id="ffg-primary-nav";inner.insertBefore(btn,nav);function close(){btn.setAttribute("aria-expanded","false");header.classList.remove("ffg-menu-open");btn.setAttribute("aria-label",activeLang==="pl"?"Otwórz menu nawigacji":"Open navigation menu")}btn.addEventListener("click",()=>{const open=btn.getAttribute("aria-expanded")!=="true";btn.setAttribute("aria-expanded",String(open));header.classList.toggle("ffg-menu-open",open);btn.setAttribute("aria-label",open?(activeLang==="pl"?"Zamknij menu nawigacji":"Close navigation menu"):(activeLang==="pl"?"Otwórz menu nawigacji":"Open navigation menu"))});header.addEventListener("keydown",e=>{if(e.key==="Escape"&&header.classList.contains("ffg-menu-open")){close();btn.focus()}});document.addEventListener("click",e=>{if(!header.contains(e.target))close()});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));header.dataset.ffgReady="true"})();