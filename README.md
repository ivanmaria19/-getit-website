# GetIt public website

Stages 02-04 are complete. Stage 05 provides provisional enquiry forms and a tested server-side Resend adapter; final fields/privacy and live configuration remain pending. Stage 06 local QA/SEO/image work is finished, awaiting client Round 1 feedback. The original visual reference remains in ../website/. Real sending is disabled; no email delivery is verified. The application provides no bookings.

## Run locally

Use Node 22 (the inspected environment has 22.23.3) and npm. From the project root:

```powershell
cd web
npm ci
npm run dev
```

Visit http://127.0.0.1:3000. The development script binds to loopback. Stop it with Ctrl+C. For a build and local production check:

```powershell
npm run build
npm run typecheck
npm start
```

The first install and next/font build require network access to npm and Google Fonts. next/font serves downloaded font files from the application; visitors do not fetch Google Fonts directly. The original DM Sans / Manrope typography and Georgia accents are retained. Do not substitute a different typeface silently if the download fails.

## Files

- src/app/layout.tsx: Dutch document language, fonts and foundation metadata.
- src/app/globals.css: supplied palette, faithful page sections, responsive layouts, typography and CSS logo treatment.
- src/components/Brand.tsx: supplied open-frame mark/wordmark as a reusable component.
- src/app/page.tsx: server-rendered marketing page composed from src/components/Marketing.tsx.
- src/components/AppShowcase.tsx and PhoneCarousel.tsx: server-rendered fictional visuals plus native-swipe/keyboard/button mobile carousel.
- src/app/interesse/creator and interesse/horeca: dynamic provisional form routes using EnquiryPage/EnquiryForm.
- src/lib/enquiries/validation.ts: proposed concise fields and shared validation.
- src/lib/server/: server-only configuration, bounded request handling and Resend delivery adapter.
- src/app/api/enquiries/route.ts: POST notification endpoint, disabled by default.
- public/images/: unchanged copies of the four supplied reference photographs; commercial rights remain unresolved. next/image now provides responsive modern-format delivery; originals remain unchanged.
- public/social/getit.jpg: sharing crop derived from the supplied dining photo; rights still pending.
- .env.example: empty server-only email/approval/origin/privacy settings; no secrets or live delivery configured.

After the required client decisions and approved Stage 08 setup, copy .env.example to .env.local and supply configuration through a safe local/account workflow. See ../implementation-plan/ENQUIRIES.md for each setting and gate. Do not enable sending merely to preview forms. Never prefix email credentials with NEXT_PUBLIC_, commit .env.local or put secrets into the plan. Keep sender and recipient server-controlled. The scope specifies ivanspeakz@gmail.com, with final confirmation tracked in CLIENT-DECISIONS.md. No visitor confirmation email is included.

## Hosting assumption

Use a commercially permitted, approved server-capable Next.js host with Node/runtime support, route handlers, server secrets, HTTPS, custom domains and image delivery. Static export alone will not support the planned enquiry endpoint. No hosting vendor, subscription, deployment or GitHub remote has been configured. Vercel Hobby is excluded by the project scope. Provider compatibility must be checked again against the approved plan before launch.

Foundation robots metadata deliberately disables indexing; revisit it when production content and launch are approved. Canonical/social metadata and responsive AVIF/WebP delivery are configured. Keep the temporary noindex restriction until authorized launch, then verify indexing/metadata on production. Publication still depends on confirmed legal/contact content, asset rights, service costs, account access and explicit approval.

## Technical references

- [Next.js installation and runtime requirements](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js self-hosted font support](https://nextjs.org/docs/app/getting-started/fonts)

See ../implementation-plan/PROGRESS.md for actual checks and stage status. Installation/build success does not verify forms or production deployment.

## Local enquiry checks

From the repository root: `node implementation-plan/checks/stage05-server.mjs` runs synthetic handler/provider tests without contacting Resend. After building and starting the app on port 3100, `node implementation-plan/checks/stage05-review.mjs` uses installed headless Chrome for provisional form/disabled API and intercepted-response browser tests. It never verifies real delivery. Stage 05 remains partial until client confirmations are recorded.

## Email plan decision

Client selected Resend transactional Free on 27 October 2026 (100 emails/day, 3000/month shared account quota at verification). The same server adapter supports this plan; no paid SDK/subscription required by the code. No upgrade, trial, overage or add-on authorized. Account/sender verification, actual configuration and receipt tests remain pending.

## 28 October update

The active marketing reference is now ../GetIt-website-Tulio-definitief-27okt/website/index.html. Copy, friends photograph, lifestyle content example, three phones and React demonstration dialogs follow that package. Existing server delivery and mobile accessibility behavior are preserved. MarketingDemos.tsx and DemoViews.tsx implement only fictional presentation states, not app or booking functionality.

Ivan confirmed ivanspeakz@gmail.com for current communication and both enquiry notifications; .env.example records it. Real sending remains disabled pending verified Resend/domain access and final privacy/configuration. The desired info@wearegetit.com mailbox is not active or published. No paid services activated. Detailed plan and outstanding setup: ../implementation-plan/OCTOBER-27-UPDATE.md.

Local regression: node implementation-plan/checks/oct27-review.mjs from the project root, against a production server on 127.0.0.1:3100. Screenshots and results are in implementation-plan/evidence/oct27. Existing stage05-server.mjs and stage05-review.mjs cover synthetic delivery/form states; they do not establish real delivery.

Verification limitation for this revision: Chrome DevTools timed out before browser checks completed. No passing screenshots or interaction report is available yet; rerun the oct27 harness when the browser environment works. HTTP/build/server checks passed; see ../implementation-plan/evidence/oct27/local-checks.json.

Enquiry popup correction: EnquiryPopups.tsx opens creator/horeca forms on the homepage; EnquiryPage supports embedded content. Direct routes remain fallback destinations. Production build/TypeScript and 16 synthetic server checks pass; browser interaction verification remains pending.

Full reference alignment: globals.css now preserves the complete supplied 27 October stylesheet in order, followed by scoped production form/accessibility integration. Run node implementation-plan/checks/reference-parity.mjs from the project root with the built app on port 3100. The harness serves the original reference on port 3101 using the same fonts, compares five page widths, both enquiries and all example dialogs/post/story states, and saves paired screenshots/results under implementation-plan/evidence/reference-parity. This working browser comparison supersedes earlier timeout limitations.

## Client finishing feedback

The current acceptance reference includes the additional full client message supplied after the visual-parity work. The third phone now shows seven compact stages and progress, including approval before publication and separate proof review; Contact/Privacy links and final form action/notice copy are implemented. See ../implementation-plan/FINAL-REFINEMENTS.md for secure Resend access, missing business/privacy input and actual-delivery testing. The local /privacy route is a clearly pending notice and cannot authorize live sending. The previous reference-parity report describes the earlier version; current QA is node implementation-plan/checks/refinements-review.mjs against port 3100.

Latest app-screen direction: the three app illustrations are restored to the supplied 27 October HTML, including the social-post third screen. The seven-stage progress screen is superseded by the user request. Contact, Privacy and enquiry improvements remain. Compare the app illustrations using node implementation-plan/checks/reference-parity.mjs --phones-only from the project root with the production server on port 3100.
