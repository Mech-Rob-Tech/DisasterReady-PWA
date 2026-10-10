# Trusted Quiz Backend Setup

Status: implementation draft on `security/phase-1-authz-baseline`. Do not deploy production Firestore rules until the checklist below passes.

## What changed
- The browser requests a quiz session from `POST /api/quiz`.
- The server selects questions and stores a short-lived session in `quizSessions`.
- The server does not return correct answers to the browser.
- The browser submits selected option indexes and the session ID.
- The server verifies the Firebase ID token (including revocation), checks session ownership/expiry/duplicate submission, calculates the score, and writes score/completion/achievements through a Firestore transaction.
- The frontend derives admin UI access from the verified Firebase `admin` custom claim, not from `localStorage` or the login tab.
- `scripts/grant-admin-claim.js` provisions the admin claim from a trusted environment; never expose service-account credentials to the browser.
- Client-side progress write methods have been removed from `service.js`.

## Required Vercel configuration
Configure a server-only environment variable named `FIREBASE_SERVICE_ACCOUNT_JSON` containing the service-account JSON required by Firebase Admin SDK, plus `FIREBASE_PROJECT_ID` if the service-account JSON does not include `project_id`.

- Add it only in Vercel project environment settings for the required deployment environments.
- Never place this value in `firebase.js`, frontend variables, GitHub source, screenshots, logs, or client-visible responses.
- Use a service account with only the permissions needed by this backend.
- Do not paste its value into an issue, pull request, or chat.
- If a suitable secret is already configured under another variable name, update the code to use that verified name instead of creating duplicate credentials.

## Non-production validation checklist
- [ ] Confirm the Vercel server runtime can import `firebase-admin`.
- [ ] Confirm missing/invalid service-account configuration fails closed.
- [ ] Start a quiz while signed in; verify questions are returned without correct-answer indexes.
- [ ] Submit valid answers; verify score is calculated on the server.
- [ ] Try to submit another user's session; expect denial.
- [ ] Replay a submitted session; expect conflict/denial.
- [ ] Submit a session after expiry; expect denial.
- [ ] Submit malformed, missing, oversized, or out-of-range answers; expect rejection.
- [ ] Confirm scores, completed quizzes, and achievements update once and appear in the student dashboard.
- [ ] Confirm existing quizzes with fewer than 10 questions work.
- [ ] Confirm logged-out users cannot start or submit quizzes.
- [ ] Confirm a normal student cannot open the admin dashboard by selecting the Admin tab or modifying localStorage.
- [ ] Provision the intended administrator using the trusted script, then force-refresh the ID token and verify admin access.
- [ ] Confirm no secrets are logged or returned.
- [ ] Run the Firestore Rules Emulator tests and syntax checks.

## Rollout blockers
1. The production Firestore rules must be independently verified.
2. A valid Admin SDK credential must be configured server-side and not exposed.
3. The backend endpoint needs integration testing against a non-production Firebase project.
4. The current login flow still trusts a frontend-selected role for dashboard rendering; this must be corrected before relying on the admin UI.
5. The proposed Firestore rules intentionally deny client writes to protected progress fields. Do not deploy them until the entire existing app has been regression-tested.
6. Do not merge or deploy this branch solely because the rules unit tests pass.
