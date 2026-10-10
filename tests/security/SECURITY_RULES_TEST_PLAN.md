# Firestore Authorization Test Plan

This file records required tests. It is not a substitute for executable Emulator Suite tests; those must be added before deploying the proposed rules.

## Required test identities
- unauthenticated user
- Student A
- Student B
- trusted platform administrator (admin custom claim)
- later: School A teacher/admin and School B teacher/admin

## Current users collection policy test cases
| Test | Expected result |
|---|---|
| Unauthenticated user reads users/StudentA | Denied |
| Student A reads users/StudentA | Allowed |
| Student A reads users/StudentB | Denied |
| Student A lists users collection | Denied |
| Trusted platform admin lists users collection | Allowed (temporary global-admin behavior) |
| Student A creates a profile with score 0 and empty arrays | Allowed |
| Student A creates a profile with non-zero score | Denied |
| Student A creates a profile with admin/role fields | Denied |
| Student A updates only lastActive | Allowed |
| Student A updates score | Denied |
| Student A updates achievements | Denied |
| Student A updates completedQuizzes | Denied |
| Student A deletes their profile | Denied |
| Unmatched collection read/write | Denied |

## Required multi-tenant tests before production rollout
- School A teacher reads assigned School A student: allowed.
- School A teacher reads unassigned School A class: denied.
- School A teacher reads School B student: denied.
- School A administrator lists School B students: denied.
- Student changes orgId in request: denied.
- Student creates/updates membership role: denied.
- Revoked or disabled membership cannot access protected records.
- Invitation that is expired, used, or issued by an unauthorized actor is rejected.

## Important migration warning
The draft rules intentionally deny client writes to score, achievements, and completedQuizzes. Current frontend code writes those fields directly. Do not deploy the rules until trusted score/achievement writes exist and regression tests pass.
