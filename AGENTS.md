# ForgeFrame Labs — Agent working agreement

Applies to all UI, UX, website, dashboard, customer journey, onboarding and visual-engineering work in this repository.

Read the actual implementation and existing design tokens before proposing changes. This repo currently uses static HTML/CSS/JS: do not assume React, Next.js or a component build pipeline. Preserve the common brand, language variants, accessibility, routing, SEO and real product availability statements.

## Workflow
1. Inventory affected pages, reusable assets, current components and live dependencies.
2. Specify audience, screen goal, conversion action and content hierarchy.
3. Select an art direction grounded in the current identity. Use Resend, Linear, Stripe, Mercury and Vercel as **principle references only**, not copies.
4. For a substantial visual redesign: propose 2-3 concepts and create responsive visual or browser prototypes. Obtain review before replacing production experience.
5. Implement in small coherent changes on a branch. Do not silently migrate to React or install a motion library. Use CSS or the existing stack first.
6. Run viewport checks at 360, 768 and 1440px; keyboard navigation, reduced-motion, contrast, focus styles, loading/error/empty states, and regression checks.
7. Capture and inspect real browser renders where browser access exists. Mark every unexecuted test as not run.

## Skills
- .agents/skills/forgeframe-art-direction/SKILL.md — original visual systems, typography, concepts
- .agents/skills/forgeframe-motion-engineering/SKILL.md — animation, interactions and progressive enhancement
- .agents/skills/forgeframe-visual-critic/SKILL.md — screenshot-led review and scoring

For implementations, also respect existing security, customer ownership, checkout and backend authorization contracts. Payment redirects never confer entitlements. Do not invent testimonials, usage metrics, logos, endorsements, product screenshots or paid capabilities. No production deployments without appropriate validation and approval.

A skill does not run continuously or automatically authorize changes. Use appropriate skills when their task matches; if unavailable, apply their documented practices explicitly.
