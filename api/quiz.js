import { randomUUID } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { quizBank } from "./quiz-bank.js";

const SESSION_TTL_MS = 30 * 60 * 1000;
const QUESTIONS_PER_QUIZ = 10;
const COMPLETION_THRESHOLD = 60;

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const rawServiceAccount =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

  if (!rawServiceAccount) {
    throw new Error("Missing Firebase Admin service-account environment variable.");
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(rawServiceAccount);
  } catch {
    throw new Error("Firebase Admin service-account environment variable must be valid JSON.");
  }

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
  });
}

function pickQuestionIndexes(questions) {
  const indexes = questions.map((_, index) => index);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes.slice(0, Math.min(QUESTIONS_PER_QUIZ, indexes.length));
}

function deriveAchievements(score, quizScore, completedQuizzes, quizType, existing) {
  const next = new Set(Array.isArray(existing) ? existing : []);
  if (score >= 50) next.add("Fire Safety Pro");
  if (score >= 100) next.add("Earthquake Expert");
  if (score >= 150) next.add("All-Rounder");
  if (score >= 300) next.add("Safety Superstar");
  if (completedQuizzes.length > 0) next.add("Quiz Novice");
  if (quizScore === 200) next.add("Perfect Score");
  if (completedQuizzes.length >= 3) next.add("Triple Threat");
  if (completedQuizzes.length >= 5) next.add("Penta-Perfect");

  const quizMasterAchievements = {
    fire: "Fire Quiz Master",
    earthquake: "Earthquake Quiz Master",
    tornado: "Tornado Quiz Master",
    flood: "Flood Quiz Master",
    wildfire: "Wildfire Quiz Master",
    hurricane: "Hurricane Quiz Master",
    "active-shooter": "Response Protocol Master",
  };
  if (quizScore === 200 && quizMasterAchievements[quizType]) {
    next.add(quizMasterAchievements[quizType]);
  }
  if (Object.keys(quizBank).every((key) => completedQuizzes.includes(key))) {
    next.add("Safety Savant");
  }
  if (Math.floor(score / 100) + 1 >= 5) next.add("Level 5 Reached");

  return [...next];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ error: "Authentication required" });

    const app = getAdminApp();
    const decoded = await getAuth(app).verifyIdToken(match[1], true);
    const uid = decoded.uid;
    const db = getFirestore(app);
    const body = req.body && typeof req.body === "object" ? req.body : {};

    if (body.action === "start") {
      const { quizType } = body;
      if (typeof quizType !== "string" || !Object.hasOwn(quizBank, quizType)) {
        return res.status(400).json({ error: "Invalid quiz type" });
      }

      const questionIndexes = pickQuestionIndexes(quizBank[quizType]);
      if (!questionIndexes.length) {
        return res.status(400).json({ error: "No questions are available for this quiz" });
      }

      const sessionId = randomUUID();
      const now = Date.now();
      await db.collection("quizSessions").doc(sessionId).create({
        uid,
        quizType,
        questionIndexes,
        submitted: false,
        createdAt: Timestamp.fromMillis(now),
        expiresAt: Timestamp.fromMillis(now + SESSION_TTL_MS),
      });

      const questions = questionIndexes.map((questionIndex) => {
        const item = quizBank[quizType][questionIndex];
        return {
          question: item.q,
          options: item.a,
        };
      });

      return res.status(200).json({ sessionId, quizType, questions });
    }

    if (body.action === "submit") {
      const { sessionId, answers } = body;
      if (
        typeof sessionId !== "string" ||
        sessionId.length > 80 ||
        !Array.isArray(answers) ||
        answers.length < 1 ||
        answers.length > QUESTIONS_PER_QUIZ ||
        !answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 3)
      ) {
        return res.status(400).json({ error: "Invalid quiz submission" });
      }

      const sessionRef = db.collection("quizSessions").doc(sessionId);
      const userRef = db.collection("users").doc(uid);

      const result = await db.runTransaction(async (transaction) => {
        const sessionSnap = await transaction.get(sessionRef);
        if (!sessionSnap.exists) {
          const error = new Error("Quiz session not found");
          error.statusCode = 404;
          throw error;
        }

        const session = sessionSnap.data();
        if (session.uid !== uid) {
          const error = new Error("Quiz session does not belong to this user");
          error.statusCode = 403;
          throw error;
        }
        if (session.submitted) {
          const error = new Error("Quiz session has already been submitted");
          error.statusCode = 409;
          throw error;
        }
        if (!session.expiresAt || session.expiresAt.toMillis() < Date.now()) {
          const error = new Error("Quiz session expired; start a new quiz");
          error.statusCode = 410;
          throw error;
        }

        const questions = session.questionIndexes.map((index) => quizBank[session.quizType]?.[index]);
        if (
          !questions.length ||
          questions.some((question) => !question) ||
          answers.length !== questions.length ||
          answers.some((answer, index) => answer >= questions[index].a.length)
        ) {
          const error = new Error("Submission does not match the quiz session");
          error.statusCode = 400;
          throw error;
        }

        const quizScore = questions.reduce(
          (total, question, index) => total + (answers[index] === question.correct ? 20 : 0),
          0
        );
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.exists
          ? userSnap.data()
          : { score: 0, achievements: [], completedQuizzes: [], lastActive: new Date().toISOString() };

        const currentScore = Number.isFinite(userData.score) ? userData.score : 0;
        const nextScore = currentScore + quizScore;
        const completedQuizzes = Array.isArray(userData.completedQuizzes)
          ? [...userData.completedQuizzes]
          : [];
        if (quizScore >= COMPLETION_THRESHOLD && !completedQuizzes.includes(session.quizType)) {
          completedQuizzes.push(session.quizType);
        }

        const achievements = deriveAchievements(
          nextScore,
          quizScore,
          completedQuizzes,
          session.quizType,
          userData.achievements
        );

        transaction.set(userRef, {
          score: nextScore,
          achievements,
          completedQuizzes,
          lastActive: new Date().toISOString(),
        }, { merge: true });

        transaction.update(sessionRef, {
          submitted: true,
          submittedAt: FieldValue.serverTimestamp(),
          quizScore,
        });

        return {
          score: quizScore,
          maxScore: questions.length * 20,
          totalScore: nextScore,
          achievements,
          completedQuizzes,
        };
      });

      return res.status(200).json(result);
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    if (statusCode >= 500) {
      console.error("Quiz API error:", error.message);
    }
    return res.status(statusCode).json({
      error: statusCode >= 500 ? "Quiz service unavailable" : error.message,
    });
  }
}
