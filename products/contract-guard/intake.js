/* Customer-side draft composer. No automatic submission, storage, tracking or backend calls. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const form=$('scope-form');if(!form)return;
const lang=document.documentElement.lang==='pl'?'pl':'en';
const i18n={
 pl:{subject:'Contract Guard — zgłoszenie konfiguracji jednego repozytorium',
  hello:'Dzień dobry,',intro:'Prosimy o ocenę możliwości wdrożenia ForgeFrame Contract Guard w jednym repozytorium GitHub za 149 USD jednorazowo.',
  email:'Adres służbowy',company:'Firma / zespół',country:'Kraj',repo:'Publiczny adres repozytorium',format:'Wersja i format OpenAPI',runner:'Środowisko CI',path:'Ścieżka specyfikacji',refs:'Referencje $ref',delivery:'Oczekiwany termin',notes:'Dodatkowy kontekst',
  signoff:'Proszę o pisemne potwierdzenie zgodności środowiska, zakresu, danych sprzedawcy i terminu przed udostępnieniem indywidualnego linku Stripe. Nie załączamy haseł ani prywatnych specyfikacji.',
  required:'Uzupełnij wymagane pola i zaznacz potwierdzenie.',badUrl:'Adres repozytorium musi mieć format https://github.com/organizacja/repo albo pozostać pusty.',open:'Otwieram program pocztowy. Sprawdź treść wiadomości i kliknij Wyślij.',gmail:'Otwieram Gmail. Sprawdź treść wiadomości i kliknij Wyślij.',popup:'Przeglądarka zablokowała kartę Gmail. Użyj opcji kopiowania lub innej aplikacji pocztowej.',copied:'Wiadomość skopiowana. Wklej ją do poczty i wyślij na forgeframe.lab@gmail.com.',manual:'Zaznacz podgląd i skopiuj wiadomość ręcznie do swojej poczty.'},
 en:{subject:'Contract Guard — one-repository setup request',
 hello:'Hello ForgeFrame Labs,',intro:'Please assess our GitHub repository for the $149 one-time ForgeFrame Contract Guard implementation.',
 email:'Work email',company:'Company / team',country:'Country',repo:'Public repository URL',format:'OpenAPI version and format',runner:'CI runner',path:'Specification path',refs:'External references',delivery:'Requested delivery window',notes:'Additional context',
 signoff:'Please confirm repository eligibility, exact scope, legal seller and delivery date in writing before sending an individual Stripe payment link. No passwords or private API specifications are attached.',
 required:'Please complete the required fields and check the acknowledgement.',badUrl:'The repository must use https://github.com/organization/repo or be left blank.',open:'Opening your mail application. Review the draft and press Send.',gmail:'Opening Gmail. Review the draft and press Send.',popup:'Gmail pop-up was blocked. Use Copy request or another email application.',copied:'Request copied. Paste it into an email to forgeframe.lab@gmail.com and send it.',manual:'Select and copy the preview manually, then send it to forgeframe.lab@gmail.com.'}
};
const t=i18n[lang],value=id=>$(id).value.trim(),status=$('scope-status'),preview=$('scope-preview');
function body(){return[t.hello,'',t.intro,'',...[
[t.email,'email'],[t.company,'company'],[t.country,'country'],[t.repo,'repository'],[t.format,'format'],[t.runner,'runner'],[t.path,'spec-path'],[t.refs,'references'],[t.delivery,'delivery'],[t.notes,'notes']
].map(([label,id])=>label+': '+(value(id)||'-')),'',t.signoff].join('\n')}
function valid(){
 if(!form.checkValidity()){form.reportValidity();status.textContent=t.required;return false}
 const repository=value('repository');
 if(repository){
  try{
   const url=new URL(repository);
   const segments=url.pathname.split('/').filter(Boolean);
   if(url.protocol!=='https:'||url.hostname!=='github.com'||segments.length<2||url.username||url.password){throw Error('Invalid repository')}
  }catch{status.textContent=t.badUrl;$('repository').focus();return false}
 }
 return true
}
function show(){preview.value=body()}
form.addEventListener('input',show);form.addEventListener('change',show);
form.addEventListener('submit',event=>{
 event.preventDefault();if(!valid())return;
 const link='mailto:forgeframe.lab@gmail.com?subject='+encodeURIComponent(t.subject)+'&body='+encodeURIComponent(body());
 status.textContent=t.open;
 window.location.href=link;
});
$('scope-gmail').addEventListener('click',()=>{
 if(!valid())return;
 const url='https://mail.google.com/mail/?view=cm&fs=1&to=forgeframe.lab%40gmail.com&su='+encodeURIComponent(t.subject)+'&body='+encodeURIComponent(body());
 const a=document.createElement('a');
 a.href=url;a.target='_blank';a.rel='noopener noreferrer';
 a.click();
 status.textContent=t.gmail+' '+t.popup;
});
$('scope-copy').addEventListener('click',async()=>{
 if(!valid())return;
 const text='To: forgeframe.lab@gmail.com\nSubject: '+t.subject+'\n\n'+body();
 preview.value=text;
 try{await navigator.clipboard.writeText(text);status.textContent=t.copied}
 catch{preview.focus();preview.select();status.textContent=t.manual}
});
show();
})();