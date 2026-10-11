(()=>{"use strict";const root=document.querySelector(".ffdev");if(!root)return;
const examples=[
"# Illustrative OpenAPI change\n- required: false\n+ required: true\n\npath: /orders\nmethod: GET\nreview: compatibility check",
"# Example workflow fragment\nname: Contract validation\non: pull_request\njobs:\n  validate:\n    runs-on: ubuntu-latest\n# See guide for actual setup",
"# Example localization CSV\nkey,en,pl,de\ncheckout.title,Checkout,Kasa,Kasse\ncheckout.pay,Pay,Zapłać,Zahlen\n\nreview: missing values"];
const tabs=[...root.querySelectorAll("[data-example]")],panel=root.querySelector("#ffdev-panel"),code=panel?.querySelector("code"),copy=root.querySelector(".ffdev-copy");if(!tabs.length||!code||!copy)return;let selected=0;
function show(i){selected=i;tabs.forEach((t,n)=>{t.setAttribute("aria-selected",String(n===i));t.tabIndex=n===i?0:-1});code.textContent=examples[i];panel.setAttribute("aria-labelledby",tabs[i].id)}
tabs.forEach((t,i)=>{t.addEventListener("click",()=>show(i));t.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){e.preventDefault();const next=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;show(next);tabs[next].focus()}})});
copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(examples[selected]);copy.textContent=document.documentElement.lang==="en"?"Copied":"Skopiowano"}catch{copy.textContent=document.documentElement.lang==="en"?"Select text to copy":"Zaznacz tekst do kopiowania"}});
show(0)})();
