# Edu-Shield Security Architecture

Status: draft. This describes the intended security boundary, not a claim that production is already configured this way.

## Identity
- Firebase Authentication establishes the signed-in identity.
- Browser storage and frontend role selectors are presentation state only; they must never grant privileges.
- Privileged roles are assigned only by a trusted backend using Firebase Admin SDK or another trusted administrative process.

## Authorization
Every protected request must validate:
1. authenticated identity;
2. organization membership, when the resource is organization-owned;
3. role within that organization;
4. resource-level permission;
5. allowed fields and operation.

A client-provided org ID, role, student ID, chapter context, or score is not authorization evidence.

## Data protection
- Students may read only their own permitted records.
- Teachers may access only assigned classes and permitted records.
- Organization administrators may manage only their own organization.
- Platform administration is separate from school administration.
- Scores, achievements, quiz completion, membership, and roles must not be freely writable by clients.

## AI API
- Keep provider credentials server-side.
- Validate request method, schema, size, and quotas.
- Resolve authoritative educational context server-side.
- Apply authorization before private school content enters model context.
- Render untrusted text safely and sanitize any allowed rich HTML.
- Treat retrieved documents and prompts as untrusted input.

## Offline campus navigation
- Downloaded maps and routes are cached, versioned, and associated with an organization.
- Offline navigation must clearly indicate map freshness.
- AR localization is an optional layer; route navigation must have a 2D fallback.
- An offline queued SOS is not a delivered alert.

## Current known gaps from source review
- Frontend role is selected from the login UI and persisted in localStorage.
- The client lists the whole users collection for the admin dashboard.
- The client writes scores, achievements, and completed quiz fields.
- The chatbot handler accepts client-provided chapter context and lacks visible request-schema/rate validation in the inspected source.
- Chatbot rendering uses innerHTML with untrusted values.
- Firestore rules were supplied in chat but are not versioned in the inspected repository tree.

## Deployment safety
The draft rules in firestore.rules are intentionally restrictive. Do not deploy until Emulator Suite tests pass and authoritative progress writes have been migrated to trusted backend logic.
