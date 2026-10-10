import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const uid = process.env.TARGET_ADMIN_UID;
const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!uid) {
  throw new Error("Set TARGET_ADMIN_UID to the Firebase Auth UID of the intended administrator.");
}
if (!rawServiceAccount) {
  throw new Error("Set FIREBASE_SERVICE_ACCOUNT_JSON in your trusted local shell.");
}

const serviceAccount = JSON.parse(rawServiceAccount);
const app = getApps()[0] || initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
});

const auth = getAuth(app);
const user = await auth.getUser(uid);
const existingClaims = user.customClaims || {};

await auth.setCustomUserClaims(uid, {
  ...existingClaims,
  admin: true,
});

console.log(`Granted admin custom claim to UID ${uid}. The user must refresh their ID token to receive the claim.`);
