---
name: forgeframe-motion-engineering
description: Production-safe animation and interaction design for premium SaaS pages using CSS/JS first, and Motion/GSAP only when the stack warrants it.
---
# ForgeFrame Motion Engineering

## Trigger
Use when implementing interactive hero demonstrations, scroll narratives, transitions, sticky sequences, hover/focus states, or animated UI feedback.

## Motion spec is mandatory
For each animation define: purpose, trigger, element, duration, easing, interruption/cancellation, initial/final state, reduced-motion alternative, and expected performance.

## Choice of technology
- Repo baseline is static HTML/CSS/JS. Prefer transforms/opacity in CSS, IntersectionObserver only as progressive enhancement, and no JS for essential content visibility.
- Consider Motion (https://motion.dev) for an existing React ecosystem, not as a reason to rebuild an app.
- Consider GSAP ScrollTrigger (https://gsap.com/docs/v3/Plugins/ScrollTrigger/) only for sequences that cannot be made maintainable with native APIs; document bundle impact and license suitability.
- Aceternity UI is a reference for interaction patterns, not drop-in dependency for this static site.
- Rive (https://rive.app) only when genuinely interactive illustration is called for; require asset provenance and graceful fallback.

## Constraints
- Respect prefers-reduced-motion: reduce; provide static, fully usable UX.
- Don't animate layout-critical dimensions or constantly repaint; favor transform and opacity.
- Never hide primary CTAs or content behind scroll handlers or JS-only reveal.
- No autoplay sound, motion traps, or hijacked scrolling.
- Keyboard/touch interactions must match pointer interaction.
- Test narrow screens and weak devices. Avoid animations that block purchasing or login.

## Production handoff
Provide 1–3 working polished motion sequences, real-browser capture if accessible, performance evidence and fallback behavior. Mark anything not run as unverified.
