# GetIt public website

## Run locally

Use Node 22 (the inspected environment has 22.23.3) and npm. From the project root:

```powershell
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

