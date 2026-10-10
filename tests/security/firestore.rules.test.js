import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

const projectId = 'demo-disasterready-security';
const rules = readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8');

let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'users', 'student-a'), {
      score: 0,
      achievements: [],
      completedQuizzes: [],
      lastActive: '2026-10-10T00:00:00.000Z',
    });
    await setDoc(doc(db, 'users', 'student-b'), {
      score: 10,
      achievements: ['Fire Safety Pro'],
      completedQuizzes: ['fire'],
      lastActive: '2026-10-10T00:00:00.000Z',
    });
    await setDoc(doc(db, 'privateRecords', 'record-1'), { value: 'private' });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

describe('users/{userId} authorization', () => {
  it('denies unauthenticated reads', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'users', 'student-a')));
  });

  it('allows a student to read their own profile', async () => {
    const db = testEnv.authenticatedContext('student-a').firestore();
    await assertSucceeds(getDoc(doc(db, 'users', 'student-a')));
  });

  it('denies a student reading another student profile', async () => {
    const db = testEnv.authenticatedContext('student-a').firestore();
    await assertFails(getDoc(doc(db, 'users', 'student-b')));
  });

  it('denies a student listing the users collection', async () => {
    const db = testEnv.authenticatedContext('student-a').firestore();
    await assertFails(getDocs(collection(db, 'users')));
  });

  it('allows a trusted admin claim to list users (temporary global-admin policy)', async () => {
    const db = testEnv.authenticatedContext('admin-user', { admin: true }).firestore();
    await assertSucceeds(getDocs(collection(db, 'users')));
  });

  it('allows an owner to create only a default profile', async () => {
    const db = testEnv.authenticatedContext('student-new').firestore();
    await assertSucceeds(setDoc(doc(db, 'users', 'student-new'), {
      score: 0,
      achievements: [],
      completedQuizzes: [],
      lastActive: '2026-10-10T00:00:00.000Z',
    }));
  });

  it('denies creating a profile with a non-zero score', async () => {
    const db = testEnv.authenticatedContext('student-new').firestore();
    await assertFails(setDoc(doc(db, 'users', 'student-new'), {
      score: 999,
      achievements: [],
      completedQuizzes: [],
      lastActive: '2026-10-10T00:00:00.000Z',
    }));
  });

  it('denies adding a role/admin field at profile creation', async () => {
    const db = testEnv.authenticatedContext('student-new').firestore();
    await assertFails(setDoc(doc(db, 'users', 'student-new'), {
      score: 0,
      achievements: [],
      completedQuizzes: [],
      lastActive: '2026-10-10T00:00:00.000Z',
      role: 'admin',
    }));
  });

  it('allows an owner to update lastActive only', async () => {
    const db = testEnv.authenticatedContext('student-a').firestore();
    await assertSucceeds(updateDoc(doc(db, 'users', 'student-a'), {
      lastActive: '2026-10-10T01:00:00.000Z',
    }));
  });

  it('denies client score updates', async () => {
    const db = testEnv.authenticatedContext('student-a').firestore();
    await assertFails(updateDoc(doc(db, 'users', 'student-a'), { score: 5000 }));
  });

  it('denies client achievement updates', async () => {
    const db = testEnv.authenticatedContext('student-a').firestore();
    await assertFails(updateDoc(doc(db, 'users', 'student-a'), {
      achievements: ['Admin'],
    }));
  });

  it('denies client completed quiz updates', async () => {
    const db = testEnv.authenticatedContext('student-a').firestore();
    await assertFails(updateDoc(doc(db, 'users', 'student-a'), {
      completedQuizzes: ['all'],
    }));
  });

  it('denies profile deletion', async () => {
    const db = testEnv.authenticatedContext('student-a').firestore();
    await assertFails(deleteDoc(doc(db, 'users', 'student-a')));
  });

  it('denies access to unmatched collections', async () => {
    const db = testEnv.authenticatedContext('student-a').firestore();
    await assertFails(getDoc(doc(db, 'privateRecords', 'record-1')));
    await assertFails(setDoc(doc(db, 'privateRecords', 'new-record'), { value: 'x' }));
  });
});
