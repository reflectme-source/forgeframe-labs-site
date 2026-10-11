# Visual Engineering setup (12 October 2026)

## What is installed
This branch adds three repository-level agent skills and a root AGENTS.md. These are readable instructions for coding agents that support repository skill conventions. They do **not** by themselves install ChatGPT account Skills or change project-level settings.

## Skills
1. forgeframe-art-direction — visual concept and layout decisions
2. forgeframe-motion-engineering — animation specification and implementation
3. forgeframe-visual-critic — review loop and quality gate

They complement existing ChatGPT skills: forgeframe-ui-design, forgeframe-sales-journey, forgeframe-auth-onboarding, forgeframe-experience-qa. Retain existing account skills unless intentionally upgraded.

## ChatGPT project instructions — append

For UI/UX tasks in ForgeFrame Labs, use forgeframe-ui-design plus forgeframe-art-direction, forgeframe-motion-engineering and forgeframe-visual-critic where available; otherwise follow the repository AGENTS.md and skill documents. Analyze the actual stack first. Require 3 art directions and a functioning responsive prototype for material redesigns before production changes. Review screenshots at 360/768/1440 and test interaction states, reduced motion and keyboard. Preserve real product claims and security constraints; never equate mockups with deployed features. Use static HTML/CSS/JS when the repository is static. Do not introduce React, GSAP, Motion or Rive without technical justification and a maintenance review.

## Implementation plan
- Phase 1: audited baseline with before screenshots and verified UI flows
- Phase 2: three distinct concepts, select one
- Phase 3: premium hero + product journey prototype on a branch
- Phase 4: real visual critic loop, accessibility/performance checks
- Phase 5: approved incremental release

## Important
External third-party skills linked in docs are inspiration only. Do not copy their source or bundle their code without provenance, review and appropriate license.
