# Velvet — zero-cost AI companion website starter

A polished, mobile-friendly static website with five fictional adult companion profiles, a demo chat mode, clearly marked ad placeholders, and an optional server-side AI endpoint.

## What works immediately

- Landing page, five companion cards, responsive layout and chat UI.
- Local demo replies (no API key required).
- Age confirmation gate (a reminder, not robust age verification).
- Ad placeholders only; no ad network or tracking code is installed.
- Privacy and terms starter pages.

## Important limits

- ₹0 is a starting target, not a guarantee of permanently free operation. Free hosting and AI quotas can change.
- Live AI requires an eligible provider account and an API key. Free model availability and quotas are not guaranteed.
- Never put an AI API key in `public/`, HTML, CSS or browser JavaScript.
- This is a starter project, not a complete legal/privacy/compliance review. Replace the legal-page placeholders with your actual operator details and obtain advice appropriate to your jurisdiction.
- This experience is designed for adults, with fictional adult characters and suggestive, non-explicit romance. The age gate is not age verification.
- Ads are placeholders. Do not insert ads until you have approval and have checked the ad network's current policies. Explicit sexual content is likely to disqualify a site from many mainstream ad networks.

## Files

- `public/` — website files. Upload the *contents* of this folder as the static site.
- `worker/index.js` — Cloudflare Worker API proxy. Keeps the provider key server-side.
- `wrangler.toml` — minimal Worker configuration.

## Publish the static website on Cloudflare Pages

1. Create a GitHub account at https://github.com/ and a Cloudflare account at https://dash.cloudflare.com/sign-up.
2. Create a new GitHub repository, e.g. `velvet-companion`.
3. Upload the contents of this project, keeping the `public` folder at the repository root.
4. In Cloudflare, open **Workers & Pages** → **Create** → **Pages** → connect to Git.
5. Select your repository. For a static upload with this layout, set **Build command** to blank and **Build output directory** to `public`.
6. Deploy. Cloudflare will provide a `*.pages.dev` address.

Cloudflare's dashboard labels can change. If the Pages Git flow is unavailable, use the direct-upload option and upload the `public` folder's contents.

## Enable live AI with Cloudflare Pages Functions (optional)

The site works in demo mode without an AI key. To enable live AI, use the included `functions/api/chat.js`. Cloudflare Pages Functions provide a same-origin `/api/chat` endpoint, so you do not need a separate Worker route or a paid custom domain.

1. Create an OpenRouter account at https://openrouter.ai/ and review its current free-model availability, terms, privacy and rate limits.
2. Create an API key. Treat it like a password. Never paste it into this chat or a public file.
3. Deploy the repository to Cloudflare Pages using the steps above. Keep the `functions` folder at the repository root (next to `public`); do not put it inside `public`.
4. In Cloudflare, open your Pages project → **Settings** → **Environment variables**.
5. Add `OPENROUTER_API_KEY` as a **secret** for Production (and Preview if you want to test previews). Paste your provider key into the secret field.
6. Add `AI_MODEL` as a regular environment variable with value `openrouter/free`, if that route is currently available to your account. Otherwise choose a currently available free model from OpenRouter's model list.
7. Trigger a new deployment so the function receives the environment variables.
8. Open your site, choose a companion and send a message. If the reply stays in demo mode, inspect the Pages Function deployment logs and verify the secret name and model availability.

If the Cloudflare Pages setup asks for a build output directory, use `public`. Keep the `functions` folder at the repository root so Pages can detect it. Dashboard labels can change.

## Ad network later

1. Publish original, useful content and build genuine visitors first.
2. Review the current policies of the network you want to apply to. Adult/suggestive AI companion content may be restricted even when it is not explicit.
3. Add the network's approved code only after approval.
4. Update privacy/cookie disclosures and consent handling as required.
5. Never click your own ads, encourage visitors to click, or use purchased/bot traffic.

## Before launch checklist

- [ ] Replace “Velvet” if you choose another brand.
- [ ] Add operator/contact details to legal pages.
- [ ] Review local laws and platform policies for adult-oriented services.
- [ ] Test mobile layout and keyboard accessibility.
- [ ] Confirm live AI works before advertising it as an AI chat service.
- [ ] Add rate limiting and abuse protection before public live-AI launch.
- [ ] Confirm provider data handling and ad-network eligibility.
velvet AI config changes
      
