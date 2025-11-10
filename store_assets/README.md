# Wallet+ Play Store Assets

This folder aggregates images needed for Play Store submission. Generate derived assets from `store_icon.png` using the provided script, and add screenshots captured from the app.

## How to Generate Icons & Graphics

1. Ensure `store_icon.png` exists at the project root (already present).
2. Install Sharp (one time):
   - `npm i --save-dev sharp`
3. Generate assets:
   - `npm run generate:store`

Generated files will be placed in `store_assets/play_store`:

- `icons/playstore-icon-512.png` — Required Play Store app icon (512x512)
- `icons/adaptive-foreground-432.png` — Adaptive foreground layer
- `icons/adaptive-background-1080.png` — Adaptive background
- `graphics/feature-graphic-1024x500.png` — Feature graphic

## Screenshots (Manual)

Capture screenshots from a real device to best reflect the app:

- Minimum: 2 phone screenshots (Recommended: 1080×1920 PNG/JPG)
- Optional: Tablet screenshots (10”+, e.g., 1600×2560)

Suggested screens to capture:

1. Home screen (overview)
2. Transactions list + Add Transaction flow
3. Budgets and Goals
4. Analysis/Net Worth
5. Settings (privacy, currency, security)

Place them under `store_assets/play_store/screenshots/` as:

- `phone-01.png`, `phone-02.png`, ...
- `tablet-01.png`, `tablet-02.png`, ... (optional)

## What to Upload in Play Console

- App icon: `icons/playstore-icon-512.png`
- Feature graphic: `graphics/feature-graphic-1024x500.png`
- Screenshots: files in `play_store/screenshots/`
- Privacy policy: hosted at `https://<your-domain>/privacy-policy.html`

## Notes

- This folder is separate from source code so you can download assets directly.
- If you rebrand, replace `store_icon.png` and re-run `npm run generate:store`.
