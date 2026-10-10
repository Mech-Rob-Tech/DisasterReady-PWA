# Edu-Shield Security Implementation Plan

Status: implementation in progress on a non-production security branch; no production configuration changed.
Branch: security/phase-1-authz-baseline

## Phase 1 — Repository and configuration baseline
- [x] Inspect the repository tree and current app/service/chatbot code.
- [x] Record the broad users-list permission supplied for review.
- [x] Create a separate security branch for proposed changes.
- [ ] Scan full Git history with a dedicated secret scanner.
- [ ] Verify production Firestore rules in Firebase Console.
- [ ] Verify API-key restrictions and deployment configuration without exporting secret values.
- [ ] Inventory all Firestore reads/writes and existing user document shapes.

## Phase 2 — Authentication and authorization
- [x] Replace frontend-selected admin role with trusted authorization in the proposed frontend branch.
- [x] Add a trusted Firebase Admin SDK script to provision the admin claim; actual claim provisioning remains an operator action.
- [ ] Define organization-scoped roles: platform admin, organization admin, teacher, student.
- [ ] Test owner-only access and cross-tenant denial in Firebase Emulator Suite.
- [ ] Verify existing admin account and remove published credentials; rotate if still valid.

## Phase 3 — Data integrity
- [x] Add a server-side quiz session/submission endpoint using Firebase Admin SDK; authoritative scoring and progress writes are performed server-side in the proposed branch.
- [x] Move the answer key into a server-only module and remove direct client-side score/achievement/progress write methods.
- [x] Require verified, non-revoked Firebase ID tokens for quiz API calls.
- [ ] Verify the Vercel runtime has the required Firebase Admin service-account environment variable configured without exposing its value.
- [ ] Test duplicate submissions, expired sessions, invalid answers, and account ownership against a non-production project.
- [ ] Verify current progress and achievement behavior against all quiz types before deployment.
- [ ] Validate permitted fields and prevent mass assignment.
- [ ] Add regression tests for existing learning/progress behavior.

## Phase 4 — Chatbot API and rendering
- [ ] Validate request shape, types, size, and method.
- [ ] Add rate/resource limits and suitable authentication/authorization.
- [ ] Resolve trusted chapter content server-side.
- [ ] Render user text safely and sanitize allowed formatted output.
- [ ] Test prompt injection and sensitive-data disclosure scenarios.

## Phase 5 — Repository automation
- [ ] Enable available GitHub secret scanning and push protection.
- [ ] Add CodeQL, Dependabot, and GitHub Actions workflow scanning as supported.
- [x] Add Firestore authorization rules tests to CI; backend integration tests are still pending.
- [ ] Protect main and sensitive workflow/rules files.

## Phase 6 — Multi-school model
- [ ] Define organizations, memberships, classes, invitations, maps, and school-specific content.
- [ ] Implement organization approval and invitation-based enrollment.
- [ ] Verify all operations enforce tenant boundaries.

## Phase 7 — Offline campus navigation and AR
- [ ] Define campus map schema and versioning.
- [ ] Build offline 2D routing first.
- [ ] Add admin floor-plan/waypoint mapping workflow.
- [ ] Evaluate QR-assisted recovery and local AR tracking.
- [ ] Add AR overlays only after localization is tested.

## Phase 8 — Emergency access and optional SOS
- [ ] Keep approved emergency guidance and contacts available offline.
- [ ] Ensure phone-call actions reflect device/browser limitations.
- [ ] Add school SOS only with verified delivery, acknowledgement, abuse controls, and clear offline status.

## Deployment rule
Do not deploy the proposed Firestore rules until the emulator tests pass and the existing quiz/progress writes have been migrated. The proposed rules intentionally block client writes to score, achievements, and completedQuizzes; deploying them before that migration would break those features.
