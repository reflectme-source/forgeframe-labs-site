(()=>{"use strict";
const root=document.querySelector(".ffcatalog-filters");if(!root)return;
const buttons=[...root.querySelectorAll("button[data-filter]")];
const input=root.querySelector("#ff-search");
const cards=[...document.querySelectorAll(".ffcatalog-grid .ffcatalog-card")];
const grid=document.querySelector(".ffcatalog-grid");
if(!input||!buttons.length||!grid)return;
const lang=document.documentElement.lang==="en"?"en":"pl";
const empty=document.createElement("p");empty.id="ff-catalog-empty";empty.setAttribute("role","status");empty.setAttribute("aria-live","polite");empty.className="ffcatalog-empty";empty.style.cssText="grid-column:1/-1;padding:28px;border:1px solid #334353;border-radius:10px;color:#bdcbd9;background:#101923";grid.append(empty);
function update(){
const selected=buttons.find(b=>b.getAttribute("aria-pressed")==="true")?.dataset.filter||"all";
const query=input.value.trim().toLocaleLowerCase(lang);
let count=0;
for(const card of cards){const category=card.dataset.category||"";const match=(selected==="all"||category===selected)&&card.textContent.toLocaleLowerCase(lang).includes(query);card.hidden=!match;if(match)count++;}
empty.hidden=count!==0;
empty.textContent=lang==="en"?"No products match these filters. Try another category or search.":"Brak produktów spełniających kryteria. Zmień kategorię lub wyszukiwanie.";
}
buttons.forEach(b=>b.addEventListener("click",()=>{buttons.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));update();}));
input.addEventListener("input",update);
update();
})();
