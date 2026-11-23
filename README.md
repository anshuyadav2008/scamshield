# ScamShield

**Think Before You Click.** ScamShield is a browser-based suspicious-message awareness tool built from the requirements in the supplied MCOA ITT presentation.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. Validate the project with:

```powershell
npm test
npm run build
```

To create the deployable static files:

```powershell
npm run build
npm run preview
```

The contents of `dist/` can be published to any static host. The app uses hash-based routes, so it works on GitHub Pages without server-side rewrite rules.

## GitHub Pages deployment

This repository includes a GitHub Actions workflow that builds and deploys the site.

1. Create a GitHub repository and push this project.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.
4. Push to the `main` branch (or run the workflow manually).

## How analysis works

The scanner uses configurable JavaScript regular-expression rules in `src/engine/rules.ts`; no message is sent to a server or third-party service. Rules are grouped and only the highest-weight match in each group contributes to the base score. A 10-point bonus applies when a sensitive-information request appears with a link, threat, or prize signal. The final score is capped at 100:

- LOW: 0–29
- MEDIUM: 30–59
- HIGH: 60–100

The supplied presentation lists categories and weights but the workspace did not include its original JavaScript source. The implemented patterns are therefore a documented, configurable interpretation of those weights, not a reconstruction of original patterns. Included patterns cover English and selected Hindi-English (Hinglish) wording, including UPI, OTP, PIN, CVV, KYC, Aadhaar, and bank-account references. Coverage is limited and can produce false positives or miss scams.

A score is a heuristic, not a probability of fraud. A low score does not guarantee a message is safe. ScamShield does not verify sender identity or link reputation. URL checks only surface structural reasons for caution; suspicious URLs are never opened.

## Privacy behavior

- Message text is analyzed in the browser and is not uploaded.
- Raw message text is not written to localStorage or sessionStorage.
- The scanner clears its input when leaving the page or choosing a new scan.
- Insights retain score, classification, timestamp, and matched category summaries in in-memory session state only; reloading the page clears them.
- Reports omit the original message.
- No external URL reputation integration is connected.

## Project areas

- `src/engine/`: configurable rules, context handling, scoring, URL extraction, and recommendations.
- `src/pages/`: home, scanner, session insights, academy, quiz, and project overview.
- `src/utils/report.ts`: clipboard, TXT, and PDF report exports.
- `src/data/samples.ts`: scanner examples and the educational quiz.
